import { Link, useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/context";
import pb from "../../lib/pocketbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";


export function Header({ headertext }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleDarkmode = () => {
    console.log('Darkmode');
    setTheme((mode) => !mode);
  };

  const logout = () => {
    console.log('ausgeloggt');
    pb.authStore.clear();
    navigate('/');
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <section className={theme ? style.dark : null}>
      <header className={style.header}>
        <Link to="/home">←</Link>
        <p className={style.headertext}>{headertext}</p>
        <div>
          {!theme ? (
            <button className={style.border} onClick={toggleDarkmode}>
              <FontAwesomeIcon icon={faMoon} className={style.button} />
            </button>
          ) : (
            <button className={style.border} onClick={toggleDarkmode}>
              <FontAwesomeIcon icon={faSun} className={style.button} />
            </button>
          )}

          <button className={style.border} onClick={logout}>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className={style.button}
            />
          </button>
        </div>
      </header>
    </section>
  );
}
