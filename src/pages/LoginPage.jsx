import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import pb from '../lib/pocketbase.js';
import { useNavigate } from 'react-router-dom';
import DynamicTriggerButton from '../components/buttons/DynamicTriggerButton.jsx';
import style from './css/Login.module.css';
import LoadingElement from '../components/loading/LoadingElement.jsx';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const emailRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();

  const sendData = async () => {
    try {
      setIsLoading(true);
      await pb.collection('users').authWithPassword(emailRef.current.value, passRef.current.value);
      setIsLoading(false);
      navigate('/home');
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Wrong Credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.log(error);
    }
  };

  return (
    <section className={style.wrapper}>
      <div>
        <img className={style.imglogo} src="../images/Logo.png" alt="E" />
        <div className={style.headline}>
          <h1 className={style.event}>Event</h1>
          <h2 className={style.pilot}>Pilot</h2>
        </div>
        <p className={style.signin}>Sign In</p>
      </div>

      <div>
        <input
          className={style.logininput}
          ref={emailRef}
          type="text"
          placeholder="Email Address"
        />
        <input
          className={style.logininputlast}
          ref={passRef}
          type="password"
          placeholder="Password"
        />
        {errorMessage && (
          <p
            style={{
              position: 'absolute',
              bottom: '25%',
              width: '100%',
              backgroundColor: 'pink',
              padding: '5px',
              color: 'darkred',
              textAlign: 'center',
              fontSize: '2rem',
            }}
          >
            {errorMessage}
          </p>
        )}

        <div>
          {!isLoading ? (
            <DynamicTriggerButton hasArrow={true} onTriggerEventFn={sendData}>
              SIGN IN
            </DynamicTriggerButton>
          ) : (
            <LoadingElement />
          )}
        </div>

        <Link className={style.link} to={'/register'} href="#">
          Don&apos;t have an account?
        </Link>
      </div>
    </section>
  );
};

export default LoginPage;
