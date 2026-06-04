//ogolne reguly//
let hunger = 100;
let cleanliness = 100;
let sleep = 100;
let isAlive = true;
let isSleeping = false;
let shrimpName = "";

let hungerDelay = 0;
let cleanlinessDelay = 0;
let sleepDelay = 0;

const MAX_DELAY_TIME = 7;

//js->html//
const hungerBar = document.getElementById('hunger-bar');
const cleanBar = document.getElementById('clean-bar');
const sleepBar = document.getElementById('sleep-bar');
const shrimpWrapper = document.getElementById('shrimp-wrapper');
const shrimpSvg = document.getElementById('shrimp-svg');
const statusBubble = document.getElementById('status-bubble');
const restartButton = document.getElementById('restart-button');
const nightOverlay = document.getElementById('night-overlay');
const jedzenie = document.getElementById('item-food');
const gabka = document.getElementById('item-sponge');
const displayShrimpName = document.getElementById('display-shrimp-name');
const namingPanel = document.getElementById('naming-panel');
const gamePlayScreen = document.getElementById('game-play-screen');
const shrimpNameInput = document.getElementById('shrimp-name-input');
const lampImg = document.getElementById('lamp-img');

//LOCAL STORAGE//
function saveGameState() {
    const gameState = {
        shrimpName: shrimpName,
        hunger: hunger,
        cleanliness: cleanliness,
        sleep: sleep,
        isAlive: isAlive,
        isSleeping: isSleeping,
        hungerDelay: hungerDelay,
        cleanlinessDelay: cleanlinessDelay,
        sleepDelay: sleepDelay,
        lastSavedTime: Date.now()
    };
    localStorage.setItem('shrimpPetState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedData = localStorage.getItem('shrimpPetState');
    if (!savedData) {
        showNamingScreen();
        return;
    }

    const state = JSON.parse(savedData);
    shrimpName = state.shrimpName || "";
    
    if (!shrimpName) {
        showNamingScreen();
        return;
    }

    showGameScreen();
    displayShrimpName.innerText = shrimpName.toUpperCase();

    hunger = state.hunger;
    cleanliness = state.cleanliness;
    sleep = state.sleep;
    isAlive = state.isAlive;
    isSleeping = state.isSleeping;
    hungerDelay = state.hungerDelay || 0;
    cleanlinessDelay = state.cleanlinessDelay || 0;
    sleepDelay = state.sleepDelay || 0;

    if (isAlive) {
        const timePassedSeconds = Math.floor((Date.now() - state.lastSavedTime) / 1000);

        for (let i = 0; i < timePassedSeconds; i++) {
            if (isSleeping) {
                sleep = Math.min(100, sleep + 4);
                if (hungerDelay > 0) hungerDelay--;
                else hunger = Math.max(0, hunger - 0.5);

                if (cleanlinessDelay > 0) cleanlinessDelay--;
                else cleanliness = Math.max(0, cleanliness - 0.5);
            } else {
                if (hungerDelay > 0) hungerDelay--;
                else hunger = Math.max(0, hunger - 2);

                if (cleanlinessDelay > 0) cleanlinessDelay--;
                else cleanliness = Math.max(0, cleanliness - 1.5);

                if (sleepDelay > 0) sleepDelay--;
                else sleep = Math.max(0, sleep - 1);
            }

            if (hunger <= 0 || cleanliness <= 0 || sleep <= 0) {
                isAlive = false;
                isSleeping = false;
                break;
            }
        }
    }

    if (isSleeping) {
        lampImg.src = 'lampazgaszona.png';
        nightOverlay.style.opacity = '1';
        jedzenie.classList.add('disabled');
        gabka.classList.add('disabled');
    } else {
        lampImg.src = 'lampawlaczona.png';
        nightOverlay.style.opacity = '0';
        jedzenie.classList.remove('disabled');
        gabka.classList.remove('disabled');
    }

    updateUI();
    checkGameOver();
}

function showNamingScreen() {
    namingPanel.style.display = 'block';
    gamePlayScreen.style.display = 'none';
    displayShrimpName.innerText = "NOWA KREWETKA";
}

function showGameScreen() {
    namingPanel.style.display = 'none';
    gamePlayScreen.style.display = 'block';
}

function submitShrimpName() {
    const inputVal = shrimpNameInput.value.trim();
    if (inputVal === "") {
        alert("Wpisz jakieś imię!");
        return;
    }
    
    shrimpName = inputVal;
    displayShrimpName.innerText = shrimpName.toUpperCase();
    
    hunger = 100;
    cleanliness = 100;
    sleep = 100;
    isAlive = true;
    isSleeping = false;
    hungerDelay = 0;
    cleanlinessDelay = 0;
    sleepDelay = 0;
    
    lampImg.src = 'lampawlaczona.png';
    shrimpWrapper.style.left = '50%';
    
    showGameScreen();
    updateUI();
    saveGameState();
}

loadGameState();

//GAMEPLAY//
setInterval(() => {
    if (isAlive && shrimpName !== "") {
        if (isSleeping) {
            sleep = Math.min(100, sleep + 5);
            if (hungerDelay > 0) hungerDelay--;
            else hunger = Math.max(0, hunger - 0.5);

            if (cleanlinessDelay > 0) cleanlinessDelay--;
            else cleanliness = Math.max(0, cleanliness - 0.3);
        } else {
            if (hungerDelay > 0) hungerDelay--;
            else hunger = Math.max(0, hunger - 0.8);

            if (cleanlinessDelay > 0) cleanlinessDelay--;
            else cleanliness = Math.max(0, cleanliness - 0.6);

            if (sleepDelay > 0) sleepDelay--;
            else sleep = Math.max(0, sleep - 0.4);
        }
        updateUI();
        checkGameOver();
        saveGameState();
    }
}, 1100);

function updateUI() {
    if (!shrimpName) return;

    hungerBar.style.width = hunger + '%';
    cleanBar.style.width = cleanliness + '%';
    sleepBar.style.width = sleep + '%';

    setBarColor(hungerBar, hunger, hungerDelay);
    setBarColor(cleanBar, cleanliness, cleanlinessDelay);
    setBarColor(sleepBar, sleep, sleepDelay);

    if (!isAlive) return;

    if (isSleeping) {
        statusBubble.innerText = "(ᴗ˳ᴗ)ᶻ𝗓𐰁";
    } else if (hungerDelay > 0 && cleanlinessDelay > 0) {
        statusBubble.innerText = "(✧0✧)";
    } else if (hunger < 30) {
        statusBubble.innerText = "( ´ཀ` )";
    } else if (cleanliness < 30) {
        statusBubble.innerText = "(╥﹏╥)";
    } else if (sleep < 30) {
        statusBubble.innerText = "(⇀‸↼‶)";
    } else {
        statusBubble.innerText = "∘˙○˚.•";
    }
}

function setBarColor(bar, value, delay) {
    if (delay > 0) {
        bar.style.backgroundColor = '#d394e4'; 
    } else if (value < 30) {
        bar.style.backgroundColor = '#e4645a'; 
    } else if (value < 60) {
        bar.style.backgroundColor = '#fef286'; 
    } else {
        bar.style.backgroundColor = '#80e283'; 
    }
}

//DRAG AND DROP//
jedzenie.addEventListener('mousedown', (e) => startDrag(e, 'cukierek.png', 'food'));
gabka.addEventListener('mousedown', (e) => startDrag(e, 'gabka.png', 'sponge'));

function startDrag(e, imgSrc, type) {
    if (!isAlive || isSleeping || !shrimpName) return;
    
    e.preventDefault();
    const dragEl = document.createElement('img');
    dragEl.src = imgSrc;
    dragEl.style.position = 'fixed';
    dragEl.style.width = '50px';
    dragEl.style.height = '50px';
    dragEl.style.pointerEvents = 'none';
    dragEl.style.zIndex = '1000';
    dragEl.style.imageRendering = 'pixelated';
    document.body.appendChild(dragEl);

    dragEl.style.left = (e.clientX - 25) + 'px';
    dragEl.style.top = (e.clientY - 25) + 'px';

    let lastWashTime = 0;

    function onMouseMove(moveEvent) {
        dragEl.style.left = (moveEvent.clientX - 25) + 'px';
        dragEl.style.top = (moveEvent.clientY - 25) + 'px';

        if (type === 'sponge') {
            const elementAtPoint = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
            
            if (shrimpSvg.contains(elementAtPoint) || elementAtPoint === shrimpWrapper) {
                const now = Date.now();
                if (now - lastWashTime > 100) {
                    cleanliness = Math.min(100, cleanliness + 4);
                    if (cleanliness === 100) cleanlinessDelay = MAX_DELAY_TIME;
                    
                    statusBubble.innerText = "◝(ᵔᗜᵔ)◜";
                    updateUI();
                    saveGameState();
                    lastWashTime = now;
                }
            }
        }
    }

    function onMouseUp(upEvent) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        const elementAtPoint = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
        
        if (type === 'food') {
            if (shrimpSvg.contains(elementAtPoint) || elementAtPoint === shrimpWrapper) {
                hunger = Math.min(100, hunger + 25);
                if (hunger === 100) hungerDelay = MAX_DELAY_TIME;
                
                statusBubble.innerText = "(っ˘ڡ˘ς)";
                updateUI();
                saveGameState();
            }
        } 
        else if (type === 'sponge') {
            if (cleanliness >= 95) statusBubble.innerText = "(⁎⁍̴̛ ₃ ⁍̴̛⁎)!!";
            else statusBubble.innerText = "∘˙○˚.•";
            saveGameState();
        }

        dragEl.remove();
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

//SPANIE//
function toggleSleep() {
    if (!isAlive || !shrimpName) return;

    isSleeping = !isSleeping;

    if (isSleeping) {
        lampImg.src = 'lampazgaszona.png';
        nightOverlay.style.opacity = '1';
        jedzenie.classList.add('disabled');
        gabka.classList.add('disabled');
    } else {
        lampImg.src = 'lampawlaczona.png';
        nightOverlay.style.opacity = '0';
        jedzenie.classList.remove('disabled');
        gabka.classList.remove('disabled');
        
        if (sleep === 100) sleepDelay = MAX_DELAY_TIME;
    }
    updateUI();
    saveGameState();
}

//GAME OVER//
function checkGameOver() {
    if (hunger <= 0 || cleanliness <= 0 || sleep <= 0) {
        isAlive = false;
        isSleeping = false;
        nightOverlay.style.opacity = '0';
        
        shrimpWrapper.classList.add('shrimp-dead-animation');
        statusBubble.innerText = "✖𐃷✖";
        restartButton.style.display = 'block';

        jedzenie.classList.add('disabled');
        gabka.classList.add('disabled');
        document.getElementById('item-sleep').classList.add('disabled');
        saveGameState();
    }
}

//RESTART//
function restartGame() {
    shrimpName = "";
    shrimpNameInput.value = "";
    
    shrimpWrapper.classList.remove('shrimp-dead-animation');
    shrimpWrapper.style.left = '50%';
    restartButton.style.display = 'none';

    lampImg.src = 'lampawlaczona.png';
    nightOverlay.style.opacity = '0';

    jedzenie.classList.remove('disabled');
    gabka.classList.remove('disabled');
    document.getElementById('item-sleep').classList.remove('disabled');
    
    showNamingScreen();
    saveGameState();
}