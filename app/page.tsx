import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";

export default function LandingPage() {
  const usps = [
    {
      emoji: "\uD83C\uDFAF",
      title: "No more guessing games",
      text: "Stop stressing about what they *might* like. Just ask (without them knowing it's you) and get them something they'll actually love.",
    },
    {
      emoji: "⏱️",
      title: "Save hours of scrolling",
      text: "No more doom-shopping or 14-tab gift searches. Send one message and let them tell you what they want.",
    },
    {
      emoji: "😊",
      title: "Give joy, not just gifts",
      text: "Figure out what really makes someone happy — with zero awkward convos or group chats.",
    },
  ];

  const faqs = [
    {
      question: "Is it really anonymous?",
      answer: "Yep. They won't know it's you unless you tell them."
    },
    {
      question: "Do I need to install anything?",
      answer: "Nope. It's all web-based and mobile-friendly."
    },
    {
      question: "Can I send it via WhatsApp?",
      answer: "Absolutely. Choose email or WhatsApp when you send it."
    }
  ];

  return (
    <div className="flex flex-col items-center text-center px-4">
      {/* Navigation */}
      <nav className="w-full max-w-6xl py-4 flex justify-between items-center text-sm">
        <div className="font-bold text-lg">GiftThing</div>
        <div className="space-x-4 hidden sm:block">
          <Link href="#how">How it works</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="/login">Login</Link>
          <Link href="/login" className="text-black hover:text-gray-800">Create a Gift</Link>
        </div>
      </nav>

      {/* Hero */}
      <Hero />

      {/* How It Works */}
      <section id="how" className="py-12 max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>
        <ol className="space-y-4 text-left">
          <li><strong>1.</strong> You choose the reason and send a message anonymously.</li>
          <li><strong>2.</strong> They fill in what makes them happy.</li>
          <li><strong>3.</strong> You get their answer + smart gift ideas.</li>
        </ol>
      </section>

      {/* USPs */}
      <section className="py-12 px-4 max-w-6xl">
        <h2 className="text-2xl font-bold text-center mb-8">Why use this tool?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {usps.map(({ emoji, title, text }, i) => (
            <Card key={i} className="p-4 flex flex-col items-start bg-white/60 shadow-xl rounded-2xl">
              <div className="text-3xl mb-2">{emoji}</div>
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <div className="space-y-4 text-left">
          {faqs.map((faq, i) => (
            <div key={i}>
              <p className="font-semibold">{faq.question}</p>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} GiftThing. Made with ❤️ & sarcasm.
      </footer>
    </div>
  );
}