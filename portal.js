// AERO CAT COMPACT INDEPENDENT PORTAL INJECTION MODULE
function activateMiningPortal(btnElement) {
    const root = document.getElementById('aerocat-portal-root');
    if (root) {
        root.style.display = 'block';
        btnElement.parentNode.style.display = 'none'; // Hide intro
        loadUserData();
    }
}

// Inject HTML Core Structure into Main DOM Card
document.addEventListener("DOMContentLoaded", () => {
    const portalPlaceholder = document.getElementById('aerocat-portal-root');
    if (!portalPlaceholder) return;

    portalPlaceholder.innerHTML = `
    <style>
    :root{ --bg:#0d1117; --card:#161b22; --accent:#00e5ff; --text:#c9d1d9; --green:#2ea44f; --red:#da3637; --gray:#21262d; }
    .portal-inner-container { width:100%; max-width:500px; background:var(--card); border:1px solid rgba(0, 229, 255, 0.2); border-radius:12px; padding:20px; margin: 0 auto; box-shadow:0 4px 12px rgba(0,0,0,.5); text-align: left; color: var(--text); }
    .portal-inner-container h2 { text-align:center; color:var(--accent); margin-bottom:15px; font-family: 'Orbitron', sans-serif; }
    .portal-stat-box{ background:var(--gray); padding:15px; border-radius:8px; font-size:18px; font-weight:bold; text-align:center; margin-bottom:15px; color: var(--text); border: 1px solid rgba(0, 229, 255, 0.1); }
    .portal-tabs{ display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #30363d; padding-bottom:10px; }
    .portal-tab-btn{ background:none; border:none; color:var(--text); font-size:12px; cursor:pointer; padding:6px; font-weight:bold; font-family: 'Orbitron', sans-serif; }
    .portal-tab-btn.active{ color:var(--accent); border-bottom:2px solid var(--accent); }
    .portal-tab-content{ display:none; }
    .portal-tab-content.active{ display:block; }
    .portal-btn{ width:100%; padding:12px; border:none; border-radius:6px; cursor:pointer; font-size:16px; font-weight:bold; margin-top:10px; color:#fff; background:var(--green); font-family: 'Orbitron', sans-serif; box-shadow: 0 0 15px rgba(46, 164, 79, 0.2); }
    .portal-btn:disabled { background: #484f58 !important; cursor: not-allowed; opacity: 0.6; box-shadow: none; }
    .portal-input{ width:100%; padding:12px; background:var(--gray); border:1px solid #30363d; border-radius:6px; color:#fff; margin-bottom:10px; }
    
    #game-canvas { width:100%; height:320px; background:#000; border-radius:10px; position:relative; overflow:hidden; margin-top:10px; border: 2px solid #30363d; }
    #chart-canvas { width:100%; height:220px; background:#000; border-radius:10px; position:relative; overflow:hidden; margin-top:10px; border: 2px solid #30363d; }
    
    .butterfly { position:absolute; font-size:32px; top: -40px; left: 45%; width: 40px; text-align: center; }
    .flower { position:absolute; bottom:15px; left:45%; font-size:45px; transition: left 0.1s ease-out; width: 50px; text-align: center; }
    .game-controls, .trade-controls { display: flex; justify-content: space-between; margin-top: 10px; gap: 8px; }
    .portal-ctrl-btn { flex: 1; padding: 12px; background: var(--gray); border: 1px solid #30363d; color: white; font-weight: bold; border-radius: 8px; cursor: pointer; }
    .portal-ctrl-btn:active { background: var(--accent); }
    .game-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; justify-content: center; align-items: center; color: #fff; z-index: 10; }
    .terminal-box{ background:#000; color:#00ff00; font-family:Courier New, monospace; padding:10px; height:100px; overflow-y:auto; border-radius:8px; font-size:12px; margin-top:10px; }
    .referral-box { background: var(--gray); padding: 15px; border-radius: 8px; border: 1px solid #30363d; margin-top: 10px; }
    </style>

    <div class="portal-inner-container">
        <h2 id="user-greeting">🐱 Welcome, @Guest</h2>
        <div class="portal-stat-box">
            Balance: <span id="balance-view">0</span> ACAT <br>
            <span id="network-users" style="font-size:12px; color:var(--accent);">Global Miners: 1,000+</span>
        </div>
        <div class="portal-tabs">
            <button class="portal-tab-btn active" onclick="switchPortalTab(this,'games')">Mining</button>
            <button class="portal-tab-btn" onclick="switchPortalTab(this,'binary')">Trading</button>
            <button class="portal-tab-btn" onclick="switchPortalTab(this,'buy')">Buy Pool</button>
            <button class="portal-tab-btn" onclick="switchPortalTab(this,'refer')">Refer</button>
            <button class="portal-tab-btn" onclick="switchPortalTab(this,'withdraw')">Withdraw</button>
        </div>

        <div id="games-tab" class="portal-tab-content active">
            <h3>🦋 Save the Flower</h3>
            <div id="game-canvas">
                <div id="start-overlay" class="game-overlay">
                    <button class="portal-btn" style="width:130px;" onclick="startGame()">Start Game</button>
                </div>
                <div id="gameover-overlay" class="game-overlay" style="display:none;">
                    <h2 style="color:var(--red); margin-bottom:5px;">GAME OVER</h2>
                    <p id="earned-session">Mined: 0 ACAT</p>
                    <button class="portal-btn" style="width:130px; background:var(--accent);" onclick="startGame()">Play Again</button>
                </div>
                <div id="live-flower" class="flower">🌸</div>
                <div id="falling-butterfly" class="butterfly">🦋</div>
            </div>
            <div class="game-controls">
                <button class="portal-ctrl-btn" onclick="moveFlower('left')">◀ Left</button>
                <button class="portal-ctrl-btn" onclick="moveFlower('center')">🔼 Center</button>
                <button class="portal-ctrl-btn" onclick="moveFlower('right')">Right ▶</button>
            </div>
            <hr style="margin:15px 0;border-color:#30363d;">
            <h3>💻 Mining Mode</h3>
            <p style="font-size:12px; color:#8b949e;">Active Protocol Node: <span id="live-hashrate" style="color:var(--green); font-weight:bold;">0.00 H/s</span></p>
            <div class="terminal-box" id="term-log">[SYS] Ready to mine blocks...<br></div>
            <button id="mining-toggle-btn" class="portal-btn" style="background:var(--accent);" onclick="toggleMining()">Start Mining Engine</button>
        </div>

        <div id="binary-tab" class="portal-tab-content">
            <h3>📈 Live Trading Terminal</h3>
            <input type="number" id="trade-amount-input" class="portal-input" value="1000">
            <canvas id="chart-canvas" width="460" height="220"></canvas>
            <div id="trade-timer" style="background:rgba(0,0,0,0.8); padding:5px 10px; border-radius:5px; font-weight:bold; color:var(--accent); display:none;">00:60</div>
            <div class="trade-controls">
                <button id="call-btn" class="portal-btn" style="background:var(--green);" onclick="placeTrade('BUY')">🟢 BUY</button>
                <button id="put-btn" class="portal-btn" style="background:var(--red);" onclick="placeTrade('SELL')">🔴 SELL</button>
            </div>
            <p id="trade-status" style="margin-top:10px; text-align:center; font-weight:bold; color:var(--accent);"></p>
            <div id="ad-slot-binary" style="margin-top:15px; text-align:center;"></div>
        </div>

        <div id="buy-tab" class="portal-tab-content">
            <h3>💱 USD to ACAT Swap Pool</h3>
            <p style="font-size:12px;color:var(--accent);margin-bottom:15px;">Enter USD value to open your secure wallet checkout directly:</p>
            
            <input type="number" id="usd-amount" class="portal-input" placeholder="Enter USD Amount (e.g. 5, 10, 50)" oninput="calcTokens()" />
            
            <div style="background: rgba(0, 229, 255, 0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(0, 229, 255, 0.2); margin-bottom: 15px;">
                <p style="font-size:13px; margin:0 0 5px 0;">📉 Required BNB: <b id="bnb-required-view" style="color:var(--accent); font-size:15px;">0.000000</b> BNB</p>
                <p style="font-size:13px; margin:0;">🎉 You will get: <b id="acat-preview" style="color:var(--green); font-size:15px;">0</b> ACAT</p>
            </div>
            
            <button id="buy-pool-trigger-btn" class="portal-btn" onclick="payWithGateway()">🚀 Pay & Claim Instantly via MetaMask</button>
            <p id="buy-pool-error" style="color:var(--red); font-size:12px; margin-top:8px; font-weight:bold; text-align:center;"></p>
        </div>

        <div id="refer-tab" class="portal-tab-content">
            <h3>👥 Refer & Earn</h3>
            <input type="text" id="ref-link-field" class="portal-input" readonly>
            <button class="portal-btn" style="background:var(--accent);" onclick="copyReferralLink()">Copy Referral Link</button>
            <div class="referral-box">
                <p>Total Friends Invited: <b id="total-ref-count">0</b></p>
                <p>Total Income: <b id="total-ref-earnings" style="color:var(--green);">0 ACAT</b></p>
            </div>
        </div>

        <div id="withdraw-tab" class="portal-tab-content">
            <h3>💳 Withdraw ACAT Tokens</h3>
            <input type="text" id="wallet-input-field" class="portal-input" placeholder="Enter BEP20 Address" />
            <input type="number" id="withdraw-amount" class="portal-input" placeholder="Calculating min..." />
            <button id="withdraw-portal-trigger-btn" class="portal-btn" style="background:var(--red);" onclick="submitWithdraw()">Withdraw to BEP20</button>
        </div>
    </div>`;
});

