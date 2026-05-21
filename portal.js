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
            <input type="number" id="withdraw-amount" class="portal-input" placeholder="Calculating min..." />
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
let userBalance = 0;
let globalUsersCount = 1000; 
let rewardScale = 1.0;
let lastEarnOneTimeBonusGiven = false; 
let audioCtx = null;

let gameActive = false, flowerPos = "center", butterflyY = -40, butterflyColumn = "center", gameLoopInterval = null, sessionEarnings = 0, speed = 4;
const lanes = { left: "15%", center: "45%", right: "75%" };

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

function getMinWithdrawLimit() {
    if (globalUsersCount <= 1000) return 3000;
    let targetMin = 3000 - ((globalUsersCount - 1000) * (3000 - 0.00013) / 999000);
    return Math.max(0.00013, parseFloat(targetMin.toFixed(5)));
}

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
            userBalance = parseFloat(data.points || 0);
            document.getElementById('balance-view').innerText = userBalance.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 6});
            let wField = document.getElementById('wallet-input-field');
            if(wField && data.wallet && data.wallet !== "Not Connected") wField.value = data.wallet;
            document.getElementById('total-ref-count').innerText = data.referrals_count || "0";
            document.getElementById('total-ref-earnings').innerText = `${(data.referral_rewards || 0).toLocaleString()} ACAT`;
            globalUsersCount = data.globalUsersCount || globalUsersCount;
            rewardScale = data.rewardScale || rewardScale;
            document.getElementById('network-users').innerText = `Global Active Miners: ${globalUsersCount.toLocaleString()}`;
        } else {
            // --- WELCOME BONUS FIXED HERE: Set to 500 ACAT for new users ---
            userBalance = 500;
            await updateFirebase({ username: username, points: userBalance, wallet: "Not Connected", referrals_count: 0, referral_rewards: 0 });
            document.getElementById('balance-view').innerText = userBalance.toLocaleString();
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
                let curPoints = parseFloat(refData.points || 0) + 100;
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
            
            // --- DYNAMIC GEOMETRIC DECAY SCALE ENGINE ---
            // Target: 1,000 users par scale 1.0 ho, aur 10 Lakh (1,000,000) users par exact 0.0000065 ho jaye.
            let newScale
