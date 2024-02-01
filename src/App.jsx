import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEvent from "./pages/AddEvent";
import FallbackLoadingScreen from "./components/loading/FallbackLoadingScreen";
import { EventDetails } from "./pages/EventDetails";
import { LoadingContext } from "./context/context";
import { Loadingscreen } from "./pages/Loadingscreen";
import { UserProfile } from "./pages/UserProfile";
import SearchEvent from "./pages/SearchEvent";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { CreatorProfil } from "./pages/CreatorProfil";
import Navbar from "./components/navbar/Navbar";
import { Home } from "./pages/Home";
import { Favorites } from "./pages/Favorites";

library.add(faBookmark);
const Protector = lazy(() => import("./Protect/Protector"));

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        {loading ? (
          <BrowserRouter>
            <Suspense fallback={<FallbackLoadingScreen />}>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<Protector />}>
                  <Route
                    path="/home"
                    element={
                      <Home>
                        <Navbar activeName="home" />
                      </Home>
                    }
                  />
                  <Route
                    path="/favorites"
                    element={
                      <Favorites>
                        <Navbar activeName="events" />
                      </Favorites>
                    }
                  />
                  <Route path="/eventdetails/:id" element={<EventDetails />} />
                  <Route path="/event/add" element={<AddEvent />} />
                  <Route
                    path="/event/search"
                    element={
                      <SearchEvent>
                        <Navbar activeName="search" />
                      </SearchEvent>
                    }
                  />
                  <Route
                    path="/user"
                    element={
                      <UserProfile>
                        <Navbar activeName="profile" />
                      </UserProfile>
                    }
                  />
                  <Route path="/creator/:id" element={<CreatorProfil />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        ) : (
          <Loadingscreen />
        )}
      </LoadingContext.Provider>
    </>
  );
}

export default App;
