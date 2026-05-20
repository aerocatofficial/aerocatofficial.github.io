// --- MHT DESIGNER AERO CAT CORE ENGINE ---

// --- 1. CORE LOGIC ENGINES ---
function getMiningCap(totalUsers) {
    // 12-hour Mining Cap: Starts at 500, reduces by 50 every 100k users (Min 50)
    let reduction = Math.floor(totalUsers / 100000) * 50;
    return Math.max(50, 500 - reduction);
}

function calculateMiningReward(totalUsers) {
    // 2-Stage Decay: 1L tak 500->1, phir 10L tak 1->0.000005
    if (totalUsers <= 100000) {
        return Math.max(1, 500 - (totalUsers * 0.004999));
    } else {
        let remaining = totalUsers - 100000;
        return Math.max(0.000005, 1 - (remaining * 0.000001111));
    }
}

function getWithdrawalThreshold(totalUsers) {
    // Starts at 5,000. As users approach 1M, threshold drops to 0.00005
    let baseThreshold = 5000;
    let minThreshold = 0.00005;
    let threshold = baseThreshold - (totalUsers * (baseThreshold / 1000000));
    return Math.max(minThreshold, threshold);
}

// --- 2. INTEGRATED FUNCTIONS (Replace these in your code) ---

// Updated Gateway Logic (Pool Protection & $1 Limit)
async function payWithGateway(){ 
    let chosenUsd = Number(document.getElementById('usd-amount').value);
    
    // Rule: Max $1.00 per transaction to protect Liquidity Pool
    if (chosenUsd > 1.00) {
        alert("❌ Limit: Max $1.00 per transaction to maintain pool stability.");
        return;
    }

    if(!calcTokens()) { alert("Transaction aborted!"); return; }
    
    let boughtTokens = chosenUsd * 10000; // Updated rate (1 USD = 10,000 ACAT)
    userBalance += boughtTokens;
    document.getElementById('balance-view').innerText = userBalance.toLocaleString(); 
    await updateFirebase({ points: userBalance });
    alert(`🎉 Success! +${boughtTokens.toLocaleString()} ACAT credited.`); 
}

// Updated Withdrawal Logic
async function submitWithdraw(){
    const walletAddr = document.getElementById('wallet-input-field').value.trim();
    const amount = parseInt(document.getElementById('withdraw-amount').value);
    const totalUsers = await getTotalUsersFromFirebase();
    const threshold = getWithdrawalThreshold(totalUsers);

    if(!walletAddr || !walletAddr.startsWith("0x")) { alert("❌ Invalid BEP20 Address"); return; }
    if(isNaN(amount) || amount < threshold){ alert(`❌ Error: Minimum withdrawal is ${threshold.toFixed(6)} ACAT`); return; }
    if(userBalance < amount) { alert("❌ Insufficient balance!"); return; }
    
    userBalance -= amount; 
    document.getElementById('balance-view').innerText = userBalance.toLocaleString(); 
    await updateFirebase({ points: userBalance, wallet: walletAddr });
    alert("🚀 Withdrawal Ledger Synchronized!");
}

// Note: Replace the old 'calcTokens' math in your code with this:
function calcTokens() {
    const usd = Number(document.getElementById('usd-amount').value); 
    let estimatedTokens = usd * 10000; // Updated rate
    document.getElementById('acat-preview').innerText = estimatedTokens.toLocaleString();
    return true;
}
