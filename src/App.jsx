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
import pb from "./lib/pocketbase";
import Navbar from "./components/navbar/Navbar";
import { Home } from "./pages/Home";
import { Favorites } from "./pages/Favorites";
import { Review } from "./pages/Review";
import { SetFavoriteMessageContext } from "./context/context";
import FavoriteTriggerMessage from "./components/general/FavoriteTriggerMessage";
import { ThemeContext } from "./context/context";
import "./App.css";

pb.autoCancellation(false);

library.add(faBookmark);
const Protector = lazy(() => import("./Protect/Protector"));

function App() {
  const [loading, setLoading] = useState(false);
  const [favMessage, setFavMessage] = useState(null);
  const [theme, setTheme] = useState(false);

  return (
    <>
      <section className={theme ? "dark" : null}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <LoadingContext.Provider value={{ loading, setLoading }}>
            {favMessage && <FavoriteTriggerMessage favMessage={favMessage} />}
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
                          <SetFavoriteMessageContext.Provider
                            value={{ favMessage, setFavMessage }}
                          >
                            <Home>
                              <Navbar activeName="home" />
                            </Home>
                          </SetFavoriteMessageContext.Provider>
                        }
                      />
                      <Route
                        path="/favorites"
                        element={
                          <SetFavoriteMessageContext.Provider
                            value={{ favMessage, setFavMessage }}
                          >
                            <Favorites>
                              <Navbar activeName="events" />
                            </Favorites>
                          </SetFavoriteMessageContext.Provider>
                        }
                      />
                      <Route
                        path="/eventdetails/:id"
                        element={
                          <SetFavoriteMessageContext.Provider
                            value={{ favMessage, setFavMessage }}
                          >
                            <EventDetails />
                          </SetFavoriteMessageContext.Provider>
                        }
                      />
                      <Route path="/event/add" element={<AddEvent />} />
                      <Route
                        path="/event/search"
                        element={
                          <SetFavoriteMessageContext.Provider
                            value={{ favMessage, setFavMessage }}
                          >
                            <SearchEvent>
                              <Navbar activeName="search" />
                            </SearchEvent>
                          </SetFavoriteMessageContext.Provider>
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
                      <Route
                        path="/review/:id"
                        element={
                          <SetFavoriteMessageContext.Provider
                            value={{ favMessage, setFavMessage }}
                          >
                            <Review />
                          </SetFavoriteMessageContext.Provider>
                        }
                      />
                    </Route>
                  </Routes>
                </Suspense>
              </BrowserRouter>
            ) : (
              <Loadingscreen />
            )}
          </LoadingContext.Provider>
        </ThemeContext.Provider>
      </section>
    </>
  );
}

export default App;
