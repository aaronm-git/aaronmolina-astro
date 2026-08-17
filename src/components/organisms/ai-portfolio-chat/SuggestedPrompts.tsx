interface Props {
  /** Prompt chip labels from the homepage portfolio chat content block */
  prompts: string[];
  /** Called with the chip's prompt text when it is clicked */
  onPick: (prompt: string) => void;
}

/**
 * Suggested-prompt chips shown when the conversation is empty.
 * Clicking a chip prefills and submits the input.
 */
export default function SuggestedPrompts({ prompts, onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map(prompt => (
        <button
          key={prompt}
          type="button"
          onClick={() => onPick(prompt)}
          className="border-ink bg-paper text-ink shadow-hard-sm rounded-sm border-2 px-4 py-2 text-sm font-semibold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_var(--color-ink)]"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
