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

// --- Responsive fit: scale the whole card to fit small screens (phones).
// Desktop and iPad are wide/tall enough that scale stays 1 (no change). ---
function fitToViewport() {
    const pad = 24;
    const scale = Math.min(1, (window.innerWidth - pad) / 580, (window.innerHeight - pad) / 480);
    document.documentElement.style.setProperty('--app-scale', scale.toFixed(4));
}
window.addEventListener('resize', fitToViewport);
fitToViewport();

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
let anniversaryDate = '';
function prettyDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months[m - 1] + ' ' + d + ', ' + y;
}

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

// Typewriter: reveal text into an element one character at a time.
function typeInto(el, text, speed) {
    return new Promise(resolve => {
        el.textContent = '';
        let i = 0;
        (function tick() {
            el.textContent = text.slice(0, i);
            if (i++ <= text.length) setTimeout(tick, speed);
            else resolve();
        })();
    });
}

// Shared coffee-bar renderer: Miffbucks logo on the counter + standing Miffy +
// a speech bubble whose dialogue types out, then the continue button appears.
function barScene(line1, line2, btnLabel, next) {
    const sub = line2 ? '<p class="sb-2"></p>' : '';
    container.innerHTML = `
        <img src="assets/miffy_starbucks.png" alt="Starbucks Miffy" class="miffy-at-bar">
        <div class="bar-counter"></div>
        <img src="assets/miffbucks_logo.svg" alt="Miffbucks" class="bar-sign">
        <div class="speech-bubble fade-in">
            <p class="sb-1"></p>
            ${sub}
        </div>
        <button id="continueBtn2" class="bar-btn" style="visibility: hidden;">${btnLabel}</button>
    `;
    const btn = document.getElementById('continueBtn2');
    btn.addEventListener('click', next);
    const sb1 = container.querySelector('.sb-1');
    const sb2 = container.querySelector('.sb-2');
    (async () => {
        await typeInto(sb1, line1, 40);
        if (sb2 && line2) await typeInto(sb2, line2, 28);
        btn.style.visibility = 'visible';
        btn.classList.add('fade-in');
    })();
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
        "Are you here to pick up Jho's americano? ☕",
        '',
        'yep!',
        ch2_game
    );
}

// === Mini-game: Make Jho's Americano (full barista flow) ===
function ch2_game() { gameWeigh(); }

// Prep 1: weigh the beans - hold to pour, stop in the green zone.
function gameWeigh() {
    container.innerHTML = `
        <div class="game-stage">
            <div class="prep-visual">
                <div class="readout" id="gramReadout">0 g</div>
                <div class="gauge"><div class="gauge-zone" style="left:56.6%;width:10%;"></div><div class="gauge-fill" id="weighFill"></div></div>
            </div>
            <div class="content" style="opacity:1;">
                <h1 id="gameMsg" style="font-size:19px;">Hold to pour the beans, stop in the green</h1>
                <button id="gameBtn">hold to pour</button>
            </div>
        </div>
    `;
    const msg = document.getElementById('gameMsg'), btn = document.getElementById('gameBtn');
    const fill = document.getElementById('weighFill'), read = document.getElementById('gramReadout');
    const LO = 17, HI = 20, MAX = 30;
    let grams = 0, timer = null, solved = false;
    const visual = container.querySelector('.prep-visual');
    const dropBean = () => { const bn = document.createElement('div'); bn.className = 'bean'; bn.style.left = (44 + Math.random() * 12) + '%'; visual.appendChild(bn); setTimeout(() => bn.remove(), 650); };
    const render = () => { fill.style.width = Math.min(grams / MAX * 100, 100) + '%'; read.textContent = Math.round(grams) + ' g'; };
    const start = () => { if (timer || solved) return; timer = setInterval(() => { grams = Math.min(grams + 1.1, MAX); render(); dropBean(); }, 55); };
    const stop = () => { if (!timer) return; clearInterval(timer); timer = null; check(); };
    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); if (solved) { gameGrind(); return; } start(); });
    btn.addEventListener('pointerup', () => { if (!solved) stop(); });
    btn.addEventListener('pointerleave', () => { if (!solved) stop(); });
    function check() {
        if (grams >= LO && grams <= HI) { solved = true; msg.textContent = 'Perfect, ' + Math.round(grams) + 'g of beans'; btn.textContent = 'grind them \u2192'; }
        else if (grams > HI) { msg.textContent = 'Too much! tipping some out...'; setTimeout(() => { grams = 0; render(); msg.textContent = 'Try again, stop in the green'; }, 700); }
        else { msg.textContent = 'A little more, keep pouring'; }
    }
}

