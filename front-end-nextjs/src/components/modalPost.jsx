import React, { useState } from "react";
import { createPost } from "@/pages/api/api";

const DialogBox = ({ onClose, onCreatePost, onPost }) => {
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleOptionChange = (event) => {
    setType(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("type", type);
      if (file) {
        formData.append("file", file);
      }

      console.log(formData);

      const post = await createPost(formData);
      onClose();
      onCreatePost();
      if (post) {
        console.log("post created");
        onPost("success");
      } else {
        onPost("error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div className="relative bg-white rounded shadow-md p-6 w-1/2 z-10">
        <h2 className="text-lg font-semibold mb-4">Puplications</h2>
        <form>
          <label className="block mb-4">
            Sélectionnez le type de post :
            <select
              className="block w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:border-blue-500"
              value={type}
              onChange={handleOptionChange}
            >
              <option value="">Sélectionnez...</option>
              <option value="Service">Service</option>
              <option value="Document">Document</option>
              <option value="Question">Question</option>
            </select>
          </label>
          <label className="block mb-4">
            Ecrivez votre contenu :
            <input
              type="text"
              value={content}
              className="block w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:border-blue-500"
              onChange={handleContentChange}
            />
          </label>
          {type === "Document" && (
            <label className="block mb-4">
              Attacher un document :
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:border-blue-500"
              />
            </label>
          )}
        </form>
        <div className="flex justify-between ">
          <button
            type="submit"
            className="bg-blue-500 text-gray-700 px-4 py-2 rounded"
            onClick={handlePost}
          >
            Soumettre
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