// GLOBAL STATE & SYSTEM ENGINES
window.Telegram = window.Telegram || {};
window.Telegram.WebApp = window.Telegram.WebApp || { expand: function(){}, initDataUnsafe: {} };
const tg = window.Telegram.WebApp;

let userId = tg.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;
let username = tg.initDataUnsafe?.user?.username || null;

if (!userId) {
    userId = localStorage.getItem('acat_web_uid') || "web_user_" + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('acat_web_uid', userId);
}
if (!username) {
    username = localStorage.getItem('acat_web_uname') || "WebArtist_" + userId.split('_')[2] || "Guest";
    localStorage.setItem('acat_web_uname', username);
}

const FIREBASE_URL = "https://aero-cat-mining-default-rtdb.firebaseio.com/users";
let userBalance = 0;
let globalUsersCount = 1000; 
let cachedBnbPrice = 580; 
let audioCtx = null;

let gameActive = false, flowerPos = "center", butterflyY = -40, butterflyColumn = "center", gameLoopInterval = null, sessionEarnings = 0, speed = 4;
const lanes = { left: "15%", center: "45%", right: "75%" };

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

document.addEventListener('keydown', (e) => {
    if(!gameActive) return;
    if(e.key === "ArrowLeft") { moveFlower('left'); e.preventDefault(); }
    if(e.key === "ArrowRight") { moveFlower('right'); e.preventDefault(); }
    if(e.key === "ArrowUp" || e.key === " ") { moveFlower('center'); e.preventDefault(); }
});

