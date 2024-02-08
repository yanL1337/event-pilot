
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import pb from '../lib/pocketbase.js';
import editProfile from '/images/EditIcon.svg';
import Following from '../components/following/Following.jsx';
import Interests from '../components/interests/Interests.jsx';
import OwnEvent from '../components/events/OwnEvent.jsx';
import { Header } from '../components/header/Header.jsx';
import FlipMove from 'react-flip-move';
import style from './css/UserProfil.module.css';



export const UserProfile = ({ children }) => {
  const [user, setUser] = useState();
  const [edit, setEdit] = useState(false);
  const [changes, setChanges] = useState({});
  const [state, setState] = useState('about');
  const [ownEvents, setOwnEvents] = useState([]);
  const [colorAbout, setColorAbout] = useState(true);
  const [colorEvents, setColorEvents] = useState(false);

  const favMessageTimer = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const record = await pb.collection('users').getOne(pb.authStore.model.id);
        setUser(record);
        setChanges(record);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setChanges((prev) => ({ ...prev, [name]: value }));
  };

  const submitChanges = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('firstname', changes.firstname);
    formData.append('lastname', changes.lastname);
    formData.append('description', changes.description);
    const fileInput = document.querySelector('input[type="file"]');

    if (fileInput && fileInput.files[0]) {
      formData.append('profilImage', fileInput.files[0]);
    }

    for (let item of changes.interests) {
      console.log(item);
      formData.append('interests', item);
    }

    //formData.append("interests", changes.interests);
    try {
      const record = await pb.collection('users').update(user.id, formData);
      setUser(record);
      setEdit(false);
    } catch (error) {
      console.error('Failed to update', error);
    }
  };

  const [file, setFile] = useState();
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  // ##############################
  function about() {
    setState('about');
    setColorAbout(true);
    setColorEvents(false);
  }
  function events() {
    setState('events');
    setColorAbout(false);
    setColorEvents(true);
  }

  useEffect(() => {
    async function getOwnEvents() {
      const ownEvents = await pb.collection('events').getFullList({
        filter: `creator="${pb.authStore.model.id}"`,
      });
      setOwnEvents(ownEvents);
    }
    getOwnEvents();
  }, []);

  const deleteEvents = (eventId) => {
    const updateEvents = ownEvents.filter((event) => event.id !== eventId);

    setOwnEvents(updateEvents);
  };

  //* wird angezeigt, wenn About ausgewählt ist
  if (state === 'about' && user) {
    return (
      <>
        <section className={style.wrapper}>
          {!edit ? (
            <>
              <Header headertext={`${user.firstname} ${user.lastname}`} />
              <img
                className={style.profilimg}
                src={`https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profilImage}`}
              />

              <div className={style.followdiv}>
                <div className={style.follow}>
                  <Following user={user} />
                  <p className={style.light}>Following</p>
                </div>
                <div>
                  <p>{user?.follower.length}</p>
                  <p className={style.light}>Followers</p>
                </div>
              </div>
              <div className={style.tabs}>
                <button className={colorAbout ? style.activeTab : null} onClick={about}>
                  ABOUT
                </button>
                <button className={colorEvents ? style.activeTab : null} onClick={events}>
                  EVENTS
                </button>
              </div>

              <div className={style.aboutme}>About Me</div>
              <p className={style.description}>{user?.description}</p>

              <Interests user={user} edit={edit} />
              <div className={style.editbutton} onClick={() => setEdit(true)}>
                <img className="icon" alt="Icon" src={editProfile} />
                <p className="d">Edit Profile</p>
              </div>
            </>
          ) : (
            //* wird beim EditProfil Button angezeigt
            //submitChanges, changes, handleInputChange
            <>
              <Header headertext={`Edit Profile`} />
              <form onSubmit={submitChanges}>
                <div className={style.editimg}>
                  <img
                    className={style.profilimgedit}
                    src={
                      file
                        ? file
                        : `https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profilImage}`
                    }
                  />
                  <div className={style.imgupload}>
                    <label htmlFor="file-input">
                      <img style={{ width: '7vw', cursor: 'pointer' }} src={editProfile} />
                    </label>

                    <input
                      name="profilImage"
                      onChange={handleChange}
                      id="file-input"
                      type="file"
                    />
                  </div>
                </div>

                <input
                  className={style.input}
                  name="firstname"
                  placeholder="First Name"
                  value={changes.firstname || ''}
                  onChange={handleInputChange}
                />
                <input
                  className={style.input}
                  name="lastname"
                  placeholder="Last Name"
                  value={changes.lastname || ''}
                  onChange={handleInputChange}
                />

                <textarea
                  className={style.textinput}
                  name="description"
                  placeholder="About me"
                  value={changes.description || ''}
                  onChange={handleInputChange}
                />

                <Interests
                  changes={changes}
                  setChanges={setChanges}
                  edit={edit}
                />
                <button className={style.savebutton} type="submit">
                  <p>Save changes</p>
                </button>
              </form>
            </>
          )}
        </section>
        {children}
      </>
    );
    // * wird bei Events angezeigt
  } else if (user) {
    return (
      <section className={style.wrapper}>
        <Header headertext={`${user.firstname} ${user.lastname}`} />
        <img
          className={style.profilimg}
          src={`https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profilImage}`}
        />

        <div className={style.followdiv}>
          <div className={style.follow}>
            <Following user={user} />
            <p className={style.light}>Following</p>
          </div>
          <div>
            <p>{user?.follower.length}</p>
            <p className={style.light}>Followers</p>
          </div>
        </div>
        <div className={style.tabs}>
          <button className={colorAbout ? style.activeTab : null} onClick={about}>
            ABOUT
          </button>
          <button className={colorEvents ? style.activeTab : null} onClick={events}>
            EVENTS
          </button>
        </div>

        <FlipMove>
          {ownEvents.length > 0 ? (
            ownEvents?.map((singleEvent) => {
              return (
                <OwnEvent
                  singleEvent={singleEvent}
                  favMessageTimer={favMessageTimer}
                  onDeleteEvents={deleteEvents}
                  key={singleEvent.id}
                />
              );
            })
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '30%',
                gap: '20px',
              }}
            >
              <h2>You aren’t hosting any events yet</h2>
            </div>
          )}
        </FlipMove>
        {children}
      </section>
    );
  }
};

UserProfile.propTypes = {
  children: PropTypes.object,
};
