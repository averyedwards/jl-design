/**
 * Harmonia WebGL Module
 * Particle system and shader-based visual effects
 */

// =============================================
// WEBGL UTILITIES
// =============================================

class WebGLUtils {
    static createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    static createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    static resizeCanvasToDisplaySize(canvas) {
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            return true;
        }
        return false;
    }
}

// =============================================
// VERTEX SHADERS
// =============================================

const PARTICLE_VERTEX_SHADER = `
    attribute vec2 a_position;
    attribute float a_size;
    attribute vec3 a_color;
    attribute float a_alpha;
    
    uniform vec2 u_resolution;
    uniform float u_time;
    
    varying vec3 v_color;
    varying float v_alpha;
    
    void main() {
        vec2 position = a_position;
        
        // Add subtle wave motion
        position.x += sin(u_time * 0.5 + a_position.y * 0.01) * 2.0;
        position.y += cos(u_time * 0.3 + a_position.x * 0.01) * 2.0;
        
        // Convert to clip space
        vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = a_size;
        
        v_color = a_color;
        v_alpha = a_alpha;
    }
`;

const PARTICLE_FRAGMENT_SHADER = `
    precision mediump float;
    
    varying vec3 v_color;
    varying float v_alpha;
    
    void main() {
        // Create circular particles with soft edges
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        if (dist > 0.5) {
            discard;
        }
        
        float alpha = v_alpha * (1.0 - smoothstep(0.3, 0.5, dist));
        gl_FragColor = vec4(v_color, alpha);
    }
`;

// =============================================
// NEURAL NETWORK SHADER (for hero background)
// =============================================

const NEURAL_VERTEX_SHADER = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    
    void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = (a_position + 1.0) * 0.5;
    }
`;

const NEURAL_FRAGMENT_SHADER = `
    precision highp float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_colorPrimary;   // Gold
    uniform vec3 u_colorSecondary; // Maroon
    uniform float u_isDarkMode;
    
    varying vec2 v_texCoord;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                          -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }
    
    // Neural network node visualization
    float neuralNode(vec2 uv, vec2 center, float radius, float time) {
        float dist = length(uv - center);
        float pulse = sin(time * 2.0 + length(center) * 10.0) * 0.5 + 0.5;
        float glow = smoothstep(radius * 1.5, radius * 0.5, dist);
        return glow * (0.5 + pulse * 0.5);
    }
    
    // Connection line between nodes
    float neuralConnection(vec2 uv, vec2 p1, vec2 p2, float width, float time) {
        vec2 pa = uv - p1;
        vec2 ba = p2 - p1;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        float dist = length(pa - ba * h);
        
        // Animated pulse along the line
        float pulse = sin(time * 3.0 - h * 6.28) * 0.5 + 0.5;
        
        return smoothstep(width, width * 0.3, dist) * (0.3 + pulse * 0.7);
    }
    
    void main() {
        vec2 uv = v_texCoord;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
        uv *= aspect;
        
        float time = u_time * 0.5;
        
        // Background gradient
        vec3 bgColor = mix(
            u_isDarkMode > 0.5 ? vec3(0.07, 0.035, 0.04) : vec3(0.98, 0.965, 0.945),
            u_isDarkMode > 0.5 ? vec3(0.11, 0.06, 0.07) : vec3(0.96, 0.93, 0.9),
            uv.y
        );
        
        // Neural network nodes
        float nodes = 0.0;
        float connections = 0.0;
        
        // Create a grid of nodes with some randomness
        for (float i = 0.0; i < 5.0; i++) {
            for (float j = 0.0; j < 4.0; j++) {
                vec2 nodePos = vec2(
                    0.15 + i * 0.2 + snoise(vec2(i, j) * 10.0) * 0.05,
                    0.2 + j * 0.25 + snoise(vec2(i + 5.0, j) * 10.0) * 0.05
                ) * aspect;
                
                // Add subtle movement
                nodePos.x += sin(time + i * 1.5) * 0.02;
                nodePos.y += cos(time + j * 1.3) * 0.02;
                
                nodes += neuralNode(uv, nodePos, 0.015, time + i + j);
                
                // Connect to nearby nodes
                if (i < 4.0) {
                    vec2 nextNode = vec2(
                        0.15 + (i + 1.0) * 0.2 + snoise(vec2(i + 1.0, j) * 10.0) * 0.05,
                        0.2 + j * 0.25 + snoise(vec2(i + 6.0, j) * 10.0) * 0.05
                    ) * aspect;
                    nextNode.x += sin(time + (i + 1.0) * 1.5) * 0.02;
                    nextNode.y += cos(time + j * 1.3) * 0.02;
                    connections += neuralConnection(uv, nodePos, nextNode, 0.002, time + i);
                }
                
                if (j < 3.0) {
                    vec2 nextNode = vec2(
                        0.15 + i * 0.2 + snoise(vec2(i, j + 1.0) * 10.0) * 0.05,
                        0.2 + (j + 1.0) * 0.25 + snoise(vec2(i + 5.0, j + 1.0) * 10.0) * 0.05
                    ) * aspect;
                    nextNode.x += sin(time + i * 1.5) * 0.02;
                    nextNode.y += cos(time + (j + 1.0) * 1.3) * 0.02;
                    connections += neuralConnection(uv, nodePos, nextNode, 0.002, time + j);
                }
            }
        }
        
        // Add noise texture
        float noise = snoise(uv * 3.0 + time * 0.1) * 0.03;
        
        // Combine effects
        vec3 nodeColor = mix(u_colorSecondary, u_colorPrimary, 0.5);
        vec3 connectionColor = u_colorPrimary;
        
        vec3 finalColor = bgColor;
        finalColor += connectionColor * connections * 0.15;
        finalColor += nodeColor * nodes * 0.25;
        finalColor += noise * (u_isDarkMode > 0.5 ? 0.05 : 0.02);
        
        // Vignette
        float vignette = 1.0 - smoothstep(0.5, 1.5, length((v_texCoord - 0.5) * 1.5));
        finalColor *= vignette * 0.3 + 0.7;
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// =============================================
// DNA HELIX SHADER (for genetic section)
// =============================================

const DNA_VERTEX_SHADER = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    
    void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = (a_position + 1.0) * 0.5;
    }
