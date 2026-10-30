/* ===============================================
   MINI-HEETA - PISKEL WITH TURN SEQUENCE
   Turn → Walk → Turn back!
   =============================================== */

export default class MiniHeetaPiskel {
    constructor() {
        // Position
        this.x = window.innerWidth - 140;
        this.y = window.innerHeight - 180;
        this.velocityX = 0;
        this.velocityY = 0;
        this.width = 100;
        this.height = 150;
        
        // Physics
        this.gravity = 0.8;
        this.isDragging = false;
        this.isGrounded = false;
        this.isFalling = false;
        this.isWalking = false;
        this.isTurning = false;
        this.facingRight = true;

        //location
        this.isOnProjectsPage = false;
        
        // Working states
        this.isWorking = false;
        this.isSitting = false;
        this.lastActivityTime = Date.now();
        this.idleTimeout = null;
        this.tapTimeout = null;
        this.tapCount = 0;
        
        // Reaction states
        this.isReacting = false;
        this.reactionTimeout = null;
        this.projectMessages = [
            "I made that!",
            "That's my work!",
            "I built this one!",
            "Proud of this!",
            "My creation!",
            "I coded that!",
            "That was fun to make!",
            "One of my projects!"
        ];
        
        // Timeouts
        this.workTimeout = null;
        this.coffeeTimeout = null;
        this.isDancing = false;

        this.turningFrames = 3; 
        this.turningDuration = 300; 

        // idle times
        this.lastActionTime = Date.now();
        this.actionCooldown = 20000;
        this.idleTimeBeforeWork = 45000;
        
        // Elements
        this.element = null;
        this.container = null;
        this.sprite = null;
        this.speechBubble = null;
        this.currentState = 'idle';
        
        // Messages
        this.messages = [
            "Hi! Use arrow keys!",
            "I'm Heeta!",
            "Drag me around!",
            "Double tap to dance!",
            "Check my projects!",
            "Let's code!"
        ];

        this.destroyed = false;
        this.cleanups = [];
        this.intervals = [];
        this.timeouts = [];
        this.rafId = null;
        
        this.init();
    }
    
    init() {
        this.createElement();
        this.attachEventListeners();
        this.setupProjectCardListeners();
        this.startAnimation();

        this.timeouts.push(setTimeout(() => {
            this.wave();
            this.showMessage("Hi!");
            this.lastActionTime = Date.now();
        }, 1500));

        this.intervals.push(setInterval(() => this.tryRandomAction(), 45000));
        this.intervals.push(setInterval(() => this.checkIfProjectsPage(), 5000));

        this.resetIdleTimer();
    }
    
    createElement() {
        // Main container
        this.element = document.createElement('div');
        this.element.id = 'mini-heeta';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        // Sprite container
        this.container = document.createElement('div');
        this.container.className = 'sprite-container idle';
        
        // Character sprite
        this.sprite = document.createElement('div');
        this.sprite.className = 'character-sprite idle';
        
        this.container.appendChild(this.sprite);
        this.element.appendChild(this.container);
        
        // Speech bubble
        this.speechBubble = document.createElement('div');
        this.speechBubble.className = 'speech-bubble';
        this.element.appendChild(this.speechBubble);
        
        document.body.appendChild(this.element);
    }
    
