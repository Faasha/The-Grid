// Fun Enhancement: Visual Effects and Grid Visualization System
// Enhanced visual feedback and animations for The Grid

class VisualEffectsEngine {
    constructor(containerElement) {
        this.container = containerElement;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animations = [];
        this.gridCanvas = null;
        this.gridCtx = null;
        
        this.initializeCanvas();
        this.initializeGridCanvas();
        this.startAnimationLoop();
    }

    initializeCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '100';
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    initializeGridCanvas() {
        this.gridCanvas = document.createElement('canvas');
        this.gridCanvas.style.position = 'relative';
        this.gridCanvas.style.border = '2px solid #00ff41';
        this.gridCanvas.style.borderRadius = '8px';
        this.gridCanvas.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.3)';
        this.gridCanvas.style.background = 'rgba(0, 0, 0, 0.85)';
        this.gridCtx = this.gridCanvas.getContext('2d');
        
        // Set grid canvas size
        this.gridCanvas.width = 400;
        this.gridCanvas.height = 400;
    }

    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    // Fun Enhancement: Dynamic Grid Visualization
    renderGrid(gameState) {
        const { grid } = gameState;
        const cellSize = 48;
        const padding = 4;
        
        this.gridCtx.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
        
        // Draw grid background
        this.gridCtx.fillStyle = 'rgba(0, 20, 40, 0.8)';
        this.gridCtx.fillRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
        
        // Draw grid lines
        this.gridCtx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
        this.gridCtx.lineWidth = 1;
        
        for (let i = 0; i <= grid.size; i++) {
            const pos = i * cellSize;
            // Vertical lines
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(pos, 0);
            this.gridCtx.lineTo(pos, grid.size * cellSize);
            this.gridCtx.stroke();
            
            // Horizontal lines
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(0, pos);
            this.gridCtx.lineTo(grid.size * cellSize, pos);
            this.gridCtx.stroke();
        }
        
        // Draw cells
        for (let y = 0; y < grid.size; y++) {
            for (let x = 0; x < grid.size; x++) {
                const cell = grid.cells[y][x];
                this.renderCell(x, y, cell, cellSize, gameState);
            }
        }
        
        // Draw player position
        this.renderPlayer(grid.playerPosition, cellSize, gameState);
        
        return this.gridCanvas;
    }

    renderCell(x, y, cell, cellSize, gameState) {
        const centerX = x * cellSize + cellSize / 2;
        const centerY = y * cellSize + cellSize / 2;
        const radius = cellSize / 3;
        
        if (!cell.discovered) {
            // Unknown cell - subtle indicator
            this.gridCtx.fillStyle = 'rgba(100, 100, 100, 0.1)';
            this.gridCtx.fillRect(x * cellSize + 2, y * cellSize + 2, cellSize - 4, cellSize - 4);
            return;
        }
        
        // Cell type visualization
        const colors = {
            'home': '#00ff41',
            'data_node': '#0099ff',
            'security_node': '#ff6600',
            'resource_node': '#00ffff',
            'trap_node': '#ff3366',
            'fortress_node': '#ff0066',
            'vault_node': '#9966ff',
            'server_farm': '#66ff99',
            'mystery_node': '#ffff00',
            'empty': 'rgba(50, 50, 50, 0.3)'
        };
        
        const color = colors[cell.type] || '#666666';
        
        // Draw cell background
        this.gridCtx.fillStyle = `${color}20`;
        this.gridCtx.fillRect(x * cellSize + 2, y * cellSize + 2, cellSize - 4, cellSize - 4);
        
        if (cell.type !== 'empty') {
            // Draw node symbol
            this.gridCtx.fillStyle = color;
            this.gridCtx.shadowColor = color;
            this.gridCtx.shadowBlur = 10;
            
            this.gridCtx.beginPath();
            this.gridCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.gridCtx.fill();
            
            this.gridCtx.shadowBlur = 0;
            
            // Draw type indicator
            this.gridCtx.fillStyle = '#000000';
            this.gridCtx.font = '12px monospace';
            this.gridCtx.textAlign = 'center';
            this.gridCtx.textBaseline = 'middle';
            
            const symbols = {
                'home': '⌂',
                'data_node': '◉',
                'security_node': '⚠',
                'resource_node': '⚡',
                'trap_node': '☠',
                'fortress_node': '▲',
                'vault_node': '◆',
                'server_farm': '≡',
                'mystery_node': '?'
            };
            
            this.gridCtx.fillText(symbols[cell.type] || '·', centerX, centerY);
        }
    }

    renderPlayer(position, cellSize, gameState) {
        const centerX = position.x * cellSize + cellSize / 2;
        const centerY = position.y * cellSize + cellSize / 2;
        
        // Player indicator with pulsing effect
        const time = Date.now() * 0.005;
        const pulse = Math.sin(time) * 0.2 + 0.8;
        
        this.gridCtx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
        this.gridCtx.shadowColor = '#ffffff';
        this.gridCtx.shadowBlur = 15;
        
        this.gridCtx.beginPath();
        this.gridCtx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        this.gridCtx.fill();
        
        this.gridCtx.shadowBlur = 0;
        
        // Player symbol
        this.gridCtx.fillStyle = '#000000';
        this.gridCtx.font = 'bold 14px monospace';
        this.gridCtx.textAlign = 'center';
        this.gridCtx.textBaseline = 'middle';
        this.gridCtx.fillText('◎', centerX, centerY);
    }

    // Fun Enhancement: Particle System
    createParticleEffect(type, x, y, options = {}) {
        const effects = {
            scan: () => this.createScanParticles(x, y, options),
            hack: () => this.createHackParticles(x, y, options),
            success: () => this.createSuccessParticles(x, y, options),
            error: () => this.createErrorParticles(x, y, options),
            levelup: () => this.createLevelUpParticles(x, y, options),
            combo: () => this.createComboParticles(x, y, options)
        };
        
        if (effects[type]) {
            effects[type]();
        }
    }

    createScanParticles(x, y, options) {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                decay: 0.02,
                size: Math.random() * 3 + 1,
                color: '#00ff41',
                type: 'scan'
            });
        }
    }

    createHackParticles(x, y, options) {
        const colors = ['#ff6600', '#ffaa00', '#ff3366'];
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: 1.0,
                decay: 0.025,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'hack'
            });
        }
    }

    createSuccessParticles(x, y, options) {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * -4 - 2,
                life: 1.0,
                decay: 0.015,
                size: Math.random() * 5 + 2,
                color: '#00ffff',
                type: 'success'
            });
        }
    }

    createComboParticles(x, y, options) {
        const comboLevel = options.combo || 1;
        const particleCount = Math.min(comboLevel * 10, 50);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1.0,
                decay: 0.01,
                size: Math.random() * 6 + 3,
                color: `hsl(${comboLevel * 30}, 100%, 60%)`,
                type: 'combo'
            });
        }
    }

    createErrorParticles(x, y, options) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1.0,
                decay: 0.03,
                size: Math.random() * 3 + 1,
                color: '#ff3366',
                type: 'error'
            });
        }
    }

    // Fun Enhancement: Smooth Animations
    animateElement(element, animation) {
        this.animations.push({
            element: element,
            ...animation,
            startTime: Date.now()
        });
    }

    // Animation types
    pulseElement(element, duration = 1000, intensity = 1.2) {
        this.animateElement(element, {
            type: 'pulse',
            duration: duration,
            intensity: intensity,
            originalTransform: element.style.transform || 'scale(1)'
        });
    }

    shakeElement(element, duration = 500, intensity = 5) {
        this.animateElement(element, {
            type: 'shake',
            duration: duration,
            intensity: intensity,
            originalTransform: element.style.transform || 'translate(0, 0)'
        });
    }

    fadeInElement(element, duration = 800) {
        element.style.opacity = '0';
        this.animateElement(element, {
            type: 'fadeIn',
            duration: duration,
            startOpacity: 0,
            endOpacity: 1
        });
    }

    // Fun Enhancement: Screen Effects
    addScreenFlash(color = '#00ff41', duration = 200) {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.backgroundColor = color;
        flash.style.opacity = '0.3';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '1000';
        flash.style.transition = `opacity ${duration}ms ease-out`;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(flash);
            }, duration);
        }, 50);
    }

    addScreenGlitch(duration = 300) {
        const glitch = document.createElement('div');
        glitch.className = 'screen-glitch';
        glitch.style.position = 'fixed';
        glitch.style.top = '0';
        glitch.style.left = '0';
        glitch.style.width = '100vw';
        glitch.style.height = '100vh';
        glitch.style.pointerEvents = 'none';
        glitch.style.zIndex = '999';
        glitch.style.mixBlendMode = 'screen';
        glitch.style.opacity = '0.8';
        
        // Glitch animation
        glitch.style.animation = `glitch ${duration}ms ease-out`;
        
        document.body.appendChild(glitch);
        
        setTimeout(() => {
            document.body.removeChild(glitch);
        }, duration);
    }

    // Animation loop
    startAnimationLoop() {
        const animate = () => {
            this.updateParticles();
            this.updateAnimations();
            this.render();
            requestAnimationFrame(animate);
        };
        animate();
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vy += 0.1; // Gravity
            
            return particle.life > 0;
        });
    }

    updateAnimations() {
        const now = Date.now();
        this.animations = this.animations.filter(anim => {
            const elapsed = now - anim.startTime;
            const progress = Math.min(elapsed / anim.duration, 1);
            
            switch (anim.type) {
                case 'pulse':
                    const scale = 1 + Math.sin(progress * Math.PI * 4) * (anim.intensity - 1) * (1 - progress);
                    anim.element.style.transform = `scale(${scale})`;
                    break;
                    
                case 'shake':
                    const shakeX = Math.sin(progress * Math.PI * 20) * anim.intensity * (1 - progress);
                    const shakeY = Math.cos(progress * Math.PI * 15) * anim.intensity * (1 - progress);
                    anim.element.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
                    break;
                    
                case 'fadeIn':
                    const opacity = anim.startOpacity + (anim.endOpacity - anim.startOpacity) * progress;
                    anim.element.style.opacity = opacity.toString();
                    break;
            }
            
            if (progress >= 1) {
                // Animation complete, reset element
                if (anim.type === 'pulse' || anim.type === 'shake') {
                    anim.element.style.transform = anim.originalTransform || '';
                }
                return false;
            }
            
            return true;
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render particles
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = particle.size * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    // UI Integration helpers
    attachGridToElement(element) {
        element.appendChild(this.gridCanvas);
    }

    // Cleanup
    destroy() {
        this.particles = [];
        this.animations = [];
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        if (this.gridCanvas && this.gridCanvas.parentNode) {
            this.gridCanvas.parentNode.removeChild(this.gridCanvas);
        }
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualEffectsEngine;
} else {
    window.VisualEffectsEngine = VisualEffectsEngine;
}