`;

const DNA_FRAGMENT_SHADER = `
    precision highp float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_colorPrimary;
    uniform vec3 u_colorSecondary;
    uniform float u_isDarkMode;
    
    varying vec2 v_texCoord;
    
    void main() {
        vec2 uv = v_texCoord;
        float time = u_time * 0.8;
        
        // Background
        vec3 bgColor = u_isDarkMode > 0.5 
            ? vec3(0.07, 0.035, 0.04) 
            : vec3(0.98, 0.965, 0.945);
        
        // DNA helix parameters
        float helixWidth = 0.15;
        float helixAmplitude = 0.08;
        float helixFrequency = 8.0;
        float helixPhase = time * 2.0;
        
        // Calculate helix strands
        float centerX = 0.5;
        float strand1 = centerX + sin(uv.y * helixFrequency + helixPhase) * helixAmplitude;
        float strand2 = centerX + sin(uv.y * helixFrequency + helixPhase + 3.14159) * helixAmplitude;
        
        // Distance to strands
        float dist1 = abs(uv.x - strand1);
        float dist2 = abs(uv.x - strand2);
        
        // Strand glow
        float glow1 = smoothstep(0.02, 0.005, dist1);
        float glow2 = smoothstep(0.02, 0.005, dist2);
        
        // Base pairs (rungs)
        float rungs = 0.0;
        for (float i = 0.0; i < 20.0; i++) {
            float rungY = fract(i * 0.05 + time * 0.1);
            float rungDist = abs(uv.y - rungY);
            
            if (rungDist < 0.008) {
                float rungX1 = centerX + sin(rungY * helixFrequency + helixPhase) * helixAmplitude;
                float rungX2 = centerX + sin(rungY * helixFrequency + helixPhase + 3.14159) * helixAmplitude;
                
                if (uv.x > min(rungX1, rungX2) && uv.x < max(rungX1, rungX2)) {
                    rungs += smoothstep(0.008, 0.002, rungDist) * 0.5;
                }
            }
        }
        
        // Combine
        vec3 finalColor = bgColor;
        finalColor += u_colorPrimary * glow1 * 0.6;
        finalColor += u_colorSecondary * glow2 * 0.4;
        finalColor += u_colorPrimary * rungs * 0.3;
        
        // Fade edges
        float edgeFade = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
        finalColor = mix(bgColor, finalColor, edgeFade);
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// =============================================
// PARTICLE SYSTEM CLASS
// =============================================

class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl', { 
            alpha: true, 
            premultipliedAlpha: false,
            antialias: true 
        });
        
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to 2D');
            return;
        }
        
        this.options = {
            particleCount: options.particleCount || 100,
            colorPrimary: options.colorPrimary || [0.83, 0.66, 0.33],   // Gold
            colorSecondary: options.colorSecondary || [0.45, 0.18, 0.22], // Maroon
            maxSize: options.maxSize || 4,
            minSize: options.minSize || 1,
            speed: options.speed || 0.5
        };
        
        this.particles = [];
        this.time = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        const gl = this.gl;
        
        // Create shaders
        const vertexShader = WebGLUtils.createShader(gl, gl.VERTEX_SHADER, PARTICLE_VERTEX_SHADER);
        const fragmentShader = WebGLUtils.createShader(gl, gl.FRAGMENT_SHADER, PARTICLE_FRAGMENT_SHADER);
        
        if (!vertexShader || !fragmentShader) return;
        
        this.program = WebGLUtils.createProgram(gl, vertexShader, fragmentShader);
        if (!this.program) return;
        
        // Get attribute/uniform locations
        this.locations = {
            position: gl.getAttribLocation(this.program, 'a_position'),
            size: gl.getAttribLocation(this.program, 'a_size'),
            color: gl.getAttribLocation(this.program, 'a_color'),
            alpha: gl.getAttribLocation(this.program, 'a_alpha'),
            resolution: gl.getUniformLocation(this.program, 'u_resolution'),
            time: gl.getUniformLocation(this.program, 'u_time')
        };
        
        // Create buffers
        this.positionBuffer = gl.createBuffer();
        this.sizeBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.alphaBuffer = gl.createBuffer();
        
        // Initialize particles
        this.initParticles();
        
        // Enable blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    
    initParticles() {
        const width = this.canvas.width || this.canvas.clientWidth;
        const height = this.canvas.height || this.canvas.clientHeight;
        
        this.particles = [];
        
        for (let i = 0; i < this.options.particleCount; i++) {
            const useGold = Math.random() > 0.3;
            const color = useGold ? this.options.colorPrimary : this.options.colorSecondary;
            
            this.particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: this.options.minSize + Math.random() * (this.options.maxSize - this.options.minSize),
                color: color,
                alpha: 0.2 + Math.random() * 0.5
            });
        }
    }
    
    updateParticles() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap around edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        }
    }
    
    render() {
        const gl = this.gl;
        if (!gl || !this.program) return;
        
        WebGLUtils.resizeCanvasToDisplaySize(this.canvas);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(this.program);
        
        // Update uniforms
        gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.locations.time, this.time);
        
        // Prepare data arrays
        const positions = [];
        const sizes = [];
        const colors = [];
        const alphas = [];
        
        for (const p of this.particles) {
            positions.push(p.x, p.y);
            sizes.push(p.size);
            colors.push(p.color[0], p.color[1], p.color[2]);
            alphas.push(p.alpha);
        }
        
        // Upload position data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(this.locations.position);
        gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);
        
        // Upload size data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(this.locations.size);
        gl.vertexAttribPointer(this.locations.size, 1, gl.FLOAT, false, 0, 0);
        
        // Upload color data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(this.locations.color);
        gl.vertexAttribPointer(this.locations.color, 3, gl.FLOAT, false, 0, 0);
        
        // Upload alpha data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.alphaBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alphas), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(this.locations.alpha);
        gl.vertexAttribPointer(this.locations.alpha, 1, gl.FLOAT, false, 0, 0);
        
        // Draw particles
        gl.drawArrays(gl.POINTS, 0, this.particles.length);
    }
    
    animate() {
        this.time += 0.016;
        this.updateParticles();
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    updateColors(primary, secondary) {
        this.options.colorPrimary = primary;
        this.options.colorSecondary = secondary;
        
        for (const p of this.particles) {
            const useGold = Math.random() > 0.3;
            p.color = useGold ? primary : secondary;
        }
    }
    
    destroy() {
        this.stop();
        if (this.gl) {
            this.gl.deleteProgram(this.program);
            this.gl.deleteBuffer(this.positionBuffer);
            this.gl.deleteBuffer(this.sizeBuffer);
            this.gl.deleteBuffer(this.colorBuffer);
            this.gl.deleteBuffer(this.alphaBuffer);
        }
    }
}

