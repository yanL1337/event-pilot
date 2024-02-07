import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import pb from '../lib/pocketbase.js';
import { useNavigate } from 'react-router-dom';
import DynamicTriggerButton from '../components/buttons/DynamicTriggerButton.jsx';

const LoginPage = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();

  const sendData = async () => {
    try {
      const authData = await pb
        .collection('users')
        .authWithPassword(emailRef.current.value, passRef.current.value);
      navigate('/home');
    } catch (error) {
      console.log(error);
    }
  };

  //console.log(pb.authStore);

  return (
    <section>
      <div>
        <img
          style={{ width: '40vw' }}
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        />
      </div>

      <div>
        <input ref={emailRef} type="text" placeholder="Email Address" />
        <input ref={passRef} type="password" placeholder="Password" />

        <div>
          <DynamicTriggerButton hasArrow={true} onTriggerEventFn={sendData}>
            SIGN IN
          </DynamicTriggerButton>
        </div>
        <div style={{ paddingTop: '15px', textAlign: 'center' }}>
          Don&apos;t have an account?
          <Link to={'/register'} href="#" style={{ color: '#668BE9' }}>
            Register
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
