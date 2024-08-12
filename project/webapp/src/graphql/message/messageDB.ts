import { Chat, chatID, Message } from "./schema";

export async function dbCreateChat(inquirerID: string, listingID: string): Promise<chatID>{
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3015/api/v0/chat/createChat', {
      method: 'POST',
      body: JSON.stringify({listingID, inquirerID}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: chatID) => {
        resolve(data);
      })
      .catch((error: Error) => {
        console.error(error);
        reject(error);
      })
  })
} 

export async function dbGetChats(requesterID: string): Promise<Chat[]>{
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3015/api/v0/chat/getChats', {
      method: 'POST',
      body: JSON.stringify({requesterID}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: Chat[]) => {
        resolve(data);
      })
      .catch((error: Error) => {
        console.error(error);
        reject(error);
      })
  })
} 

export async function dbGetChatInfo(requesterID: string, chatID: string): Promise<Chat>{
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3015/api/v0/chat/getChatInfo', {
      method: 'POST',
      body: JSON.stringify({requesterID, chatID}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: Chat) => {
        resolve(data);
      })
      .catch((error: Error) => {
        console.error(error);
        reject(error);
      })
  })
} 

export async function dbGetChatHistory(requesterID: string, chatID: string): Promise<Message[]>{
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3015/api/v0/chat/history', {
      method: 'POST',
      body: JSON.stringify({requesterID, chatID}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: Message[]) => {
        resolve(data);
      })
      .catch((error: Error) => {
        console.error(error);
        reject(error);
      })
  })
} 

export async function dbSendMessage(requesterID: string, chatID: string, message: string): Promise<Message>{
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3015/api/v0/message/send', {
      method: 'POST',
      body: JSON.stringify({requesterID, chatID, message}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: Message) => {
        resolve(data);
      })
      .catch((error: Error) => {
        console.error(error);
        reject(error);
      })
  })
} 


