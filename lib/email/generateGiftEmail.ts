interface GiftEmailData {
  receiver_name: string;
  occasion: string;
  gif?: string;
  background?: string;
}

export function generateGiftEmail(data: GiftEmailData): string {
  const {
    receiver_name,
    occasion,
    gif,
  } = data;

  return `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 24px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    ">
      <!-- Header -->
      <h1 style="
        color: #000000;
        font-size: 24px;
        text-align: center;
        margin-bottom: 24px;
        font-weight: 700;
      ">
        Hey ${receiver_name}! Someone wants to get you something for your ${occasion.toLowerCase()} 🎁
      </h1>

      <!-- GIF Section (if provided) -->
      ${gif ? `
        <div style="
          width: 200px;
          height: 200px;
          margin: 0 auto 24px auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        ">
          <img 
            src="${gif}" 
            alt="Gift animation" 
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
            "
          />
        </div>
      ` : ''}

      <!-- Main Content -->
      <div style="
        text-align: center;
        margin-bottom: 32px;
        background-color: #f5f5f5;
        padding: 24px;
        border-radius: 12px;
      ">
        <p style="
          color: #000000;
          font-size: 20px;
          margin-bottom: 16px;
          font-weight: 600;
        ">
          <strong>${receiver_name}</strong>, what would make you happy? 😊
        </p>

        <p style="
          color: #666666;
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 24px;
        ">
          For your ${occasion.toLowerCase()}, a secret gift ninja wants to make sure you get something you'll love.
        </p>

        <p style="
          color: #000000;
          font-size: 16px;
          line-height: 1.5;
        ">
          Just reply to this email with your wishes. Your gift ninja will figure it out! 🥷
        </p>
      </div>

      <!-- Footer -->
      <div style="
        text-align: center;
        padding-top: 24px;
        border-top: 1px solid #eaeaea;
      ">
        <p style="
          color: #999999;
          font-size: 14px;
          margin: 0;
        ">
          Sent anonymously via Gift Ninja 🎁
        </p>
      </div>
    </div>
  `;
} 