// Prep 2: grind - hold to fill the grind meter.
function gameGrind() {
    container.innerHTML = `
        <div class="game-stage">
            <div class="prep-visual">
                <div class="grinder">
                    <div class="grinder-hopper"></div>
                    <div class="grinder-body"></div>
                    <div class="grinder-chute"></div>
                </div>
                <div class="gauge"><div class="gauge-fill" id="grindFill"></div></div>
            </div>
            <div class="content" style="opacity:1;">
                <h1 id="gameMsg" style="font-size:19px;">Hold to grind the beans</h1>
                <button id="gameBtn">hold to grind</button>
            </div>
        </div>
    `;
    const stage = container.querySelector('.game-stage');
    const msg = document.getElementById('gameMsg'), btn = document.getElementById('gameBtn');
    const fill = document.getElementById('grindFill');
    let pct = 0, timer = null, solved = false;
    const grinderEl = container.querySelector('.grinder');
    const dropGround = () => { const g = document.createElement('div'); g.className = 'ground'; g.style.left = (45 + Math.random() * 10) + '%'; grinderEl.appendChild(g); setTimeout(() => g.remove(), 550); };
    const render = () => { fill.style.width = pct + '%'; };
    const start = () => {
        if (timer || solved) return;
        stage.classList.add('grinding');
        timer = setInterval(() => { pct = Math.min(pct + 3, 100); render(); dropGround(); if (pct >= 100) { clearInterval(timer); timer = null; stage.classList.remove('grinding'); done(); } }, 50);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; stage.classList.remove('grinding'); } };
    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); if (solved) { gameTamp(); return; } start(); });
    btn.addEventListener('pointerup', () => { if (!solved) stop(); });
    btn.addEventListener('pointerleave', () => { if (!solved) stop(); });
    function done() { solved = true; msg.textContent = 'Ground to perfection'; btn.textContent = 'tamp it \u2192'; }
}

// Prep 3: tamp - one satisfying press.
function gameTamp() {
    container.innerHTML = `
        <div class="game-stage">
            <div class="prep-visual">
                <div class="tamper" id="tamper"><div class="tamper-handle"></div><div class="tamper-base"></div></div>
                <div class="portafilter"><div class="pf-basket"><div class="grounds"></div></div><div class="pf-handle"></div></div>
            </div>
            <div class="content" style="opacity:1;">
                <h1 id="gameMsg" style="font-size:19px;">Drag the tamper down onto the grounds</h1>
                <button id="gameBtn" style="display:none;">now brew it \u2192</button>
            </div>
        </div>
    `;
    const msg = document.getElementById('gameMsg'), btn = document.getElementById('gameBtn');
    const tamper = document.getElementById('tamper');
    const REST = -30, CONTACT = 30;
    let dragging = false, startY = 0, ty = REST, tamped = false;
    const scaleOf = () => container.getBoundingClientRect().width / container.offsetWidth;
    const setY = (v) => { ty = Math.max(REST, Math.min(v, CONTACT)); tamper.style.transform = 'translateY(' + ty + 'px)'; };
    tamper.style.touchAction = 'none'; tamper.style.cursor = 'grab';
    tamper.addEventListener('pointerdown', (e) => { if (tamped) return; e.preventDefault(); dragging = true; tamper.setPointerCapture(e.pointerId); startY = e.clientY; tamper.style.cursor = 'grabbing'; });
    tamper.addEventListener('pointermove', (e) => { if (!dragging) return; setY(REST + (e.clientY - startY) / scaleOf()); });
    const end = () => {
        if (!dragging) return; dragging = false; tamper.style.cursor = 'grab';
        if (ty >= CONTACT - 4) { tamped = true; setY(CONTACT); msg.textContent = 'Perfectly tamped'; btn.style.display = 'inline-block'; btn.onclick = () => gameBrew(); }
        else { setY(REST); }
    };
    tamper.addEventListener('pointerup', end);
    tamper.addEventListener('pointercancel', end);
}

