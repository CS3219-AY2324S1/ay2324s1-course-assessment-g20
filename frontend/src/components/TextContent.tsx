import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function TextContent({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}

export default TextContent;
