import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Hero } from "@/components/ui/Hero";
import { HowItWorks } from "@/components/ui/HowItWorks";

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
      emoji: "🤖",
      title: "Get smart gift suggestions",
      text: "Our AI analyzes their preferences and suggests perfect gifts you'd never think of.",
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
      question: "Is this app free?",
      answer: "Yes! GiftThing is completely free to use. No hidden fees, no subscriptions."
    },
    {
      question: "How do the gift suggestions work?",
      answer: "Our AI analyzes the recipient's preferences and occasion to recommend unique, thoughtful gifts."
    },
    {
      question: "Can I use this for any occasion?",
      answer: "Absolutely! Birthdays, holidays, thank-yous, or just because—you choose the occasion."
    }
  ];

  return (
    <div className="flex flex-col items-center text-center px-4 bg-white text-black min-h-screen">
      {/* Navigation */}
      <nav className="w-full max-w-6xl py-4 flex justify-between items-center text-sm bg-white">
        <div className="font-bold text-lg text-black">GiftThing</div>
        <div className="space-x-4 hidden sm:block">
          <Link href="#how" className="text-black hover:text-gray-800">How it works</Link>
          <Link href="#faq" className="text-black hover:text-gray-800">FAQ</Link>
          <Link href="/flow/start" className="text-black hover:text-gray-800">Create a Gift</Link>
        </div>
      </nav>

      {/* Hero */}
      <Hero />

      {/* USPs */}
      <section className="py-12 px-4 max-w-6xl bg-white">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">Why use this tool?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {usps.map(({ emoji, title, text }, i) => (
            <Card key={i} className="p-4 flex flex-col items-center bg-white shadow-xl rounded-2xl text-center">
              <div className="text-3xl mb-2">{emoji}</div>
              <h3 className="text-lg font-semibold mb-1 text-black">{title}</h3>
              <p className="text-sm text-gray-600">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* FAQ */}
      <section id="faq" className="py-12 max-w-3xl bg-white">
        <h2 className="text-2xl font-bold mb-6 text-black">FAQ</h2>
        <div className="space-y-4 text-left">
          {faqs.map((faq, i) => (
            <div key={i}>
              <p className="font-semibold text-black">{faq.question}</p>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-sm text-gray-600 bg-white">
        © {new Date().getFullYear()} GiftThing. Made with ❤️ & sarcasm.
      </footer>
    </div>
  );
}