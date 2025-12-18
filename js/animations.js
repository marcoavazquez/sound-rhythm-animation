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
  function (frequencyData, positions, colors) {
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
  // Animation 6: Radial / Circular
  function (frequencyData, positions, colors) {
    const barCount = frequencyData.length;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3; // Base radius for the circle

    for (let i = 0; i < barCount; i++) {
      const value = (frequencyData[i] / 255) || 0.001;
      const barHeight = value * (Math.min(width, height) / 2.5); // Max height limit

      // Angle for this bar
      const angle = (i / barCount) * Math.PI * 2;

      // Inner point (on the circle circumference)
      const innerX = centerX + Math.cos(angle) * radius;
      const innerY = centerY + Math.sin(angle) * radius;

      // Outer point
      const outerX = centerX + Math.cos(angle) * (radius + barHeight);
      const outerY = centerY + Math.sin(angle) * (radius + barHeight);

      // We need thickness, so we need perpendicular vectors
      // Tangent angle is angle + PI/2
      const barWidthRad = (Math.PI * 2) / barCount * 0.5; // Half width in radians

      // Actually simpler to just offset the angle for the 4 corners if segments are thin
      // Or calculate specific perp offsets.
      // Let's use simple angular width

      const angleLeft = angle - barWidthRad;
      const angleRight = angle + barWidthRad;

      // Triangle 1
      positions.push(centerX + Math.cos(angleLeft) * radius, centerY + Math.sin(angleLeft) * radius); // Inner Left
      positions.push(centerX + Math.cos(angleRight) * radius, centerY + Math.sin(angleRight) * radius); // Inner Right
      positions.push(centerX + Math.cos(angleLeft) * (radius + barHeight), centerY + Math.sin(angleLeft) * (radius + barHeight)); // Outer Left

      // Triangle 2
      positions.push(centerX + Math.cos(angleRight) * radius, centerY + Math.sin(angleRight) * radius); // Inner Right
      positions.push(centerX + Math.cos(angleRight) * (radius + barHeight), centerY + Math.sin(angleRight) * (radius + barHeight)); // Outer Right
      positions.push(centerX + Math.cos(angleLeft) * (radius + barHeight), centerY + Math.sin(angleLeft) * (radius + barHeight)); // Outer Left

      setColor(value, i, barCount, colors);
    }
  },
  // Animation 7: Zipper (Alternating Top/Down)
  function (frequencyData, positions, colors) {
    const barCount = frequencyData.length;
    const barWidth = width / barCount;

    for (let i = 0; i < barCount; i++) {
      const value = (frequencyData[i] / 255) || 0.001;
      const barHeight = value * height;
      const x = i * barWidth;

      const isTop = i % 2 === 0;

      let y1, y2;

      if (isTop) {
        // Grow from Top
        y1 = height;
        y2 = height - barHeight;
      } else {
        // Grow from Bottom
        y1 = 0;
        y2 = barHeight;
      }

      // Triangle 1
      positions.push(x, y1);
      positions.push(x + barWidth, y1);
      positions.push(x, y2);

      // Triangle 2
      positions.push(x + barWidth, y1);
      positions.push(x + barWidth, y2);
      positions.push(x, y2);

      setColor(value, i, barCount, colors)
    }
  },
  // Animation 8: Horizontal Stack (Left -> Right)
  function (frequencyData, positions, colors) {
    const barCount = frequencyData.length;
    const barHeight = height / barCount; // Actually this is the vertical thickness of each horizontal bar

    for (let i = 0; i < barCount; i++) {
      const value = (frequencyData[i] / 255) || 0.001;
      const barLength = value * width; // Length horizontal

      const y = i * barHeight; // Stack vertically
      // Or maybe center it vertically? i=0 at bottom.

      // x goes from 0 to barLength

      // Triangle 1
      positions.push(0, y);           // Bottom Left
      positions.push(barLength, y);   // Bottom Right
      positions.push(0, y + barHeight); // Top Left

      // Triangle 2
      positions.push(barLength, y);   // Bottom Right
      positions.push(barLength, y + barHeight); // Top Right
      positions.push(0, y + barHeight); // Top Left

      setColor(value, i, barCount, colors)
    }
  }
]