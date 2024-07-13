// This will contain functions + classes that are defined here and exported

//  Trie Data structure to store 3 triggers (@, /, :, text),
// @ -> Tag User, / => Command , :text => Custom Emotes, text => text/default

// Create Node Class
class TrieNode {
  children: { [key: string]: TrieNode };
  finalWord: string;
  isEndOfWord: boolean;

  constructor() {
    this.children = {}; // storing the children of each node
    this.finalWord = ''; // store the main value
    this.isEndOfWord = false; // indicator if we have reached the end of word
  }
}

// create Trie Class
export class Trie {
  root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }

  // inserting all words inside the trie
  insert(word: string): void {
    let currentNode = this.root;

    for (let letter of word) {
      if (!currentNode.children[letter]) {
        currentNode.children[letter] = new TrieNode();
      }
      currentNode = currentNode.children[letter];
    }
    currentNode.isEndOfWord = true;
    currentNode.finalWord = word;
  }
  // Search and display any potentential matches
  search(word: string): string[] {
    let result: string[] = [];

    let currentNode = this.root;

    // Moving Pointer to the last letter
    for (let letter of word) {
      if (currentNode.children[letter]) {
        currentNode = currentNode.children[letter];
      } else {
        return []; // No words with this prefix found, return empty array
      }
    }

    // Traverse through any of the potential matches EX/ "Angel" => ["Angels", "Angels2"...]
    const dfs = (node: TrieNode) => {
      if (node.isEndOfWord) {
        result.push(node.finalWord);
      }

      for (let childKey in node.children) {
        dfs(node.children[childKey]);
      }
    };

    dfs(currentNode);
    result.sort();
    return result;
  }

  insertMany(words: string[]): void {
    for (let word of words) {
      this.insert(word);
    }
  }
}

interface User {
  name: string;
  description: string;
}

// This is Dummy Data just for sure
const users: User[] = [
  { name: '@KobeBryant', description: '@KobeBryant' },
  { name: '@LebronJames', description: '@LebronJames' },
  { name: '@AnthonyDavis', description: '@AnthonyDavis' },
  { name: '@ChrisPaul', description: '@ChrisPaul' },
  { name: '@StephCurry', description: '@StephCurry' },
  { name: '@JaysumTatum', description: '@JaysumTatum' },
  { name: '@JaylenBrown', description: '@JaylenBrown' },
  { name: '@JamalMurray', description: '@JamalMurray' },
  { name: '@NikolaJokic', description: '@NikolaJokic' },
  { name: '@DamianLillard', description: '@DamianLillard' },
  { name: '@Giannis', description: '@Giannis' },
];

interface Command {
  name: string;
  description: string;
}

const commands: Command[] = [
  {
    name: '/block',
    description: 'Block a user from interacting with you on Twitch',
  },
  {
    name: '/unblock',
    description: 'Remove user from your block list',
  },
  {
    name: '/color',
    description: 'Change your username color, i.e. blue, green, etc',
  },
  {
    name: '/gift',
    description: 'Gift a specified number of Subs to the community',
  },
  {
    name: '/help',
    description: 'Get detailed information on using a chat command',
  },
  {
    name: '/mods',
    description: 'Display a list of moderators for this channel',
  },
  {
    name: '/vips',
    description: 'Display a list of VIPs for this channel',
  },
  {
    name: '/vote',
    description: 'Vote in the active poll on the given channel',
  },
];

interface Emote {
  name: string;
  description: string;
}

const emotes: Emote[] = [
  {
    name: ':catjam',
    description: '../../public/emotes/catJam.webp',
  },
  {
    name: ':ez',
    description: '../../public/emotes/EZ.webp',
  },
  {
    name: ':kekw',
    description: '../../public/emotes/KEKW.webp',
  },
  {
    name: ':monkas',
    description: '../../public/emotes/monkaS.webp',
  },
];

// Initialize the chatTrie
export const chatTrie = new Trie();

// Insert users into chatTrie
for (let user of users) {
  chatTrie.insert(user.name);
}

// Insert commands into chatTrie
for (let command of commands) {
  chatTrie.insert(command.name);
}

// Insert emotes into chatTrie
for (let emote of emotes) {
  chatTrie.insert(emote.name);
}
