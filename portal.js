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
    #game-canvas, #chart-canvas { width:100%; height:220px; background:#000; border-radius:10px; position:relative; overflow:hidden; margin-top:10px; border: 2px solid #30363d; }
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
        </div>

        <div id="buy-tab" class="portal-tab-content">
            <h3>💱 USD to ACAT Swap Pool</h3>
            <input type="number" id="usd-amount" class="portal-input" placeholder="Enter USD Amount" oninput="calcTokens()" />
            <p>You get: <b id="acat-preview" style="color:var(--accent);">0</b> ACAT</p>
            <button class="portal-btn" onclick="payWithGateway()">Pay via Gateway</button>
            <p id="buy-pool-error" style="color:var(--red); font-size:12px; margin-top:5px; font-weight:bold; text-align:center;"></p>
        </div>

        <div id="refer-tab" class="portal-tab-content">
            <h3>👥 Refer & Earn</h3>
            <input type="text" id="ref-link-field" class="portal-input" readonly>
            <button class="portal-btn" style="background:var(--accent);" onclick="copyReferralLink()">Copy Referral Link</button>
            <div class="referral-box">
                <p>Total Friends Invited: <b id="total-ref-count">0</b></p>
                <p>Total Income: <b id="total-ref-earnings" style="color:var(--green);">0 ACAT</b></p>
                <p style="display:none;">Bonus View Hidden: <span id="refer-earning-view">0</span></p>
            </div>
        </div>

        <div id="withdraw-tab" class="portal-tab-content">
            <h3>💳 Withdraw ACAT Tokens</h3>
            <input type="text" id="wallet-input-field" class="portal-input" placeholder="Enter BEP20 Address" />
            <input type="number" id="withdraw-amount" class="portal-input" placeholder="Min 1,000,000 ACAT" />
            <button class="portal-btn" style="background:var(--red);" onclick="submitWithdraw()">Withdraw to BEP20</button>
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
const MAX_TOTAL_SUPPLY = 25000; 
let userBalance = 0;
let globalUsersCount = 1000; 
let rewardScale = 1.0;
let lastEarnOneTimeBonusGiven = false; 
let audioCtx = null;

// Butterfly game variables
let gameActive = false, flowerPos = "center", butterflyY = -40, butterflyColumn = "center", gameLoopInterval = null, sessionEarnings = 0, speed = 4;
const lanes = { left: "15%", center: "45%", right: "75%" };

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

async function updateFirebase(updatedFields){
    try{
        await fetch(`${FIREBASE_URL}/${userId}.json`, {
            method:'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(updatedFields)
        });
    } catch(e) { console.error("Firebase update error", e); }
}

async function loadUserData(){
    const greet = document.getElementById("user-greeting");
    if (greet) greet.innerText = `🐱 Welcome, @${username}`;
    const baseAppUrl = window.location.href.split('?')[0];
    const refField = document.getElementById('ref-link-field');
    if(refField) refField.value = `${baseAppUrl}?ref=${userId}`;

    try {
        const response = await fetch(`${FIREBASE_URL}/${userId}.json`);
        const data = await response.json();
        if (data) {
            userBalance = parseInt(data.points || 0);
            document.getElementById('balance-view').innerText = userBalance.toLocaleString();
            let wField = document.getElementById('wallet-input-field');
            if(wField && data.wallet && data.wallet !== "Not Connected") wField.value = data.wallet;
            document.getElementById('total-ref-count').innerText = data.referrals_count || "0";
            document.getElementById('total-ref-earnings').innerText = `${(data.referral_rewards || 0).toLocaleString()} ACAT`;
            globalUsersCount = data.globalUsersCount || globalUsersCount;
            rewardScale = data.rewardScale || rewardScale;
            document.getElementById('network-users').innerText = `Global Active Miners: ${globalUsersCount.toLocaleString()}`;
        } else {
            userBalance = 0;
            await updateFirebase({ username: username, points: userBalance, wallet: "Not Connected", referrals_count: 0, referral_rewards: 0 });
        }
        fetchGlobalNetworkCount();
        checkReferralParameters();
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
                let curCount = parseInt(refData.referrals_count || 0) + 1;
                let curRewards = parseInt(refData.referral_rewards || 0) + 100; 
                let curPoints = parseInt(refData.points || 0) + 100;
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
            const u = Math.max(globalUsersCount, 1);
            const log = Math.log10(u);
            const newScale = clamp(0.0012 / log, 0.000002, 0.0012);
            rewardScale = newScale;
            document.getElementById('network-users').innerText = `Global Active Miners: ${globalUsersCount.toLocaleString()}`;
            await updateFirebase({ rewardScale: rewardScale, globalUsersCount: globalUsersCount });
        }
    } catch(e) {}
}

function switchPortalTab(btnElement, tabId){
    document.querySelectorAll('.portal-tab-content').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('.portal-tab-btn').forEach(el=>el.classList.remove('active'));
    const tContent = document.getElementById(tabId + '-tab');
    if(tContent) tContent.classList.add('active'); 
    btnElement.classList.add('active');
    if(tabId === 'binary') initCandleChart();
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
    if (butterflyY >= 190 && butterflyY <= 230 && butterflyColumn === flowerPos) { gameOver(); return; }
    if (butterflyY > 260) {
        let calculatedReward = Math.round(5 * rewardScale); 
        if(calculatedReward < 1) calculatedReward = 1;
        sessionEarnings += calculatedReward; userBalance += calculatedReward; 
        document.getElementById('balance-view').innerText = userBalance.toLocaleString();
        if(sessionEarnings % 100 === 0) speed += 0.5; spawnButterfly();
    }
}

