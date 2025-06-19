interface Suggestion {
  label: string;
  url?: string;
}

export default function GiftSuggestions({ suggestions }: { suggestions: Suggestion[] }) {
  return (
    <div className="space-y-2 mt-4">
      <p className="text-sm text-gray-500">Here's what could make them smile 👇</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) =>
          s.url ? (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-3 py-1 bg-pink-100 text-sm font-medium hover:bg-pink-200 transition"
            >
              {s.label}
            </a>
          ) : (
            <span
              key={i}
              className="rounded-full px-3 py-1 bg-yellow-100 text-sm font-medium"
            >
              {s.label}
            </span>
          )
        )}
      </div>
    </div>
  );
} 