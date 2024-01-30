import pb from "../lib/pocketbase.js";

const RegisterPage = () => {
  const sendData = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
      const record = await pb.collection("users").create(formData);
      console.log(record);
    } catch (error) {
      console.log(error);
    }
  };

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
        <form onSubmit={sendData}>
          <input
            name="firstname"
            id="firstname"
            type="text"
            placeholder="Vorname"
          />
          <input
            name="username"
            id="username"
            type="text"
            placeholder="Nachname"
          />
          <input
            name="email"
            id="email"
            type="text"
            placeholder="Email Address"
          />
          <input
            name="password"
            id="password"
            type="password"
            placeholder="Password"
          />

          <input
            name="passwordConfirm"
            id="passwordConfirm"
            type="password"
            placeholder="Confirm password"
          />

          <input
            name="profilImage"
            id="profilImage"
            type="file"
            content="Avatar"
          />

          <div>
            <button type="submit">Register</button>
          </div>
        </form>
        <div>
          Already have an Account?
          {/* <Link to={"/login"} href="#">
            Login
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
