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
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="p-12 mx-auto w-full max-w-5xl bg-white shadow-lg rounded-lg flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">
          Training Center{" "}
          <span className="text-lg bg-primary rounded p-2 text-white">
            Comming soon
          </span>
        </h1>

        <div className="mt-4 ">
          {documents.map((doc, i) => (
            <DocPost
              key={i}
              filename={doc.split("/").pop()}
              description=""
              payed={true}
            />
          ))}
          {documents.length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-center">
                You can pursue the curriculum of your choice and undergo
                training to earn{" "}
                <span className="text-green-800">NFT Certificates.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dochub;
