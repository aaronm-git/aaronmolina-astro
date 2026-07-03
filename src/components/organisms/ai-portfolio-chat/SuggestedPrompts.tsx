interface Props {
  onPick: (prompt: string) => void;
}

const PROMPTS = [
  'What did you ship for the LA Clippers?',
  'Tell me about TypeLyft',
  'Are you available for contract work?',
  "What's your stack?",
];

/**
 * Suggested-prompt chips shown when the conversation is empty.
 * Clicking a chip prefills and submits the input.
 */
export default function SuggestedPrompts({ onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map(prompt => (
        <button
          key={prompt}
          type="button"
          onClick={() => onPick(prompt)}
          className="rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-semibold shadow-[2px_2px_0_var(--color-border)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] active:translate-y-0 active:shadow-[1px_1px_0_var(--color-border)]"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
