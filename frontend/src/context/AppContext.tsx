"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";

export const user_service = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "";

export const chat_service = process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || "";

// interface for user
export interface User {
  _id: string; // unique id for user
  name: string; // user's name
  email: string; // user's email
}

// interface for chat
export interface Chat {
  _id: string; // unique id for chat
  users: string[]; // array of user ids present in the chat

  // latest message in the chat
  latestMessage: {
    text: string;
    sender: string; // user id of the sender
  };
  createdAt: string;
  updatedAt: string;
  unseenCount?: number; // unseen message count
}

// interface for chat along with user details
export interface Chats {
  _id: string;
  user: User; // user details of the other user in the chat
  chat: Chat; // chat details
}

// interface for app context
interface AppContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean; // Is user authenticated
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchChats: () => Promise<void>;
  chats: Chats[] | null;
  users: User[] | null;
  setChats: React.Dispatch<React.SetStateAction<Chats[] | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined); // create context for app

interface AppProviderProps {
  children: ReactNode;
}

// create provider for app context
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // state to hold user data
  const [user, setUser] = useState<User | null>(null);

  // state to check if user is authenticated
  const [isAuth, setIsAuth] = useState(false);

  const [loading, setLoading] = useState(true);

  // function to fetch user data from backend
  async function fetchUser() {
    try {
      // get token from cookies
      const token = Cookies.get("token");

      // Send a GET request to backend to fetch user data

      const { data } = await axios.get(`${user_service}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // function to logout user / ended the current session

  async function logoutUser() {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("User Logged out successfully");
  }

  const [chats, setChats] = useState<Chats[] | null>(null);

  async function fetchChats() {
    const token = Cookies.get("token");

    try {
      // Send a get request to backend and fetch all the chats of current loggedIn user ( authenticated req hai )

      // Agar hum logged out rahenge toh fetchChats() call hi nahi hoga. Isliye humein isko bahar rakhna padega.

      // Jaise hi user verify ho jaye, tab fetchChats() dobara call hona chahiye . Nahi toh chats ka array empty hi rahega , We have to reload once toh fetchChats()

      const { data } = await axios.get(`${chat_service}/api/v1/chat/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChats(data.chats);
    } catch (error) {
      console.log(error);
    }
  }

  // array of all users
  const [users, setUsers] = useState<User[] | null>(null);

  async function fetchUsers() {
    const token = Cookies.get("token");

    try {
      const { data } = await axios.get(`${user_service}/api/v1/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser(); // fetch user data on component mount or when page refreshes

    fetchChats(); // fetch all chats of authenticated user on component mount or when page refreshes

    fetchUsers(); // fetch all the users  on component mount or when page refreshes
  }, []);

  return (
    // provide the context to children components

    <AppContext.Provider
      value={{
        user,
        setIsAuth,
        setUser,
        isAuth,
        loading,
        logoutUser,
        fetchChats,
        fetchUsers,
        chats,
        users,
        setChats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  // custom hook to use app context
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useappdata must be used within AppProvider");
  }

  return context;
};

// but there is problem hai ki agar user loggedOut hai  toh fetchChats() , fetchUsers()dono mein se koi bhi call hi nahi hoga.

// and then agar hum dobara login krte hai by adding email , jaise hi user verify ho jayega , tab bhi fetchUsers() , fetchChats() call nhi hoga without reload , data empty rhega and humein manual reload krna pad rha hai to call both fetchUsers() , fetchChats().
