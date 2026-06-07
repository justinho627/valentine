function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '♥';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
}

for (let i = 0; i < 15; i++) {
    createHeart();
}
let heartInterval = setInterval(createHeart, 800);

// Wait for drive-in animation to complete, then show main content
setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
}, 5500);

const container = document.querySelector('.container');
let noBtn;

document.getElementById('continueBtn').addEventListener('click', () => {
    container.innerHTML = `
        <img src="assets/miffy_new.png" alt="Miffy" class="miffy-img">
        <div class="content fade-in">
            <h1>Will you be his Valentine?</h1>
            <div class="buttons">
                <button id="yesBtn">Yes</button>
                <button id="noBtn">No</button>
            </div>
        </div>
    `;
    
    const yesBtn = document.getElementById('yesBtn');
    noBtn = document.getElementById('noBtn');
    
    // Get button position before moving it
    const rect = noBtn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Position it to the right of the container
    noBtn.style.position = 'fixed';
    noBtn.style.left = (containerRect.right + 20) + 'px';
    noBtn.style.top = (containerRect.top + containerRect.height / 2 - rect.height / 2) + 'px';
    noBtn.style.margin = '0';
    document.body.appendChild(noBtn);
    
    // Add click handler to move button away
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const btnRect = noBtn.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        
        // Check if near edge
        const edgeMargin = 100;
        const nearEdge = btnRect.left < edgeMargin || btnRect.right > window.innerWidth - edgeMargin || 
                        btnRect.top < edgeMargin || btnRect.bottom > window.innerHeight - edgeMargin;
        
        let newX, newY;
        if (nearEdge) {
            // Move toward center
            const toCenterX = centerX - btnCenterX;
            const toCenterY = centerY - btnCenterY;
            const angle = Math.atan2(toCenterY, toCenterX);
            
            newX = btnCenterX + Math.cos(angle) * 200 - btnRect.width / 2;
            newY = btnCenterY + Math.sin(angle) * 200 - btnRect.height / 2;
        } else {
            // Move away in random direction
            const angle = Math.random() * Math.PI * 2;
            newX = btnCenterX + Math.cos(angle) * 200 - btnRect.width / 2;
            newY = btnCenterY + Math.sin(angle) * 200 - btnRect.height / 2;
        }
        
        // Clamp to bounds
        const margin = 20;
        newX = Math.max(margin, Math.min(newX, window.innerWidth - btnRect.width - margin));
        newY = Math.max(margin, Math.min(newY, window.innerHeight - btnRect.height - margin));
        
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';
    });
    
    yesBtn.addEventListener('click', () => {
        container.innerHTML = `
            <img src="assets/miffy_new.png" alt="Miffy" class="miffy-img">
            <div class="content fade-in">
                <h1>Yay!</h1>
                <p style="font-size: 24px;">Miffers knew you'd say yes!</p>
                <button id="nextBtn">click me</button>
            </div>
        `;
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            container.innerHTML = `
                <div class="car-container drive-away">
                    <img src="assets/miffy_new.png" alt="Miffy" class="miffy-in-car">
                    <img src="assets/car.png" alt="Car" class="car-img">
                </div>
                <div class="content fade-in">
                    <h1>Let me go tell Jho!</h1>
                </div>
            `;
            
            // Fade out after the car drives off
            setTimeout(() => {
                container.style.opacity = '0';
                container.style.transition = 'opacity 1s';
            }, 5000);

            // Chapter 1 complete -> continue into Chapter 2 (Starbucks)
            setTimeout(() => {
                startChapter2();
            }, 6000);
        });
    });
    
    document.addEventListener('mousemove', handleMouseMove);
});

function handleMouseMove(e) {
    if (!noBtn) return;
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const distance = Math.sqrt(Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2));
    
    if (distance < 150) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Check if near edge
        const margin = 100;
        const nearEdge = rect.left < margin || rect.right > window.innerWidth - margin || 
                        rect.top < margin || rect.bottom > window.innerHeight - margin;
        
        let newX, newY;
        if (nearEdge) {
            // Move toward center
            const toCenterX = centerX - btnCenterX;
            const toCenterY = centerY - btnCenterY;
            const angle = Math.atan2(toCenterY, toCenterX);
            
            newX = btnCenterX + Math.cos(angle) * 300 - rect.width / 2;
            newY = btnCenterY + Math.sin(angle) * 300 - rect.height / 2;
        } else {
            // Move away from cursor
            const deltaX = btnCenterX - e.clientX;
            const deltaY = btnCenterY - e.clientY;
            const angle = Math.atan2(deltaY, deltaX);
            
            newX = btnCenterX + Math.cos(angle) * 300 - rect.width / 2;
            newY = btnCenterY + Math.sin(angle) * 300 - rect.height / 2;
        }
        
        // Clamp to screen bounds
        const clampMargin = 20;
        newX = Math.max(clampMargin, Math.min(newX, window.innerWidth - rect.width - clampMargin));
        newY = Math.max(clampMargin, Math.min(newY, window.innerHeight - rect.height - clampMargin));
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';
        noBtn.style.zIndex = '100';
    }
}


