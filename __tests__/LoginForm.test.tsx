import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '../components/LoginForm';
import { supabase } from '../lib/supabase';

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
    },
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send me the magic link/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    render(<LoginForm />);
    
    // Get form elements
    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const submitButton = screen.getByRole('button');

    // Type invalid email and submit
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.submit(screen.getByTestId('login-form'));

    // Wait for the error message
    const errorMessage = await waitFor(() => 
      screen.getByRole('alert')
    );

    expect(errorMessage).toHaveTextContent('Please enter a valid email address');
  });

  it('handles successful OTP request', async () => {
    const mockSignInWithOtp = vi.fn().mockResolvedValue({ error: null });
    supabase.auth.signInWithOtp = mockSignInWithOtp;

    render(<LoginForm />);
    
    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const submitButton = screen.getByRole('button', { name: /send me the magic link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          emailRedirectTo: expect.any(String),
        },
      });
    });
  });

  it('handles API errors', async () => {
    const mockError = new Error('API Error');
    const mockSignInWithOtp = vi.fn().mockResolvedValue({ error: mockError });
    supabase.auth.signInWithOtp = mockSignInWithOtp;

    render(<LoginForm />);
    
    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const submitButton = screen.getByRole('button', { name: /send me the magic link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    const errorMessage = await waitFor(() => 
      screen.getByRole('alert')
    );
    expect(errorMessage).toHaveTextContent('API Error');
  });

  it('disables form submission while loading', async () => {
    const mockSignInWithOtp = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves
    supabase.auth.signInWithOtp = mockSignInWithOtp;

    render(<LoginForm />);
    
    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const submitButton = screen.getByRole('button', { name: /send me the magic link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });
  });
}); 