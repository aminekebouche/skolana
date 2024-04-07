import React, { useEffect, useState } from "react";
import CardEventPersonnalized from "../components/cardEventPersonnalized/CardEventPersonnalized";
import CreatEvent from "../components/creatEvent/CreatEvent";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { allPosts } from "./api/api";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const [postStaus, usePostStatus] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const handleCreatePost = async () => {
    const posts = allPosts();
    posts.then((val) => {
      setPosts(val);
    });
  };

  useEffect(() => {
    handleCreatePost();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  return (
    <div className="flex justify-center mt-4 w-full h-full bg-background">
      <div className="mt-12 mx-auto w-full max-w-4xl">
        <h1 className="ml-2 mt-2 text-2xl font-bold">For you</h1>

        <CreatEvent onCreatePost={handleCreatePost} />
        {posts.map((event, index) => (
          <CardEventPersonnalized event={event} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
