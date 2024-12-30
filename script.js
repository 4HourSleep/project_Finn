document.addEventListener('DOMContentLoaded', () => {
    const trail = document.querySelector('.cursor-trail');
    let timeout;

    document.addEventListener('mousemove', (e) => {
        trail.style.left = (e.pageX - 23.5 + 20) + 'px';
        trail.style.top = (e.pageY + 20) + 'px';
        trail.style.opacity = '0.7';
        
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
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            trail.style.opacity = '0';
        }, 100);
    });

    const loadingScreen = document.getElementById('loading-screen');
    const gameStartScreen = document.getElementById('game-start');
    const gameContent = document.getElementById('game-content');
    const startButton = document.getElementById('start-button');
    
    // Add glitch effect to game start screen
    function addGlitchEffect() {
        const img = gameStartScreen.querySelector('.full-screen-bg');
        if (!img) return;

        // Random glitch effect
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance to trigger glitch
                const glitchDuration = Math.random() * 200 + 50; // 50-250ms
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

    // Function to show game start screen
    function showGameStart() {
        loadingScreen.style.display = 'none';
        gameStartScreen.style.display = 'flex';
        addGlitchEffect(); // Add glitch effect when showing game start screen
    }

    // Function to start the actual game
    function startGame() {
        gameStartScreen.style.display = 'none';
        gameContent.style.display = 'block';
        setup(); // Initialize p5.js
    }

    // Add glitch effect to loading screen text
    const loadingText = loadingScreen.querySelector('p');
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance to trigger glitch
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
    }, 5000);  // Changed from 3000 to 5000

    // Music player setup with debug logging
    const musicFiles = [
        './music/BGM_Eye01.ogg',
        './music/BGM_Eye02.ogg',
        './music/BGM_Eye03.ogg',
        './music/BGM_Eye04.ogg',
        './music/BGM_Eye05.ogg',
        './music/BGM_Eye06.ogg',
        './music/BGM_Eye07.ogg'
    ];

    let currentTrack = 0;
    const audio = new Audio();
    let isPlaying = false;

    // Function to play next track with debug
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
    audio.volume = 0.5;
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

let scenes = [
    {
      text: "You find yourself in a dimly lit room, the air thick with the scent of antiseptic.",
      choices: [
        { text: "Look around", nextScene: 1 },
        { text: "Call out", nextScene: 2 }
      ]
    },
    {
      text: "The walls are padded, and there's a single door with a small window.",
      choices: [
        { text: "Approach the door", nextScene: 3 },
        { text: "Sit down", nextScene: 4 }
      ]
    },
    {
      text: "Your voice echoes, but there's no response.",
      choices: [
        { text: "Look around", nextScene: 1 },
        { text: "Wait silently", nextScene: 4 }
      ]
    },
    {
      text: "Through the window, you see a figure approaching. It's Klesinister Y.",
      choices: [
        { text: "Greet Klesinister Y", nextScene: 5 },
        { text: "Stay silent", nextScene: 6 }
      ]
    },
    {
      text: "Time passes, and you feel a growing sense of unease.",
      choices: [
        { text: "Stand up", nextScene: 3 },
        { text: "Wait longer", nextScene: 7 }
      ]
    },
    {
      text: "Klesinister Y nods, acknowledging your presence.",
      choices: [
        { text: "Ask about this place", nextScene: 8 },
        { text: "Remain silent", nextScene: 6 }
      ]
    },
    {
      text: "Klesinister Y observes you quietly.",
      choices: [
        { text: "Speak", nextScene: 5 },
        { text: "Wait", nextScene: 7 }
      ]
    },
    {
      text: "The room's atmosphere grows heavier, and you feel a pressing need to act.",
      choices: [
        { text: "Call out", nextScene: 2 },
        { text: "Pound on the door", nextScene: 9 }
      ]
    },
    {
      text: "Klesinister Y explains that this is a construct of the mind, a place between realities.",
      choices: [
        { text: "Inquire further", nextScene: 10 },
        { text: "Express disbelief", nextScene: 11 }
      ]
    },
    {
      text: "Your actions have consequences. The end.",
      choices: []
    },
    {
      text: "Klesinister Y delves deeper into the nature of this realm, revealing hidden truths.",
      choices: [
        { text: "Accept the knowledge", nextScene: 12 },
        { text: "Reject the reality", nextScene: 11 }
      ]
    },
    {
      text: "Denial leads to your undoing. The end.",
      choices: []
    },
    {
      text: "Embracing the truth, you find clarity and purpose. The end.",
      choices: []
    }
  ];
  
  let currentScene = 0;
  
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
  
  function draw() {
    background(0);
  }
  
  function updateScene() {
    let scene = scenes[currentScene];
    document.getElementById('text-box').innerHTML = scene.text;
    let choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    scene.choices.forEach((choice, index) => {
      let button = document.createElement('button');
      button.innerHTML = choice.text;
      button.className = 'choice-button';
      button.onclick = () => {
        currentScene = choice.nextScene;
        updateScene();
      };
      choicesDiv.appendChild(button);
    });
  }
  