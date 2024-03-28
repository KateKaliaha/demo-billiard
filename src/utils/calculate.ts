import { Ball } from "../interfaces";

export const calculateBilliardPositions = (
  rows: number,
  startX: number,
  startY: number,
  ballSpacing: number
): Ball[] => {
  const balls: Ball[] = [];

  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < row; i++) {
      const x = startX + (row * ballSpacing * Math.sqrt(3)) / 2;
      const y = startY + (i - row / 2) * ballSpacing;
      const radius = 15 + Math.random() * 5;
      const color = Math.floor(Math.random() * 16777215).toString(16);

      balls.push({
        x,
        y,
        vx: 0,
        vy: 0,
        radius,
        color: `#${color}`,
        draw: function (ctx: CanvasRenderingContext2D) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        },
      });
    }
  }

  return balls;
};

export const borderCollision = (
  ball: Ball,
  canvasWidth: number,
  canvasHeight: number
): void => {
  const { x, y, radius, vy, vx } = ball;

  if (y + radius + vy > canvasHeight || y - radius + vy < 0) {
    ball.vy = -vy;
  }

  if (x + radius + vx > canvasWidth || x - radius + vx < 0) {
    ball.vx = -vx;
  }
};
