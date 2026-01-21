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
setInterval(createHeart, 800);

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
            
            // Fade out and show restart after car drives off
            setTimeout(() => {
                container.style.opacity = '0';
                container.style.transition = 'opacity 1s';
            }, 5000);
            
            setTimeout(() => {
                container.innerHTML = `
                    <div class="content fade-in" style="position: absolute; top: calc(50% + 40px); left: 50%; transform: translate(-50%, -50%); opacity: 1; text-align: center; width: auto;">
                        <button id="restartBtn">Restart</button>
                        <p style="font-size: 14px; margin-top: 10px;">(hundred cookies if you can click "no")</p>
                    </div>
                `;
                container.style.opacity = '1';
                
                document.getElementById('restartBtn').addEventListener('click', () => {
                    location.reload();
                });
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
