import { useEffect, useRef } from "react";
import { v4 as uniqueId } from "uuid";

import FooterComponent from "./Footer.Component";

import { Confetti } from "../utils/Confetti";
import { getDegAngel, random } from "../utils/common";

import partyPopperImg from "../images/party-popper.png";
import "../styles/App.scss";

const App = () => {
  //#region refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partyPopperRef = useRef<HTMLDivElement>(null);
  const partyPopperContainerRef = useRef<HTMLDivElement>(null);
  //#endregion

  let intervalHandler: NodeJS.Timer;

  const confettiSprites: { [key: string]: Confetti } = {};
  const confettiSpread = 50;
  const confettiGravity = 0.5;
  const confettiFriction = 0.01;
  const confettiFiringSpeed = 70;
  const dpr = window.devicePixelRatio || 1;

  let canvasContext: CanvasRenderingContext2D | null;
  let partyPopperAngle = 0;
  let shoot = false;

  //#region listeners
  const registerListeners = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      intervalHandler = setInterval(render, 16);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("touchmove", handleTouchMove);

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("touchstart", handleMouseDown);
      canvas.addEventListener("touchend", handleMouseUp);
      canvas.addEventListener("resize", setCanvasSize);
    }
  };

  const unregisterListeners = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      clearInterval(intervalHandler);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);

      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchend", handleMouseUp);
      canvas.removeEventListener("resize", setCanvasSize);
    }
  };
  //#endregion

  const addConfettiParticles = (amount: number, angle: number, speed: number, x: number, y: number): void => {
    for (let i = 0; i < amount; i++) {
      // sprite
      const r = random(4, 6) * dpr;
      const d = random(15, 25) * dpr;

      // generate random color
      const color = `rgb(${random(50, 255)}, ${random(50, 200)}, ${random(50, 200)})`;

      const tilt = random(-10, 10);
      const tiltAngleIncremental = random(0.05, 0.07);
      const tiltAngle = 0;

      const id = uniqueId();

      const sprite = {
        angle,
        velocity: { x: 0, y: 0 },
        speed,
        x,
        y,
        r,
        d,
        color,
        tilt,
        tiltAngleIncremental,
        tiltAngle,
      };

      // add a little bif of randomness to angle and speed
      const minAngle = sprite.angle - confettiSpread / 2;
      const maxAngle = sprite.angle + confettiSpread / 2;
      const currentAngle = random(minAngle, maxAngle);
      const radians = (currentAngle * Math.PI) / 180;

      const minSpeed = sprite.speed / 4;
      const maxSpeed = sprite.speed;
      const currentSpeed = random(minSpeed, maxSpeed);

      sprite.velocity.x = Math.cos(radians) * currentSpeed;
      sprite.velocity.y = Math.sin(radians) * currentSpeed;

      confettiSprites[id] = sprite;
    }
  };

  /**
   * Renders a single frame (60 FPS)
   */
  const render = () => {
    const canvas = canvasRef.current;
    if (canvas) canvasContext?.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);

    drawConfetti();

    if (shoot && canvasRef.current) {
      addConfettiParticles(
        10,
        partyPopperAngle,
        confettiFiringSpeed,
        canvasRef.current.clientWidth / 2,
        canvasRef.current.clientHeight * 0.9
      );
    }
  };

  const drawConfetti = () => {
    for (const spriteId in confettiSprites) {
      const sprite = confettiSprites[spriteId];

      if (canvasContext) {
        canvasContext.beginPath();
        canvasContext.lineWidth = sprite.d / 2;
        canvasContext.strokeStyle = sprite.color;
        canvasContext.moveTo(sprite.x + sprite.tilt + sprite.r, sprite.y);
        canvasContext.lineTo(sprite.x + sprite.tilt, sprite.y + sprite.tilt + sprite.r);
        canvasContext.stroke();
      }

      updateConfettiParticle(spriteId);
    }
  };

  /**
   * Updates given particle (position, velocity, angle, etc)
   *
   * @param spriteId individual particle id
   */
  const updateConfettiParticle = (spriteId: string): void => {
    if (!canvasContext) return;
    const sprite = confettiSprites[spriteId];

    // add friction
    sprite.velocity.y -= sprite.velocity.y * confettiFriction;
    sprite.velocity.x -= sprite.velocity.x * confettiFriction;

    // apply gravity as long as particles haven't crossed the bottom edge
    if (sprite.y <= canvasContext.canvas.height) {
      sprite.velocity.y += confettiGravity;
    } else {
      sprite.velocity.x = 0;
      sprite.velocity.y = 0;
      delete confettiSprites[spriteId];
    }

    // tilt particles
    const tiltAngle = 0.0005 * sprite.d;

    // update particle properties
    sprite.angle += 0.01;
    sprite.tiltAngle += tiltAngle;
    sprite.tiltAngle += sprite.tiltAngleIncremental;
    sprite.tilt = Math.sin(sprite.tiltAngle - sprite.r / 2) * sprite.r * 2;

    // update particle position
    sprite.y += sprite.velocity.y;
    sprite.x += sprite.velocity.x;
  };

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

  /**
   * Sets canvas size
   */
  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    }
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
    if (canvas) {
      partyPopperAngle = getDegAngel(canvas.clientWidth / 2, canvas.clientHeight * 0.9, pointX, pointY);
    }
    if (partyPopperRef.current) {
      partyPopperRef.current.style.transform = `translateX(0)rotate(${partyPopperAngle + 45}deg)`;
    }
  };
  //#endregion

  useEffect(() => {
    registerListeners();
    return () => {
      unregisterListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = "Confetti";
    const canvas = canvasRef.current;
    setCanvasSize();
    if (canvas) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      canvasContext = canvas.getContext("2d");
      canvasContext?.scale(dpr, dpr);
    }
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
        <div className="pc-footer-wrapper">
          <FooterComponent />
        </div>
      </div>
    </div>
  );
};

export default App;
