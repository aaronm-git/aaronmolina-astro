import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

type PreviewData = {
  systemPrompt: string;
  tools: unknown[];
};

/**
 * Transparency modal showing the system prompt and tool spec used by the chat
 * function. Demonstrates auditable AI to recruiters and prospective clients.
 */
export default function SystemPromptModal({ open, onClose }: Props) {
  const [data, setData] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || data) return;
    fetch('/api/system-prompt-preview.json')
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setData)
      .catch(() => setError('Could not load preview.'));
  }, [open, data]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-[6px_6px_0_var(--color-border)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border p-4">
          <div>
            <h2 className="text-xl font-extrabold">System prompt</h2>
            <p className="text-sm text-muted-foreground">
              The exact instructions and tools sent to Claude for every chat.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : !data ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                System prompt
              </h3>
              <pre className="mb-6 overflow-x-auto rounded-lg border border-border bg-background p-3 text-xs leading-relaxed">
                {data.systemPrompt}
              </pre>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Tools
              </h3>
              <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 text-xs leading-relaxed">
                {JSON.stringify(data.tools, null, 2)}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
