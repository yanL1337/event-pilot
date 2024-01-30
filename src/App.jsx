import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Protector from './Protect/Protector';
import AddEvent from "./pages/AddEvent";
import FallbackLoadingScreen from "./components/loading/FallbackLoadingScreen";
const Protector = lazy(() => import("./Protect/Protector"));
import { EventDetails } from "./pages/EventDetails";
import { LoadingContext } from "./context/context";
import { Loadingscreen } from "./pages/Loadingscreen";

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
                  <Route path="/eventdetails/:id" element={<EventDetails />} />
                  <Route path="/event/add" element={<AddEvent />} />
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
