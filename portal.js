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
    /* (same styles as before, omitted for brevity) */
    </style>

    <div class="portal-inner-container">
        <h2 id="user-greeting">🐱 Welcome, @Guest</h2>
        <div class="portal-stat-box">
            Balance: <span id="balance-view">0</span> ACAT <br>
            <span id="network-users" style="font-size:12px; color:var(--accent);">Global Miners: 1,000+</span>
        </div>
        <!-- Tabs and content remain as you provided -->
        <!-- ... (copy your existing HTML content here) ... -->
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

// Backend / Economy Constants (tweak these as you go)
const FIREBASE_URL = "https://aero-cat-mining-default-rtdb.firebaseio.com/users";
const MAX_TOTAL_SUPPLY = 25000; // Buy Pool cap base (will scale depending on marketplace later)
let userBalance = 0;
let globalUsersCount = 1000; // this will be fetched from backend
let rewardScale = 1.0;
let lastEarnOneTimeBonusGiven = false; // per-user 0.5 ACAT bonus on first game
let audioCtx = null;

// Helper: clamp
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

// Helpers to fetch/update backend (kept simple)
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

    try {
        const response = await fetch(`${FIREBASE_URL}/${userId}.json`);
        const data = await response.json();
        if (data) {
            userBalance = parseInt(data.points || 0);
            document.getElementById('balance-view').innerText = userBalance.toLocaleString();
            // Ref and wallet info can be filled similarly if you have fields
            globalUsersCount = data.globalUsersCount || globalUsersCount;
            rewardScale = data.rewardScale || rewardScale;
            document.getElementById('network-users').innerText = `Global Active Miners: ${globalUsersCount.toLocaleString()}`;
        } else {
            // initialize
            userBalance = 0;
            await updateFirebase({ username: username, points: userBalance, wallet: "Not Connected", referrals_count: 0, referral_rewards: 0 });
        }
        // kick off fetch for scaling
        fetchGlobalNetworkCount();
        checkReferralParameters();
    } catch (e) {
        console.error("loadUserData error", e);
    }
}

// Simple referral param handling (unchanged behavior)
async function checkReferralParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerId = urlParams.get('ref');
    if (referrerId && referrerId !== userId && !localStorage.getItem('acat_ref_processed')) {
        try {
            const refCheck = await fetch(`${FIREBASE_URL}/${referrerId}.json`);
            const refData = await refCheck.json();
            if (refData) {
                let curCount = parseInt(refData.referrals_count || 0) + 1;
                let curRewards = parseInt(refData.referral_rewards || 0) + 100; // Refer bonus
                let curPoints = parseInt(refData.points || 0) + 100;
                await fetch(`${FIREBASE_URL}/${referrerId}.json`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ referrals_count: curCount, referral_rewards: curRewards, points: curPoints })
                });
                localStorage.setItem('acat_ref_processed', 'true');
            }
        } catch(e) { /* ignore */ }
    }
}

async function fetchGlobalNetworkCount() {
    try {
        const userRes = await fetch(`${FIREBASE_URL}.json?shallow=true`);
        const allUsers = await userRes.json();
        if (allUsers) {
            globalUsersCount = Object.keys(allUsers).length + 1000;
            // compute a base reward scale that gradually decreases with user count
            const u = Math.max(globalUsersCount, 1);
            const log = Math.log10(u);
            // bounded, smooth decay
            const newScale = clamp(0.0012 / log, 0.000002, 0.0012);
            rewardScale = newScale;
            document.getElementById('network-users').innerText = `Global Active Miners: ${globalUsersCount.toLocaleString()}`;
            await updateFirebase({ rewardScale: rewardScale, globalUsersCount: globalUsersCount });
        }
    } catch(e) { /* ignore */ }
}

// 1) BOOM! GAME OVER: apply 15 ACAT base, plus one-time 0.5 ACAT, scaled by rewardScale
let gameActive = false;
let sessionEarnings = 0;
let lastGameTime = 0;

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

async function gameOver() {
    gameActive = false;
    clearInterval(gameLoopInterval);
    playBoomSound();

    // Base payout
    const basePayout = 15;

    // One-time per-user bonus: 0.5 ACAT
    const oneTimeBonus = lastEarnOneTimeBonusGiven ? 0 : 0.5;
    lastEarnOneTimeBonusGiven = true;

    // Apply scaling
    const scaledPayout = Math.max(0, Math.floor((basePayout + oneTimeBonus) * rewardScale * 1e6) / 1e6);
    const totalEarned = scaledPayout;

    sessionEarnings += totalEarned;
    userBalance += totalEarned;
    document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    await updateFirebase({ points: userBalance });

    const overlay = document.getElementById('gameover-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.getElementById('earned-session').innerText = `Mined: +${totalEarned.toLocaleString()} ACAT`;
    }
}

