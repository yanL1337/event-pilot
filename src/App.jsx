import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  var i;

  console.log("local storage");
  for (i = 0; i < localStorage.length; i++) {
    console.log(
      localStorage.key(i) +
        "=[" +
        localStorage.getItem(localStorage.key(i)) +
        "]"
    );
  }

  console.log("session storage");
  for (i = 0; i < sessionStorage.length; i++) {
    console.log(
      sessionStorage.key(i) +
        "=[" +
        sessionStorage.getItem(sessionStorage.key(i)) +
        "]"
    );
  }
  return (
    <>
      <LoginPage />
    </>
  );
}

export default App;