// Brew: place the cup under the machine, pour, foam (continues to ch2_scene4).
function gameBrew() {
    container.innerHTML = `
        <div class="game-stage">
            <div class="machine"><div class="machine-spout"></div></div>
            <div class="pour-stream"></div>
            <div class="dropzone" id="dropzone"></div>
            <div class="game-cup" id="gameCup">
                <div class="cup-shell"><div class="coffee-fill" id="coffeeFill"></div></div>
                <div class="game-sleeve"><img src="assets/miffbucks_logo.svg" alt="" class="game-logo"></div>
            </div>
            <div class="content" style="opacity:1;">
                <h1 id="gameMsg" style="font-size:19px;">Drag the cup under the machine ☕</h1>
                <button id="gameBtn" style="display:none;"></button>
            </div>
        </div>
    `;
    const stage = container.querySelector('.game-stage');
    const cup = document.getElementById('gameCup');
    const drop = document.getElementById('dropzone');
    const msg = document.getElementById('gameMsg');
    const btn = document.getElementById('gameBtn');
    const fill = document.getElementById('coffeeFill');
    let dragging = false, offX = 0, offY = 0, placed = false;
    let pullPerfect = false, waterPerfect = false;
    const scaleOf = () => container.getBoundingClientRect().width / container.offsetWidth;

    cup.addEventListener('pointerdown', (e) => {
        if (placed) return;
        dragging = true; cup.setPointerCapture(e.pointerId);
        const s = scaleOf(), r = cup.getBoundingClientRect();
        offX = (e.clientX - r.left) / s; offY = (e.clientY - r.top) / s;
        cup.style.cursor = 'grabbing';
    });
    cup.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const s = scaleOf(), cr = container.getBoundingClientRect();
        let x = (e.clientX - cr.left) / s - offX;
        let y = (e.clientY - cr.top) / s - offY;
        x = Math.max(0, Math.min(x, container.offsetWidth - cup.offsetWidth));
        y = Math.max(0, Math.min(y, container.offsetHeight - cup.offsetHeight));
        cup.style.left = x + 'px'; cup.style.top = y + 'px';
    });
    const endDrag = () => {
        if (!dragging) return; dragging = false; cup.style.cursor = 'grab';
        const cupR = cup.getBoundingClientRect(), dz = drop.getBoundingClientRect();
        const cx = cupR.left + cupR.width / 2, cy = cupR.top + cupR.height / 2;
        if (cx > dz.left - 40 && cx < dz.right + 40 && cy > dz.top - 40 && cy < dz.bottom + 50) {
            placed = true;
            const s = scaleOf(), cr = container.getBoundingClientRect();
            cup.style.left = ((dz.left - cr.left) / s + (drop.offsetWidth - cup.offsetWidth) / 2) + 'px';
            cup.style.top  = ((dz.top  - cr.top)  / s + (drop.offsetHeight - cup.offsetHeight) / 2) + 'px';
            cup.style.cursor = 'default';
            drop.style.display = 'none';
            startPull();
        }
    };
    cup.addEventListener('pointerup', endDrag);
    cup.addEventListener('pointercancel', endDrag);

    function freshBtn() {
        const o = document.getElementById('gameBtn');
        const n = o.cloneNode(false); n.id = 'gameBtn'; o.replaceWith(n); return n;
    }
    // Brew 1: pull the shot - tap to stop the sweeping marker in the green window.
    function startPull() {
        msg.textContent = 'Pull the shot, tap to stop in the green';
        const sbtn = freshBtn(); sbtn.textContent = 'stop'; sbtn.style.display = 'inline-block';
        const bar = document.createElement('div'); bar.className = 'shot-bar';
        bar.innerHTML = '<div class="shot-zone"></div><div class="shot-marker" id="shotMarker"></div>';
        stage.appendChild(bar);
        const marker = document.getElementById('shotMarker');
        let pos = 0, dir = 1, raf = null, stopped = false;
        const tick = () => { pos += dir * 1.7; if (pos >= 100) { pos = 100; dir = -1; } else if (pos <= 0) { pos = 0; dir = 1; } marker.style.left = pos + '%'; raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
        sbtn.onclick = () => {
            if (stopped) return; stopped = true; cancelAnimationFrame(raf);
            sbtn.style.display = 'none';
            pullPerfect = pos >= 40 && pos <= 60;
            stage.classList.add('pouring');
            fill.style.transition = 'height 1.2s ease';
            fill.style.height = '34%';
            setTimeout(() => { stage.classList.remove('pouring'); bar.remove(); msg.textContent = pullPerfect ? 'Perfect shot, rich crema' : 'Good shot, in she goes'; addWater(); }, 1300);
        };
    }
    // Brew 2: add hot water - hold to pour, stop at the fill line (americano).
    function addWater() {
        msg.textContent = 'Top it with hot water, stop at the line';
        const wbtn = freshBtn(); wbtn.textContent = 'hold to pour water'; wbtn.style.display = 'inline-block';
        const shell = cup.querySelector('.cup-shell');
        const line = document.createElement('div'); line.className = 'fill-line'; shell.appendChild(line);
        const water = document.createElement('div'); water.className = 'water-fill'; shell.appendChild(water);
        const stream = container.querySelector('.pour-stream'); if (stream) stream.style.background = '#5aa7e0';
        let h = 34, timer = null, done = false;
        const startW = () => { if (timer || done) return; stage.classList.add('pouring'); timer = setInterval(() => { h = Math.min(h + 1.4, 100); water.style.height = (h - 34) + '%'; }, 50); };
        const stopW = () => { if (!timer) return; clearInterval(timer); timer = null; stage.classList.remove('pouring'); check(); };
        wbtn.addEventListener('pointerdown', (e) => { e.preventDefault(); if (done) return; startW(); });
        wbtn.addEventListener('pointerup', () => { if (!done) stopW(); });
        wbtn.addEventListener('pointerleave', () => { if (!done) stopW(); });
        function check() {
            if (h >= 66) { done = true; waterPerfect = (h >= 68 && h <= 80); line.style.display = 'none'; msg.textContent = (h > 84 ? 'A touch over, still perfect for her' : 'Right at the line'); setTimeout(addFoam, 800); }
            else { msg.textContent = 'A little more water'; }
        }
    }
    // Brew 3: foam art, then hand it over.
    // Finish: show the graded drink, then hand it over (no foam step).
    function addFoam() {
        const stars = 3 + (pullPerfect ? 1 : 0) + (waterPerfect ? 1 : 0);
        const rating = '\u2605'.repeat(stars) + '\u2606'.repeat(5 - stars);
        msg.innerHTML = `One americano for Jho!<br><span class="quality">${rating}</span>`;
        const fbtn = freshBtn(); fbtn.textContent = 'Hand it over \u2192'; fbtn.style.display = 'inline-block';
        fbtn.onclick = () => ch2_scene4();
    }
}

