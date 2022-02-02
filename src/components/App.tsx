import { useEffect, useRef } from "react";
import "../styles/App.scss";
import partyPopperImg from "../images/party-popper.png";

const dpr = window.devicePixelRatio || 1;

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partyPopperRef = useRef<HTMLDivElement>(null);

  const registerListeners = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }
  };

  const unregisterListeners = () => {
    const canvas = canvasRef.current;
    if (canvas) window.removeEventListener("mousemove", handleMouseMove);
  };

  const getDegAngel = (x0: number, y0: number, x1: number, y1: number): number => {
    console.log(`x0 - ${x0}, y0 - ${y0}, x1 - ${x1}, y1 - ${y1}`);
    const y = y1 - y0;
    const x = x1 - x0;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    let angle = 0;
    // TODO: angle is a bit off need to be fixed
    if (canvas) {
      angle = getDegAngel(canvas.clientWidth / 2, canvas.clientHeight * 0.9, e.clientX * dpr, e.clientY * dpr);
    }
    if (partyPopperRef.current) {
      partyPopperRef.current.style.transform = `translateX(0)rotate(${angle + 45}deg)`;
    }
  };

  useEffect(() => {
    registerListeners();
    return () => {
      unregisterListeners();
    };
  }, []);

  return (
    <div className="pc-main-content">
      <div className="pc-canvas-container">
        <div className="pc-intro">
          <span className="pc-intro-english">happy new year</span>
          <span>&nbsp;</span>
          <span className="pc-intro-chinese">新年好</span>
        </div>
        <div className="pc-party-popper-container">
          <div className="pc-party-popper" ref={partyPopperRef}>
            <img src={partyPopperImg} alt="party popper" />
          </div>
        </div>
        <canvas ref={canvasRef} className="pc-canvas"></canvas>
      </div>
    </div>
  );
};

export default App;
