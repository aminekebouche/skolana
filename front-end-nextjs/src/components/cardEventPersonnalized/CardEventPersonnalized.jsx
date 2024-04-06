import React, { useContext } from "react";
import Image from "next/image";
import DocPost from "../DocPost";
import ReactTimeAgo from "react-time-ago";
import { likeOrUnlike } from "@/pages/api/api";
import { AuthContext } from "@/context/authContext";

const sentences = {
  Service: "a proposé un service",
  Document: (numberOfDoc) =>
    `a partagé ${numberOfDoc} document${numberOfDoc > 1 ? "s" : ""}`,
  Question: "a posé une question",
};

const CardEventPersonnalized = ({ event }) => {
  const type = event.type;
  const numberOfDoc = event.documents.length;
  const { currentUser } = useContext(AuthContext);
  const idUser = currentUser._id;
  const liked = event.likes.includes(idUser);

  const handleLike = async () => {
    await likeOrUnlike({ postId: event._id });
  };

  const show = () => {
    console.log(event);
  };

  return (
    <div className="bg-white w-full rounded-lg shadow-md p-6 flex flex-col my-4">
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
              <h3
                className="bg-green-500 text-white rounded-lg px-2 py-1 font-bold text-lg"
                onClick={show}
              >
                {event.price} {"SKOL"}
              </h3>
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
            <DocPost filename={e} description={""} key={i} />
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
