import React, { useState, useContext, useEffect } from "react";
import GoogleButton from "react-google-button";
import { AuthContext } from "../context/authContext";
import styles from "../styles/login.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();

  const [error, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { currentUser, login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log(inputs);
      const loggedIn = await login(inputs);
      if (loggedIn) {
        router.push("/");
      } else {
        setErr("Login failed.");
      }
    } catch (err) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);
  return (
    <div className={styles.login}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>Welcom</h1>
          <p>
            Skolana, the social network for students. Centralize your student
            life and simplify your university journey.
          </p>
          <span>{"Vous n avez pas de compte ?"}</span>
          <Link href="/register">
            <button className={styles.signUpButton}>SIGN UP</button>
          </Link>
        </div>
        <div className={styles.right}>
          <img src="/logo2.png" alt="" />
          <h1>Sign in</h1>
          <form>
            <input
              type="username"
              name="username"
              value={inputs.username}
              placeholder="Username"
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="password"
              name="password"
              value={inputs.password}
              placeholder="Password"
              onChange={handleChange}
              className={styles.input}
            />
          </form>
          <button onClick={handleLogin} className={styles.signInButton}>
            SIGN IN
          </button>
          {/* <div className={styles.googleButton}>
            <a href={`${API_URL}/user/auth/google`}>
              <GoogleButton type="light" />
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
