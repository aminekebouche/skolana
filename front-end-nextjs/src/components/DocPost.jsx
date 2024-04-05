import React from "react";
import Image from "next/image";

const DocPost = ({ filename, description }) => {
  return (
    <div className="flex items-center rounded-lg h-28 p-4 mr-4 mb-4 border border-gray-300">
      <Image
        src="/pdficon.svg"
        alt="profile"
        className="w-16 h-16 rounded-full mr-4"
        width={"10"}
        height={"10"}
      />
      <div>
        <p className="text-sm font-semibold">{filename}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default DocPost;
