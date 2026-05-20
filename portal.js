# Updated Dynamic Economy Logic for `portal.js`

## 1) Replace Your Global Variables Section With This

```javascript
const FIREBASE_URL = "https://aero-cat-mining-default-rtdb.firebaseio.com/users";
const MAX_TOTAL_SUPPLY = 20000000;

let userBalance = 0;
let globalUsersCount = 1000;
let rewardScale = 1.0;
let audioCtx = null;

/* ===========================
   DYNAMIC ECONOMY ENGINE
=========================== */

const MAX_NETWORK_USERS = 1000000;

function getDynamicScale() {

    let scale = 1 - (globalUsersCount / MAX_NETWORK_USERS);

    if(scale < 0.000001)
        scale = 0.000001;

    return scale;
}

function getDynamicGameReward() {

    // Starts high → slowly drops
    let reward = 1 * getDynamicScale();

    if(reward < 0.00005)
        reward = 0.00005;

    return parseFloat(reward.toFixed(6));
}

function getDynamicMiningReward() {

    // Max 100 ACAT per hour initially
    let reward = 100 * getDynamicScale();

    if(reward < 0.00005)
        reward = 0.00005;

    return parseFloat(reward.toFixed(6));
}

function getDynamicReferralReward() {

    let reward = 100 * getDynamicScale();

    if(reward < 0.00001)
        reward = 0.00001;

    return parseFloat(reward.toFixed(6));
}

function getDynamicWithdrawMinimum() {

    let minimum = 1000 * getDynamicScale();

    if(minimum < 0.00005)
        minimum = 0.00005;

    return parseFloat(minimum.toFixed(6));
}

function getDynamicBuyRate() {

    // 1 USD = 25,000 ACAT initially
    let rate = 25000 * getDynamicScale();

    if(rate < 0.000005)
        rate = 0.000005;

    return parseFloat(rate.toFixed(6));
}

/* ===========================
   BALANCE DEDUCTION LOGIC
=========================== */

async function deductBalance(amount) {

    amount = parseFloat(amount);

    if(isNaN(amount) || amount <= 0) {
        return false;
    }

    if(userBalance < amount) {

        alert(`❌ Insufficient Balance! Need ${amount.toLocaleString()} ACAT`);

        return false;
    }

    userBalance -= amount;

    document.getElementById('balance-view').innerText =
        userBalance.toLocaleString();

    await updateFirebase({
        points: userBalance
    });

    return true;
}
```

---

# 2) Replace `loadUserData()` With This

```javascript
async function loadUserData(){

    const greet = document.getElementById("user-greeting");

    if(greet)
        greet.innerText = `🐱 Welcome, @${username}`;

    const baseAppUrl = window.location.href.split('?')[0];

    const refField = document.getElementById('ref-link-field');

    if(refField)
        refField.value = `${baseAppUrl}?ref=${userId}`;

    try{

        const response = await fetch(`${FIREBASE_URL}/${userId}.json`);

        const data = await response.json();

        if(data){

            userBalance = parseFloat(data.points || 0);

            let wField = document.getElementById('wallet-input-field');

            if(wField && data.wallet && data.wallet !== "Not Connected") {
                wField.value = data.wallet;
            }

            document.getElementById('total-ref-count').innerText =
                data.referrals_count || "0";

            document.getElementById('total-ref-earnings').innerText =
                `${(data.referral_rewards || 0).toLocaleString()} ACAT`;

            document.getElementById('refer-earning-view').innerText =
                (data.referral_rewards || 0).toLocaleString();

        } else {

            // NEW USER BONUS
            userBalance = 5000;

            await updateFirebase({
                username: username,
                points: 5000,
                wallet: "Not Connected",
                referrals_count: 0,
                referral_rewards: 0,
                welcome_bonus: true
            });

            console.log("✅ 5000 ACAT Welcome Bonus Added");
        }

        document.getElementById('balance-view').innerText =
            userBalance.toLocaleString();

        checkReferralParameters();

        fetchGlobalNetworkCount();

    } catch(error) {
        console.log(error);
    }
}
```

---

# 3) Replace Referral Reward Section Inside `checkReferralParameters()`

Find This:

```javascript
let curRewards =
    parseInt(refData.referral_rewards || 0) + 250;

let curPoints =
    parseInt(refData.points || 0) + 250;
```

Replace With:

```javascript
let dynamicReferral = getDynamicReferralReward();

let curRewards =
    parseFloat(refData.referral_rewards || 0) + dynamicReferral;

let curPoints =
    parseFloat(refData.points || 0) + dynamicReferral;
```

---

# 4) Replace Game Reward Section Inside `updateGameFrame()`

