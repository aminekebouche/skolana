import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import DocCard from "@/components/docCard/DocCard";
import { useState } from "react";

const Dochub = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      image: "/pdficon.svg",
      title: "TD - ML",
      author: "Kamelia TERKMANI",
      date: "21/12/2023",
      likes: 10,
      description: "Sujet de td de machine learning - 5 exercices",
    },
    {
      id: 2,
      image: "/pdficon.svg",
      title: "TP - PowerBi",
      author: "Amine KEBOUCHE",
      date: "21/12/2023",
      likes: 10,
      description: "Sujet de tp de Powerbi - 3 exercices",
    },
    {
      id: 3,
      image: "/pdficon.svg",
      title: "TD - Analyse Financière",
      author: "Adnane Chejari",
      date: "21/12/2023",
      likes: 10,
      description: "Sujet de td d'analyse financière - 2 exercices",
    },
    {
      id: 4,
      image: "/pdficon.svg",
      title: "TD - Algèbre",
      author: "Kamelia TERKMANI",
      date: "21/12/2023",
      likes: 10,
      description: "Sujet de td d'Algèbre- 12 exercices",
    },
  ]);
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);
  return (
    <div className="flex justify-center mt-4 w-full h-full bg-background">
      <div className="p-12 mx-auto w-full max-w-5xl bg-white ">
        <h1 className="m-2 text-2xl font-bold">Documents</h1>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
          {documents.map((doc) => (
            <DocCard key={doc.id} doc={doc} />
          ))}
          {documents.map((doc) => (
            <DocCard key={doc.id} doc={doc} />
          ))}
          {documents.map((doc) => (
            <DocCard key={doc.id} doc={doc} />
          ))}
          {documents.map((doc) => (
            <DocCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dochub;
