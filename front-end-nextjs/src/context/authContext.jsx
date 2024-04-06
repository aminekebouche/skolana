//import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";

import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as anchor from "@project-serum/anchor";
import idl from "../pages/idl.json";
import {
  getAccount,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  AccountLayout,
} from "@solana/spl-token";

const PROGRAM_KEY = new PublicKey(idl.metadata.address);
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const AuthContext = React.createContext(null);

export const AuthContextProvider = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const anchorWallet = useAnchorWallet();

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(idl, PROGRAM_KEY, provider);
    }
  }, [connection, anchorWallet]);

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

  const [onchaintUser, setOnchainUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userchain");
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

  const updateOnchaintUser = (input) => {
    setOnchainUser(input);
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
      setOnchainUser(null);
      return res;
    } else {
      const error = await response.json();
      return error;
    }
  };

  const showPub = async () => {
    console.log(publicKey.toBase58());
  };

  const createPostOnChain = async (types, content, documents, price) => {
    if (program && publicKey) {
      try {
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        const [postPda] = findProgramAddressSync(
          [
            utf8.encode("post"),
            publicKey.toBuffer(),
            Uint8Array.from([onchaintUser.lastPostId]),
          ],
          program.programId
        );

        await program.methods
          .createPost(types, content, documents, price)
          .accounts({
            userAccount: userPda,
            postAccount: postPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } catch (error) {
        console.error(error);
      } finally {
      }
    }
  };

  const showBalance2 = async () => {
    const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    console.log("Token                                         Balance");
    console.log("------------------------------------------------------------");
    tokenAccounts.value.forEach((tokenAccount) => {
      const accountData = AccountLayout.decode(tokenAccount.account.data);
      console.log(
        `${new PublicKey(accountData.mint)}   ${
          accountData.amount / BigInt(1000000000)
        }`
      );
      console.log(tokenAccount.pubkey.toBase58());
    });
  };

  const showBalance = async () => {
    try {
      const tokenAccounts = await connection.getTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      const balances = []; // Tableau pour stocker les soldes

      console.log("Token                                         Balance");
      console.log(
        "------------------------------------------------------------"
      );

      tokenAccounts.value.forEach((tokenAccount) => {
        const accountData = AccountLayout.decode(tokenAccount.account.data);
        const balance = accountData.amount / BigInt(1000000000); // Divisez par 1 milliard
        balances.push(balance); // Ajoutez le solde au tableau
        console.log("tooooooooooz");
        console.log(balances);

        console.log(`${new PublicKey(accountData.mint)}   ${balance}`);
        console.log(tokenAccount.pubkey.toBase58());
      });

      return balances; // Retourne le tableau des soldes
    } catch (error) {
      console.error("Error fetching token accounts:", error);
      return []; // En cas d'erreur, retournez un tableau vide
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("userchain", JSON.stringify(onchaintUser));
  }, [onchaintUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        onchaintUser,
        login,
        logout,
        allUsers,
        updateCurrentUser,
        updateOnchaintUser,
        createPost,
        showPub,
        createPostOnChain,
        showBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