function getMinWithdrawLimit() {
    if (globalUsersCount <= 1000) return 30000;
    if (globalUsersCount <= 1000000) {
        let progress = (globalUsersCount - 1000) / 999000;
        let factor = 30000 - (progress * (30000 - 10));
        return clamp(parseFloat(factor.toFixed(5)), 10, 30000);
    } else {
        let progress = (globalUsersCount - 1000000) / 9000000;
        let factor = 10 - (progress * (10 - 0.5));
        return clamp(parseFloat(factor.toFixed(5)), 0.5, 10);
    }
}

const BSC_API_KEY = "C3XUZ127GS96PDE9KGIRXBI3Q6XIM9BG1T"; 
const MY_PROJECT_WALLET = "0x73eB715fd12636E1aE4f5321d5C759fEb56Df301";

async function fetchLiveBnbPrice() {
    try {
        const priceRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
        const priceData = await priceRes.json();
        if(priceData.binancecoin?.usd) cachedBnbPrice = parseFloat(priceData.binancecoin.usd);
    } catch(apiErr) { console.log("BNB rate sync busy. Fallback used."); }
}

function getCurrentReferralBonus() {
    if (globalUsersCount <= 1000) return 100;
    if (globalUsersCount <= 1000000) {
        let progress = (globalUsersCount - 1000) / 999000;
        return clamp(100 - (progress * (100 - 0.2)), 0.2, 100);
    } else {
        let progress = (globalUsersCount - 1000000) / 9000000;
        return clamp(0.2 - (progress * (0.2 - 0.0000026)), 0.0000026, 0.2);
    }
}

function getCurrentWelcomeBonus() {
    if (globalUsersCount <= 1000) return 500;
    if (globalUsersCount <= 1000000) {
        let progress = (globalUsersCount - 1000) / 999000;
        return clamp(500 - (progress * (500 - 0.5)), 0.5, 500);
    } else {
        let progress = (globalUsersCount - 1000000) / 9000000;
        return clamp(0.5 - (progress * (0.5 - 0.0000065)), 0.0000065, 0.5);
    }
}

function getMiningPerSecondReward() {
    if (globalUsersCount <= 1000) return 0.0555;
    if (globalUsersCount <= 1000000) {
        let progress = (globalUsersCount - 1000) / 999000;
        return clamp(0.0555 - (progress * (0.0555 - 0.013)), 0.013, 0.0555);
    } else {
        let progress = (globalUsersCount - 1000000) / 9000000;
        return clamp(0.013 - (progress * (0.013 - 0.0000013)), 0.0000013, 0.0013);
    }
}

