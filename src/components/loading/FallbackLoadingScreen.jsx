import styles from './FallbackLoadingScreen.module.css';

const FallbackLoadingScreen = () => {
  return (
    <section className={styles.section}>
      <article>
        <div className={styles.loading_div}>
          <img src="/images/LoadSite.gif" alt="is loading..." />
          <span>Is Loading...</span>
        </div>
      </article>
    </section>
  );
};

export default FallbackLoadingScreen;
