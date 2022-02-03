import { useEffect, useRef } from "react";
import "../styles/App.scss";
import partyPopperImg from "../images/party-popper.png";

const dpr = window.devicePixelRatio || 1;

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partyPopperRef = useRef<HTMLDivElement>(null);
  const partyPopperContainerRef = useRef<HTMLDivElement>(null);
  let shoot = false;

  //#region listeners
  const registerListeners = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("touchmove", handleTouchMove);

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("touchstart", handleMouseDown);
      canvas.addEventListener("touchend", handleMouseUp);
    }
  };

  const unregisterListeners = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);

      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchend", handleMouseUp);
    }
  };
  //#endregion
  
  const getDegAngel = (x0: number, y0: number, x1: number, y1: number): number => {
    // console.log(`x0 - ${x0}, y0 - ${y0}, x1 - ${x1}, y1 - ${y1}`);
    const y = y1 - y0;
    const x = x1 - x0;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const addConfettiParticles = (amount: number, angle: number, velocity: number, x: number, y: number): void => {};

  //#region event handlers
  //#region movements
  const handleMouseMove = (e: MouseEvent) => {
    handleAngleChanges(e.clientX * dpr, e.clientY * dpr);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleAngleChanges(e.touches[0].clientX * dpr, e.touches[0].clientY * dpr);
  };
  //#endregion

  //#region actions
  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    shoot = true;
    if (partyPopperContainerRef.current) partyPopperContainerRef.current.classList.add("shake");
  };

  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    shoot = false;
    if (partyPopperContainerRef.current) partyPopperContainerRef.current.classList.remove("shake");
  };
  //#endregion

  /**
   * Change angle of the partyPopper element to point towards the cursor or touch
   *
   * @param {number} pointX  - X coordinate of the pointer
   * @param {number} pointY  - Y coordinate of the pointer
   */
  const handleAngleChanges = (pointX: number, pointY: number): void => {
    const canvas = canvasRef.current;
    let angle = 0;
    // TODO: angle is a bit off need to be fixed
    if (canvas) {
      angle = getDegAngel(canvas.clientWidth / 2, canvas.clientHeight * 0.9, pointX, pointY);
    }
    if (partyPopperRef.current) {
      partyPopperRef.current.style.transform = `translateX(0)rotate(${angle + 45}deg)`;
    }
  };
  //#endregion

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
        <div className="pc-party-popper-container" ref={partyPopperContainerRef}>
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
