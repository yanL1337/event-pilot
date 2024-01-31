import { useContext, useEffect } from "react";
import { LoadingContext } from "../context/context";
import style from "./css/Loadingscreen.module.css";

export function Loadingscreen() {
  const { setLoading } = useContext(LoadingContext);

  //* soll 2s angezeigt werden
  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 10);
  }, []);
  return (
    <section className={style.section}>
      <div className={style.div}>
        <img src="../images/Logo.png" alt="E" />
        <p>vent</p>
        <p>Pilot</p>
      </div>
    </section>
  );
}
