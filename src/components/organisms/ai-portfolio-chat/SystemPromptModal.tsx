import { useEffect, useState } from 'react';

interface Props {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the modal should close (backdrop click or close button) */
  onClose: () => void;
}

/** Shape of the JSON fetched from `/api/system-prompt-preview.json` */
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
    <div className="bg-ink/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="border-ink bg-paper shadow-hard flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border-2" onClick={e => e.stopPropagation()}>
        <div className="border-ink flex items-start justify-between border-b-2 p-4">
          <div>
            <h2 className="font-display text-ink text-xl font-black uppercase">System prompt</h2>
            <p className="text-graphite text-sm">The exact instructions and tools sent to Claude for every chat.</p>
          </div>
          <button type="button" onClick={onClose} className="text-graphite hover:bg-concrete-2 rounded-sm p-1" aria-label="Close">
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {error ? (
            <p className="text-ink text-sm">{error}</p>
          ) : !data ? (
            <p className="text-graphite text-sm">Loading...</p>
          ) : (
            <>
              <h3 className="text-graphite mb-2 font-mono text-xs font-bold tracking-wide uppercase">System prompt</h3>
              <pre className="border-ink bg-concrete text-ink mb-6 overflow-x-auto rounded-sm border-2 p-3 text-xs leading-relaxed">{data.systemPrompt}</pre>
              <h3 className="text-graphite mb-2 font-mono text-xs font-bold tracking-wide uppercase">Tools</h3>
              <pre className="border-ink bg-concrete text-ink overflow-x-auto rounded-sm border-2 p-3 text-xs leading-relaxed">{JSON.stringify(data.tools, null, 2)}</pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
