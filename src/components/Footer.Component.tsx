import "../styles/footer.scss";

const FooterComponent = () => {
  return (
    <footer className="pc-footer-container">
      <div className="pc-footer-app-info">
        <div className="pc-footer-app-author">
          Made by Ed (<span className="pc-logo-first-letter">エ</span>ヂイ)
        </div>
        <div className="pc-footer-app-version">version {process.env.REACT_APP_VERSION}</div>
      </div>
    </footer>
  );
};

export default FooterComponent;
