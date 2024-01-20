export default function Message({ content, me }: { content: string; me: boolean }) {
  return (
    <div className={`${me ? 'justify-end' : 'justify-start'} flex`}>
      <div className={`${me ? 'bg-green-300' : 'bg-gray-200 '} w-fit p-3 rounded-lg`}>
        {content}
      </div>
    </div>
  );
}