/* ============================================================
   CHAPTER 2 - STARBUCKS  ("Can I be your boyfriend?")
   Begins after the Valentine "Let me go tell Jho!" car drive-off.
   Mirrors the Chapter 1 scene style: each scene swaps the
   container's innerHTML and wires up the next button.
   ============================================================ */

// Floating coffee-cup motif (Chapter 2 counterpart to createHeart)
function createCoffee() {
    const cup = document.createElement('div');
    cup.className = 'coffee';
    cup.style.left = Math.random() * 100 + '%';
    cup.style.animationDuration = (Math.random() * 3 + 4) + 's';
    cup.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(cup);
    setTimeout(() => cup.remove(), 8000);
}

let coffeeInterval;

// Entry point: stop the hearts, switch to the green Starbucks theme,
// start the floating cups, and play the opening scene.
function startChapter2() {
    clearInterval(heartInterval);

    // clean up any leftover Chapter 1 runaway button + its mouse handler
    document.removeEventListener('mousemove', handleMouseMove);
    if (noBtn) { noBtn.remove(); noBtn = null; }

    document.body.classList.add('ch2');
    container.classList.add('chapter2');

    for (let i = 0; i < 10; i++) createCoffee();
    coffeeInterval = setInterval(createCoffee, 800);

    container.style.opacity = '1';
    ch2_scene1();
}

// Scene 1: time-skip - Starbucks Miffy drives back in (full-size car, matches Chapter 1).
function ch2_scene1() {
    container.innerHTML = `
        <div class="car-container drive-in">
            <img src="assets/miffy_starbucks.png" alt="Starbucks Miffy" class="miffy-in-car">
            <img src="assets/car.png" alt="Car" class="car-img">
        </div>
        <div class="content" style="animation: fadeIn 0.5s ease-in 3s forwards;">
            <h1>A little while later... &#9749;</h1>
        </div>
    `;
    // Auto-advance once the drive-in + text have played (no button -> no overlap, matches Ch1).
    setTimeout(ch2_driveToBar, 5000);
}

// Transition: the car drives off, leaving Miffy at the Miffbucks counter.
function ch2_driveToBar() {
    container.innerHTML = `
        <div class="car-container drive-off-ch2">
            <img src="assets/miffy_starbucks.png" alt="Starbucks Miffy" class="miffy-in-car">
            <img src="assets/car.png" alt="Car" class="car-img">
        </div>
    `;
    setTimeout(ch2_bar1, 1700);
}

// Shared coffee-bar renderer: Miffbucks logo on the counter + standing Miffy +
// a speech bubble of dialogue + a continue button. line2 is optional.
function barScene(line1, line2, btnLabel, next) {
    const sub = line2 ? `<p class="sb-2">${line2}</p>` : '';
    container.innerHTML = `
        <img src="assets/miffy_starbucks.png" alt="Starbucks Miffy" class="miffy-at-bar">
        <div class="bar-counter"></div>
        <img src="assets/miffbucks_logo.svg" alt="Miffbucks" class="bar-sign">
        <div class="speech-bubble fade-in">
            <p class="sb-1">${line1}</p>
            ${sub}
        </div>
        <button id="continueBtn2" class="bar-btn fade-in">${btnLabel}</button>
    `;
    document.getElementById('continueBtn2').addEventListener('click', next);
}

// Bar dialogue 1.
function ch2_bar1() {
    barScene(
        'Hi Khuuchie!',
        'Miffers been pulling shifts here... cause our family eat so much',
        'aww, poor miffers',
        ch2_bar2
    );
}

// Bar dialogue 2.
function ch2_bar2() {
    barScene(
        "Are you here to pick up Jho's americano? &#9749;",
        '',
        'yep!',
        ch2_scene4
    );
}

// Scene: the cup is handed forward, "4 beby" on the green sleeve.
function ch2_scene4() {
    container.innerHTML = `
        <div class="handcup">
            <span class="sleeve-text">4 beby</span>
        </div>
        <div class="content fade-in">
            <h1>...there's something written on the back</h1>
            <button id="nextBtn2">read it</button>
        </div>
    `;
    document.getElementById('nextBtn2').addEventListener('click', ch2_question);
}

