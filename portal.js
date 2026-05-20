// --- AERO CAT CORE ENGINE (MHT DESIGNER) ---
const FIREBASE_URL = "https://aero-cat-mining-default-rtdb.firebaseio.com/users";
let userBalance = 0, globalUsersCount = 1000, rewardScale = 1.0;

async function activateMiningPortal(btnElement) {
    const root = document.getElementById('aerocat-portal-root');
    if(root) {
        root.style.display = 'block';
        btnElement.parentElement.style.display = 'none'; // Button hide
        loadUserData();
    }
}

// --- ECONOMY ENGINES ---
function getMiningCap(totalUsers) {
    let reduction = Math.floor(totalUsers / 100000) * 50;
    return Math.max(50, 500 - reduction);
}

function calculateMiningReward(totalUsers) {
    if (totalUsers <= 100000) return Math.max(1, 500 - (totalUsers * 0.004999));
    let remaining = totalUsers - 100000;
    return Math.max(0.000005, 1 - (remaining * 0.000001111));
}

function getWithdrawalThreshold(totalUsers) {
    let base = 5000, min = 0.00005;
    let threshold = base - (totalUsers * (base / 1000000));
    return Math.max(min, threshold);
}

// --- CORE LOGIC ---
async function loadUserData(){
    // Firebase Data Fetching Logic...
    // (Ensure your Auth logic is here)
    document.getElementById('balance-view').innerText = userBalance.toLocaleString();
}

async function payWithGateway(){ 
    let usd = Number(document.getElementById('usd-amount').value);
    // Hard Limit Protection
    if (usd > 1.00) { alert("Max $1.00 per transaction!"); return; }
    
    let tokens = usd * 10000;
    userBalance += tokens;
    document.getElementById('balance-view').innerText = userBalance.toLocaleString();
    alert(`Success! +${tokens.toLocaleString()} ACAT added.`);
}

async function submitWithdraw(){
    const amount = parseInt(document.getElementById('withdraw-amount').value);
    // Dynamic Threshold Check
    const threshold = getWithdrawalThreshold(globalUsersCount);
    if(amount < threshold){ alert(`Min withdrawal: ${threshold.toFixed(6)} ACAT`); return; }
    
    userBalance -= amount;
    alert("Withdrawal Ledger Synchronized!");
}

// --- UTILITIES ---
function switchPortalTab(btn, tabId){
    document.querySelectorAll('.portal-tab-content').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('.portal-tab-btn').forEach(el=>el.classList.remove('active'));
    document.getElementById(tabId + '-tab').classList.add('active');
    btn.classList.add('active');
}