Find This:

```javascript
let calculatedReward =
    Math.round(15 * rewardScale);

if(calculatedReward < 1)
    calculatedReward = 1;
```

Replace With:

```javascript
let calculatedReward = getDynamicGameReward();
```

---

# 5) Replace Entire `toggleMining()` Function

```javascript
let miningInterval = null;

function toggleMining(){

    const btn = document.getElementById('mining-toggle-btn');

    const log = document.getElementById('term-log');

    const hashrate = document.getElementById('live-hashrate');

    if(!miningInterval) {

        log.innerHTML += "[SYS] Starting mining processors...<br>";

        btn.innerText = "Pause Mining Engine";

        btn.style.background = "var(--red)";

        miningInterval = setInterval(async()=>{

            let hourlyReward = getDynamicMiningReward();

            userBalance += hourlyReward;

            document.getElementById('balance-view').innerText =
                userBalance.toLocaleString();

            log.innerHTML +=
                `[MINED] +${hourlyReward} ACAT block verified.<br>`;

            log.scrollTop = log.scrollHeight;

            hashrate.innerText =
                (11 + Math.random()*3).toFixed(2) + " GH/s";

            await updateFirebase({
                points: userBalance
            });

        }, 3600000); // 1 hour

    } else {

        clearInterval(miningInterval);

        miningInterval = null;

        log.innerHTML += "[SYS] Mining paused.<br>";

        btn.innerText = "Start Mining Engine";

        btn.style.background = "var(--accent)";

        hashrate.innerText = "0.00 H/s";
    }
}
```

---

# 6) Replace `calcTokens()` Function

```javascript
function calcTokens() {

    const usd =
        Number(document.getElementById('usd-amount').value);

    let dynamicRate = getDynamicBuyRate();

    let estimatedTokens = usd * dynamicRate;

    document.getElementById('acat-preview').innerText =
        estimatedTokens.toLocaleString();

    const errorLog =
        document.getElementById('buy-pool-error');

    if(estimatedTokens > MAX_TOTAL_SUPPLY) {

        errorLog.innerText =
            "❌ Error: Purchase amount exceeds pool limit!";

        return false;

    } else {

        errorLog.innerText = "";

        return true;
    }
}
```

---

# 7) Replace `payWithGateway()` Function

```javascript
async function payWithGateway(){

    if(!calcTokens()) {

        alert("Transaction aborted!");
        return;
    }

    let chosenUsd =
        Number(document.getElementById('usd-amount').value);

    let dynamicRate = getDynamicBuyRate();

    let boughtTokens = chosenUsd * dynamicRate;

    userBalance += boughtTokens;

    document.getElementById('balance-view').innerText =
        userBalance.toLocaleString();

    await updateFirebase({
        points: userBalance
    });

    alert(`🎉 Success! +${boughtTokens.toLocaleString()} ACAT credited.`);
}
```

---

# 8) Replace `placeTrade()` Deduction Area

Keep this:

```javascript
const deducted = await deductBalance(chosenAmount);

if(!deducted)
    return;
```

Already correct.

---

# 9) Replace `submitWithdraw()` Function

```javascript
async function submitWithdraw(){

    const walletAddr =
        document.getElementById('wallet-input-field').value.trim();

    const amount =
        parseFloat(document.getElementById('withdraw-amount').value);

    const dynamicMinimum = getDynamicWithdrawMinimum();

    if(
        !walletAddr ||
        !walletAddr.startsWith("0x") ||
        walletAddr.length !== 42
    ) {
        alert("❌ Error: Invalid BEP20 Address");
        return;
    }

    if(isNaN(amount) || amount < dynamicMinimum){

        alert(`❌ Minimum Withdraw is ${dynamicMinimum} ACAT`);

        return;
    }

    const deducted = await deductBalance(amount);

    if(!deducted)
        return;

    await updateFirebase({
        points: userBalance,
        wallet: walletAddr
    });

    alert("🚀 Withdrawal Ledger Synchronized!");
}
```

---

# Final Dynamic Economy Result

## Initially

* Welcome Bonus → 5000 ACAT
* Mining → 100 ACAT/hour
* Game Reward → ~1 ACAT+
* Referral → 100 ACAT
* Withdraw Minimum → 1000 ACAT
* 1 USD → 25,000 ACAT

## As Users Increase Toward 1,000,000

Everything automatically decreases like Bitcoin/Satoshi scarcity system:

* Mining reward drops
* Game reward drops
* Referral drops
* Buy rate drops
* Withdraw minimum drops

This creates:

* Scarcity
* Controlled supply
* Anti-inflation economy
* Long-term token survival
* Early-user advantage
