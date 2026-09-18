import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

// Markdown tối giản cho câu trả lời của AI: khối ```code```, tiêu đề,
// danh sách (- / * / 1.), `inline code`, **đậm** và *nghiêng*.

const renderInline = (text, keyPrefix) =>
  text
    .split(/(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\s][^*\n]*\*)/g)
    .map((part, i) => {
      const key = `${keyPrefix}-${i}`;
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={key}
            className="px-1 py-0.5 rounded bg-slate-100 text-rose-600 dark:text-rose-400 text-[12px] font-mono break-words"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={key} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={key}>{part.slice(1, -1)}</em>;
      }
      return part;
    });

const UL_ITEM = /^\s*[-*•]\s+(.*)$/;
const OL_ITEM = /^\s*(\d+)[.)]\s+(.*)$/;
const HEADING = /^#{1,6}\s+(.*)$/;

const renderBlocks = (text, keyPrefix) => {
  const blocks = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const key = `${keyPrefix}-p${blocks.length}`;
    blocks.push(
      <p key={key}>
        {paragraph.map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {renderInline(line, `${key}-${i}`)}
          </React.Fragment>
        ))}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    const key = `${keyPrefix}-l${blocks.length}`;
    const items = list.items.map((item, i) => (
      <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
    ));
    blocks.push(
      list.ordered ? (
        <ol
          key={key}
          start={list.start}
          className="list-decimal pl-5 space-y-1"
        >
          {items}
        </ol>
      ) : (
        <ul
          key={key}
          className="list-disc pl-5 space-y-1 marker:text-slate-400"
        >
          {items}
        </ul>
      ),
    );
    list = null;
  };

  for (const line of text.split("\n")) {
    const ul = line.match(UL_ITEM);
    const ol = line.match(OL_ITEM);
    const heading = line.match(HEADING);

    if (ul || ol) {
      flushParagraph();
      const ordered = Boolean(ol);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, start: ol ? Number(ol[1]) : 1, items: [] };
      }
      list.items.push(ordered ? ol[2] : ul[1]);
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push(
        <p
          key={`${keyPrefix}-h${blocks.length}`}
          className="font-bold text-slate-900"
        >
          {renderInline(heading[1], `${keyPrefix}-h${blocks.length}`)}
        </p>,
      );
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
};

const CodeBlock = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Trình duyệt chặn clipboard: bỏ qua.
    }
  };

  return (
    <div className="rounded-lg overflow-hidden bg-gray-950 text-gray-100 border border-gray-800">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900 text-[11px] text-gray-400">
        <span className="font-mono">{lang || "code"}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 hover:text-white transition-colors"
          aria-label="Sao chép code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" /> Đã chép
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Sao chép
            </>
          )}
        </button>
      </div>
      <pre className="p-3 text-[12px] leading-relaxed font-mono overflow-x-auto scrollbar-thin-dark">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const ChatMarkdown = ({ text }) => {
  // Khi đang stream, khối code có thể chưa đóng: tạm đóng để hiển thị đúng.
  const fenceCount = (text.match(/```/g) || []).length;
  const source = fenceCount % 2 === 1 ? `${text}\n\`\`\`` : text;
  const parts = source.split(/```([\w+#.-]*)[^\n]*\n?([\s\S]*?)```/g);

  const out = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i].trim()) out.push(...renderBlocks(parts[i], `t${i}`));
    if (i + 2 < parts.length) {
      out.push(
        <CodeBlock
          key={`c${i}`}
          lang={parts[i + 1]}
          code={parts[i + 2].replace(/\n$/, "")}
        />,
      );
    }
  }
  return <div className="space-y-2">{out}</div>;
};
