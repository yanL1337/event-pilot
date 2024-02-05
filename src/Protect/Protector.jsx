import { Navigate, Outlet } from 'react-router-dom';

import { useState } from 'react';
import pb from '../lib/pocketbase';

const Protector = () => {
  const [isLogin] = useState(pb.authStore.isValid);

  if (!isLogin) {
    // Wenn wir unsere Userdaten nicht abrufen können leiten wir uns zur Login Seite um
    return <Navigate to={'/'} />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export default Protector;
