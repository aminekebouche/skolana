import React, { useState, useEffect } from "react";

const Alert = ({ isAlert, onPost, message }) => {
  const [isVisible, setIsVisible] = useState(isAlert);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [first, setFisrt] = useState("");
  const [second, setSecond] = useState("");

  useEffect(() => {
    if (isAlert) {
      if (isAlert === "success") {
        setAlertType("bg-green-100");
        setAlertMessage(message);
        const [firstLine, secondLine] = message.split("\n");
        setFisrt(firstLine);
        setSecond(secondLine);
      } else if (isAlert === "error") {
        setAlertType("bg-red-100");
        setAlertMessage("Error: Something went wrong");
      }

      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        onPost(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAlert, onPost]);

  return (
    <>
      {isVisible && (
        <div
          className={`fixed top-12 right-0 m-4 border-t-4 rounded-b px-4 py-3 shadow-md ${alertType}`}
          role="alert"
        >
          <div className="flex items-center">
            <div>
              <p className="font-bold">{first}</p>
              {second && (
                <a
                  href={second}
                  target="_blank"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Solana explorer ↗️{" "}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Alert;
