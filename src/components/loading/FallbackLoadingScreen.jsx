import styles from './FallbackLoadingScreen.module.css';

const FallbackLoadingScreen = () => {
  return (
    <section className={styles.section}>
      <article>
        <div className={styles.loading_div}>
          <img
            src="/images/LoadingAnimation.gif"
            alt="is loading..."
            style={{ height: '40vh', marginTop: '50%' }}
          />
          <span>Is Loading...</span>
        </div>
      </article>
    </section>
  );
};

export default FallbackLoadingScreen;
