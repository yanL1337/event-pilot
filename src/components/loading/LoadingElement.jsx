import style from "./LoadingElement.module.css";

const LoadingElement = () => {
  return (
    <div className={style.loadingelement}>
      <img
        src="/images/Logo.png"
        alt="is loading..."
        style={{ height: "10%" }}
      />
    </div>
  );
};

export default LoadingElement;
