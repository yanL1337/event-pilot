import { Link, useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/context";
import pb from "../../lib/pocketbase";

export function Header({ headertext }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleDarkmode = () => {
    console.log("Darkmode");
    setTheme((mode) => !mode);
  };

  const logout = () => {
    console.log("ausgeloggt");
    pb.authStore.clear();
    navigate("/");
  };

  return (
    <header className={style.header}>
      <Link to="/home">←</Link>
      <p>{headertext}</p>
      <div>
        <button onClick={toggleDarkmode}>darkmode</button>
        <button onClick={logout}>logout</button>
      </div>
    </header>
  );
}
