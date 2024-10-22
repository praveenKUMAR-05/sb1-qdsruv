interface DataPoint {
  x: number;
  y: number;
}

export const extractDataFromImage = async (imageUrl: string): Promise<DataPoint[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const dataPoints: DataPoint[] = [];
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Assuming the ECG line is dark (close to black)
            if (r < 50 && g < 50 && b < 50) {
              dataPoints.push({ x, y: canvas.height - y });
            }
          }
        }

        // Sort data points by x-coordinate
        dataPoints.sort((a, b) => a.x - b.x);

        // Remove duplicate x values, keeping the highest y value
        const uniqueDataPoints = dataPoints.reduce((acc: DataPoint[], curr) => {
          const existing = acc.find(point => point.x === curr.x);
          if (!existing || curr.y > existing.y) {
            if (existing) {
              acc = acc.filter(point => point.x !== curr.x);
            }
            acc.push(curr);
          }
          return acc;
        }, []);

        resolve(uniqueDataPoints);
      } else {
        resolve([]);
      }
    };
    img.src = imageUrl;
  });
};