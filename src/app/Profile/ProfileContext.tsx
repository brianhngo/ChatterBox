// This file will hold our Context ( passing down Prop)

import React, { createContext } from 'react';

// Create a Context
const MyContext = createContext({
  isModal: false,
  setIsModal: () => {},
});

export default MyContext;

//  I want to pass down isModal Usestate so i can trigger modal to pop if the user isn't logged in anywhere
