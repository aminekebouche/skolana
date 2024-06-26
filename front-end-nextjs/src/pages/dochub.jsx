import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import DocCard from "@/components/docCard/DocCard";
import { useState } from "react";
import DocPost from "@/components/DocPost";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Dochub = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);

  const allUsers = async () => {
    const response = await fetch(API_URL + `/user/docs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      const users = await response.json();
      setDocuments(users.user.docs);
      return users;
    } else {
      const error = await response.json();
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  return (
    <div className="flex justify-center mt-4 w-full h-full bg-background">
      <div className="p-12 mx-auto w-full max-w-5xl bg-white ">
        <h1 className="m-2 text-2xl font-bold">
          My Purchased Documents{" "}
          <button className="px-5  bg-gray rounded-md" onClick={allUsers}>
            <img
              src={"/refresh.svg"}
              alt="refresh"
              width={"20"}
              height={"20"}
            />
          </button>
        </h1>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
          {documents.map((doc, i) => (
            <DocPost
              key={i}
              filename={doc.split("/").pop()}
              description={""}
              payed={true}
            />
          ))}
          {documents.length === 0 && (
            <div className="flex justify-center items-center ">
              Purchase documents from your colleagues
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dochub;