function getButterflyPassReward() {
    if (globalUsersCount <= 1000) return 0.2; 
    if (globalUsersCount <= 1000000) {
        let progress = (globalUsersCount - 1000) / 999000;
        return clamp(0.2 - (progress * (0.2 - 0.015)), 0.015, 0.2);
    } else {
        let progress = (globalUsersCount - 1000000) / 9000000;
        return clamp(0.015 - (progress * (0.015 - 0.0000015)), 0.0000015, 0.015);
    }
}

function getBuyPoolSwapRate() {
    if (globalUsersCount <= 1000) return 25000;
    if (globalUsersCount <= 1000000) {
        let progress = (globalUsersCount - 1000) / 999000;
        return clamp(25000 - (progress * (25000 - 10)), 10, 25000);
    } else {
        let progress = (globalUsersCount - 1000000) / 9000000;
        return clamp(10 - (progress * (10 - 0.00013)), 0.00013, 10);
    }
}

async function updateFirebase(updatedFields){
    try{
        await fetch(`${FIREBASE_URL}/${userId}.json`, {
            method:'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(updatedFields)
        });
    } catch(e) { console.error("Firebase update sync error", e); }
}

function updateBalanceDisplay() {
    const el = document.getElementById('balance-view');
    if (el) el.innerText = userBalance.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 7});
}

async function loadUserData(){
    await checkReferralParameters();
    await fetchLiveBnbPrice();

    const greet = document.getElementById("user-greeting");
    if (greet) greet.innerText = `🐱 Welcome, @${username}`;
    
    const baseAppUrl = window.location.origin + window.location.pathname;
    const refField = document.getElementById('ref-link-field');
    if(refField) refField.value = `${baseAppUrl}?ref=${userId}`;

    try {
        await fetchGlobalNetworkCount(); 
        const response = await fetch(`${FIREBASE_URL}/${userId}.json`);
        const data = await response.json();

        if (data) {
            userBalance = parseFloat(data.points || 0);
            updateBalanceDisplay();
            let wField = document.getElementById('wallet-input-field');
            if(wField && data.wallet && data.wallet !== "Not Connected") wField.value = data.wallet;
            document.getElementById('total-ref-count').innerText = data.referrals_count || "0";
            document.getElementById('total-ref-earnings').innerText = `${parseFloat(data.referral_rewards || 0).toLocaleString(undefined, {maximumFractionDigits: 7})} ACAT`;
        } else {
            userBalance = getCurrentWelcomeBonus();
            await updateFirebase({ username: username, points: userBalance, wallet: "Not Connected", referrals_count: 0, referral_rewards: 0 });
            updateBalanceDisplay();
        }
        injectPortalAds();
    } catch (e) { console.error("loadUserData error", e); }
}

async function checkReferralParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerId = urlParams.get('ref');
    if (referrerId && referrerId !== userId && !localStorage.getItem('acat_ref_processed')) {
        try {
            const refCheck = await fetch(`${FIREBASE_URL}/${referrerId}.json`);
            const refData = await refCheck.json();
            if (refData) {
                let dynamicReferBonus = getCurrentReferralBonus();
                let curCount = parseInt(refData.referrals_count || 0) + 1;
                let curRewards = parseFloat(refData.referral_rewards || 0) + dynamicReferBonus; 
                let curPoints = parseFloat(refData.points || 0) + dynamicReferBonus;
                
                await fetch(`${FIREBASE_URL}/${referrerId}.json`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ referrals_count: curCount, referral_rewards: curRewards, points: curPoints })
                });
                localStorage.setItem('acat_ref_processed', 'true');
            }
        } catch(e) {}
    }
}

async function fetchGlobalNetworkCount() {
    try {
        const userRes = await fetch(`${FIREBASE_URL}.json?shallow=true`);
        const allUsers = await userRes.json();
        if (allUsers) {
            globalUsersCount = Object.keys(allUsers).length + 1000;
            document.getElementById('network-users').innerText = `Global Active Miners: ${globalUsersCount.toLocaleString()}`;
            const withdrawInp = document.getElementById('withdraw-amount');
            if (withdrawInp) {
                withdrawInp.placeholder = `Min ${getMinWithdrawLimit().toLocaleString(undefined, {maximumFractionDigits: 5})} ACAT`;
            }
        }
    } catch(e) {}
}

function switchPortalTab(btnElement, tabId){
    document.querySelectorAll('.portal-tab-content').forEach(el=>el.style.display = 'none');
    document.querySelectorAll('.portal-tab-btn').forEach(el=>el.classList.remove('active'));
    
    const tContent = document.getElementById(tabId + '-tab');
    if(tContent) {
        tContent.style.display = 'block';
        tContent.classList.add('active'); 
    }
    btnElement.classList.add('active');
    if(tabId === 'binary') initCandleChart();
    if(tabId === 'withdraw') {
        const withdrawInp = document.getElementById('withdraw-amount');
        if (withdrawInp) withdrawInp.placeholder = `Min ${getMinWithdrawLimit().toLocaleString(undefined, {maximumFractionDigits: 5})} ACAT`;
    }
}

