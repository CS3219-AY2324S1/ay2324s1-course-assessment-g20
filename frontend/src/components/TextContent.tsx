import ReactMarkdown from 'react-markdown';

function TextContent({ content }: { content: string }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}

export default TextContent;
