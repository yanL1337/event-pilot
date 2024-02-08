import styles from "./FallbackLoadingScreen.module.css";

const FallbackLoadingScreen = () => {
  return (
    <div className={styles.section}>
      <img src="/images/Logo.png" alt="is loading..." />
    </div>
  );
};

export default FallbackLoadingScreen;
