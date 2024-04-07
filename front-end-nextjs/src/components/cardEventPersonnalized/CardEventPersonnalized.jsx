import React, { useContext, useState } from "react";
import Image from "next/image";
import DocPost from "../DocPost";
import ReactTimeAgo from "react-time-ago";
import { likeOrUnlike } from "@/pages/api/api";
import { AuthContext } from "@/context/authContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import Alert from "../Alert";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const sentences = {
  Service: "proposed a service",
  Document: (numberOfDoc) =>
    `shared ${numberOfDoc} document${numberOfDoc > 1 ? "s" : ""}`,
  Question: "asked a question",
};

const CardEventPersonnalized = ({ event }) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, wallet } = useWallet();

  const type = event.type;
  const numberOfDoc = event.documents.length;
  const { currentUser, updateUser } = useContext(AuthContext);
  const idUser = currentUser._id;
  const liked = event.likes.includes(idUser);
  const [payed, setPayed] = useState(false);
  const [isAlert, setIsAlert] = useState(null);
  const [messageClaim, setMessageClaim] = useState("");

  const handleLike = async () => {
    await likeOrUnlike({ postId: event._id });
  };

  const show = () => {
    console.log(event);
    setPayed(!payed);
  };

  const downloadDoc = () => {
    console.log("Download");
    if (event.type === "Document" && payed) {
      const url =
        API_URL + "/uploads/" + event.author._id + "/" + event.documents[0];
      return url;
    }
    return false;
  };

  async function getNumberDecimals(mintAddress) {
    const info = await connection.getParsedAccountInfo(
      new PublicKey(mintAddress)
    );
    const result = (info.value?.data).parsed.info.decimals;
    return result;
  }

  const claim = async (amount) => {
    const DESTINATION_WALLET = event.author.publicKey;
    const MINT_ADDRESS = "2cwD1PLfr2GKB8LYNHPbjMvhyPzvkUump4HvdBzEvHoc";
    const TRANSFER_AMOUNT = amount;

    try {
      console.log(
        `Sending ${TRANSFER_AMOUNT} ${MINT_ADDRESS} from ${publicKey.toBase58()} to ${DESTINATION_WALLET}.`
      );
      //Step 1
      console.log(`1 - Getting Source Token Account`);
      let sourceAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(MINT_ADDRESS),
        publicKey,
        signTransaction
      );
      console.log(`    Source Account: ${sourceAccount.address.toString()}`);

      //Step 2
      console.log(`2 - Getting Destination Token Account`);
      let destinationAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(MINT_ADDRESS),
        new PublicKey(DESTINATION_WALLET),
        signTransaction
      );
      console.log(
        `    Destination Account: ${destinationAccount.address.toString()}`
      );

      //Step 3
      console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
      const numberDecimals = await getNumberDecimals(MINT_ADDRESS);
      console.log(`    Number of Decimals: ${numberDecimals}`);

      //Step 4
      console.log(`4 - Creating and Sending Transaction`);
      const tx = new Transaction();
      tx.add(
        createTransferInstruction(
          sourceAccount.address,
          destinationAccount.address,
          publicKey,
          TRANSFER_AMOUNT * Math.pow(10, numberDecimals),
          []
        )
      );

      console.log("YES");

      const latestBlockHash = await connection.getLatestBlockhash("confirmed");
      tx.feePayer = await publicKey;

      console.log("YES 2");
      tx.recentBlockhash = await latestBlockHash.blockhash;

      const signed = await signTransaction(tx);
      await connection.sendRawTransaction(signed.serialize());

      console.log("YES 3");
      //const signature = await signTransaction(tx);
      console.log(
        "\x1b[32m", //Green Text
        `   Transaction Success!🎉`,
        `\n    https://explorer.solana.com/tx/${signed}?cluster=devnet`
      );
      setMessageClaim(
        `Purchase successfully completed ${TRANSFER_AMOUNT} SKT🎉 \n https://explorer.solana.com/tx/${signed}?cluster=devnet`
      );
      setIsAlert("success");
      setPayed(true);
      const docs = currentUser.docs;
      const url =
        API_URL + "/uploads/" + event.author._id + "/" + event.documents[0];
      docs.push(url);
      if (url) {
        await updateUser({ docs: docs });
      } else {
        console.log("NON URL");
      }
    } catch (error) {
      setMessageClaim(`You need to connect your wallet !`);
      setIsAlert("error");
      console.error("Error sending tokens:", error);
    }
  };

  return (
    <div className="bg-white w-full rounded-lg shadow-md p-6 flex flex-col my-4">
      {isAlert && (
        <Alert isAlert={isAlert} onPost={setIsAlert} message={messageClaim} />
      )}
      <div className="flex items-center">
        <Image
          src={event.author.avatar}
          alt="profile"
          className="rounded-full mr-4 cover"
          width={"40"}
          height={"40"}
        />
        <div>
          <div className="flex gap-80 items-center">
            <span className="flex gap-2 text-lg">
              <h2 className=" font-semibold">
                {event.author.firstname} {event.author.lastname}
              </h2>
              {typeof sentences[type] === "function" ? (
                <p>{sentences[type](numberOfDoc)}</p>
              ) : (
                <p>{sentences[type]}</p>
              )}
            </span>

            {event.price && event.price != 0 && (
              <div className="flex gap-6">
                <h3
                  className="bg-green-600 text-white rounded-lg px-2 py-1 font-bold text-lg flex items-center"
                  onClick={show}
                >
                  {event.price} {"SKT"}{" "}
                </h3>
                <button
                  onClick={() => claim(event.price)}
                  className="bg-blue-600 text-white rounded-lg px-2 py-1 font-bold text-lg"
                >
                  Buy
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600">
            <ReactTimeAgo date={event.createdAt} locale="en-US" />
          </p>
          <span className="bg-primary text-white rounded-xl px-2 py-1 font-bold text-xs">
            {event.type}
          </span>
        </div>
      </div>

      <p className="text-gray-800 mt-3">{event.content}</p>
      <div className="flex mt-4 flex-wrap">
        <div className="flex flex-1 gap-6 min-w-0 px-2">
          {event.documents.map((e, i) => (
            <a href={downloadDoc()} key={i} download target="_blank">
              <DocPost filename={e} description={""} key={i} payed={payed} />
            </a>
          ))}
        </div>
      </div>
      <div className="flex gap-4 items-center mt-4">
        <div className="flex items-center text-gray-700 text-sm">
          {!liked ? (
            <Image
              src="/likeIcon.svg"
              alt="profile"
              className="w-6 h-6 rounded-full mr-2 cursor-pointer"
              width={"10"}
              height={"10"}
              onClick={handleLike}
            />
          ) : (
            <Image
              src="/like.png"
              alt="profile"
              className="w-6 h-6 rounded-full mr-2 cursor-pointer"
              width={"10"}
              height={"10"}
              onClick={handleLike}
            />
          )}
          <span>{event.likes.length} Likes</span>
        </div>
        <div className="flex items-center text-gray-700 text-sm">
          {" "}
          <Image
            src="/commentIcon.svg"
            alt="profile"
            className="w-6 h-6 rounded-full mr-2"
            width={"10"}
            height={"10"}
          />{" "}
          <p className="text-sm text-gray-600">
            {event.comments.length} Comments
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardEventPersonnalized;
