import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

function CodeContent({ content, language }: { content: string; language: string }) {
  return (
    <div>
      <SyntaxHighlighter language={language}>{content}</SyntaxHighlighter>
    </div>
  );
}

export default CodeContent;
