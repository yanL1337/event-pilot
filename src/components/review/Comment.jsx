import PropTypes from 'prop-types';
import pb from '../../lib/pocketbase';
import { formatDateToString } from '../../utils/helperFunction';
import { Rating } from './Rating';
import FallbackLoadingScreen from '../loading/FallbackLoadingScreen';
import style from '../../pages/css/Review.module.css';

export function Comment({ singleComment }) {
  if (singleComment && singleComment.expand.writer) {
    const profileImagePath = `${pb.baseUrl}/api/files/${singleComment.expand.writer.collectionId}/${singleComment.expand.writer.id}/${singleComment.expand.writer.profilImage}`;
    return (
      <section className={style.wrapper}>
        <div className={style.flexdiv}>
          <div>
            <img
              className={style.profilpic}
              src={
                singleComment.expand.writer.profilImage
                  ? profileImagePath
                  : '/images/No_image_available.svg.png'
              }
              alt="Profilbild des Verfassers der Bewertung"
            />
            <h3>{singleComment.expand.writer.firstname}</h3>
          </div>
          <p className={style.date}>{formatDateToString(singleComment.created)}</p>
        </div>
        <Rating />
        <p className={style.comment}>{singleComment.comment}</p>
      </section>
    );
  } else {
    <FallbackLoadingScreen />;
  }
}

Comment.propTypes = {
  singleComment: PropTypes.object,
};