// Scene: the cup is handed forward, "4 beby" on the green sleeve.
function ch2_scene4() {
    container.innerHTML = `
        <div class="handcup">
            <span class="sleeve-text">4 beby</span>
            <span class="steam s1"></span><span class="steam s2"></span><span class="steam s3"></span>
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
            <span class="steam s1"></span><span class="steam s2"></span><span class="steam s3"></span>
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
        noBtn2.style.left = Math.min(containerRect.right + 20, window.innerWidth - rect.width - 8) + 'px';
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
    document.getElementById('nextBtn2').addEventListener('click', ch2_datePicker);
}

// Anniversary date picker - lock in the date now (the in-person ask comes later).
function ch2_datePicker() {
    container.innerHTML = `
        <img src="assets/miffy_starbucks.png" alt="Starbucks Miffy" class="miffy-img">
        <div class="content fade-in">
            <h1 style="font-size: 22px;">Let's lock in our anniversary</h1>
            <input type="date" id="annDate" class="date-input">
            <button id="annBtn">lock it in</button>
        </div>
    `;
    const input = document.getElementById('annDate');
    const btn = document.getElementById('annBtn');
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    input.value = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
    anniversaryDate = input.value;
    input.addEventListener('change', () => { anniversaryDate = input.value; });
    btn.addEventListener('click', ch2_driveOffToJho);
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
        const annLine = anniversaryDate
            ? `<p style="font-size: 16px; margin-bottom: 14px;">Anniversary locked in: ${prettyDate(anniversaryDate)}</p>`
            : '';
        container.innerHTML = `
            <div class="content fade-in" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 1; text-align: center; width: auto;">
                ${annLine}
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
