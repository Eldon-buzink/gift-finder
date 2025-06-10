import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

// Helper function for development logging
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

// Initialize Resend with error handling
let resend: Resend;
try {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  resend = new Resend(process.env.RESEND_API_KEY);
} catch (error) {
  console.error('Failed to initialize Resend:', error);
}

export async function POST(request: Request) {
  try {
    // Check if Resend is properly initialized
    if (!resend) {
      console.error('Resend is not initialized');
      return NextResponse.json(
        { success: false, error: 'Email service not properly configured' },
        { status: 500 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      devLog('Received API request with body:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { to, subject, htmlContent, senderName, occasion, recipientName } = body;

    devLog('Parsed request data:', {
      to,
      subject,
      senderName,
      occasion,
      recipientName
    });

    // Validate required fields
    if (!to || !subject || !htmlContent) {
      console.error('Missing required fields:', { to, subject, htmlContent });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      // Send email
      devLog('Attempting to send email to:', to);
      const emailResult = await resend.emails.send({
        from: 'Gift Ninja <onboarding@resend.dev>',
        to: [to],
        subject,
        html: htmlContent,
      });

      devLog('Resend API response:', emailResult);

      if (!emailResult.data?.id) {
        console.error('Failed to send email:', emailResult);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to send email',
            details: emailResult 
          },
          { status: 500 }
        );
      }

      // First find the record by email
      devLog('Looking up email record for:', to);
      const { data: emailRecord, error: findError } = await supabase
        .from('emails')
        .select('*')
        .eq('recipient_email', to)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (findError) {
        console.error('Error finding email record:', findError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to find email record',
            details: findError 
          },
          { status: 500 }
        );
      }

      if (!emailRecord) {
        console.error('No email record found for:', to);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Email record not found' 
          },
          { status: 404 }
        );
      }

      // Now update the record using its ID
      const updatePayload: any = {
        status: 'sent',
        resend_id: emailResult.data.id
      };

      if (recipientName) {
        devLog('Updating recipient name to:', recipientName);
        updatePayload.recipient_name = recipientName;
      }

      devLog('Updating Supabase record with:', updatePayload);
      const { data: updatedRecord, error: updateError } = await supabase
        .from('emails')
        .update(updatePayload)
        .eq('id', emailRecord.id)
        .select('*')
        .single();

      if (updateError) {
        console.error('Error updating email status:', updateError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to update email status',
            details: updateError 
          },
          { status: 500 }
        );
      }

      devLog('Email record updated successfully:', updatedRecord);
      return NextResponse.json({ 
        success: true, 
        data: {
          ...emailResult.data,
          recipient_name: updatedRecord.recipient_name
        }
      });

    } catch (emailError: any) {
      console.error('Resend API error:', emailError);
      return NextResponse.json(
        { 
          success: false, 
          error: emailError.message || 'Failed to send email',
          details: emailError.response?.body || emailError
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unhandled error in /api/send:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        details: error
      },
      { status: 500 }
    );
  }
} 