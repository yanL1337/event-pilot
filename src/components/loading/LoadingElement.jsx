import PropTypes from 'prop-types';

const LoadingElement = ({ dynamicHeight }) => {
  const heightStyle = dynamicHeight ? `${dynamicHeight}px` : '75px';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
      <img src="/images/LoadingAnimation.gif" alt="is loading..." style={{ height: heightStyle }} />
    </div>
  );
};

LoadingElement.propTypes = {
  dynamicHeight: PropTypes.string,
};

export default LoadingElement;
