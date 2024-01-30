import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Protector from './Protect/Protector';
import AddEvent from "./pages/AddEvent";
import FallbackLoadingScreen from "./components/loading/FallbackLoadingScreen";
const Protector = lazy(() => import("./Protect/Protector"));
import { EventDetails } from "./pages/EventDetails";
import { UserProfile } from "./pages/UserProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<FallbackLoadingScreen />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<Protector />}>
              <Route path="/eventdetails/:id" element={<EventDetails />} />
              <Route path="/event/add" element={<AddEvent />} />
              <Route path="/user" element={<UserProfile />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
