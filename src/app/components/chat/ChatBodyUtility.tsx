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
  catjam: '/emotes/catJam.webp',
  kekw: '/emotes/KEKW.webp',
  ez: '/emotes/EZ.webp',
  monkas: '/emotes/monkas.webp',
};

// Replace Emojis in the chatbody
export const replaceShortcutsWithEmojis = (message) => {
  const words = message.split(' ');
  return words.map((word, index) => {
    // Search for theinstance of ':'. Then remove it and look for the matching emoji via map
    const cleanWord = word.replace(/:/g, '');
    if (emojiMap[cleanWord]) {
      return (
        <img
          key={index}
          src={emojiMap[cleanWord]}
          alt={cleanWord}
          className="inline-block"
          style={{ width: '20px', height: '20px' }}
        />
      );
    }
    // if its not return the word
    return <span key={index}>{word} </span>;
  });
};

// Replace Emojis in the Input Text Area
export const replaceShortcutsWithEmojisInput = (message) => {
  const words = message.split(' ');
  return words
    .map((word, index) => {
      const cleanWord = word.replace(/:/g, ''); // searches for ":"
      if (emojiMap[cleanWord]) {
        return (
          <img
            key={index}
            src={emojiMap[cleanWord]}
            alt={cleanWord}
            className="inline-block"
            style={{ width: '20px', height: '20px' }}
          />
        );
      }

      // tryutnd word if it doesnt exist
      return word + ' ';
    })
    .join('');
};
