export default function CheckInboxPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-red-100 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-black">📬 Check your inbox</h1>
        <p className="text-lg text-gray-600">
          We sent you a magic link to login. Open it, and you&apos;ll be back here in no time 🎉
        </p>
        <p className="text-sm text-gray-600">
          Didn&apos;t get the email? Check spam. Or give it a sec. The internet is weird.
        </p>
      </div>
    </main>
  );
} 