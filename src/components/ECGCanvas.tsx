import React, { useEffect, useRef } from 'react';

interface ECGCanvasProps {
  imageUrl: string;
}

const ECGCanvas: React.FC<ECGCanvasProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  return <canvas ref={canvasRef} className="w-full h-auto border border-gray-300 rounded" />;
};

export default ECGCanvas;