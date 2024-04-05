import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-gray-800">
      <div className="mx-auto container px-4 lg:px-8">
        <section className="text-center lg:text-left mt-24">
          <div className="py-16 lg:flex lg:items-center">
            <div className="lg:w-2/3 lg:pr-8">
              <h1 className="text-6xl font-bold text-primary mb-6">
                Studycool
              </h1>
              <p className="text-2xl mb-9">
                Centralisez votre vie étudiante et simplifiez votre parcours
                universitaire.
              </p>
              <p className="mb-6 text-xl">
                {`Découvrez Daufinder, la plateforme qui révolutionne votre
                expérience universitaire en centralisant cours, événements et
                soutien étudiant. Simplifiez votre vie académique dès
                aujourd'hui !`}
              </p>
              <button className="mt-4 py-2 px-6 bg-primary text-white rounded shadow-lg hover:bg-primary-dark transition duration-300">
                Découvrir
              </button>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/home.svg"
                alt="Étudiante avec un sac à dos et un dossier"
                className="mx-auto lg:mx-0"
                width="987"
                height="658"
              />
            </div>
          </div>
        </section>

        <section className="py-16 lg:flex lg:items-center">
          <div className="lg:w-1/3">
            <Image
              src="/home2.png"
              alt="Étudiante avec un sac à dos et un dossier"
              className="rounded-xl shadow-xl transform scale-90 lg:scale-100 lg:rounded-none"
              width="987"
              height="658"
            />
          </div>
          <div className="lg:w-2/3 lg:pl-8">
            <h1 className="text-5xl font-bold text-primary mb-6">Portail</h1>
            <p className="text-xl">
              Centralisez votre vie étudiante et simplifiez votre parcours
              universitaire.
            </p>
          </div>
        </section>

        <section className="py-16 lg:flex lg:items-center">
          <div className="lg:w-2/3 lg:pr-8">
            <h1 className="text-5xl font-bold text-primary mb-6">DocHub</h1>
            <p className="text-xl">
              Centralisez votre vie étudiante et simplifiez votre parcours
              universitaire.
            </p>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="/home3.png"
              alt="Étudiante avec un sac à dos et un dossier"
              className="rounded-xl shadow-xl transform scale-90 lg:scale-100 lg:rounded-none"
              width="987"
              height="658"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
