// this is will be to store any utility functions for ChatBody.tsx

export const messages = [
  {
    username: 'Username',
    message:
      'Very Nice Content! I hope you have a terrific weekend. and hopefully we shall meet again',
  },
  { username: 'Username', message: 'Very Nice Content!' },
  { username: 'Username', message: 'Very Nice Content!' },
  {
    username: 'Username',
    message:
      'Very Nice Content! I hope you have a terrific weekend. and hopefully we shall meet again',
  },
  {
    username: 'Username',
    message:
      'Very Nice Content! I hope you have a terrific weekend. and hopefully we shall meet again',
  },
  {
    username: 'Username',
    message:
      'Very Nice Content! I hope you have a terrific weekend. and hopefully we shall meet again',
  },
  { username: 'Username', message: 'Very Nice Content!' },
  { username: 'Username', message: 'Very Nice Content!' },
  { username: 'Username', message: 'Very Nice Content!' },
  { username: 'Username', message: 'Very Nice Content!' },
  { username: 'Username', message: 'Very Nice Content!' },
  { username: 'Username', message: 'Very Nice Content!' },
];

const emojiMap = {
  catjam: 'catjam.png',
  kekw: 'kekw.png',
  ez: 'ez.png',
  monkas: 'monkas.png',
};

export const renderMessageWithEmojis = (message: string) => {
  return message.split(':').map((part, index) => {
    if (index % 2 === 1) {
      const imageSrc = emojiMap[part];
      if (imageSrc) {
        return (
          <img
            key={index}
            src={`path_to_images/${imageSrc}`}
            alt={part}
            className="inline-block"
          />
        );
      }

      return <span key={index}>:{part}:</span>;
    }
    return <span key={index}>{part}</span>;
  });
};
