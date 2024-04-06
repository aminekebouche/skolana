import React, { useState, useContext, useEffect } from "react";
import DialogBox from "../modalPost";
import Image from "next/image";
import Alert from "../Alert";
import { AuthContext } from "../../context/authContext";

const CreatEvent = ({ onCreatePost }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isAlert, setIsAlert] = useState(null);
  const { currentUser, onchaintUser, createPostOnChain } =
    useContext(AuthContext);
  const [currentUserReady, setCurrentUserReady] = useState(false);

  const toggleDialog = () => {
    if (!onchaintUser) {
      alert("Connecter votre wallet !");
      return;
    }
    setShowDialog(!showDialog);
  };

  useEffect(() => {
    if (currentUser) {
      setCurrentUserReady(true);
    }
  }, [currentUser]);

  const mess = "Success: Your post has been published !";

  return (
    <div className="flex bg-white my-5 p-5 rounded-xl h-800 w-300">
      {isAlert && (
        <Alert isAlert={isAlert} onPost={setIsAlert} message={mess} />
      )}
      <Image
        src={currentUser?.avatar}
        alt="pdp"
        className="pdp w-8 h-8 rounded-full ring-2"
        width={"30"}
        height={"30"}
      />
      <div
        className="bg-seachbar-color text-icon-color w-full text-sm items-center flex pl-4 rounded-md mx-8 cursor-pointer hover:bg-gray"
        onClick={toggleDialog}
      >
        Add post ...
      </div>
      <button
        className="px-5 bg-indigo text-white bg-primary rounded-md text-xs font-bold hover:bg-indigo-dark font-['Arial']"
        onClick={toggleDialog}
      >
        Share
      </button>
      <button className="px-5  bg-gray rounded-md" onClick={onCreatePost}>
        <Image src={"/refresh.svg"} alt="refresh" width={"20"} height={"20"} />
      </button>
      {showDialog && (
        <DialogBox
          onClose={toggleDialog}
          onCreatePost={onCreatePost}
          onPost={setIsAlert}
        />
      )}
    </div>
  );
};

export default CreatEvent;
