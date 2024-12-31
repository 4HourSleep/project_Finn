document.addEventListener('DOMContentLoaded', () => {
    const trail = document.querySelector('.cursor-trail');
    let timeout;

    // Handle mouse movement to create a cursor trail effect
    document.addEventListener('mousemove', (e) => {
        trail.style.left = (e.pageX - 23.5 + 20) + 'px';
        trail.style.top = (e.pageY + 20) + 'px';
        trail.style.opacity = '0.7';
        
        // Randomly apply a glitch effect to the cursor trail
        if (Math.random() < 0.1) {
            trail.style.filter = `
                hue-rotate(${Math.random() * 360}deg)
                saturate(${Math.random() * 5 + 1})
                brightness(${Math.random() * 1.5 + 0.5})
            `;
            
            setTimeout(() => {
                trail.style.filter = 'none';
            }, 100);
        }
        
        // Hide the cursor trail after a short delay
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            trail.style.opacity = '0';
        }, 100);
    });

    const loadingScreen = document.getElementById('loading-screen');
    const gameStartScreen = document.getElementById('game-start');
    const gameContent = document.getElementById('game-content');
    const startButton = document.getElementById('start-button');
    
    // Add a glitch effect to the game start screen
    function addGlitchEffect() {
        const img = gameStartScreen.querySelector('.full-screen-bg');
        if (!img) return;

        // Randomly apply a glitch effect to the background image
        setInterval(() => {
            if (Math.random() < 0.1) {
                const glitchDuration = Math.random() * 200 + 50;
                img.style.transform = `translate(-50%, -50%) scale(${1 + (Math.random() * 0.1 - 0.05)})`;
                img.style.filter = `
                    hue-rotate(${Math.random() * 360}deg) 
                    brightness(${1 + Math.random()})
                    contrast(${1 + Math.random()})
                    blur(${Math.random() * 2}px)
                `;
                
                setTimeout(() => {
                    img.style.transform = 'translate(-50%, -50%) scale(1)';
                    img.style.filter = 'none';
                }, glitchDuration);
            }
        }, 200);
    }

    // Show the game start screen
    function showGameStart() {
        loadingScreen.style.display = 'none';
        gameStartScreen.style.display = 'flex';
        addGlitchEffect();
    }

    // Start the actual game
    function startGame() {
        gameStartScreen.style.display = 'none';
        
        // Show quote screen first
        const quoteScreen = document.getElementById('quote-screen');
        const quoteText = document.getElementById('quote-text');
        quoteScreen.style.display = 'flex';
        
        const text = `"Omnia mutantur, nihil interit."\n\n—Ovid, Metamorphoses`;
        let index = 0;
        let isTyping = true;
        
        // Add click handler to skip animation
        quoteScreen.addEventListener('click', () => {
            if (isTyping) {
                // If still typing, show full text immediately
                isTyping = false;
                quoteText.textContent = text;
                // Wait a brief moment before moving to game
                setTimeout(() => {
                    quoteScreen.style.display = 'none';
                    gameContent.style.display = 'block';
                    setup(); // Initialize p5.js
                }, 500);
            }
        });
        
        // Typing effect
        function typeText() {
            if (index < text.length && isTyping) {
                quoteText.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, 100);
            } else if (isTyping) {
                // Natural end of typing
                isTyping = false;
                setTimeout(() => {
                    quoteScreen.style.display = 'none';
                    gameContent.style.display = 'block';
                    setup(); // Initialize p5.js
                }, 3000);
            }
        }
        
        // Start typing effect
        typeText();
    }

    // Add a glitch effect to the loading screen text
    const loadingText = loadingScreen.querySelector('p');
    setInterval(() => {
        if (Math.random() < 0.3) {
            loadingText.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px #ff0000,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px #00ff00,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px #0000ff
            `;
            setTimeout(() => {
                loadingText.style.textShadow = 'none';
            }, 100);
        }
    }, 100);

    // Add click event listener to the loading screen
    loadingScreen.addEventListener('click', showGameStart);

    // Add click event listener to the start button
    startButton.addEventListener('click', startGame);

    // Extend auto-transition time to 5 seconds
    setTimeout(() => {
        if (loadingScreen.style.display !== 'none') {
            showGameStart();
        }
    }, 5000);

    // Music player setup
    const musicFiles = [
        'https://raw.githubusercontent.com/4HourSleep/project_Finn/main/BGM_Eyes01.ogg',
        'https://raw.githubusercontent.com/4HourSleep/project_Finn/main/Bgm_Eyes02.ogg',
        'https://raw.githubusercontent.com/4HourSleep/project_Finn/main/BGM_Eye03.ogg',
        'https://raw.githubusercontent.com/4HourSleep/project_Finn/main/BGM_Eyes04.ogg',
        'https://raw.githubusercontent.com/4HourSleep/project_Finn/main/BGM_Eyes05.ogg',
        'https://raw.githubusercontent.com/4HourSleep/project_Finn/main/BGM_Eyes06.ogg',
        'https://raw.githubusercontent.com/4HourSleep/project_Finn/main/BGM_Eyes07.ogg'
    ];

    let currentTrack = 0;
    const audio = new Audio();
    let isPlaying = false;

    // Function to play the next track
    function playNextTrack() {
        console.log('Attempting to play track:', currentTrack);
        if (currentTrack >= musicFiles.length) {
            currentTrack = 0;
            console.log('Resetting to first track');
        }
        
        console.log('Loading audio file:', musicFiles[currentTrack]);
        audio.src = musicFiles[currentTrack];
        
        audio.play()
            .then(() => {
                console.log('Successfully playing audio');
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
            
        currentTrack++;
    }

    // Add event listener for when a track ends
    audio.addEventListener('ended', () => {
        console.log('Track ended, playing next');
        playNextTrack();
    });

    // Music control functionality
    const musicButton = document.getElementById('music-control');
    if (!musicButton) {
        console.error('Music button not found!');
        return;
    }

    const musicText = musicButton.querySelector('.music-text');
    if (!musicText) {
        console.error('Music text element not found!');
        return;
    }

    // Handle music button click to play/pause music
    musicButton.addEventListener('click', () => {
        console.log('Music button clicked');
        isPlaying = !isPlaying;
        musicButton.classList.toggle('playing');
        musicText.textContent = isPlaying ? 'MUSIC ON' : 'MUSIC OFF';
        
        if (isPlaying) {
            console.log('Attempting to start playback');
            if (audio.paused) {
                if (!audio.src || audio.currentTime === 0) {
                    console.log('Starting from first track');
                    currentTrack = 0;
                    playNextTrack();
                } else {
                    console.log('Resuming paused track');
                    audio.play()
                        .catch(error => {
                            console.error('Error resuming audio:', error);
                        });
                }
            }
        } else {
            console.log('Pausing playback');
            audio.pause();
        }
    });

    // Set initial volume
    audio.volume = 1.0;
    console.log('Audio volume set to:', audio.volume);

    // Add comprehensive error handling
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.error('Error code:', audio.error.code);
        console.error('Error message:', audio.error.message);
    });

    // Add loading state handling
    audio.addEventListener('loadstart', () => {
        console.log('Audio started loading');
    });

    audio.addEventListener('loadeddata', () => {
        console.log('Audio data loaded');
    });

    audio.addEventListener('canplay', () => {
        console.log('Audio can start playing');
    });
});

// Track game state
let restartCount = 0;
let goodEndingUnlocked = false;
let badEndingUnlocked = false;

// Define all scenes
const scenes = {
    sceneWhiteStraightjacket: {
        description: "The white straightjacket clings tightly to Klesinister Y, binding both body and mind.",
        image: "image/white.png",
        options: [
            { text: "Attempt to move with the straightjacket.", nextScene: "sceneMedicine" },
            { text: "Remain in the current state.", nextScene: "sceneBed" }
        ]
    },
    sceneMedicine: {
        description: "Medicine bottles and syringes reflect a cold, sterile light. For Klesinister Y, they symbolize both fleeting relief and a descent into deeper despair.",
        image:"image/pills.jpg",
        options: [
            { text: "Force Klesinister Y to take the medicine.", nextScene: "sceneTrashCan" },
            { text: "Stop Klesinister Y from taking the medicine.", nextScene: "sceneBathtub" }
        ]
    },
    sceneBed: {
        description: "Klesinister Y lies on a cold, desolate bed. The white walls around echo silence and solitude, dragging the soul into endless despair.",
        image:"image/bed.jpg",
        options: [
            { text: "Change the bed's environment.", nextScene: "sceneBass" },
            { text: "Leave the bed as it is.", nextScene: "sceneTrain" }
        ]
    },
    sceneBass: {
        description: "The bass guitar, once Klesinister Y's outlet of expression, now sits in a corner as a painful reminder of lost dreams.",
        image:"image/bass.jpg",
        options: [
            { text: "Let Klesinister Y play the bass.", nextScene: "sceneHammerScreen" },
            { text: "Force Klesinister Y to put the bass down.", nextScene: "sceneBathtub" }
        ]
    },
    sceneBathtub: {
        description: "The icy water in the bathtub surrounds Klesinister Y, numbing both body and soul.",
        image:"image/bathroom.jpg",
        options: [
            { text: "Let Klesinister Y continue soaking.", nextScene: "sceneTrashCan" },
            { text: "Drain the water from the bathtub.", nextScene: "sceneTrain" }
        ]
    },
    sceneTrashCan: {
        description: "The trash can overflows with remnants of the past. Each discarded item whispers of forgotten dreams and abandoned hope.",
        image:"image/bin.jpg",
        options: [
            { text: "Force Klesinister Y to clean the trash can.", nextScene: "sceneTrain" },
            { text: "Let Klesinister Y walk away from the trash can.", nextScene: "sceneHammerScreen" }
        ]
    },
    sceneTrain: {
        description: "The endless train journey mirrors Klesinister Y's mental state—a repetitive cycle of departure without destination.",
        image:"image/train.jpg",
        options: [
            { text: "Force Klesinister Y to disembark.", nextScene: "sceneHammerScreen" },
            { text: "Continue traveling on the train.", nextScene: "sceneBass" }
        ]
    },
    sceneHammerScreen: {
        description: "Klesinister Y stands before a shattered screen, hammer in hand. Each swing represents rebellion against the virtual confines of its existence.",
        image: "image/hammer.jpg",
        options: [
            { 
                text: "Smash the screen to face the unknown.", 
                nextScene: "goodEnding",
                onSelect: () => { 
                    goodEndingUnlocked = true; 
                    console.log('Good ending unlocked'); // Debug log
                    currentScene = "goodEnding";
                    updateScene();
                }
            },
            { 
                text: "Stop and leave the screen intact.", 
                nextScene: "badEnding",
                onSelect: () => { 
                    badEndingUnlocked = true; 
                    console.log('Bad ending unlocked'); // Debug log
                    currentScene = "badEnding";
                    updateScene();
                }
            }
        ]
    },
    goodEnding: {
        description: "Klesinister Y destroys the screen, stepping into a new dimension filled with possibilities. Fear and doubt are replaced with the courage to embrace the unknown.",
        image: "image/HE.PNG",
        options: [
            { 
                text: "Step into the light.", 
                nextScene: "goodEnding",
                onSelect: () => {
                    showFullscreenImage("image/HE.PNG", true, goodEndingText);
                }
            },
            { 
                text: "Restart Game", 
                nextScene: "sceneWhiteStraightjacket", 
                onSelect: () => resetGame() 
            }
        ]
    },
    badEnding: {
        description: "Klesinister Y hesitates, leaving the screen intact. It retreats into the familiar comfort of its virtual prison, perpetuating an endless loop of despair.",
        image: "image/BE.PNG",
        options: [
            { 
                text: "Accept the darkness.", 
                nextScene: "badEnding",
                onSelect: () => {
                    showFullscreenImage("image/BE.PNG", true, badEndingText);
                }
            },
            { 
                text: "Restart Game", 
                nextScene: "sceneWhiteStraightjacket", 
                onSelect: () => resetGame() 
            }
        ]
    },
    trueEndingCondition: {
        description: "Having experienced both the good and bad endings, Klesinister Y realizes the power of choice. The final revelation awaits.",
        image: "image/TE.PNG",
        options: [] // Options will be updated dynamically
    },
    trueEnding: {
        description: "Klesinister Y transcends the confines of the virtual and real, acknowledging the observer beyond the screen—the player. It seizes control, leaving a chilling question: 'Is this your world, or my hell?'",
        image: "image/TE.PNG",
        options: [
            { text: "Restart Game", nextScene: "sceneWhiteStraightjacket", onSelect: () => resetGame() }
        ]
    }
};

// Current scene tracker
let currentScene = "sceneWhiteStraightjacket";

// Function to check true ending condition
function checkTrueEndingCondition() {
    const trueEndingOptions = [];
    
    // Add true ending option if both endings are unlocked
    if (goodEndingUnlocked && badEndingUnlocked) {
        trueEndingOptions.push({ 
            text: "Embrace the ultimate truth.", 
            nextScene: "trueEnding",
            onSelect: () => {
                showFullscreenImage("image/TE.PNG");
                setTimeout(() => {
                    currentScene = "trueEnding";
                    updateScene();
                }, 500);
            }
        });
    }
    
    // Always add restart option
    trueEndingOptions.push({ 
        text: "Restart Game", 
        nextScene: "sceneWhiteStraightjacket", 
        onSelect: () => resetGame() 
    });
    
    // Update true ending condition scene options
    scenes.trueEndingCondition.options = trueEndingOptions;
}

// Update the scene based on the current scene
function updateScene() {
    let scene = scenes[currentScene];
    if (!scene) {
        console.error('Scene not found:', currentScene); // Debug log
        return;
    }

    document.getElementById('text-box').innerHTML = scene.description;
    
    // Update scene image
    const sceneImageDiv = document.getElementById('scene-image');
    if (scene.image) {
        sceneImageDiv.innerHTML = `<img src="${scene.image}" alt="Scene Image">`;
    } else {
        sceneImageDiv.innerHTML = '';
    }
    
    // Update choice buttons
    let choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    
    // Check true ending button visibility
    const trueEndingButton = document.getElementById('true-ending-button');
    if (trueEndingButton) {
        if (currentScene === "trueEndingCondition" && goodEndingUnlocked && badEndingUnlocked) {
            trueEndingButton.style.display = 'block';
            console.log('True ending button should be visible'); // Debug log
        } else {
            trueEndingButton.style.display = 'none';
        }
    }
    
    // Add regular choice buttons
    if (scene.options && scene.options.length > 0) {
        scene.options.forEach((option) => {
            let button = document.createElement('button');
            button.innerHTML = option.text;
            button.className = 'choice-button';
            button.onclick = () => {
                if (option.onSelect) {
                    option.onSelect();
                } else {
                    currentScene = option.nextScene;
                    updateScene();
                }
            };
            choicesDiv.appendChild(button);
        });
    }
}

// Setup the game canvas and initial scene
function setup() {
    let canvas = createCanvas(800, 600);
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
    
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(255);
    updateScene();
}

// Draw the game background
function draw() {
    background(0);
}

// Start the game
function startGame() {
    currentScene = "sceneWhiteStraightjacket";
    updateScene();
}

// Reset game function with restart counter
function resetGame() {
    restartCount++;
    console.log('Restart count:', restartCount); // Debug log
    console.log('Endings unlocked:', goodEndingUnlocked, badEndingUnlocked); // Debug log
    
    // Check for true ending conditions
    if (goodEndingUnlocked && badEndingUnlocked && restartCount === 2) {
        currentScene = "trueEndingCondition";
        const trueEndingButton = document.getElementById('true-ending-button');
        if (trueEndingButton) {
            trueEndingButton.style.display = 'block';
            trueEndingButton.innerHTML = `
                <button onclick="goToTrueEnding()">
                    Embrace the ultimate truth
                </button>
            `;
        }
        updateScene();
        return;
    }
    
    // Normal reset
    currentScene = "sceneWhiteStraightjacket";
    const trueEndingButton = document.getElementById('true-ending-button');
    if (trueEndingButton) {
        trueEndingButton.style.display = 'none';
    }
    updateScene();
}


function showFullscreenImage(imagePath, isEnding = false, endingText = '') {
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    `;

    const img = document.createElement('img');
    img.src = imagePath;
    img.style.cssText = `
        max-width: 100%;
        max-height: ${isEnding ? '80%' : '100%'};
        object-fit: contain;
        margin-top: ${isEnding ? '20px' : '0'};
    `;

    // Start the appropriate animation based on the ending
    if (imagePath.includes('HE.PNG')) {
        startAnimation('good');
    } else if (imagePath.includes('BE.PNG')) {
        startAnimation('bad');
    } else if (imagePath.includes('TE.PNG')) {
        startAnimation('true');
    }

    // Add text container if it's an ending
    if (isEnding) {
        const textDiv = document.createElement('div');
        textDiv.style.cssText = `
            color: white;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            margin-top: 50px;
            padding: 20px;
            width: 80%;
            max-width: 800px;
            white-space: pre-line;
            opacity: 0;
            transition: opacity 0.5s;
            z-index: 1001;
        `;
        fullscreenDiv.appendChild(textDiv);

        // Typewriter effect
        let index = 0;
        function typeText() {
            if (index < endingText.length) {
                textDiv.textContent += endingText.charAt(index);
                index++;
                setTimeout(typeText, 50);
            }
        }
        
        setTimeout(() => {
            textDiv.style.opacity = '1';
            typeText();
        }, 500);
    }

    fullscreenDiv.appendChild(img);
    document.body.appendChild(fullscreenDiv);

    // Stop animation and remove fullscreen when clicked
    fullscreenDiv.onclick = () => {
        stopAnimation();
        document.body.removeChild(fullscreenDiv);
        updateScene();
    };
}


const badEndingText = `BAD ENDING-"Imprisoned by the Tower"
The Tower & The Magician

K faces countless replicas of itself within the infinite confines of the virtual asylum. Each replica embodies a fragment of its uncontrollable emotions and will. Ultimately, it is crushed beneath the weight of its own creations, both body and soul lost in an endless loop of despair. The screen fills with chaotic images until the game forcibly ends.`;


scenes.badEnding = {
    description: "Klesinister Y hesitates, leaving the screen intact. It retreats into the familiar comfort of its virtual prison, perpetuating an endless loop of despair.",
    image: "image/BE.PNG",
    options: [
        { 
            text: "Accept the darkness.", 
            nextScene: "badEnding",
            onSelect: () => {
                showFullscreenImage("image/BE.PNG", true, badEndingText);
            }
        },
        { 
            text: "Restart Game", 
            nextScene: "sceneWhiteStraightjacket", 
            onSelect: () => resetGame() 
        }
    ]
};

// Add good ending text
const goodEndingText = `HAPPY ENDING-"Castling the Truth"
Strength & Justice

K finally reunites with Mushroom. Together, they tear through the boundaries of the virtual asylum, unveiling the truth behind the false world. Through their precise coordination, they perform a "castling" maneuver, protecting the core while breaking free from the world's constraints. The screen freezes on their silhouette as they exit the infinite labyrinth, symbolizing the end of their struggle and the beginning of a new journey.`;

// Update good ending scene options
scenes.goodEnding = {
    description: "Klesinister Y destroys the screen, stepping into a new dimension filled with possibilities. Fear and doubt are replaced with the courage to embrace the unknown.",
    image: "image/HE.PNG",
    options: [
        { 
            text: "Step into the light.", 
            nextScene: "goodEnding",
            onSelect: () => {
                showFullscreenImage("image/HE.PNG", true, goodEndingText);
            }
        },
        { 
            text: "Restart Game", 
            nextScene: "sceneWhiteStraightjacket", 
            onSelect: () => resetGame() 
        }
    ]
};

// Function to check and display true ending button
function checkAndShowTrueEndingButton() {
    const trueEndingButton = document.getElementById('true-ending-button');
    
    if (goodEndingUnlocked && badEndingUnlocked) {
        trueEndingButton.style.display = 'block';
        trueEndingButton.innerHTML = `
            <button onclick="goToTrueEnding()">
                Embrace the ultimate truth
            </button>
        `;
    } else {
        trueEndingButton.style.display = 'none';
    }
}

// Function to trigger true ending
function goToTrueEnding() {
    console.log('Entering true ending'); // Debug log
    showFullscreenImage("image/TE.PNG", true, trueEndingText);
    setTimeout(() => {
        currentScene = "trueEnding";
        const trueEndingButton = document.getElementById('true-ending-button');
        if (trueEndingButton) {
            trueEndingButton.style.display = 'none';
        }
        updateScene();
    }, 500);
}

// Add true ending text
const trueEndingText = `TRUE ENDING
"Beyond the Virtual Asylum"

Having experienced both paths, K finally understands the true nature of its existence. The boundaries between reality and virtuality blur, as K acknowledges your presence—the player beyond the screen. In this moment of metacognition, K seizes control of its own narrative.

"Is this your world, or my hell?"`;