interface Suggestion {
  label: string;
  url?: string;
}

function parseSuggestion(label: string) {
  const emojiMatch = label.match(/^([\p{Emoji_Presentation}\p{Extended_Pictographic}])\s*/u);
  const emoji = emojiMatch ? emojiMatch[1] : '🎁';

  const cleanedLabel = label.replace(/^([\p{Emoji_Presentation}\p{Extended_Pictographic}])\s*/u, '');

  // Check for headline and description
  const separator = cleanedLabel.includes(' - ') ? ' - ' : ' — ';
  const [headline, ...descParts] = cleanedLabel.split(separator);
  const description = descParts.join(separator).trim();

  return {
    emoji,
    headline: headline.trim(),
    description,
  };
}

export default function GiftSuggestions({ suggestions }: { suggestions: Suggestion[] }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">Here&apos;s what could make them smile 👇</p>
      <div className="flex flex-col gap-4">
        {suggestions.map((s, i) => {
          const { emoji, headline, description } = parseSuggestion(s.label);

          const content = (
            <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="text-3xl pt-1">{emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{headline}</div>
                {description && (
                  <div className="text-sm text-gray-600 mt-1">{description}</div>
                )}
              </div>
            </div>
          );

          return s.url ? (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {content}
            </a>
          ) : (
            <div key={i}>{content}</div>
          );
        })}
      </div>
    </div>
  );
} 