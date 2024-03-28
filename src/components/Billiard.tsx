import React, { useRef, useEffect } from "react";
import { Ball } from "../interfaces";
import { calculateBilliardPositions } from "../utils/calculate";
import { useBilliardLogic } from "../hooks/useBilliardLogic";
import { draw } from "../utils/draw";
import { ColorPicker } from "./ColorPicker";

interface BilliardProps {
  width: number;
  height: number;
}

export const Billiard: React.FC<BilliardProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([
    ...calculateBilliardPositions(5, 450, 250, 40),
  ]);
  const {
    cueStickPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectedBallForColorChange,
    setSelectedBallForColorChange,
  } = useBilliardLogic(canvasRef, ballsRef);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;
    const animationLoop = () => {
      draw(
        ctx,
        ballsRef.current,
        canvas,
        cueStickPosition.current.start,
        cueStickPosition.current.end
      );
      rafRef.current = requestAnimationFrame(animationLoop);
    };
    animationLoop();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [
    cueStickPosition,
    cueStickPosition.current.end,
    cueStickPosition.current.start,
  ]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedBallForColorChange !== null) {
      const selectedBall = ballsRef.current[selectedBallForColorChange];
      selectedBall.color = event.target.value;
      setSelectedBallForColorChange(null);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ backgroundColor: "rgb(20, 98,91)" }}
      />
      {selectedBallForColorChange !== null && canvasRef.current && (
        <ColorPicker
          position={{
            x:
              ballsRef.current[selectedBallForColorChange].x +
              canvasRef.current.offsetLeft +
              20,
            y:
              ballsRef.current[selectedBallForColorChange].y +
              canvasRef.current.offsetTop -
              15,
          }}
          onColorChange={handleColorChange}
        />
      )}
    </>
  );
};