// =============================================
// NEURAL BACKGROUND CLASS
// =============================================

class NeuralBackground {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl', { 
            alpha: false,
            antialias: true 
        });
        
        if (!this.gl) {
            console.warn('WebGL not supported for neural background');
            return;
        }
        
        this.options = {
            colorPrimary: options.colorPrimary || [0.83, 0.66, 0.33],
            colorSecondary: options.colorSecondary || [0.45, 0.18, 0.22],
            isDarkMode: options.isDarkMode || false
        };
        
        this.time = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        const gl = this.gl;
        
        const vertexShader = WebGLUtils.createShader(gl, gl.VERTEX_SHADER, NEURAL_VERTEX_SHADER);
        const fragmentShader = WebGLUtils.createShader(gl, gl.FRAGMENT_SHADER, NEURAL_FRAGMENT_SHADER);
        
        if (!vertexShader || !fragmentShader) return;
        
        this.program = WebGLUtils.createProgram(gl, vertexShader, fragmentShader);
        if (!this.program) return;
        
        // Get uniform locations
        this.locations = {
            time: gl.getUniformLocation(this.program, 'u_time'),
            resolution: gl.getUniformLocation(this.program, 'u_resolution'),
            colorPrimary: gl.getUniformLocation(this.program, 'u_colorPrimary'),
            colorSecondary: gl.getUniformLocation(this.program, 'u_colorSecondary'),
            isDarkMode: gl.getUniformLocation(this.program, 'u_isDarkMode')
        };
        
        // Create fullscreen quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);
        
        this.positionBuffer = positionBuffer;
        this.positionLocation = gl.getAttribLocation(this.program, 'a_position');
    }
    
    render() {
        const gl = this.gl;
        if (!gl || !this.program) return;
        
        WebGLUtils.resizeCanvasToDisplaySize(this.canvas);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        gl.useProgram(this.program);
        
        // Set uniforms
        gl.uniform1f(this.locations.time, this.time);
        gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
        gl.uniform3fv(this.locations.colorPrimary, this.options.colorPrimary);
        gl.uniform3fv(this.locations.colorSecondary, this.options.colorSecondary);
        gl.uniform1f(this.locations.isDarkMode, this.options.isDarkMode ? 1.0 : 0.0);
        
        // Draw
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    
    animate() {
        this.time += 0.016;
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    setDarkMode(isDark) {
        this.options.isDarkMode = isDark;
    }
    
    updateColors(primary, secondary) {
        this.options.colorPrimary = primary;
        this.options.colorSecondary = secondary;
    }
    
    destroy() {
        this.stop();
        if (this.gl) {
            this.gl.deleteProgram(this.program);
            this.gl.deleteBuffer(this.positionBuffer);
        }
    }
}

// =============================================
// GLOBAL WEBGL MANAGER
// =============================================

class HarmoniaWebGL {
    constructor() {
        this.particleSystem = null;
        this.neuralBackground = null;
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        
        // Initialize hero background
        const heroCanvas = document.getElementById('webgl-hero');
        if (heroCanvas) {
            this.neuralBackground = new NeuralBackground(heroCanvas, {
                colorPrimary: [0.83, 0.66, 0.33],
                colorSecondary: [0.45, 0.18, 0.22],
                isDarkMode: document.body.getAttribute('data-theme') === 'dark'
            });
            this.neuralBackground.start();
        }
        
        // Initialize particle overlay
        const particleCanvas = document.getElementById('webgl-particles');
        if (particleCanvas) {
            this.particleSystem = new ParticleSystem(particleCanvas, {
                particleCount: 80,
                colorPrimary: [0.83, 0.66, 0.33],
                colorSecondary: [0.45, 0.18, 0.22],
                maxSize: 3,
                minSize: 1,
                speed: 0.3
            });
            this.particleSystem.start();
        }
        
        this.initialized = true;
        
        // Listen for theme changes
        this.setupThemeListener();
    }
    
    setupThemeListener() {
        // Watch for theme attribute changes
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'data-theme') {
                    this.updateTheme();
                }
            }
        });
        
        observer.observe(document.body, { attributes: true });
    }
    
    updateTheme() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        
        const lightGold = [0.83, 0.66, 0.33];
        const lightMaroon = [0.45, 0.18, 0.22];
        const darkGold = [0.94, 0.78, 0.43];
        const darkMaroon = [0.55, 0.23, 0.27];
        
        if (this.neuralBackground) {
            this.neuralBackground.setDarkMode(isDark);
            this.neuralBackground.updateColors(
                isDark ? darkGold : lightGold,
                isDark ? darkMaroon : lightMaroon
            );
        }
        
        if (this.particleSystem) {
            this.particleSystem.updateColors(
                isDark ? darkGold : lightGold,
                isDark ? darkMaroon : lightMaroon
            );
        }
    }
    
    pause() {
        if (this.particleSystem) this.particleSystem.stop();
        if (this.neuralBackground) this.neuralBackground.stop();
    }
    
    resume() {
        if (this.particleSystem) this.particleSystem.start();
        if (this.neuralBackground) this.neuralBackground.start();
    }
    
    destroy() {
        if (this.particleSystem) this.particleSystem.destroy();
        if (this.neuralBackground) this.neuralBackground.destroy();
        this.initialized = false;
    }
}

// Create global instance
window.harmoniaWebGL = new HarmoniaWebGL();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure canvas elements are ready
    setTimeout(() => {
        window.harmoniaWebGL.init();
    }, 100);
});

// Handle visibility change to pause/resume
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        window.harmoniaWebGL.pause();
    } else {
        window.harmoniaWebGL.resume();
    }
});
