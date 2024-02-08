import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import pb from "../lib/pocketbase.js";
import { useNavigate } from "react-router-dom";
import DynamicTriggerButton from "../components/buttons/DynamicTriggerButton.jsx";
import style from "./css/Login.module.css";

const LoginPage = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();
  const [fehlgeschlagen, setFehlgeschlagen] = useState();

  const sendData = async () => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(emailRef.current.value, passRef.current.value);
      navigate("/home");
    } catch (error) {
      setFehlgeschlagen(true);
      console.log(error);
    }
  };

  return (
    <section className={style.wrapper}>
      <div>
        <img className={style.imglogo} src="../images/Logo.png" alt="E" />
        <div className={style.headline}>
          <h1 className={style.event}>Event</h1>
          <h2 className={style.pilot}>Pilot</h2>
        </div>
        <p className={style.signin}>Sign In</p>
      </div>

      <div>
        <input
          className={style.logininput}
          ref={emailRef}
          type="text"
          placeholder="Email Address"
        />
        <input
          className={style.logininputlast}
          ref={passRef}
          type="password"
          placeholder="Password"
        />

        {fehlgeschlagen ? (
          <p className={style.warning}>
            Oops, that went wrong, please check your email address and password.
          </p>
        ) : null}

        <div>
          <DynamicTriggerButton hasArrow={true} onTriggerEventFn={sendData}>
            SIGN IN
          </DynamicTriggerButton>
        </div>

        <Link className={style.link} to={"/register"} href="#">
          Don&apos;t have an account?
        </Link>
      </div>
    </section>
  );
};

export default LoginPage;