// Final scene: the cup flips + zooms to reveal the question, then Yes / dodging-No.
let noBtn2;
function ch2_question() {
    container.innerHTML = `
        <div class="flip-wrap">
            <div class="flip-cup">
                <div class="cup-face cup-front"><span class="sleeve-text">4 beby</span></div>
                <div class="cup-face cup-back"><span class="cup-q">Can I be<br>ur bf?</span></div>
            </div>
        </div>
        <div class="content qbtns"></div>
    `;
    // Reveal the buttons once the flip lands.
    setTimeout(() => {
        const c = container.querySelector('.qbtns');
        c.innerHTML = `
            <div class="buttons">
                <button id="yesBtn2">Yes</button>
                <button id="noBtn2">No</button>
            </div>
        `;
        c.classList.add('fade-in');

        const yesBtn = document.getElementById('yesBtn2');
        noBtn2 = document.getElementById('noBtn2');

        const containerRect = container.getBoundingClientRect();
        const rect = noBtn2.getBoundingClientRect();
        noBtn2.style.position = 'fixed';
        noBtn2.style.left = (containerRect.right + 20) + 'px';
        noBtn2.style.top = (containerRect.top + containerRect.height / 2 - rect.height / 2) + 'px';
        noBtn2.style.margin = '0';
        document.body.appendChild(noBtn2);

        noBtn2.addEventListener('click', (e) => { e.preventDefault(); dodge(noBtn2, 200); });
        yesBtn.addEventListener('click', ch2_celebrate);
        document.addEventListener('mousemove', handleMouseMove2);
    }, 1500);
}

// A burst of confetti + rising hearts and cups for the big moment.
function launchCelebration() {
    for (let i = 0; i < 18; i++) createCoffee();
    for (let i = 0; i < 12; i++) createHeart();
    const colors = ['#00704A', '#1E3932', '#f4efe1', '#ffd166', '#ff69b4'];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + '%';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
        c.style.animationDelay = (Math.random() * 0.6) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 5200);
    }
}

// Celebration: she said yes!
function ch2_celebrate() {
    document.removeEventListener('mousemove', handleMouseMove2);
    if (noBtn2) { noBtn2.remove(); noBtn2 = null; }

    launchCelebration();

    container.innerHTML = `
        <img src="assets/miffy_starbucks.png" alt="Starbucks Miffy" class="miffy-img joy">
        <div class="content fade-in">
            <h1>YAY!!</h1>
            <p style="font-size: 22px;">He's officially urs</p>
            <button id="nextBtn2">click me</button>
        </div>
    `;
    document.getElementById('nextBtn2').addEventListener('click', ch2_driveOffToJho);
}

// Miffy drives off again - this time to go tell Jho the good news.
function ch2_driveOffToJho() {
    container.style.opacity = '1';
    container.innerHTML = `
        <div class="car-container drive-off-jho">
            <img src="assets/miffy_starbucks.png" alt="Starbucks Miffy" class="miffy-in-car">
            <img src="assets/car.png" alt="Car" class="car-img">
        </div>
        <div class="content fade-in">
            <h1>Let me go tell Jho!!</h1>
        </div>
    `;
    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transition = 'opacity 1s';
    }, 4200);
    setTimeout(() => {
        container.innerHTML = `
            <div class="content fade-in" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 1; text-align: center; width: auto;">
                <button id="restartBtn2">start over</button>
                <p style="font-size: 14px; margin-top: 14px;">dw your in-person proposal is coming</p>
            </div>
        `;
        container.style.opacity = '1';
        document.getElementById('restartBtn2').addEventListener('click', () => location.reload());
    }, 5200);
}

// Shared helper: move a button away from its current spot toward open space.
function dodge(btn, dist) {
    const btnRect = btn.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const edgeMargin = 100;
    const nearEdge = btnRect.left < edgeMargin || btnRect.right > window.innerWidth - edgeMargin ||
                     btnRect.top < edgeMargin || btnRect.bottom > window.innerHeight - edgeMargin;

    let newX, newY;
    if (nearEdge) {
        const angle = Math.atan2(centerY - btnCenterY, centerX - btnCenterX);
        newX = btnCenterX + Math.cos(angle) * dist - btnRect.width / 2;
        newY = btnCenterY + Math.sin(angle) * dist - btnRect.height / 2;
    } else {
        const angle = Math.random() * Math.PI * 2;
        newX = btnCenterX + Math.cos(angle) * dist - btnRect.width / 2;
        newY = btnCenterY + Math.sin(angle) * dist - btnRect.height / 2;
    }

    const margin = 20;
    newX = Math.max(margin, Math.min(newX, window.innerWidth - btnRect.width - margin));
    newY = Math.max(margin, Math.min(newY, window.innerHeight - btnRect.height - margin));

    btn.style.position = 'fixed';
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
    btn.style.zIndex = '100';
}

// Chapter 2 cursor-evasion for the "No" button.
function handleMouseMove2(e) {
    if (!noBtn2) return;
    const rect = noBtn2.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const distance = Math.sqrt(Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2));
    if (distance < 150) {
        dodge(noBtn2, 300);
    }
}
