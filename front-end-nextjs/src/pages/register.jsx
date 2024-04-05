import React, { useState } from "react";
import styles from "../styles/register.module.scss";
import Link from "next/link";
import Image from "next/image";
//import PasswordChecklist from "react-password-checklist";
import { useRouter } from "next/router";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
    email: "",
    password: "",
    university: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const [alertMessage, setAlertMessage] = useState({ message: "", color: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords are different.");
      return;
    }
    console.log(formData);
    const user = JSON.stringify(formData);
    delete user.confirmPassword;
    console.log(user);
    console.log(API_URL + "/user/register HELLO");
    fetch(API_URL + "/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((error) => {
            throw error;
          });
        }
      })
      .then((user) => {
        console.log(user);
        setAlertMessage({
          message: "Inscription réussie, redirection en cours...",
          color: "green",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      })
      .catch((error) => {
        setAlertMessage({
          message: error.error.message,
          color: "red",
        });
      });
  };

  return (
    <div className={styles.register}>
      <div className={styles.card}>
        <div className={styles.left}>
          <Image src="/Studycool.svg" alt="Logo" width={"200"} height={"100"} />
          <h1>Create Account</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstname"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="university"
              placeholder="University"
              value={formData.University}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {/* <PasswordChecklist
              rules={[
                "minLength",
                "capital",
                "specialChar",
                "lowercase",
                "number",
                "match",
              ]}
              minLength={8}
              value={formData.password}
              valueAgain={formData.confirmPassword}
            /> */}
            <button>SING UP</button>
          </form>
        </div>
        <div className={styles.right}>
          {alertMessage.message && (
            <div
              className={`alert ${
                alertMessage.color === "green" ? "alert-success" : "alert-error"
              }`}
            >
              {alertMessage.message}
            </div>
          )}
          <h1>Rejoinez nous </h1>
          <p>
            Studycool, le réseau social des Étudiants. Centralisez votre vie
            étudiante et simplifiez votre parcours universitaire.
          </p>
          <span>Vous avez un compte ?</span>
          <Link href="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
