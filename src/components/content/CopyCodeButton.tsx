import { useState } from 'react';

type CopyState = 'idle' | 'copied' | 'failed';

export default function CopyCodeButton({ code }: { code: string }) {
  const [state, setState] = useState<CopyState>('idle');

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(code);
      setState('copied');
    } catch {
      setState('failed');
    }
  };

  return (
    <span className="copy-code">
      <button type="button" onClick={copy}>复制代码</button>
      <span aria-live="polite">
        {state === 'copied' && '已复制'}
        {state === 'failed' && '请手动复制代码'}
      </span>
    </span>
  );
}
