import Image from 'next/image';
import Chat from './components/chat/Chat';
import LoginFeature from './Profile/LoginFeature';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center bg-white text-blue-800 justify-between p-24">
      <LoginFeature />
      <Chat />
    </main>
  );
}
