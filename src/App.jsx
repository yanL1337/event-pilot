import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Protector from './Protect/Protector';
import AddEvent from './pages/AddEvent';
import FallbackLoadingScreen from './components/loading/FallbackLoadingScreen';

const Protector = lazy(() => import('./Protect/Protector'));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<FallbackLoadingScreen />}>
          <Routes>
            <Route element={<Protector />}>
              <Route path="/event/add" element={<AddEvent />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
