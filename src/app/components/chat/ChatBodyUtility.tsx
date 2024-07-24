// this is will be to store any utility functions for ChatBody.tsx

const emojiMap = {
  catjam: '/emotes/catJam.webp',
  kekw: '/emotes/KEKW.webp',
  ez: '/emotes/EZ.webp',
  monkas: '/emotes/monkas.webp',
};

// Replace Emojis in the chatbody
export const replaceShortcutsWithEmojis = (message) => {
  // Ensure the message is a string
  if (typeof message !== 'string') {
    // Optionally, handle the case where message is not a string
    return <span>Invalid message format</span>;
  }

  // Split the message into words and replace shortcuts with emojis
  const words = message.split(' ');
  return words.map((word, index) => {
    // Remove leading and trailing colons
    const cleanWord = word.replace(/:/g, '');

    // Check if cleanWord matches any emoji
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

    // If no match, return the word as a span
    return <span key={index}>{word} </span>;
  });
};
