/**
 * Combines 20 individual cell images into a single 4x5 grid image
 * @param cellImages Array of 20 data URLs (one per cell)
 * @returns Promise<string> Data URL of the combined grid image
 */
export const combineCellsIntoGrid = async (
  cellImages: (string | null)[]
): Promise<string> => {
  if (cellImages.length !== 20) {
    throw new Error('Expected exactly 20 cell images');
  }

  // Create a new canvas for the combined grid
  const gridCanvas = document.createElement('canvas');
  const ctx = gridCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Grid dimensions: 5 columns x 4 rows
  const cellWidth = 300; // Same as single cell canvas
  const cellHeight = 300;
  gridCanvas.width = cellWidth * 5; // 1500px
  gridCanvas.height = cellHeight * 4; // 1200px

  // Fill with white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);

  // Draw grid lines
  ctx.strokeStyle = '#94A3B8'; // gray-400
  ctx.lineWidth = 2;

  // Horizontal lines (3 lines to create 4 rows)
  for (let i = 1; i < 4; i++) {
    const y = cellHeight * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(gridCanvas.width, y);
    ctx.stroke();
  }

  // Vertical lines (4 lines to create 5 columns)
  for (let i = 1; i < 5; i++) {
    const x = cellWidth * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, gridCanvas.height);
    ctx.stroke();
  }

  // Load and draw each cell image
  const loadImagePromises = cellImages.map((dataUrl, index) => {
    return new Promise<void>((resolve, reject) => {
      if (!dataUrl) {
        // Empty cell, just resolve
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        const x = col * cellWidth;
        const y = row * cellHeight;

        // Draw the cell image
        ctx.drawImage(img, x, y, cellWidth, cellHeight);
        resolve();
      };
      img.onerror = () => reject(new Error(`Failed to load cell image ${index}`));
      img.src = dataUrl;
    });
  });

  // Wait for all images to load
  await Promise.all(loadImagePromises);

  // Return the combined grid as a data URL
  return gridCanvas.toDataURL('image/png');
};
