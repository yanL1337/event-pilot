import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddEventForm from '../components/events/AddEventForm';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

/* CSS */
import styles from './css/AddEvent.module.css';
import { useNavigate } from 'react-router';

const AddEvent = () => {
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <>
      <header>
        <section>
          <article className={styles.header_article}>
            <FontAwesomeIcon
              icon={faArrowLeftLong}
              style={{ height: '30px' }}
              onClick={navigateBack}
            />
            <h2>
              Add <span className={styles.green_h2}>Event</span>
            </h2>
          </article>
        </section>
      </header>
      <main>
        <AddEventForm />
      </main>
    </>
  );
};

export default AddEvent;