async function gameOver() {
    gameActive = false; clearInterval(gameLoopInterval); playBoomSound();
    const basePayout = 15;
    const oneTimeBonus = lastEarnOneTimeBonusGiven ? 0 : 0.5;
    lastEarnOneTimeBonusGiven = true;
    const scaledPayout = Math.max(0, Math.floor((basePayout + oneTimeBonus) * rewardScale * 1e6) / 1e6);
    sessionEarnings += scaledPayout; userBalance += scaledPayout;
    document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    await updateFirebase({ points: userBalance });
    const overlay = document.getElementById('gameover-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.getElementById('earned-session').innerText = `Mined: +${scaledPayout.toLocaleString()} ACAT`;
    }
}

// 2) MINING ENGINE (FIXED)
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
            const basePerSec = 0.0555;
            const decayFactor = clamp(1 - Math.log10(Math.max(1, globalUsersCount)) / 12, 0.5, 1.0);
            const perSec = basePerSec * decayFactor * rewardScale;
            const earned = Math.max(0, perSec);
            const earnedFixed = Math.round(earned * 10000) / 10000; 
            
            userBalance += earnedFixed;
            document.getElementById('balance-view').innerText = userBalance.toLocaleString();
            await updateFirebase({ points: userBalance });

            log.innerHTML += `[MINED] +${earnedFixed.toFixed(4)} ACAT block verified.<br>`;
            log.scrollTop = log.scrollHeight;
            hashrate.innerText = (11 + Math.random() * 3).toFixed(2) + " GH/s";
        }, 1000);
    } else {
        clearInterval(miningInterval);
        miningInterval = null;
        log.innerHTML += "[SYS] Mining paused.<br>";
        btn.innerText = "Start Mining Engine";
        btn.style.background = "var(--accent)";
        hashrate.innerText = "0.00 H/s";
    }
}

// 3) CANDLESTICK / TRADING ENGINE
let canvas, ctx, candleBars = [], chartTimer = null, tradeActive = false, tradeType = "", strikePrice = 0, currentBetCost = 1000, secondsLeft = 60, candleTimeCounter = 0, timerInterval = null;

function initCandleChart() {
    canvas = document.getElementById('chart-canvas'); ctx = canvas.getContext('2d');
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
    if (!ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#161b22"; ctx.lineWidth = 1;
    for (let i = 0; i < canvas.height; i += 25) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

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

async function placeTrade(type) {
    if (tradeActive) return;
    const amountInput = document.getElementById('trade-amount-input'); const chosenAmount = parseInt(amountInput.value);
    if (isNaN(chosenAmount) || chosenAmount <= 0) { alert("Please type a valid custom amount."); return; }
    if (userBalance < chosenAmount) { alert(`Insufficient funds! Needs ${chosenAmount.toLocaleString()} ACAT.`); return; }

    currentBetCost = chosenAmount; userBalance -= chosenAmount; document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    await updateFirebase({ points: userBalance });

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
    document.getElementById('balance-view').innerText = userBalance.toLocaleString(); await updateFirebase({ points: userBalance });
}

function calcTokens() {
    const usd = Number(document.getElementById('usd-amount').value); const tokens = usd * 5000;
    document.getElementById('acat-preview').innerText = tokens.toLocaleString();
    const errorLog = document.getElementById('buy-pool-error'); const effectiveCap = 25000; 
    if (tokens > effectiveCap) { errorLog.innerText = "❌ Error: Purchase amount exceeds pool limit!"; return false; }
    else { errorLog.innerText = ""; return true; }
}

async function payWithGateway(){ 
    if (!calcTokens()) { alert("Transaction aborted!"); return; }
    const chosenUsd = Number(document.getElementById('usd-amount').value); const boughtTokens = chosenUsd * 5000;
    userBalance += boughtTokens; document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    await updateFirebase({ points: userBalance }); alert(`🎉 Success! +${boughtTokens.toLocaleString()} ACAT credited.`);
}

function copyReferralLink() { const linkField = document.getElementById('ref-link-field'); linkField.select(); document.execCommand('copy'); alert("Referral link copied!"); }

// 6) WITHDRAW PROCESS
async function submitWithdraw(){
    const walletAddr = document.getElementById('wallet-input-field').value.trim();
    const amount = parseInt(document.getElementById('withdraw-amount').value);

    if (!walletAddr || !walletAddr.startsWith("0x") || walletAddr.length !== 42) {
        alert("❌ Error: Invalid BEP20 Address"); return;
    }

    const lastWithdrawKey = 'acat_last_withdraw_ts_' + userId;
    const lastWithdrawTs = parseInt(localStorage.getItem(lastWithdrawKey) || "0", 10);
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (now - lastWithdrawTs < ONE_DAY) {
        alert("Daily withdrawal limit reached. Please try again after 24 hours."); return;
    }

    const epochKey = 'withdraw_epoch';
    const prevEpoch = parseInt(localStorage.getItem(epochKey) || "0", 10);
    const days = (now - prevEpoch) / (1000 * 60 * 60 * 24);
    const decay = Math.max(0.75, Math.pow(0.999, days * 365)); 
    const minWithdraw = 100000 * decay; 
    const minRequired = Math.max(minWithdraw, 100000 * decay);

    if (isNaN(amount) || amount < minRequired) {
        alert(`❌ Error: Minimum withdraw is ${minRequired.toLocaleString()} ACAT (scaled with time).`); return;
    }
    if (userBalance < amount) {
        alert("❌ Error: Insufficient balance!"); return;
    }

    userBalance -= amount;
    document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    await updateFirebase({ points: userBalance, wallet: walletAddr });
    localStorage.setItem(epochKey, String(now)); 
    localStorage.setItem(lastWithdrawKey, String(now)); 
    alert("🚀 Withdrawal Ledger Synchronized!");
}
