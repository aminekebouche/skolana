import React from "react";

const DocCard = ({ doc }) => {
  return (
    <div className="flex items-center rounded-lg p-4 h-28 border border-gray-300 bg-white flex-grow">
      <img
        src={"/pdficon.svg"}
        alt={doc.title}
        className="w-16 h-16 rounded-full mr-4"
      />
      <div>
        <p className="text-sm font-semibold">{doc.title}</p>
        <p className="text-xs text-gray-600">
          By {doc.author} {doc.date}
        </p>
        <div className="flex ">
          <img
            src="/likeIcon.svg"
            alt="likes"
            className="w-4 h-4 rounded-full mr-2"
          />
          <p className="text-xs text-gray-600">{doc.likes}</p>
        </div>
        <p className="text-xs text-gray-600">{doc.description}</p>
      </div>
    </div>
  );
};

export default DocCard;
