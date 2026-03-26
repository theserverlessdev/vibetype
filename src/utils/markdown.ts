export interface MarkdownNode {
  type: 'text' | 'bold' | 'italic' | 'code' | 'codeblock' | 'bullet' | 'paragraph';
  content: string;
  children?: MarkdownNode[];
  language?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function parseMarkdown(text: string): MarkdownNode[] {
  const nodes: MarkdownNode[] = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trimStart().startsWith('```')) {
      const language = line.trimStart().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      let closed = false;
      while (i < lines.length) {
        if (lines[i].trimStart().startsWith('```')) {
          closed = true;
          i++;
          break;
        }
        codeLines.push(lines[i]);
        i++;
      }
      if (closed) {
        nodes.push({ type: 'codeblock', content: codeLines.join('\n'), language });
      } else {
        // Unclosed code block - render as-is
        nodes.push({ type: 'text', content: '```' + language + '\n' + codeLines.join('\n') });
      }
      continue;
    }

    // Bullet list
    if (/^[\s]*[-*]\s/.test(line)) {
      const content = line.replace(/^[\s]*[-*]\s/, '');
      nodes.push({ type: 'bullet', content, children: parseInline(content) });
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraph
    nodes.push({ type: 'paragraph', content: line, children: parseInline(line) });
    i++;
  }

  return nodes;
}

function parseInline(text: string): MarkdownNode[] {
  const nodes: MarkdownNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      nodes.push({ type: 'bold', content: boldMatch[1] });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic *text*
    const italicMatch = remaining.match(/^\*(.+?)\*/);
    if (italicMatch) {
      nodes.push({ type: 'italic', content: italicMatch[1] });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code `text`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      nodes.push({ type: 'code', content: codeMatch[1] });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check for unclosed markers - take one char and continue
    const nextSpecial = remaining.search(/[\*`]/);
    if (nextSpecial === -1) {
      nodes.push({ type: 'text', content: remaining });
      break;
    } else if (nextSpecial === 0) {
      // Unclosed marker, treat as text
      nodes.push({ type: 'text', content: remaining[0] });
      remaining = remaining.slice(1);
    } else {
      nodes.push({ type: 'text', content: remaining.slice(0, nextSpecial) });
      remaining = remaining.slice(nextSpecial);
    }
  }

  return nodes;
}

export function renderMarkdownToHtml(text: string): string {
  const nodes = parseMarkdown(text);
  return nodes.map(renderNode).join('');
}

function renderNode(node: MarkdownNode): string {
  switch (node.type) {
    case 'codeblock':
      return `<pre style="background:rgba(0,0,0,0.15);padding:12px;border-radius:8px;overflow-x:auto;margin:8px 0;font-size:13px"><code>${escapeHtml(node.content)}</code></pre>`;
    case 'bullet':
      return `<div style="display:flex;gap:8px;margin:2px 0"><span style="flex-shrink:0">•</span><span>${renderInlineNodes(node.children || [])}</span></div>`;
    case 'paragraph':
      return `<p style="margin:4px 0">${renderInlineNodes(node.children || [])}</p>`;
    default:
      return `<span>${escapeHtml(node.content)}</span>`;
  }
}

function renderInlineNodes(nodes: MarkdownNode[]): string {
  return nodes
    .map((n) => {
      switch (n.type) {
        case 'bold':
          return `<strong>${escapeHtml(n.content)}</strong>`;
        case 'italic':
          return `<em>${escapeHtml(n.content)}</em>`;
        case 'code':
          return `<code style="background:rgba(0,0,0,0.1);padding:2px 6px;border-radius:4px;font-size:0.9em">${escapeHtml(n.content)}</code>`;
        default:
          return escapeHtml(n.content);
      }
    })
    .join('');
}

/**
 * Get the visible portion of answer text during AI_TYPING phase.
 * Splits by words and returns the first N words joined.
 * Handles unclosed markdown markers by stripping them from the end.
 */
export function getVisibleAnswer(fullAnswer: string, wordIndex: number): string {
  const words = fullAnswer.split(/(\s+)/);
  const visible = words.slice(0, wordIndex * 2 + 1).join('');

  // Strip unclosed bold/italic markers at the end
  let cleaned = visible;

  // Check for unclosed ** (bold)
  const boldCount = (cleaned.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) {
    const lastIdx = cleaned.lastIndexOf('**');
    cleaned = cleaned.slice(0, lastIdx) + cleaned.slice(lastIdx + 2);
  }

  // Check for unclosed backtick blocks
  const tripleCount = (cleaned.match(/```/g) || []).length;
  if (tripleCount % 2 !== 0) {
    // Don't strip - show as-is since code block is being typed
  }

  return cleaned;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
