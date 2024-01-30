import { Navigate, Outlet } from "react-router-dom";
import PocketBase from "pocketbase";
import useLocalStorage from "../hooks/useLocalStorage";
import { getUserExample } from "../utils/fetchData";
import { useEffect } from "react";

const pb = new PocketBase(`${import.meta.env.VITE_POCKET_FETCH_URL}`);

const Protector = () => {
  const [isLogin] = useLocalStorage("pocketbase_auth", null);
  // const isLogin = useLocalStorage('pocketbase_auth', null);

  useEffect(() => {
    /* Diese Funktion ist aktuell nur provisorisch!!!! */
    const fetchData = async () => {
      const userData = await getUserExample(pb);
      if (!userData) {
        // Wenn wir unsere Userdaten nicht abrufen können leiten wir uns zur Login Seite um
        return <Navigate to={"/login"} />;
      }
    };

    if (!isLogin) {
      //fetchData();
    }
  }, [isLogin]);

  if (!isLogin) {
    // Wenn wir unsere Userdaten nicht abrufen können leiten wir uns zur Login Seite um
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default Protector;
