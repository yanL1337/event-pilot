import style from "./LoadingElement.module.css";
import PropTypes from 'prop-types';

const LoadingElement = ({ dynamicHeight }) => {
  const heightStyle = dynamicHeight ? `${dynamicHeight}px` : '10%';
  return (
    <div className={style.loadingelement}>
      <img
        src="/images/Logo.png"
        alt="is loading..."
        style={{ height: heightStyle }}
      />
    </div>
  );
};

LoadingElement.propTypes = {
  dynamicHeight: PropTypes.string,
};

export default LoadingElement;