// 2) MINING MODE: cap ~200 ACAT per hour per user, with decay as user count grows
let miningInterval = null;
function toggleMining(){ // async fix applied below
    const btn = document.getElementById('mining-toggle-btn');
    const log = document.getElementById('term-log');
    const hashrate = document.getElementById('live-hashrate');
    if (!miningInterval) {
        log.innerHTML += "[SYS] Starting mining processors...<br>";
        btn.innerText = "Pause Mining Engine";
        btn.style.background = "var(--red)";

        // Use async interval with simple per-second reward, capped by decay
        miningInterval = setInterval(async () => {
            // Target ~200 ACAT/hour -> ~0.0555 ACAT/sec
            const basePerSec = 0.0555;
            const decayFactor = clamp(1 - Math.log10(Math.max(1, globalUsersCount)) / 12, 0.5, 1.0);
            const perSec = basePerSec * decayFactor * rewardScale;
            const earned = Math.max(0, perSec);

            // Optional: clamp to avoid tiny fractional drift
            const earnedFixed = Math.round(earned * 10000) / 10000; // 4 decimals
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

// 3) CANDLE STICK / TRADING: keep similar to original but wire in new scaling
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
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // simple grid
    ctx.strokeStyle = "#161b22"; ctx.lineWidth = 1;
    for (let i = 0; i < canvas.height; i += 25) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // price tick
    candleTimeCounter++;
    const currentCandle = candleBars[candleBars.length - 1];
    const tickChange = tradeActive ? ((tradeType === "BUY") ? (Math.random() * 4 - 2.5) : (Math.random() * 4 - 1.5)) : (Math.random() * 6 - 3);
    currentCandle.close += tickChange;
    if (currentCandle.close > currentCandle.high) currentCandle.high = currentCandle.close;
    if (currentCandle.close < currentCandle.low) currentCandle.low = currentCandle.close;

    // shift candles
    if (candleTimeCounter >= 60) {
        candleTimeCounter = 0;
        const baseOpen = currentCandle.close;
        candleBars.shift();
        candleBars.push({ open: baseOpen, close: baseOpen, high: baseOpen, low: baseOpen });
    }

    // live price
    const currentLivePrice = parseFloat(currentCandle.close.toFixed(2));
    const minPrice = Math.min(...candleBars.map(c => c.low)) - 5;
    const maxPrice = Math.max(...candleBars.map(c => c.high)) + 5;
    const priceRange = maxPrice - minPrice || 1;
    function mapY(price) { return canvas.height - ((price - minPrice) / priceRange) * (canvas.height - 40) - 20; }

    const barWidth = 22; const gap = 8;
    for (let i = 0; i < candleBars.length; i++) {
        const bar = candleBars[i]; const x = i * (barWidth + gap) + 15;
        const yOpen = mapY(bar.open); const yClose = mapY(bar.close); const yHigh = mapY(bar.high); const yLow = mapY(bar.low);
        const isGreen = bar.close >= bar.open;
        ctx.strokeStyle = isGreen ? "#2ea44f" : "#da3637"; ctx.fillStyle = isGreen ? "#2ea44f" : "#da3637"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x + barWidth/2, yHigh); ctx.lineTo(x + barWidth/2, yLow); ctx.stroke();
        ctx.fillRect(x, Math.min(yOpen, yClose), barWidth, Math.max(2, Math.abs(yOpen - yClose)));
    }

    if (tradeActive) {
        ctx.save(); ctx.fillStyle = "rgba(0, 229, 255, 0.12)"; ctx.font = "bold 72px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`${secondsLeft}s`, canvas.width / 2, canvas.height / 2 + 25); ctx.restore();
        // simple scan line
        const scanX = 15 + (14 * 30) + ((60 - secondsLeft) / 60) * 22;
        ctx.strokeStyle = "rgba(234, 54, 55, 0.6)"; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.moveTo(scanX, 0); ctx.lineTo(scanX, canvas.height); ctx.stroke(); ctx.setLineDash([]);
        const yStrike = mapY(strikePrice); ctx.strokeStyle = "#00e5ff"; ctx.lineWidth = 1.5; ctx.setLineDash([6,4]);
        ctx.beginPath(); ctx.moveTo(0, yStrike); ctx.lineTo(canvas.width, yStrike); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#00e5ff"; ctx.font = "10px sans-serif"; ctx.fillText(`ENTRY: ${strikePrice}`, 10, yStrike - 5);
    }

    // live line
    const yLive = mapY(currentLivePrice);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, yLive); ctx.lineTo(canvas.width, yLive); ctx.stroke();

    ctx.fillStyle = "#00e5ff"; ctx.font = "bold 13px sans-serif"; ctx.fillText(`INDEX: ${currentLivePrice}`, canvas.width - 110, 25);
}

async function placeTrade(type) {
    if (tradeActive) return;
    const amountInput = document.getElementById('trade-amount-input');
    const chosenAmount = parseInt(amountInput.value);
    if (isNaN(chosenAmount) || chosenAmount <= 0) { alert("Please type a valid custom amount."); return; }

    // Check balance
    if (userBalance < chosenAmount) { alert(`Insufficient funds! Needs ${chosenAmount.toLocaleString()} ACAT.`); return; }

    // Deduct cost
    currentBetCost = chosenAmount;
    userBalance -= chosenAmount; document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    await updateFirebase({ points: userBalance });

    tradeActive = true; tradeType = type; const currentLiveCandle = candleBars[candleBars.length - 1];
    strikePrice = parseFloat(currentLiveCandle.close.toFixed(2)); secondsLeft = 60;

    document.getElementById('call-btn').disabled = true; document.getElementById('put-btn').disabled = true;
    document.getElementById('trade-amount-input').disabled = true;
    document.getElementById('trade-timer').style.display = "block";
    document.getElementById('trade-status').style.color = "var(--accent)";
    document.getElementById('trade-status').innerText = `Trade Active: ${type} at position ${strikePrice}`;

    timerInterval = setInterval(() => {
        secondsLeft--;
        document.getElementById('trade-timer').innerText = `00:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`;
        if (secondsLeft <= 0) { clearInterval(timerInterval); resolveTrade(); }
    }, 1000);
}

async function resolveTrade() {
    tradeActive = false;
    document.getElementById('trade-timer').style.display = "none";
    document.getElementById('call-btn').disabled = false;
    document.getElementById('put-btn').disabled = false;
    document.getElementById('trade-amount-input').disabled = false;

    const finalCandle = candleBars[candleBars.length - 1];
    const finalPrice = parseFloat(finalCandle.close.toFixed(2));
    let won = false;
    if (tradeType === "BUY" && finalPrice > strikePrice) won = true;
    if (tradeType === "SELL" && finalPrice < strikePrice) won = true;

    if (won) {
        const payout = Math.round(currentBetCost * 1.8);
        userBalance += payout;
        document.getElementById('trade-status').style.color = "var(--green)";
        document.getElementById('trade-status').innerText = `🎉 WIN! Closed at ${finalPrice}. +${payout.toLocaleString()} ACAT credited.`;
    } else {
        document.getElementById('trade-status').style.color = "var(--red)";
        document.getElementById('trade-status').innerText = `❌ LOSE! Closed at ${finalPrice}. -${currentBetCost.toLocaleString()} ACAT absorbed.`;
    }

    document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    await updateFirebase({ points: userBalance });
}

// 4) BUY POOL: now 25,000 cap per purchase
function calcTokens() {
    const usd = Number(document.getElementById('usd-amount').value);
    const tokens = usd * 5000;
    document.getElementById('acat-preview').innerText = tokens.toLocaleString();
    const errorLog = document.getElementById('buy-pool-error');
    const effectiveCap = 25000; // per your request
    if (tokens > effectiveCap) {
        errorLog.innerText = "❌ Error: Purchase amount exceeds pool limit!";
        return false;
    } else {
        errorLog.innerText = "";
        return true;
    }
}

async function payWithGateway(){ 
    if (!calcTokens()) { alert("Transaction aborted!"); return; }
    const chosenUsd = Number(document.getElementById('usd-amount').value);
    const boughtTokens = chosenUsd * 5000;
    userBalance += boughtTokens;
    document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    await updateFirebase({ points: userBalance });
    alert(`🎉 Success! +${boughtTokens.toLocaleString()} ACAT credited.`);
}

// 5) REFER: 100 ACAT per refer and growth-based scaling
function copyReferralLink() {
    const linkField = document.getElementById('ref-link-field');
    linkField.select();
    document.execCommand('copy');
    alert("Referral link copied!");
}

// 6) WITHDRAW: base 100000, now scales down as userbase grows and time passes
async function submitWithdraw(){
    const walletAddr = document.getElementById('wallet-input-field').value.trim();
    const amount = parseInt(document.getElementById('withdraw-amount').value);

    // BEP20 addr check
    if (!walletAddr || !walletAddr.startsWith("0x") || walletAddr.length !== 42) {
        alert("❌ Error: Invalid BEP20 Address");
        return;
    }

    // Daily withdrawal guard (new): only once per 24h per user
    const lastWithdrawKey = 'acat_last_withdraw_ts_' + userId;
    const lastWithdrawTs = parseInt(localStorage.getItem(lastWithdrawKey) || "0", 10);
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (now - lastWithdrawTs < ONE_DAY) {
        alert("Daily withdrawal limit reached. Please try again after 24 hours.");
        return;
    }

    // Time-decay based minimum/limit
    const epochKey = 'withdraw_epoch';
    const prevEpoch = parseInt(localStorage.getItem(epochKey) || "0", 10);
    const days = (now - prevEpoch) / (1000 * 60 * 60 * 24);
    const decay = Math.max(0.75, Math.pow(0.999, days * 365)); // gentle decay
    const minWithdraw = 100000 * decay; // scaled
    const minRequired = Math.max(minWithdraw, 100000 * decay);

    if (isNaN(amount) || amount < minRequired) {
        alert(`❌ Error: Minimum withdraw is ${minRequired.toLocaleString()} ACAT (scaled with time).`);
        return;
    }
    if (userBalance < amount) {
        alert("❌ Error: Insufficient balance!");
        return;
    }

    userBalance -= amount;
    document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    await updateFirebase({ points: userBalance, wallet: walletAddr });
    localStorage.setItem(epochKey, String(now)); // update epoch
    localStorage.setItem(lastWithdrawKey, String(now)); // daily gate updated
    alert("🚀 Withdrawal Ledger Synchronized!");
}
