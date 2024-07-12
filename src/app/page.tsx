import Image from 'next/image';
import Chat from './components/chat/Chat';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-blue-800 justify-between p-24">
      <Chat />
    </main>
  );
}
