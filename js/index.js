let gl, program, positionBuffer, colorBuffer;
let animationId;
let audioContext, analyser, dataArray;
let isUsingAudio = true;
let current = 0;
let fftSize = 512;
let color = "random";
const canvas = document.getElementById('canvas');
const width = canvas.width;
const height = canvas.height;
// Vertex shader
const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec3 a_color;
            varying vec3 v_color;
            uniform vec2 u_resolution;
            
            void main() {
                vec2 zeroToOne = a_position / u_resolution;
                vec2 zeroToTwo = zeroToOne * 2.0;
                vec2 clipSpace = zeroToTwo - 1.0;
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                v_color = a_color;
            }
        `;

// Fragment shader
const fragmentShaderSource = `
            precision mediump float;
            varying vec3 v_color;
            
            void main() {
                gl_FragColor = vec4(v_color, 1.0);
            }
        `;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function initWebGL() {
  const canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    alert('WebGL not supported');
    return false;
  }

  // Create shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  program = createProgram(gl, vertexShader, fragmentShader);

  // Create buffers
  positionBuffer = gl.createBuffer();
  colorBuffer = gl.createBuffer();

  // Set viewport
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0.3);

  return true;
}

function prev() {
  current = (current - 1 + animations.length) % animations.length;
}
function next() {
  current = (current + 1) % animations.length;
}
function changeFFTSize(size) {
  fftSize = parseInt(size);
  stopDemo()
  startAudio()
}
function changeColor(grade) {
  if (grade === -1) {
    color = "rainbow";
  } else if (grade === 361) {
    color = "random";
  } else {
    color = grade;
  }
}

function generateDemoData() {
  const data = new Uint8Array(128).fill(0);
  return data;
}

function drawSpectrogram(frequencyData) {
  // Generate vertices for bars
  const positions = [];
  const colors = [];

  animations[current](frequencyData, positions, colors);

  // Update position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

  // Update color buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);

  // Clear and draw
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  // Set resolution uniform
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  gl.uniform2f(resolutionLocation, width, height);

  // Bind position attribute
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Bind color attribute
  const colorLocation = gl.getAttribLocation(program, 'a_color');
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(colorLocation);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

  // Draw all triangles
  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
}

function animate() {
  let data;

  if (isUsingAudio && analyser) {
    analyser.getByteFrequencyData(dataArray);
    const sampleRate = audioContext.sampleRate;
    const frequencyResolution = sampleRate / analyser.fftSize;
    data = dataArray.filter((_, i) => {
      const frequency = i * frequencyResolution;
      if (frequency < 4_000 && frequency > 30) {
        return true
      }
      return frequency > 0 && i % 5 === 0 && frequency < 14_000
    });
  } else {
    data = generateDemoData();
  }

  drawSpectrogram(data);
  animationId = requestAnimationFrame(animate);
}

function startDemo() {
  isUsingAudio = false;
  stopDemo();
  animate();
}

function stopDemo() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}
async function startAudio() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;
    source.connect(analyser);
    const sampleRate = audioContext.sampleRate;
    const frequencyResolution = sampleRate / analyser.fftSize;
    dataArray = new Uint8Array(analyser.frequencyBinCount)
    isUsingAudio = true;
    stopDemo();
    animate();
  } catch (err) {
    console.error('Microphone access denied:', err);
    alert('Microphone access is required for audio visualization');
  }
}

// Initialize WebGL when page loads
window.onload = function () {
  if (initWebGL()) {
    startDemo();
  }
};