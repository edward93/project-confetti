import { useRef } from "react";
import "../styles/App.scss";
import partyPopper from "../images/party-popper.png";

const App = () => {
  const canvasRef = useRef(null);

  return (
    <div className="pc-main-content">
      <div className="pc-canvas-container">
        <div className="pc-intro">
          <span className="pc-intro-english">happy new year</span>
          <span>&nbsp;</span>
          <span className="pc-intro-chinese">新年好</span>
        </div>
        <div className="pc-party-popper-container">
          <div className="pc-party-popper">
            <img src={partyPopper} alt="party popper" />
          </div>
        </div>
        <canvas ref={canvasRef} className="pc-canvas"></canvas>
      </div>
    </div>
  );
};

export default App;
