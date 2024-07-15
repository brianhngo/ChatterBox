import Image from 'next/image';
import Chat from './components/chat/Chat';
import LoginFeature from './Profile/LoginFeature';
import Channel from './Channel/Channel';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center bg-white text-blue-800 justify-between p-24">
      <LoginFeature />
      <div className="flex flex-row justify-center w-full h-full ">
        <div className="w-3/5 border border-gray-800 ">
          <Channel />
        </div>
        <div className="w-2/5  h-full">
          <Chat />
        </div>
      </div>
    </main>
  );
}
