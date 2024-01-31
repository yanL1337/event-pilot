import { Navigate, Outlet } from "react-router-dom";
import { getUserExample } from "../utils/fetchData";
import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";

const Protector = () => {
  const [isLogin] = useState(pb.authStore.isValid);

  useEffect(() => {
    console.log("first");
    /* Diese Funktion ist aktuell nur provisorisch!!!! */
    const fetchData = async () => {
      const userData = await getUserExample(pb);
      if (!userData) {
        // Wenn wir unsere Userdaten nicht abrufen können leiten wir uns zur Login Seite um
        return <Navigate to={"/"} />;
      }
    };

    if (!isLogin) {
      //fetchData();
    }
  }, [isLogin]);

  if (!isLogin) {
    // Wenn wir unsere Userdaten nicht abrufen können leiten wir uns zur Login Seite um
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default Protector;