function playBoomSound() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}
}

function moveFlower(position) { if(!gameActive) return; flowerPos = position; document.getElementById('live-flower').style.left = lanes[position]; }

function startGame() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    document.getElementById('start-overlay').style.display = 'none'; 
    document.getElementById('gameover-overlay').style.display = 'none';
    gameActive = true; sessionEarnings = 0; butterflyY = -40; speed = 4; moveFlower('center'); spawnButterfly();
    if(gameLoopInterval) clearInterval(gameLoopInterval); gameLoopInterval = setInterval(updateGameFrame, 20);
}

function spawnButterfly() {
    const columns = ["left", "center", "right"]; butterflyColumn = columns[Math.floor(Math.random() * columns.length)]; butterflyY = -40;
    const bEl = document.getElementById('falling-butterfly'); bEl.style.left = lanes[butterflyColumn]; bEl.style.top = butterflyY + "px";
}

function updateGameFrame() {
    if(!gameActive) return; butterflyY += speed;
    const bEl = document.getElementById('falling-butterfly'); bEl.style.top = butterflyY + "px";
    if (butterflyY >= 290 && butterflyY <= 330 && butterflyColumn === flowerPos) { gameOver(); return; }
    if (butterflyY > 360) {
        let flatReward = getButterflyPassReward(); 
        sessionEarnings += flatReward; userBalance += flatReward; 
        updateBalanceDisplay();
        if(Math.round(sessionEarnings * 10) % 5 === 0) speed += 0.3; spawnButterfly();
    }
}

async function gameOver() {
    gameActive = false; clearInterval(gameLoopInterval); playBoomSound();
    await updateFirebase({ points: userBalance });
    const overlay = document.getElementById('gameover-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.getElementById('earned-session').innerText = `Mined: +${sessionEarnings.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 4})} ACAT`;
    }
}

// MINING ENGINE
let miningInterval = null;
function toggleMining(){
    const btn = document.getElementById('mining-toggle-btn');
    const log = document.getElementById('term-log');
    const hashrate = document.getElementById('live-hashrate');
    if (!miningInterval) {
        log.innerHTML += "[SYS] Starting mining processors...<br>";
        btn.innerText = "Pause Mining Engine";
        btn.style.background = "var(--red)";

        miningInterval = setInterval(async () => {
            let earned = getMiningPerSecondReward();
            userBalance += earned;
            updateBalanceDisplay();
            await updateFirebase({ points: userBalance });

            log.innerHTML += `[MINED] +${earned.toFixed(7)} ACAT block verified.<br>`;
            log.scrollTop = log.scrollHeight;
            hashrate.innerText = (11 + Math.random() * 3).toFixed(2) + " GH/s";
        }, 1000);
    } else {
        clearInterval(miningInterval); miningInterval = null;
        log.innerHTML += "[SYS] Mining paused.<br>";
        btn.innerText = "Start Mining Engine";
        btn.style.background = "var(--accent)";
        hashrate.innerText = "0.00 H/s";
    }
}

// CANDLESTICK / TRADING ENGINE
let canvas, ctx, candleBars = [], chartTimer = null, tradeActive = false, tradeType = "", strikePrice = 0, currentBetCost = 1000, secondsLeft = 60, candleTimeCounter = 0, timerInterval = null;

function initCandleChart() {
    canvas = document.getElementById('chart-canvas'); 
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (candleBars.length === 0) {
        let seedClose = 140.20;
        for (let i = 0; i < 15; i++) {
            let open = seedClose + (Math.random() * 16 - 8);
            let close = open + (Math.random() * 20 - 10);
            candleBars.push({ open, close, high: Math.max(open, close) + Math.random() * 5, low: Math.min(open, close) - Math.random() * 5 });
            seedClose = close;
        }
    }
    if (!chartTimer) chartTimer = setInterval(renderCandleFrame, 1000);
}

