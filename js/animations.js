const validColors = new Array(360 / 30).fill(30).map((v, i) => i * v);
let cc = 0;
let rnd = Math.random()

function updateRnd() {
  rnd = Math.random();
  return rnd
}

function setColor(value, index, barCount, colors) {
  let hue = color
  let lightness = value * 0.3 + 0.2; // Minimum brightness
  const saturation = 1;
  if (color === "rainbow") {
    hue = (index / barCount) * 0.9; // 0 to 0.8 (red to blue)
  } else if (color === "random") {
    lightness = value * 0.4 + 0.1
    hue = ((index + cc) % barCount) / barCount // Random hue in [0, 1] range
    if (index === 0) {
      cc += value + barCount / 4000
    }
    if (cc > barCount) {
      cc = 0;
    }
  } else {
    hue = parseFloat(color) / 360; // Convert degrees to [0, 1] range
  }
  // Convert HSL to RGB
  const rgb = hslToRgb(hue, saturation, lightness);

  // Add color for each vertex (6 vertices per bar)
  for (let j = 0; j < 6; j++) {
    colors.push(rgb[0], rgb[1], rgb[2]);
  }
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;

  if (h < 1 / 6) { r = c; g = x; b = 0; }
  else if (h < 2 / 6) { r = x; g = c; b = 0; }
  else if (h < 3 / 6) { r = 0; g = c; b = x; }
  else if (h < 4 / 6) { r = 0; g = x; b = c; }
  else if (h < 5 / 6) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return [r + m, g + m, b + m];
}

const animations = [
  function(frequencyData, positions, colors) {
    const barCount = frequencyData.length;
    const barWidth = width / barCount;
    for (let i = 0; i < barCount; i++) {
      const value = (frequencyData[i] / 255) || 0.005; // Normalize to 0-1
      const barHeight = value * height;
      const x = i * barWidth;

      // Two triangles per bar (rectangle)
      // Triangle 1
      positions.push(x, (height / 2) + (barHeight / 2));           // bottom left
      positions.push(x + barWidth - 1, (height / 2) + (barHeight / 2)); // bottom right
      positions.push(x, (height / 2) - (barHeight / 2)); // top left

      // Triangle 2
      positions.push(x + barWidth - 1, (height / 2) + (barHeight / 2)); // bottom right
      positions.push(x + barWidth - 1, (height / 2) - (barHeight / 2)); // top right
      positions.push(x, (height / 2) - (barHeight / 2)); // top left
      setColor(value, i, barCount, colors)
    }
  },
  function (frequencyData, positions, colors) {
    const barCount = frequencyData.length;
    const barWidth = width / barCount;
    for (let i = 0; i < barCount; i++) {
      const value = (frequencyData[i] / 255) || 0.001; // Normalize to 0-1
      const barHeight = value * height;
      const x = i * barWidth;

      // Two triangles per bar (rectangle)
      // Triangle 1
      positions.push(x, height);           // bottom left
      positions.push(x + barWidth, height); // bottom right
      positions.push(x, height - barHeight); // top left

      // Triangle 2
      positions.push(x + barWidth, height); // bottom right
      positions.push(x + barWidth, height - barHeight); // top right
      positions.push(x, height - barHeight); // top left

      setColor(value, i, barCount, colors)
    }
  },
  function (frequencyData, positions, colors) {
    const barCount = frequencyData.length;
    const barWidth = width / barCount;
    for (let i = 0; i < barCount; i++) {
      const value = (frequencyData[i] / 255) || 0.001; // Normalize to 0-1
      const barHeight = value * height;
      const x = i * barWidth;

      // Two triangles per bar (rectangle)
      // Triangle 1
      positions.push(x, 0);
      positions.push(x + barWidth, 0);
      positions.push(x + barWidth / 2, 0 + barHeight);

      // Triangle 2
      positions.push(x, height); // bottom right
      positions.push(x + barWidth, height); // top right
      positions.push(x + barWidth / 2, height - barHeight);

      setColor(value, i, barCount, colors)
    }
  },
  function (frequencyData, positions, colors) {
    const barCount = frequencyData.length;
    const barWidth = width / barCount;
    for (let i = 0; i < barCount; i++) {
      const value = (frequencyData[i] / 255) || 0.001; // Normalize to 0-1
      const x = i * barWidth;

      // Two triangles per bar (rectangle)
      // Triangle 1
      positions.push(x, 0);
      positions.push(x + barWidth, 0);
      positions.push(x + barWidth, height);

      // Triangle 2
      positions.push(x, height); // bottom right
      positions.push(x + barWidth, height); // top right
      positions.push(x, 0);

      setColor(value, i, barCount, colors)
    }
  },
  function (frequencyData, positions, colors) {
    const barCount = frequencyData.length;
    const barWidth = width / barCount;
    for (let i = 0; i < barCount; i++) {
      const value = (frequencyData[i] / 255) || 0.001; // Normalize to 0-1
      const barHeight = value * height;
      const x = i * barWidth;

      // Two triangles per bar (rectangle)
      // Triangle 1
      positions.push(x, height - barHeight + barWidth);           // bottom left
      positions.push(x + barWidth, height - barHeight + barWidth); // bottom right
      positions.push(x, height - barHeight); // top left

      // Triangle 2
      positions.push(x + barWidth, height - barHeight + barWidth); // bottom right
      positions.push(x + barWidth, height - barHeight); // top right
      positions.push(x, height - barHeight); // top left

      setColor(value, i, barCount, colors)
    }
  },
]