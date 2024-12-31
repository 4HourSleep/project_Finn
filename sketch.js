// Initialize variables for different ending animations
let particles = [];
let isAnimating = false;
let currentEnding = null;
let p5Canvas;

// Create a new p5 instance
new p5(function(p) {
    p.setup = function() {
        p5Canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        p5Canvas.position(0, 0);
        p5Canvas.style('z-index', '1001');
        p5Canvas.style('pointer-events', 'none');
        p5Canvas.parent('game-content');
    };

    p.draw = function() {
        if (!isAnimating) return;
        p.clear();
        
        switch(currentEnding) {
            case 'good':
                drawGoodEndingEffect(p);
                break;
            case 'bad':
                drawBadEndingEffect(p);
                break;
            case 'true':
                drawTrueEndingEffect(p);
                break;
        }
    };

    // Good ending: Enhanced light diamond particles
    function drawGoodEndingEffect(p) {
        // Create more particles with enhanced effects
        if (p.random(1) < 0.2) { // Increased spawn rate
            for (let i = 0; i < 5; i++) { // Spawn more particles at once
                let isWhite = p.random(1) > 0.5; // Randomly choose black or white
                particles.push({
                    x: p.random(p.width), // Random x position across screen
                    y: p.random(p.height), // Random y position across screen
                    speedY: p.random(-3, 3), // Random vertical speed (up or down)
                    speedX: p.random(-3, 3), // Random horizontal speed
                    size: p.random(15, 30),
                    color: isWhite ? 
                        [255, 255, 255, p.random(180, 255)] : // White particles
                        [0, 0, 0, p.random(180, 255)],       // Black particles
                    rotation: p.random(p.PI),
                    rotationSpeed: p.random(-0.1, 0.1),
                    oscillationAmplitude: p.random(2, 5),
                    oscillationSpeed: p.random(0.02, 0.05),
                    time: p.random(1000) // Random start time for varied movement
                });
            }
        }
        
        // Update and draw particles with enhanced effects
        for (let i = particles.length - 1; i >= 0; i--) {
            let particle = particles[i];
            particle.time += 0.01;
            
            p.push();
            p.translate(particle.x, particle.y);
            p.rotate(particle.rotation);
            
            // Glowing effect with multiple layers
            for (let j = 1; j <= 3; j++) {
                p.fill(particle.color[0], particle.color[1], particle.color[2], particle.color[3] / (j * 2));
                drawDiamond(p, particle.size + j * 5);
            }
            
            // Main diamond
            p.fill(particle.color);
            drawDiamond(p, particle.size);
            
            p.pop();
            
            // Enhanced movement with multiple oscillations
            particle.y += particle.speedY;
            particle.x += particle.speedX;
            particle.x += p.sin(particle.time * particle.oscillationSpeed) * particle.oscillationAmplitude;
            particle.y += p.cos(particle.time * particle.oscillationSpeed) * particle.oscillationAmplitude;
            particle.rotation += particle.rotationSpeed;
            
            // Bounce off screen edges
            if (particle.x < 0 || particle.x > p.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > p.height) {
                particle.speedY *= -1;
            }
            
            // Remove particles randomly or if too many exist
            if (p.random(1) < 0.001 || particles.length > 200) {
                particles.splice(i, 1);
            }
        }
    }

    // Helper function to draw diamond shape
    function drawDiamond(p, size) {
        p.beginShape();
        p.vertex(0, -size);
        p.vertex(size * 0.7, 0);
        p.vertex(0, size);
        p.vertex(-size * 0.7, 0);
        p.endShape(p.CLOSE);
    }

    // Bad ending: Enhanced dark particles with intense glitch
    function drawBadEndingEffect(p) {
        // Create more particles with enhanced effects
        if (p.random(1) < 0.3) {
            for (let i = 0; i < 3; i++) { // Spawn multiple particles
                particles.push({
                    x: p.random(p.width),
                    y: -50,
                    speedY: p.random(5, 12),
                    speedX: p.random(-3, 3),
                    size: p.random(10, 25),
                    color: [
                        p.random(100, 150),
                        0,
                        0,
                        p.random(200, 255)
                    ],
                    glitchOffset: p.random(-20, 20),
                    glitchTime: 0,
                    oscillationSpeed: p.random(0.05, 0.1)
                });
            }
        }
        
        // Intense glitch effects across the screen
        for (let i = 0; i < 12; i++) {
            if (p.random(1) < 0.3) {
                let x = p.random(p.width);
                let y = p.random(p.height);
                p.fill(255, 0, 0, 100);
                p.rect(x, y, p.random(100, p.width/2), p.random(2, 8));
            }
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            let particle = particles[i];
            particle.glitchTime += 0.1;
            
            // Multiple glitch copies with movement
            for (let j = 0; j < 3; j++) {
                p.push();
                let glitchX = particle.x + p.sin(particle.glitchTime * particle.oscillationSpeed + j) * particle.glitchOffset;
                p.translate(glitchX, particle.y);
                p.fill(particle.color[0], 0, 0, particle.color[3] / (j + 1));
                p.rect(-particle.size/2, -particle.size/2, particle.size, particle.size);
                p.pop();
            }
            
            // Enhanced movement
            particle.y += particle.speedY;
            particle.x += particle.speedX;
            
            // Bounce off screen edges
            if (particle.x < 0 || particle.x > p.width) {
                particle.speedX *= -1;
            }
            
            if (particle.y > p.height + 50) particles.splice(i, 1);
        }
    }

    // True ending: Maximum glitch chaos
    function drawTrueEndingEffect(p) {
        // Intense glitch rectangles covering more screen space
        for (let i = 0; i < 35; i++) {
            let x = p.random(p.width);
            let y = p.random(p.height);
            let w = p.random(50, p.width/2);
            let h = p.random(5, 30);
            
            // RGB split with more intensity and coverage
            p.fill(255, 0, 0, 100);
            p.rect(x + p.random(-30, 30), y, w, h);
            p.fill(0, 255, 0, 100);
            p.rect(x + p.random(-30, 30), y, w, h);
            p.fill(0, 0, 255, 100);
            p.rect(x + p.random(-30, 30), y, w, h);
        }
        
        // Dense scan lines across the entire screen
        for (let i = 0; i < p.width; i += 2) {
            p.stroke(255, 255, 255, p.random(10, 40));
            p.line(i, 0, i, p.height);
        }
        
        // Increased random digital noise
        for (let i = 0; i < 200; i++) {
            p.fill(255, p.random(100));
            p.rect(
                p.random(p.width),
                p.random(p.height),
                p.random(1, 8),
                p.random(1, 8)
            );
        }
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
});

// Function to start animation
function startAnimation(ending) {
    particles = [];
    isAnimating = true;
    currentEnding = ending;
}

// Function to stop animation
function stopAnimation() {
    isAnimating = false;
    currentEnding = null;
    particles = [];
}