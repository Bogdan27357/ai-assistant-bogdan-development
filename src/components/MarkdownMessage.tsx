import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useState } from 'react';

interface MarkdownMessageProps {
  content: string;
}

const MarkdownMessage = ({ content }: MarkdownMessageProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Код скопирован!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');
          
          return !inline && match ? (
            <div className="relative group my-4">
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(codeString)}
                  className="bg-slate-800 border-slate-600 hover:bg-slate-700"
                >
                  <Icon 
                    name={copiedCode === codeString ? "Check" : "Copy"} 
                    size={14} 
                    className="mr-1" 
                  />
                  {copiedCode === codeString ? 'Скопировано' : 'Копировать'}
                </Button>
              </div>
              <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  fontSize: '0.875rem',
                  background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code 
              {...props} 
              className="px-1.5 py-0.5 rounded bg-slate-700/50 text-indigo-300 font-mono text-sm"
            >
              {children}
            </code>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-white mt-6 mb-4 text-gradient">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-white mt-5 mb-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold text-gray-200 mt-4 mb-2">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="leading-relaxed mb-4 text-gray-100">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-gray-100">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-100">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="ml-4">
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 italic text-gray-300 bg-slate-800/30 rounded-r-lg">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse border border-slate-600 rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-slate-700">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="border border-slate-600 px-4 py-2 text-left font-semibold text-white">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-slate-600 px-4 py-2 text-gray-200">
            {children}
          </td>
        ),
        a: ({ children, href }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            {children}
          </a>
        ),
        hr: () => (
          <hr className="my-6 border-slate-600" />
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-white">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-300">
            {children}
          </em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownMessage;
