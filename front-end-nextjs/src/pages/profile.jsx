import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/authContext";
import { useRouter } from "next/router";
import Alert from "@/components/Alert";
const API = process.env.REACT_APP_API_URL;
import {
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  getAccount,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  AccountLayout,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Profile = () => {
  const { currentUser, updateCurrentUser, logout, showBalance } =
    useContext(AuthContext);
  const [inputs, setInputs] = useState({
    lastname: "",
    firstname: "",
    university: "",
    description: "",
    email: "",
    password: "",
    profilePicture: "",
    avatar: "",
  });

  const [isAlert, setIsAlert] = useState(null);
  const [messageClaim, setMessageClaim] = useState("");

  const [balance, setBalance] = useState("0");
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (selectedImage) formData.append("profilePicture", selectedImage);
    formData.append("lastname", inputs.lastname);
    formData.append("firstname", inputs.firstname);
    formData.append("university", inputs.university);
    formData.append(
      "description",
      inputs.description ? inputs.description : ""
    );
    formData.append("email", inputs.email);

    try {
      const response = await fetch(`${API}/user/profile/${currentUser._id}`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const updatedUser = await response.json();
        updateCurrentUser({ ...updatedUser, _id: updatedUser._id });
        console.log("Profile updated:", updatedUser);
      } else {
        console.error("Error updating profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await showBalance();
        console.log(balance);
        setBalance(balance[0]);
        console.log(balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [showBalance]);

  useEffect(() => {
    console.log(balance);
  }, [balance]);

  const show = () => {
    console.log(balance);
  };

  useEffect(() => {
    if (currentUser) {
      setInputs({
        lastname: currentUser.lastname,
        firstname: currentUser.firstname,
        university: currentUser.university,
        description: currentUser.description,
        email: currentUser.email,
        avatar: currentUser.avatar,
        password: "",
      });
    }
  }, [currentUser]);

  async function getNumberDecimals(mintAddress) {
    const info = await connection.getParsedAccountInfo(
      new PublicKey(mintAddress)
    );
    const result = (info.value?.data).parsed.info.decimals;
    return result;
  }

  const claim = async () => {
    const FROM_KEYPAIR = Keypair.fromSecretKey(
      Uint8Array.from([
        195, 17, 145, 124, 85, 36, 5, 73, 119, 63, 217, 63, 29, 177, 217, 30,
        146, 246, 250, 224, 24, 232, 106, 224, 57, 106, 178, 63, 49, 53, 253, 6,
        173, 173, 135, 132, 89, 250, 244, 3, 211, 2, 105, 92, 35, 146, 255, 71,
        114, 106, 194, 44, 10, 210, 127, 47, 234, 241, 18, 81, 157, 32, 251,
        178,
      ])
    );
    const DESTINATION_WALLET = publicKey.toBase58();
    const MINT_ADDRESS = "CF3dQAz62C4QhAuNxQjgs14wygPPRkhdgYaBFFBQfNWp";
    const TRANSFER_AMOUNT = 10;

    try {
      console.log(
        `Sending ${TRANSFER_AMOUNT} ${MINT_ADDRESS} from ${FROM_KEYPAIR.publicKey.toString()} to ${DESTINATION_WALLET}.`
      );
      //Step 1
      console.log(`1 - Getting Source Token Account`);
      let sourceAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        FROM_KEYPAIR,
        new PublicKey(MINT_ADDRESS),
        FROM_KEYPAIR.publicKey
      );
      console.log(`    Source Account: ${sourceAccount.address.toString()}`);

      //Step 2
      console.log(`2 - Getting Destination Token Account`);
      let destinationAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        FROM_KEYPAIR,
        new PublicKey(MINT_ADDRESS),
        new PublicKey(DESTINATION_WALLET)
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
          FROM_KEYPAIR.publicKey,
          TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
        )
      );

      const latestBlockHash = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = await latestBlockHash.blockhash;
      const signature = await sendAndConfirmTransaction(connection, tx, [
        FROM_KEYPAIR,
      ]);
      console.log(
        "\x1b[32m", //Green Text
        `   Transaction Success!🎉`,
        `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
      setMessageClaim(
        `Welcome offer successfully claimed ${TRANSFER_AMOUNT} SKT🎉 \n https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
      setIsAlert("success");
      setBalance(balance + BigInt(TRANSFER_AMOUNT));
    } catch (error) {
      console.error("Error sending tokens:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-10">
      {isAlert && (
        <Alert isAlert={isAlert} onPost={setIsAlert} message={messageClaim} />
      )}
      <div className="container mx-auto p-4 ">
        <div className="m-24 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center p-8 space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-shrink-0">
              <img
                src={inputs.avatar}
                alt="profile"
                className="w-48 h-48 rounded-full mr-4"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-4xl font-bold text-gray-900 truncate">
                {inputs.firstname} {inputs.lastname}
              </h2>

              <div className="flex flex-wrap gap-2 mt-3">
                {/* Badge for strong subjects or skills */}
                <span className="bg-blue-100 text-blue-800  font-semibold mr-2 px-2.5 py-0.5 rounded">
                  Matières fortes: Algorithmique
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <button className="w-full md:w-auto bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm">
                Modifier mon profil
              </button>
            </div>
          </div>
          <div className="ml-8">
            <div className="flex mt-4 align-items">
              <img
                src="/high-school.png"
                alt="profile"
                className="w-8 h-8 rounded-full mr-4"
              />
              <p className="text-gray-500 text-lg mt-1">
                Université : {inputs.university}
              </p>
            </div>
            <div className="flex mt-4 align-items">
              <img
                src="/graduate.png"
                alt="profile"
                className="w-8 h-8 rounded-full mr-4"
              />
              <p className="text-gray-500 text-lg mt-1">
                Master 2 Methodes informatiques appliquées à la gestion
                d'entreprise
              </p>
            </div>
            <div className="flex mt-4 align-items">
              <img
                src="/score.png"
                alt="profile"
                className="w-8 h-8 rounded-full mr-4"
              />
              <p className="text-gray-500 text-lg mt-1">
                20 documents téléchargés
              </p>
            </div>
            <div className="flex justify-center items-center gap-2  m-8">
              <div className="bg-gray-100 rounded-xl px-4 py-1 inline-flex items-center">
                <img
                  src="/avatar.png"
                  alt="profile"
                  className="w-12 h-12 rounded-full mr-3 bg-green-500"
                />
                <p className="text-gray-700 text-lg font-bold">
                  Your Balance : {balance?.toString() || 0} SKOL
                </p>
              </div>
              <button
                onClick={claim}
                className="p-2 m-2 bg-indigo text-white font-bold bg-green-800 rounded-md text-sm"
              >
                Claim SKOL
              </button>
            </div>
          </div>
          <div className="flex justify-end m-8">
            <button
              onClick={handleSubmit}
              className="bg-primary text-white py-2 px-4 rounded-md focus:outline-none mr-2"
            >
              Enregistrer
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md focus:outline-none"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
