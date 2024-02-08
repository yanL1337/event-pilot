import { Link, useNavigate } from "react-router-dom";
import DynamicTriggerButton from "../components/buttons/DynamicTriggerButton.jsx";
import pb from "../lib/pocketbase.js";
import style from "./css/Login.module.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const sendData = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
      const record = await pb.collection("users").create(formData);
      navigate("/");
    } catch (error) {
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
        <p className={style.signin}>Sign Up</p>

        <form onSubmit={sendData}>
          <input
            className={style.logininput}
            name="firstname"
            id="firstname"
            type="text"
            placeholder="Vorname"
          />
          <input
            className={style.logininput}
            name="lastname"
            id="lastname"
            type="text"
            placeholder="Nachname"
          />

          <input
            className={style.logininput}
            name="description"
            id="description"
            placeholder="About me"
          />
          <input
            className={style.logininput}
            name="email"
            id="email"
            type="text"
            placeholder="Email Address"
          />
          <input
            className={style.logininput}
            name="password"
            id="password"
            type="password"
            placeholder="Password"
          />

          <input
            className={style.logininput}
            name="passwordConfirm"
            id="passwordConfirm"
            type="password"
            placeholder="Confirm password"
          />

          <input
            className={style.inputfile}
            name="profilImage"
            id="profilImage"
            type="file"
            content="Avatar"
          />

          <div>
            <DynamicTriggerButton hasArrow={true}>SIGN UP</DynamicTriggerButton>
          </div>
        </form>
        <Link className={style.link} to={"/"} href="#">
          Already have an account? Login
        </Link>
      </div>
    </section>
  );
};

export default RegisterPage;
