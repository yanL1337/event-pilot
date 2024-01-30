import { useEffect, useRef } from "react";
import pb from "../lib/pocketbase.js";

const LoginPage = () => {
  const emailRef = useRef();
  const passRef = useRef();

  const sendData = async () => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(emailRef.current.value, passRef.current.value);
      console.log(authData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      console.log(pb.authStore.isValid);
    }, 3000);
  }, []);

  //console.log(pb.authStore);

  return (
    <section>
      <div>
        <img
          style={{ width: "40vw" }}
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        />
      </div>

      <div>
        <input ref={emailRef} type="text" placeholder="Email Address" />
        <input ref={passRef} type="password" placeholder="Password" />

        <div>
          <button onClick={sendData} type="submit">
            Login
          </button>
        </div>
        <div>
          Don&apos;t have an account?
          {/* <Link
          to={"/register"}
          href="#"
        >
          Register
        </Link> */}
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