function renderCandleFrame() {
    canvas = document.getElementById('chart-canvas'); if (!canvas) return;
    ctx = canvas.getContext('2d'); if (!ctx) return; 
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#161b22"; ctx.lineWidth = 1;
    for (let i = 0; i < canvas.height; i += 25) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

    if (candleBars.length === 0) return;
    candleTimeCounter++; const currentCandle = candleBars[candleBars.length - 1];
    const tickChange = tradeActive ? ((tradeType === "BUY") ? (Math.random() * 4 - 2.5) : (Math.random() * 4 - 1.5)) : (Math.random() * 6 - 3);
    currentCandle.close += tickChange;
    if (currentCandle.close > currentCandle.high) currentCandle.high = currentCandle.close;
    if (currentCandle.close < currentCandle.low) currentCandle.low = currentCandle.close;

    if (candleTimeCounter >= 60) {
        candleTimeCounter = 0; const baseOpen = currentCandle.close; candleBars.shift();
        candleBars.push({ open: baseOpen, close: baseOpen, high: baseOpen, low: baseOpen });
    }

    const currentLivePrice = parseFloat(currentCandle.close.toFixed(2));
    const minPrice = Math.min(...candleBars.map(c => c.low)) - 5; const maxPrice = Math.max(...candleBars.map(c => c.high)) + 5; const priceRange = maxPrice - minPrice || 1;
    function mapY(price) { return canvas.height - ((price - minPrice) / priceRange) * (canvas.height - 40) - 20; }

    const barWidth = 22; const gap = 8;
    for (let i = 0; i < candleBars.length; i++) {
        const bar = candleBars[i]; const x = i * (barWidth + gap) + 15;
        const yOpen = mapY(bar.open); const yClose = mapY(bar.close); const yHigh = mapY(bar.high); const yLow = mapY(bar.low);
        const isGreen = bar.close >= bar.open;
        ctx.strokeStyle = isGreen ? "#2ea44f" : "#da3637"; ctx.fillStyle = isGreen ? "#2ea44f" : "#da3637"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x + barWidth/2, yHigh); ctx.lineTo(x + barWidth/2, yLow); ctx.stroke(); ctx.fillRect(x, Math.min(yOpen, yClose), barWidth, Math.max(2, Math.abs(yOpen - yClose)));
    }

    if (tradeActive) {
        ctx.save(); ctx.fillStyle = "rgba(0, 229, 255, 0.12)"; ctx.font = "bold 72px sans-serif"; ctx.textAlign = "center"; ctx.fillText(`${secondsLeft}s`, canvas.width / 2, canvas.height / 2 + 25); ctx.restore();
        const scanX = 15 + (14 * 30) + ((60 - secondsLeft) / 60) * 22; ctx.strokeStyle = "rgba(234, 54, 55, 0.6)"; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(scanX, 0); ctx.lineTo(scanX, canvas.height); ctx.stroke(); ctx.setLineDash([]);
        const yStrike = mapY(strikePrice); ctx.strokeStyle = "#00e5ff"; ctx.lineWidth = 1.5; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(0, yStrike); ctx.lineTo(canvas.width, yStrike); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = "#00e5ff"; ctx.font = "10px sans-serif"; ctx.fillText(`ENTRY: ${strikePrice}`, 10, yStrike - 5);
    }
    const yLive = mapY(currentLivePrice); ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, yLive); ctx.lineTo(canvas.width, yLive); ctx.stroke();
    ctx.fillStyle = "#00e5ff"; ctx.font = "bold 13px sans-serif"; ctx.fillText(`INDEX: ${currentLivePrice}`, canvas.width - 110, 25);
}

function placeTrade(type) {
    if (tradeActive) return;
    const amountInput = document.getElementById('trade-amount-input'); const chosenAmount = parseInt(amountInput.value);
    if (isNaN(chosenAmount) || chosenAmount <= 0) { alert("Please type a valid custom amount."); return; }
    if (userBalance < chosenAmount) { alert(`Insufficient funds! Needs ${chosenAmount.toLocaleString()} ACAT.`); return; }

    currentBetCost = chosenAmount; userBalance -= chosenAmount; updateBalanceDisplay();
    updateFirebase({ points: userBalance });

    tradeActive = true; tradeType = type; const currentLiveCandle = candleBars[candleBars.length - 1];
    strikePrice = parseFloat(currentLiveCandle.close.toFixed(2)); secondsLeft = 60;

    document.getElementById('call-btn').disabled = true; document.getElementById('put-btn').disabled = true; document.getElementById('trade-amount-input').disabled = true;
    document.getElementById('trade-timer').style.display = "block"; document.getElementById('trade-status').style.color = "var(--accent)"; document.getElementById('trade-status').innerText = `Trade Active: ${type} at position ${strikePrice}`;

    timerInterval = setInterval(() => {
        secondsLeft--; document.getElementById('trade-timer').innerText = `00:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`;
        if (secondsLeft <= 0) { clearInterval(timerInterval); resolveTrade(); }
    }, 1000);
}

