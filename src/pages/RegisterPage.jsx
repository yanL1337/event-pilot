import { Link, useNavigate } from 'react-router-dom';
import DynamicTriggerButton from '../components/buttons/DynamicTriggerButton.jsx';
import pb from '../lib/pocketbase.js';

const RegisterPage = () => {
  const navigate = useNavigate();

  const sendData = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
      const record = await pb.collection('users').create(formData);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

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
        <form onSubmit={sendData}>
          <input name="firstname" id="firstname" type="text" placeholder="Vorname" />
          <input name="lastname" id="lastname" type="text" placeholder="Nachname" />
          <input name="email" id="email" type="text" placeholder="Email Address" />
          <input name="password" id="password" type="password" placeholder="Password" />

          <input
            name="passwordConfirm"
            id="passwordConfirm"
            type="password"
            placeholder="Confirm password"
          />

          <input name="profilImage" id="profilImage" type="file" content="Avatar" />

          <div>
            <DynamicTriggerButton hasArrow={true}>SIGN UP</DynamicTriggerButton>
          </div>
        </form>
        <div style={{ paddingTop: '15px', textAlign: 'center' }}>
          Already have an Account?
          <Link to={'/'} href="#" style={{ color: '#668BE9' }}>
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
