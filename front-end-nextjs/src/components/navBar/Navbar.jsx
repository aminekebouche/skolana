import React, { useContext, useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "../../context/authContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/router";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  TransactionInstruction,
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  confirmTransaction,
} from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as anchor from "@project-serum/anchor";
import idl from "../../pages/idl.json";
import {
  getAccount,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  AccountLayout,
  createTransferInstruction,
  createMint,
  createAccount,
  mintTo,
  getOrCreateAssociatedTokenAccount,
  createTransferCheckedInstruction,
  transfer,
  Token,
} from "@solana/spl-token";

const PROGRAM_KEY = new PublicKey(idl.metadata.address);
const active = "bg-indigo active";
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000" + "/uploads/";

const Navbar = () => {
  const { currentUser, onchaintUser, updateOnchaintUser, showBalance } =
    useContext(AuthContext);
  const router = useRouter();
  const isActive = (pathname) => router.pathname === pathname;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();
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

  useEffect(() => {
    setIsLoggedIn(currentUser !== null && currentUser !== undefined);
  }, [currentUser]);

  useEffect(() => {
    const start = async () => {
      console.log(initialized);
      console.log(program);
      if (program && publicKey) {
        console.log("program");
        console.log(program.programId);

        try {
          const [userPda] = await findProgramAddressSync(
            [utf8.encode("user"), publicKey.toBuffer()],
            program.programId
          );
          console.log(userPda.toJSON());
          const user = await program.account.userAcount.fetch(userPda);
          console.log(user);
          if (user) {
            setInitialized(true);
            updateOnchaintUser(user);
            const postAccounts = await program.account.postAcount.all(
              publicKey.toString()
            );
            //setPosts(postAccounts);
          }
        } catch (error) {
          console.log(error);
          setInitialized(false);
        }
      }
    };

    start();
  }, [program, publicKey]);

  const fetchBalance = async () => {
    if (!publicKey) return;

    try {
      const publicKeyObj = new PublicKey(publicKey.toBuffer());
      const balance = await connection.getBalance(publicKeyObj);
      // Convertir la balance de lamports en SOL (1 SOL = 10^9 lamports)
      const solBalance = balance / 1000000000;
      console.log(solBalance);
    } catch (error) {
      console.error("Erreur lors de la récupération de la balance:", error);
    }
  };

  const fetchTokenBalance = async () => {
    if (!publicKey) return;

    try {
      const tokenAccountInfo = await getAccount(
        connection,
        new PublicKey("EKv5JdXx16j8XF1dQeikeo8au5eS6cuW3vSdERAZDRNJ")
      );

      console.log(tokenAccountInfo.amount);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la balance du token:",
        error
      );
    }
  };

  const show2 = async () => {
    try {
      const t = await fetchTokenBalance();
      console.log(t);
    } catch (err) {
      console.log(err);
    }
  };

  const initUser = async () => {
    if (program && publicKey) {
      try {
        //setTransactionPending(true)
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        const name = currentUser.firstname + currentUser.lastname;
        const avatar = currentUser.avatar;

        const user = await program.methods
          .initUser(name, avatar)
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        console.log(user);
        setInitialized(true);
      } catch (error) {
        console.log(error);
      } finally {
        //setTransactionPending(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-between bg-white w-full h-14 fixed top-0 z-50">
      <div className="flex items-center pl-4">
        <div className="logo">
          <Link href="">
            <Image src="/Studycool.svg" alt="logo" width="121" height="30" />
          </Link>
        </div>
      </div>
      <div className="flex items-center pl-4">
        <div className="flex items-center gap-10 pl-10">
          <Link
            href="/home"
            className={
              isActive("/home")
                ? "text-primary font-bold underline underline-offset-8"
                : ""
            }
          >
            Accueil
          </Link>
          <Link
            href="/dashboard"
            className={
              isActive("/dashboard")
                ? "text-primary font-bold underline underline-offset-8"
                : ""
            }
          >
            Portail
          </Link>
          <Link
            href="/dochub"
            className={
              isActive("/dochub")
                ? "text-primary font-bold underline underline-offset-8"
                : ""
            }
          >
            DocHub
          </Link>
          <button onClick={show2}>Show</button>
        </div>

        {isLoggedIn ? (
          <>
            <div className="flex mx-5">
              <Link
                href="/profile"
                className="flex px-2 bg-seachbar-color rounded-full hover:bg-gray"
              >
                <img
                  className="pdp w-8 h-8 rounded-full ring-2"
                  src={currentUser?.avatar}
                  alt="pdp"
                  width={"40"}
                  height={"40"}
                />
                <ExpandMoreIcon className="p-1 text-icon-color hover:text-white" />
              </Link>
            </div>
            {!publicKey ? (
              <WalletMultiButton />
            ) : initialized ? (
              <WalletMultiButton />
            ) : (
              <button
                onClick={initUser}
                className="p-2 m-2 bg-indigo text-white bg-primary rounded-md text-sm"
              >
                Associate user
              </button>
            )}
          </>
        ) : (
          <div className="flex mx-5">
            <Link
              href="/login"
              className="p-2 m-2 bg-indigo text-white bg-primary rounded-md text-sm"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="p-2 m-2 bg-indigo text-white bg-primary rounded-md text-sm"
            >
              Sign in
            </Link>
          </div>
        )}
        <div className="w-full border-b-2 absolute w-full inset-x-0 bottom-0  border-gray"></div>
      </div>
    </div>
  );
};

export default Navbar;