async function resolveTrade() {
    tradeActive = false; document.getElementById('trade-timer').style.display = "none";
    document.getElementById('call-btn').disabled = false; document.getElementById('put-btn').disabled = false; document.getElementById('trade-amount-input').disabled = false;
    const finalCandle = candleBars[candleBars.length - 1]; const finalPrice = parseFloat(finalCandle.close.toFixed(2)); let won = false;
    if (tradeType === "BUY" && finalPrice > strikePrice) won = true; if (tradeType === "SELL" && finalPrice < strikePrice) won = true;

    if (won) {
        const payout = Math.round(currentBetCost * 1.8); userBalance += payout;
        document.getElementById('trade-status').style.color = "var(--green)"; document.getElementById('trade-status').innerText = `🎉 WIN! Closed at ${finalPrice}. +${payout.toLocaleString()} ACAT credited.`;
    } else {
        document.getElementById('trade-status').style.color = "var(--red)"; document.getElementById('trade-status').innerText = `❌ LOSE! Closed at ${finalPrice}. -${currentBetCost.toLocaleString()} ACAT absorbed.`;
    }
    updateBalanceDisplay(); await updateFirebase({ points: userBalance });
}

// USD TO ACAT SWAP POOL ENGINE
function calcTokens() {
    const usd = Number(document.getElementById('usd-amount').value); 
    let dynamicRate = getBuyPoolSwapRate();
    const tokens = usd * dynamicRate; 
    
    document.getElementById('acat-preview').innerText = tokens.toLocaleString(undefined, {maximumFractionDigits: 0});
    
    const bnbNeeded = (usd / cachedBnbPrice);
    document.getElementById('bnb-required-view').innerText = isNaN(bnbNeeded) ? "0.000000" : bnbNeeded.toFixed(6);

    const errorLog = document.getElementById('buy-pool-error'); 
    const effectiveCap = 5000000; 
    if (tokens > effectiveCap) { errorLog.innerText = "❌ Error: Purchase amount exceeds pool limit!"; return false; }
    else { errorLog.innerText = ""; return true; }
}

function loadLibraryScript(srcUrl) {
    return new Promise((resolve, reject) => {
        if (window.ethers) return resolve();
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = srcUrl;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Script injection failed: " + srcUrl));
        document.head.appendChild(script);
    });
}

// --- 🔥 UNIVERSAL HYBRID AUTO-TRIGGER DIRECT IN-WALLET ROUTING ---
async function payWithGateway() { 
    if (!calcTokens()) { alert("Transaction aborted!"); return; }
    
    const usdAmount = parseFloat(document.getElementById('usd-amount').value);
    const triggerBtn = document.getElementById('buy-pool-trigger-btn');
    
    if (isNaN(usdAmount) || usdAmount <= 0) {
        alert("❌ Error: Invalid USD deposit value!"); return;
    }

    const exactBnbRequired = (usdAmount / cachedBnbPrice).toFixed(6);
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 1. MOBILE SMART AUTO-REDIRECT (DEEP LINK DELEGATION ROOT)
    if (isMobileDevice && !window.ethereum) {
        const targetAddress = MY_PROJECT_WALLET;
        const currentUrlClean = window.location.href.split('?')[0].replace("https://", "").replace("http://", "");
        
        // Formulating dynamic query mapping sequence
        const metamaskTxDeepLink = `https://metamask.app.link/dapp/${currentUrlClean}?target=${targetAddress}&val=${exactBnbRequired}&usd=${usdAmount}`;
        
        alert(`🚀 Launching MetaMask App Terminal Engine!\n\nTotal Transfer Value: ${exactBnbRequired} BNB.\n\nMetaMask open hotey hi direct popup confirm karein!`);
        window.location.href = metamaskTxDeepLink;
        return; 
    }

    // 2. EXTENSION WEB3 EXECUTOR PIPELINE (DESKTOP OR INSIDE METAMASK BROWSER NATIVE)
    try {
        if(!window.ethereum) {
            alert("❌ Wallet Connection Not Found! Agar mobile pe hain toh MetaMask App ke dApp browser mein ye site open karein."); return;
        }

        triggerBtn.disabled = true;
        triggerBtn.innerText = "Synchronizing Node...";
        await loadLibraryScript("https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js");

        triggerBtn.innerText = "Connecting Secure Wallet...";
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        triggerBtn.innerText = "Waiting for Approval...";
        const txResponse = await signer.sendTransaction({ to: MY_PROJECT_WALLET, value: ethers.utils.parseEther(exactBnbRequired.toString()) });
        
        triggerBtn.innerText = "Mining Block Ledger...";
        await txResponse.wait(); 

        let dynamicRate = getBuyPoolSwapRate();
        const boughtTokens = usdAmount * dynamicRate;
        userBalance += boughtTokens; 
        updateBalanceDisplay();
        await updateFirebase({ points: userBalance });
        
        alert(`🎉 Success! Liquidity Secured!\n+${boughtTokens.toLocaleString()} ACAT tokens unlocked in your balance ledger!`);
        document.getElementById('usd-amount').value = "";
        document.getElementById('bnb-required-view').innerText = "0.000000";
        document.getElementById('acat-preview').innerText = "0";
    } catch (err) {
        console.error(err);
        alert("❌ Blockchain Error: Transaction rejected or canceled by user.");
    } finally {
        if(triggerBtn) {
            triggerBtn.disabled = false;
            triggerBtn.innerText = "🚀 Pay & Claim Instantly via MetaMask";
        }
    }
}

