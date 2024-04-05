//import axios from "axios";
import React, { useEffect, useState } from "react";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const AuthContext = React.createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (error) {
          console.error(error);
        }
      }
      return null;
    }
  });

  const updateCurrentUser = (input) => {
    setCurrentUser(input);
    return true;
  };

  const login = async (inputs) => {
    const response = await fetch(API_URL + "/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
      credentials: "include",
    });

    if (response.ok) {
      const user = await response.json();
      setCurrentUser(user);
      return true;
    } else {
      const error = await response.json();
      console.log(error);
      return false;
    }
  };

  const createPost = async (inputs) => {
    const response = await fetch(API_URL + "/post/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
      credentials: "include",
    });

    if (response.ok) {
      const user = await response.json();
      //setCurrentUser(user);
      return true;
    } else {
      const error = await response.json();
      console.log(error);
      return false;
    }
  };

  const allUsers = async () => {
    const response = await fetch(API_URL + `/user/all/${currentUser?._id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const users = await response.json();
      return users;
    } else {
      const error = await response.json();
      console.log(error);
      return false;
    }
  };

  const logout = async () => {
    const response = await fetch(API_URL + "/user/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const res = await response.json();
      setCurrentUser(null);
      return res;
    } else {
      const error = await response.json();
      return error;
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        allUsers,
        updateCurrentUser,
        createPost,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
