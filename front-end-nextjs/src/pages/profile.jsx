import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/authContext";
import { useRouter } from "next/router";
const API = process.env.REACT_APP_API_URL;

const Profile = () => {
  const { currentUser, updateCurrentUser, logout } = useContext(AuthContext);
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
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

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
  return (
    <div className="bg-gray-100 min-h-screen pt-10">
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
            <div className="flex justify-center  m-8">
              <div className="bg-gray-100 rounded-xl px-4 py-1 inline-flex items-center">
                <img
                  src="/star.png"
                  alt="profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <p className="text-gray-700 text-lg">
                  Ton score est de 275 points
                </p>
              </div>
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
