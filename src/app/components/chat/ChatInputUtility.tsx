import axios from 'axios';
import { socket } from './ChatInput';
// This will contain functions + classes that are defined here and exported

//  Trie Data structure to store 3 triggers (@, /, :, text),
// @ -> Tag User, / => Command , :text => Custom Emotes, text => text/default

// Create Node Class
class TrieNode {
  children: { [key: string]: TrieNode };
  finalWord: string;
  isEndOfWord: boolean;
  description: string;

  constructor() {
    this.children = {}; // storing the children of each node
    this.finalWord = ''; // store the main value
    this.isEndOfWord = false; // indicator if we have reached the end of word
    this.description = ''; // this will be description tag
  }
}

// create Trie Class
export class Trie {
  root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }

  // inserting all words inside the trie
  insert(word: string, description: string): void {
    let currentNode = this.root;

    for (let letter of word) {
      if (!currentNode.children[letter]) {
        currentNode.children[letter] = new TrieNode();
      }
      currentNode = currentNode.children[letter];
    }
    currentNode.isEndOfWord = true;
    currentNode.finalWord = word;
    currentNode.description = description;
  }
  // Search and display any potentential matches
  search(word: string) {
    let result: any = [];

    let currentNode = this.root;

    // Moving Pointer to the last letter
    for (let letter of word) {
      if (currentNode.children[letter]) {
        currentNode = currentNode.children[letter];
      } else {
        return []; // No words with this prefix found, return empty array
      }
    }

    // Traverse through any of the potential matches EX/ "Angel" => [["Angels", description], "Angels2"...] with its description
    const dfs = (node: TrieNode) => {
      if (node.isEndOfWord) {
        result.push([node.finalWord, node.description]);
      }

      for (let childKey in node.children) {
        dfs(node.children[childKey]);
      }
    };

    dfs(currentNode);
    result.sort();
    return result;
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
    name: '/setAdmin',
    description: '/setAdmin @username - Set user as admin',
  },
  {
    name: '/unsetAdmin',
    description: '/unsetAdmin @username - Remove user as admin',
  },
  {
    name: '/mute',
    description: '/mute @username - Muted user',
  },
  {
    name: '/unmute',
    description: '/unmute @username - unmuted user',
  },
  {
    name: '/ban',
    description: '/ban @username - bans a user',
  },
  {
    name: '/unban',
    description: '/unban @username - unbans a user',
  },
  {
    name: '/suspend',
    description: '/suspend @username - suspends a user',
  },
  {
    name: '/unsuspend',
    description: '/unsuspend @username - unsuspend a user',
  },
  {
    name: '/settitle',
    description: '/settitle @Text - Update Channel Title',
  },
  {
    name: '/setdescription',
    description: '/setdescription @Text - Update Channel Description',
  },
];

export async function commandSwitchCase(command, information, streamId) {
  try {
    let response;

    switch (command) {
      case '/setadmin':
        response = await axios.put('http://localhost:3001/api/chat/setAdmin', {
          token: window.localStorage.getItem('token'),
          selectedUser: information,
          streamsId: streamId,
        });

        if (response.data) {
          socket.emit('setAdmin_user', {
            selectedUser: information,
            token: window.localStorage.getItem('token'),
            streamsId: streamId,
          });
        } else {
          socket.emit('failed_setAdminUSER');
        }
        break;

      case '/unsetadmin':
        response = await axios.put(
          'http://localhost:3001/api/chat/removeAdmin',
          {
            token: window.localStorage.getItem('token'),
            selectedUser: information,
            streamsId: streamId,
          }
        );
        if (response.data) {
          socket.emit('unsetAdmin_user', {
            selectedUser: information,
            token: window.localStorage.getItem('token'),
            streamsId: streamId,
          });
        } else {
          socket.emit('failed_unsetAdminUser');
        }

        break;

      case '/mute':
        console.log('mute1');
        response = await axios.put('http://localhost:3001/api/chat/muteUser', {
          token: window.localStorage.getItem('token'),
          selectedUser: information,
          streamsId: streamId,
        });
        if (response.data) {
          socket.emit('mute_user', {
            selectedUser: information,
            streamsId: streamId,
            token: window.localStorage.getItem('token'),
          });
        } else {
          socket.emit('failed_muteUSER');
        }

        break;

      case '/unmute':
        response = await axios.put(
          'http://localhost:3001/api/chat/unmuteUser',
          {
            token: window.localStorage.getItem('token'),
            selectedUser: information,
            streamsId: streamId,
          }
        );

        if (response.data) {
          socket.emit('unmute_user', {
            token: window.localStorage.getItem('token'),
            selectedUser: information,
            streamsId: streamId,
          });
        } else {
          socket.emit('failed_unmuteUSER');
        }

        break;

      case '/ban':
        response = await axios.put('http://localhost:3001/api/chat/banUser', {
          token: window.localStorage.getItem('token'),
          selectedUser: information,
          streamsId: streamId,
        });
        if (response.data) {
          socket.emit('ban_user', {
            token: window.localStorage.getItem('token'),
            selectedUser: information,
            streamsId: streamId,
          });
        } else {
          socket.emit('failed_ban', {});
        }
        break;

      case '/unban':
        response = await axios.put('http://localhost:3001/api/chat/unbanUser', {
          token: window.localStorage.getItem('token'),
          selectedUser: information,
          streamsId: streamId,
        });
        if (response.data) {
          socket.emit('unban_user', {});
        } else {
          socket.emit('failed_unban');
        }

        break;

      case '/suspend':
        response = await axios.put('http://localhost:3001/api/chat/suspend', {
          token: window.localStorage.getItem('token'),
          selectedUser: information,
          streamsId: streamId,
        });
        break;
      // if (response.data){
      //   socket.emit('update_user', {})
      // }

      case '/unsuspend':
        response = await axios.put('http://localhost:3001/api/chat/unsuspend', {
          token: window.localStorage.getItem('token'),
          selectedUser: information,
          streamsId: streamId,
        });
        // if (response.data){
        //   socket.emit('update_user', {})
        // }

        break;

      case '/settitle':
        response = await axios.put(
          'http://localhost:3001/api/chat/updateTitle',
          {
            token: window.localStorage.getItem('token'),
            text: information,
            streamsId: streamId,
          }
        );
        // if (response.data){
        //   socket.emit('update_user', {})
        // }

        break;
      case '/setdescription':
        response = await axios.put(
          'http://localhost:3001/api/chat/updateDescription',
          {
            token: window.localStorage.getItem('token'),
            text: information,
            streamsId: streamId,
          }
        );
        // if (response.data){
        //   socket.emit('update_user', {})
        // }
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

interface Emote {
  name: string;
  description: string;
}

const emotes: Emote[] = [
  {
    name: ':catjam',
    description: '/emotes/catJam.webp',
  },
  {
    name: ':ez',
    description: '/emotes/EZ.webp',
  },
  {
    name: ':kekw',
    description: '/emotes/KEKW.webp',
  },
  {
    name: ':monkas',
    description: '/emotes/monkaS.webp',
  },
];

// Initialize the chatTrie
export const chatTrie = new Trie();

// Insert users into chatTrie
for (let user of users) {
  chatTrie.insert(user.name.toLocaleLowerCase(), user.description);
}

// Insert commands into chatTrie
for (let command of commands) {
  chatTrie.insert(command.name.toLocaleLowerCase(), command.description);
}

// Insert emotes into chatTrie
for (let emote of emotes) {
  chatTrie.insert(emote.name.toLocaleLowerCase(), emote.description);
}