    attachEventListeners() {
        this.listen(this.element, 'mousedown', this.onMouseDown.bind(this));
        this.listen(document, 'mousemove', this.onMouseMove.bind(this));
        this.listen(document, 'mouseup', this.onMouseUp.bind(this));

        this.listen(this.element, 'touchstart', this.onTouchStart.bind(this), { passive: false });
        this.listen(document, 'touchmove', this.onTouchMove.bind(this), { passive: false });
        this.listen(document, 'touchend', this.onTouchEnd.bind(this));

        this.listen(document, 'keydown', (e) => {
            if (e.target.matches('input, textarea')) return;
            this.resetIdleTimer();

            if (e.key === 'ArrowLeft') { e.preventDefault(); this.startWalkingSequence('left'); }
            if (e.key === 'ArrowRight') { e.preventDefault(); this.startWalkingSequence('right'); }
            if (e.key === 'ArrowUp') { e.preventDefault(); this.jump(); }
            if (e.key === 'd' || e.key === 'D') { this.dance(); }
        });

        this.listen(document, 'keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') this.stopWalkingSequence();
        });
    }
    
    onMouseDown(e) {
        if (e.button === 0) {
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            this.potentialDrag = true;
            this.dragMoved = false;
            
            // Don't start drag immediately - wait to see if it's a click or drag
            setTimeout(() => {
                if (this.potentialDrag && this.dragMoved) {
                    this.startDrag(e.clientX, e.clientY);
                }
            }, 150);
        }
    }
    
    onMouseMove(e) {
        if (this.potentialDrag && !this.isDragging) {
            const dx = Math.abs(e.clientX - this.dragStartX);
            const dy = Math.abs(e.clientY - this.dragStartY);
            
            if (dx > 5 || dy > 5) {
                this.dragMoved = true;
                this.startDrag(this.dragStartX, this.dragStartY);
            }
        }
        
        if (this.isDragging) {
            this.drag(e.clientX, e.clientY);
            if (Math.random() > 0.85) this.createTrail();
        }
    }
    
    onMouseUp(e) {
        this.potentialDrag = false;
        
        if (this.isDragging) {
            this.endDrag();
        } else if (!this.dragMoved) {
            // It's a click, not a drag
            this.handleTap();
        }
        
        this.dragMoved = false;
        this.resetIdleTimer();
    }
    
    onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.dragStartX = touch.clientX;
        this.dragStartY = touch.clientY;
        this.potentialDrag = true;
        this.dragMoved = false;
        
        setTimeout(() => {
            if (this.potentialDrag && this.dragMoved) {
                this.startDrag(touch.clientX, touch.clientY);
            }
        }, 150);
    }
    
    onTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        
        if (this.potentialDrag && !this.isDragging) {
            const dx = Math.abs(touch.clientX - this.dragStartX);
            const dy = Math.abs(touch.clientY - this.dragStartY);
            
            if (dx > 5 || dy > 5) {
                this.dragMoved = true;
                this.startDrag(this.dragStartX, this.dragStartY);
            }
        }
        
        if (this.isDragging) {
            this.drag(touch.clientX, touch.clientY);
        }
    }
    
    onTouchEnd() {
        this.potentialDrag = false;
        
        if (this.isDragging) {
            this.endDrag();
        } else if (!this.dragMoved) {
            // It's a tap, not a drag
            this.handleTap();
        }
        
        this.dragMoved = false;
        this.resetIdleTimer();
    }
    
    handleTap() {
        this.tapCount++;
        
        if (this.tapCount === 1) {
            // Wait to see if it's a double tap
            this.tapTimeout = setTimeout(() => {
                // Single tap - wave
                if (this.isGrounded && !this.isWorking) {
                    this.wave();
                }
                this.tapCount = 0;
            }, 300);
        } else if (this.tapCount === 2) {
            // Double tap - DANCE
            clearTimeout(this.tapTimeout);
            if (this.isGrounded && !this.isWorking && !this.isDancing) {
                this.dance();
            }
            this.tapCount = 0;
        }
    }
    
    startDrag(clientX, clientY) {
        this.isDragging = true;
        this.hasMoved = false;
        this.stopWalkingSequence();
        
        // Stop working if dragging
        if (this.isWorking) {
            this.stopWorkingSequence();
        }
        
        // Stop dancing if dragging
        if (this.isDancing) {
            this.isDancing = false;
        }
        
        this.element.classList.add('dragging');
        this.offsetX = clientX - this.x;
        this.offsetY = clientY - this.y;
        this.velocityY = 0;
        this.velocityX = 0;
        this.setState('picked-up');
        this.container.className = 'sprite-container';
    }
    
    drag(clientX, clientY) {
        const newX = clientX - this.offsetX;
        const newY = clientY - this.offsetY;
        
        if (Math.abs(newX - this.x) > 5 || Math.abs(newY - this.y) > 5) {
            this.hasMoved = true;
        }
        
        this.x = newX;
        this.y = newY;
        this.updatePosition();
    }
    
    endDrag() {
        if (this.isDragging && this.hasMoved) {
            this.showMessage("Wheee! 🎉");
        }
        
        this.isDragging = false;
        this.element.classList.remove('dragging');
        this.isFalling = true;
        
        // Start falling animation
        this.setState('falling');
        this.container.className = 'sprite-container';
        
        console.log('🪂 Falling...');
    }
    
    // WALKING SEQUENCE: Turn → Walk → Turn back
    startWalkingSequence(direction) {
        if (this.isDragging || this.isTurning || this.isWorking || this.isDancing) return;
        
        // Stop working if currently working
        if (this.isWorking) {
            this.stopWorkingSequence();
            setTimeout(() => this.startWalkingSequence(direction), 900);
            return;
        }
        
        this.resetIdleTimer();
        
        // If already walking in same direction, continue
        if (this.isWalking && 
            ((direction === 'right' && this.facingRight) || 
             (direction === 'left' && !this.facingRight))) {
            return;
        }
        
        // If already walking in opposite direction, stop first
        if (this.isWalking) {
            this.stopWalkingSequence();
            setTimeout(() => this.startWalkingSequence(direction), this.turningDuration);
            return;
        }
        
        // Start turning
        this.isTurning = true;
        this.facingRight = (direction === 'right');
        
        // Play turning animation
        this.setState('turning-' + direction);
        this.container.className = 'sprite-container';
        
        console.log(`🔄 Turning ${direction}...`);
        
        // After turning completes, start walking
        setTimeout(() => {
            this.isTurning = false;
            this.isWalking = true;
            this.velocityX = direction === 'right' ? 4 : -4;
            
            this.setState('walking-' + direction);
            this.container.className = 'sprite-container walking';
            
            console.log(`🚶 Walking ${direction}...`);
        }, this.turningDuration);
    }
    
    stopWalkingSequence() {
        if (!this.isWalking || this.isTurning) return;
        
        this.isWalking = false;
        this.isTurning = true;
        this.velocityX = 0;
        
        // Turn back to front (idle position)
        const turnBackDirection = this.facingRight ? 'right' : 'left';
        this.setState('turning-back-' + turnBackDirection);
        this.container.className = 'sprite-container';
        
        console.log(`🔄 Turning back to idle...`);
        
        // After turning back, return to idle
        setTimeout(() => {
            this.isTurning = false;
            
            if (this.isGrounded && !this.isDragging) {
                this.setState('idle');
                this.container.className = 'sprite-container idle';
                console.log(`🧍 Back to idle`);
            }
        }, this.turningDuration);
    }
    
    startWorkingSequence() {
        if (this.isDragging || this.isTurning || this.isWorking || !this.isGrounded || this.isDancing) return;
        
        // Stop any current activities
        if (this.isWalking) {
            this.stopWalkingSequence();
            setTimeout(() => this.startWorkingSequence(), this.turningDuration);
            return;
        }

        this.isWorking = true;
        this.isSitting = true;
        
        // Clear any existing work timeout
        if (this.workTimeout) {
            clearTimeout(this.workTimeout);
            this.workTimeout = null;
        }
        
        // Sit down and take out laptop
        this.setState('taking-out-laptop');
        this.container.className = 'sprite-container sitting';
        
        // Vary the messages
        const startMessages = [
            "Time to code! 💻",
            "Let's build something! 🛠️",
            "Back to work! ⌨️",
            "Coding mode ON! 🚀"
        ];
        this.showMessage(startMessages[Math.floor(Math.random() * startMessages.length)]);
        
        // After sitting animation, start working
        setTimeout(() => {
            if (this.isWorking && !this.isReacting) {
                this.setState('working');
                
                // Occasional working messages
                if (Math.random() > 0.5) {
                    const workMessages = [
                        "Working hard! ⌨️",
                        "In the zone! 🎯",
                        "Building stuff! 🏗️",
                        "Debug mode! 🐛"
                    ];
                    this.showMessage(workMessages[Math.floor(Math.random() * workMessages.length)]);
                }
            }
            
            // Work for 5-10 seconds then FORCE STOP - NO CONDITIONS!
            let workDuration;
            if(this.isOnProjectsPage){
                workDuration = 30000 + Math.random() * 30000;
            } else {
                workDuration = 5000 + Math.random() * 5000;
            }
            this.workTimeout = setTimeout(() => {
                // FORCE STOP - no conditions!
                this.stopWorkingSequence();
            }, workDuration);
        }, 800);
    }
    
    stopWorkingSequence() {
        if (!this.isWorking) return;
        
        // IMMEDIATELY clear all flags
        this.isReacting = false;
        
        // Clear ALL timeouts
        if (this.workTimeout) {
            clearTimeout(this.workTimeout);
            this.workTimeout = null;
        }
        
        if (this.reactionTimeout) {
            clearTimeout(this.reactionTimeout);
            this.reactionTimeout = null;
        }
        
        // Put laptop away (reverse animation)
        this.setState('putting-away-laptop');
        
        const stopMessages = [
            "Break time! ☕",
            "Stretching time! 🤸",
            "Good progress! ✅",
            "Time to move! 🚶"
        ];
        this.showMessage(stopMessages[Math.floor(Math.random() * stopMessages.length)]);
        
        // After putting away animation completes (800ms), return to idle
        setTimeout(() => {
            this.isWorking = false;
            this.isSitting = false;
            
            // 30% chance to drink coffee after working
            if (Math.random() < 0.3) {
                this.drinkCoffee();
            } else {
                this.setState('idle');
                this.container.className = 'sprite-container idle';
                console.log('🧍 Successfully back to idle after working');
            }
            if(this.isOnProjectsPage){
                const breakDuration = 8000 + Math.random() * 8000;
                setTimeout(() => {
                    if (this.isOnProjectsPage && !this.isWorking && 
                        !this.isDragging && !this.isDancing && this.isGrounded) {
                            this.startWorkingSequence();
                        }
                }, breakDuration);
            }
        }, 800);
    }
    
    reactToProjectHover() {
        // Only react if currently working and not already reacting
        if (!this.isWorking || this.isReacting || this.isDragging) return;
        
        console.log('🎯 Reacting to project hover!');
        this.isReacting = true;
        
        // Clear any existing reaction timeout
        if (this.reactionTimeout) {
            clearTimeout(this.reactionTimeout);
        }
        
        // Switch to "I did" pose
        this.setState('i-did');
        this.container.className = 'sprite-container proud';
        
        // Say something proud
        const message = this.projectMessages[Math.floor(Math.random() * this.projectMessages.length)];
        this.showMessage(message);
        
        // Return to working after 2 seconds
        this.reactionTimeout = setTimeout(() => {
            if (this.isWorking && !this.isDragging) {
                this.setState('working');
                this.container.className = 'sprite-container sitting';
                console.log('💻 Back to working after reaction');
            }
            this.isReacting = false;
        }, 2000);
    }
    
    setupProjectCardListeners() {
        const onOver = (e) => {
            if (e.target.closest?.('.project-card')) this.reactToProjectHover();
        };
        this.listen(document, 'mouseover', onOver);
        this.listen(document, 'touchstart', onOver, { passive: true });
    }
    
    checkIdleTime() {
        const now = Date.now();
        const idleTime = now - this.lastActivityTime;
        
        if (idleTime > this.idleTimeBeforeWork && 
            !this.isWorking && !this.isDragging && this.isGrounded && 
            !this.isWalking && !this.isTurning && !this.isDancing) {
            this.startWorkingSequence();
            this.lastActionTime = Date.now();
        }
    }
    
    resetIdleTimer() {
        this.lastActivityTime = Date.now();
        
        // Clear existing timeout
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
        }
        
        // Set new timeout
        this.idleTimeout = setTimeout(() => {
            this.checkIdleTime();
        }, this.idleTimeBeforeWork);
    }
    
    checkIfProjectsPage() {
        // Check if we're on/near projects section
        const onProjects = 
            window.location.pathname.includes('projects') || 
            window.location.hash.includes('projects') ||
            document.querySelector('.projects-section')?.getBoundingClientRect().top < window.innerHeight / 2;
        
        this.isOnProjectsPage = onProjects; // Track status
        
        if (onProjects) {
            if (!this.isWorking && this.isGrounded && !this.isDancing && !this.isDragging) {
                setTimeout(() => {
                    // Double-check still on projects
                    if (this.isOnProjectsPage && !this.isWorking) {
                        this.startWorkingSequence();
                    }
                }, 3000); // Your 3 second delay
            }
        }
    }
    
    jump() {
        if (!this.isGrounded || this.isDragging || this.isTurning || this.isWorking || this.isDancing) return;
        
        this.resetIdleTimer();
        
        // STOP walking if currently walking
        if (this.isWalking) {
            this.isWalking = false;
            this.velocityX = 0;
            console.log('⏸️ Stopped walking to jump');
        }
        
        this.velocityY = -22;
        this.isGrounded = false;
        this.isFalling = false; // Not falling while jumping up
        
        const jumpMessages = ["Boing! 🦘", "Wheee! 🚀", "Jump! ⬆️"];
        this.showMessage(jumpMessages[Math.floor(Math.random() * jumpMessages.length)]);
        
        this.setState('jumping');
        this.container.className = 'sprite-container jumping';
        
        // After jump peaks, will naturally transition to falling via applyPhysics
    }

    wave() {
        if (this.isDragging || this.isTurning || this.isDancing) return;
        
        // STOP walking if currently walking
        if (this.isWalking) {
            this.isWalking = false;
            this.velocityX = 0;
            console.log('⏸️ Stopped walking to wave');
        }
        
        console.log('👋 Waving!');
        
        this.setState('waving');
        this.container.className = 'sprite-container';
        
        const waveMessages = ["Hi! 👋", "Hello there! 👋", "Hey! 👋"];
        this.showMessage(waveMessages[Math.floor(Math.random() * waveMessages.length)]);
        
        // Wave for 1.5 seconds (3 loops of 2-frame animation)
        setTimeout(() => {
            // ALWAYS return to idle after waving
            this.setState('idle');
            this.container.className = 'sprite-container idle';
            console.log('🧍 Back to idle after waving');
        }, 1500);
    }
    
    drinkCoffee() {
        if (this.isDragging || this.isTurning || this.isWalking || this.isWorking || this.isDancing) return;
        
        console.log('☕ Coffee break!');
        
        this.setState('coffee');
        this.container.className = 'sprite-container coffee';
        
        const coffeeMessages = [
            "Coffee time! ☕",
            "Mmm... coffee! ☕",
            "Need caffeine! ☕",
            "Refueling! ☕",
            "Best part of coding! ☕"
        ];
        this.showMessage(coffeeMessages[Math.floor(Math.random() * coffeeMessages.length)]);
        
        // Clear any existing coffee timeout
        if (this.coffeeTimeout) {
            clearTimeout(this.coffeeTimeout);
        }
        
        // Drink coffee for 3 seconds
        this.coffeeTimeout = setTimeout(() => {
            this.setState('idle');
            this.container.className = 'sprite-container idle';
            console.log('🧍 Back to idle after coffee');
        }, 3000);
    }
    
    dance() {
        if (this.isDragging || this.isDancing) return;
        
        // Stop any current activities
        if (this.isWalking) {
            this.stopWalkingSequence();
            setTimeout(() => this.dance(), this.turningDuration);
            return;
        }
        
        if (this.isWorking) {
            this.stopWorkingSequence();
            setTimeout(() => this.dance(), 900);
            return;
        }
        
        console.log('💃 Dance time!');
        this.isDancing = true;
        
        const danceMessages = [
            "Let's dance! 💃",
            "Dance party! 🎉",
            "Feeling groovy! 🕺",
            "Can't stop dancing! 🎵",
            "Dance mode ON! 💫"
        ];
        this.showMessage(danceMessages[Math.floor(Math.random() * danceMessages.length)]);
        
        // Total dance duration (15-20 seconds)
        const totalDanceDuration = 10000 + Math.random() * 5000;
        const danceStartTime = Date.now();
        
        // Start the dance loop alternating between dance-1 and dance-1-2
        this.danceLoop(danceStartTime, totalDanceDuration);
    }

    danceLoop(startTime, totalDuration) {
        if (!this.isDancing) return;
        
        // Check if total dance time is over
        const elapsed = Date.now() - startTime;
        if (elapsed >= totalDuration) {
            this.stopDancing();
            return;
        }
        
        // Play dance-1 (9 frames, 0.9s)
        this.setState('dance-1');
        this.container.className = 'sprite-container dancing';
        console.log('💃 Dance-1');
        
        setTimeout(() => {
            if (!this.isDancing) return;
            
            // Check again before dance-1-2
            const elapsed = Date.now() - startTime;
            if (elapsed >= totalDuration) {
                this.stopDancing();
                return;
            }
            
            // Play dance-1-2 (9 frames, 0.9s)
            this.setState('dance-1-2');
            this.container.className = 'sprite-container dancing';
            console.log('💃 Dance-1-2');
            
            setTimeout(() => {
                // Loop back to dance-1
                this.danceLoop(startTime, totalDuration);
            }, 900); // Duration of dance-1-2
            
        }, 900); // Duration of dance-1
    }

    stopDancing() {
        if (!this.isDancing) return;
        
        console.log('💃 Stopping dance...');
        this.isDancing = false;
        
        this.setState('idle');
        this.container.className = 'sprite-container idle';
        
        const endMessages = [
            "That was fun! 😊",
            "Whew! 💦",
            "Love dancing! 💕",
            "More later! 👋"
        ];
        this.showMessage(endMessages[Math.floor(Math.random() * endMessages.length)]);
        
        console.log('🧍 Back to idle after dancing');
    }
    
    celebrateFormSubmit() {
        this.dance();
        setTimeout(() => {
            this.showMessage("Message sent! 🎉");
            this.createConfetti();
        }, 500);
    }
    
    setState(state) {
        this.currentState = state;
        this.sprite.className = 'character-sprite ' + state;
    }
    
    showMessage(text) {
        this.speechBubble.textContent = text;
        this.speechBubble.classList.add('show');
        
        setTimeout(() => {
            this.speechBubble.classList.remove('show');
        }, 3500);
    }
    
    tryRandomAction(){
        const now = Date.now();
        const timeSinceLastAction = now - this.lastActionTime;

        if (this.isDragging || this.isWalking || this.isTurning || 
            this.isWorking || this.isDancing || !this.isGrounded ||
            timeSinceLastAction < this.actionCooldown) {
            return;
        }

        if (Math.random() < 0.6) {
            return;
        }
        
        const actions = ['message', 'wave', 'coffee'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        switch(action) {
            case 'message':
                const message = this.messages[Math.floor(Math.random() * this.messages.length)];
                this.showMessage(message);
                break;
            case 'wave':
                this.wave();
                break;
            case 'coffee':
                this.drinkCoffee();
                break;
        }
        
        this.lastActionTime = Date.now();
    }
    
    createTrail() {
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = (this.x + 50) + 'px';
        trail.style.top = (this.y + 75) + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 1100);
    }
    
    createDust() {
        // Create MORE dust particles (increased from 6 to 15)
        for (let i = 0; i < 25; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            
            // Random position around the feet
            const offsetX = (Math.random() - 0.5) * 80; // Wider spread
            const offsetY = Math.random() * 20;
            
            dust.style.left = (this.x + 50 + offsetX) + 'px';
            dust.style.top = (this.y + 135 + offsetY) + 'px';
            
            // Random size for variety
            const size = 8 + Math.random() * 12; // 8-20px
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';
            
            document.body.appendChild(dust);
            
            setTimeout(() => dust.remove(), 1200); // Longer duration
        }
    }
    
    createConfetti() {
        const colors = ['#5178BD', '#7B9FE0', '#FF69B4', '#4ADE80', '#FBBF24'];
        
        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'particle';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = (this.x + 50) + 'px';
            confetti.style.top = (this.y + 50) + 'px';
            document.body.appendChild(confetti);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 5 + Math.random() * 6;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let px = this.x + 50;
            let py = this.y + 50;
            let pvy = vy;
            
            const animateConfetti = () => {
                px += vx;
                py += pvy;
                pvy += 0.5;
                
                confetti.style.left = px + 'px';
                confetti.style.top = py + 'px';
                confetti.style.opacity = Math.max(0, 1 - py / window.innerHeight);
                
                if (py < window.innerHeight) {
                    requestAnimationFrame(animateConfetti);
                } else {
                    confetti.remove();
                }
            };
            
            animateConfetti();
        }
    }
    
    applyPhysics() {
        if (this.isDragging) return;
        
        // Walking
        if (this.isWalking && this.isGrounded && !this.isTurning) {
            this.x += this.velocityX;
        }
        
        // Gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // Ground collision
        const ground = window.innerHeight - 170;
        if (this.y >= ground) {
            this.y = ground;
            this.velocityY = 0;
            
            // Landing sequence
            if (!this.isGrounded && this.isFalling) {
                console.log('💥 Landing!');
                this.isFalling = false;
                
                // Show landing animation
                this.setState('landing');
                this.container.className = 'sprite-container landing';
                this.createDust();
                
                // After landing animation (300ms), return to idle
                setTimeout(() => {
                    if (!this.isWalking && !this.isTurning && !this.isWorking && !this.isDancing) {
                        this.setState('idle');
                        this.container.className = 'sprite-container idle';
                        console.log('🧍 Landed - back to idle');
                    }
                }, 300);
            }
            
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
            
            // Start falling animation if not already falling and not jumping
            if (!this.isFalling && this.velocityY > 2 && this.currentState !== 'jumping') {
                this.isFalling = true;
                this.setState('falling');
                this.container.className = 'sprite-container';
                console.log('🪂 Started falling');
            }
        }
        
        // Walls
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
            this.stopWalkingSequence();
        }
        if (this.x > window.innerWidth - this.width) {
            this.x = window.innerWidth - this.width;
            this.velocityX = 0;
            this.stopWalkingSequence();
        }
        
        this.updatePosition();
    }
    
    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }
    
    listen(target, type, fn, opts) {
        target.addEventListener(type, fn, opts);
        this.cleanups.push(() => target.removeEventListener(type, fn, opts));
    }

    destroy() {
        this.destroyed = true;
        cancelAnimationFrame(this.rafId);
        this.intervals.forEach(clearInterval);
        this.timeouts.forEach(clearTimeout);
        [this.idleTimeout, this.tapTimeout, this.workTimeout,
         this.coffeeTimeout, this.reactionTimeout].forEach(clearTimeout);
        this.cleanups.forEach((fn) => fn());
        this.element?.remove();
    }

    startAnimation() {
        const animate = () => {
            if (this.destroyed) return;
            this.applyPhysics();
            this.rafId = requestAnimationFrame(animate);
        };
        animate();
    }
}