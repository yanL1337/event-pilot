import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddEvent from './pages/AddEvent';
import FallbackLoadingScreen from './components/loading/FallbackLoadingScreen';
import { EventDetails } from './pages/EventDetails';
import SearchEvent from './pages/SearchEvent';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

const Protector = lazy(() => import('./Protect/Protector'));

// Favorite Icon Global einbinden
library.add(faBookmark);

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<FallbackLoadingScreen />}>
          <Routes>
            <Route element={<LoginPage />} />
            <Route element={<RegisterPage />} />
            <Route element={<Protector />}>
              <Route path="/eventdetails/:id" element={<EventDetails />} />
              <Route path="/event/add" element={<AddEvent />} />
              <Route path="/event/search" element={<SearchEvent />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