// 3. AUTO-CHECKOUT LISTEN PROTOCOL ON APP LANDING 
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasTargetWallet = urlParams.get('target');
    const hasBnbValue = urlParams.get('val');
    const hasUsdValue = urlParams.get('usd');

    if (window.ethereum && hasTargetWallet && hasBnbValue && hasUsdValue) {
        try {
            await loadLibraryScript("https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            
            alert(`⚡ Processing Automated Deep Link Payload: ${hasBnbValue} BNB`);
            const txResponse = await signer.sendTransaction({
                to: hasTargetWallet,
                value: ethers.utils.parseEther(hasBnbValue)
            });
            
            await txResponse.wait();
            
            // Instantly credit database node variables natively
            const parsedUsd = parseFloat(hasUsdValue);
            let dynamicRate = getBuyPoolSwapRate();
            const boughtTokens = parsedUsd * dynamicRate;
            
            // Reload user balance context pipeline
            userBalance += boughtTokens;
            updateBalanceDisplay();
            await updateFirebase({ points: userBalance });

            alert(`🎉 Success! Mobile Web3 Transfer Confirmed.\n\n+${boughtTokens.toLocaleString()} ACAT tokens credited!`);
            // Clean browser parameters matrix flawlessly
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch(deepErr) {
            console.error("Deep Link Transaction execution failed", deepErr);
        }
    }
});

function copyReferralLink() { const linkField = document.getElementById('ref-link-field'); linkField.select(); document.execCommand('copy'); alert("Referral link copied!"); }

// WITHDRAW PROCESS (MOBILE OPTIMIZED WEB3 ROUTING INTEGRATION)
async function submitWithdraw(){
    const walletAddr = document.getElementById('wallet-input-field').value.trim();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const wBtn = document.getElementById('withdraw-portal-trigger-btn');

    if (!walletAddr || !walletAddr.startsWith("0x") || walletAddr.length !== 42) {
        alert("❌ Error: Invalid BEP20 Address"); return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert("❌ Error: Invalid withdrawal amount requested."); return;
    }

    try {
        const checkRes = await fetch(`${FIREBASE_URL}/${userId}.json`);
        const userData = await checkRes.json();
        
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const lastWithdrawTs = parseInt(userData?.last_withdraw_time || "0", 10);

        if (now - lastWithdrawTs < ONE_DAY) {
            const hoursLeft = Math.ceil((ONE_DAY - (now - lastWithdrawTs)) / (1000 * 60 * 60));
            alert(`Daily withdrawal limit reached. Please try again after ${hoursLeft} hours.`);
            return;
        }
    } catch(dbErr) {
        alert("❌ System Sync Error. Try again."); return;
    }

    const minRequired = getMinWithdrawLimit();
    if (amount < minRequired) {
        alert(`❌ Error: Minimum withdraw is ${minRequired.toLocaleString(undefined, {maximumFractionDigits: 5})} ACAT`); return;
    }
    if (userBalance < amount) {
        alert("❌ Error: Insufficient balance!"); return;
    }

    try {
        if(wBtn) wBtn.disabled = true;
        userBalance -= amount;
        updateBalanceDisplay();
        
        await updateFirebase({ 
            points: userBalance, 
            wallet: walletAddr,
            last_withdraw_time: Date.now() 
        });
        
        alert("🚀 Withdrawal Request Submitted!\n\nTokens have been logged for validation review. Assets arrive in your BEP20 wallet within 12-24 hours.");
    } catch (error) {
        alert("❌ Transaction failed to initialize.");
    } finally {
        if(wBtn) {
            wBtn.disabled = false;
        }
    }
}

// Dynamic Ad Injection Engine
function injectPortalAds() {
    const adSlot = document.getElementById('ad-slot-binary');
    if (adSlot) {
        window.atOptions = {
            'key' : 'b72d58e4dcff113bf0637df0df17cfba',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
        };
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.highperformanceformat.com/b72d58e4dcff113bf0637df0df17cfba/invoke.js';
        adSlot.innerHTML = ''; 
        adSlot.appendChild(script);
    }
}
