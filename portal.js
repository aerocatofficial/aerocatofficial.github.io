```javascript
/* =========================================================
   DYNAMIC SATOSHI-STYLE ECONOMY ENGINE
   =========================================================

   ✅ Reward automatically decreases as users increase
   ✅ Welcome bonus becomes dynamic
   ✅ Mining rewards become dynamic
   ✅ Trading payout becomes dynamic
   ✅ Buy pool rate becomes dynamic
   ✅ Withdraw becomes dynamic

   TARGET EXAMPLE:
   1 User        = High rewards
   10,000 Users  = Lower rewards
   100,000 Users = Very low rewards
   1,000,000 Users = ~0.00005 style economy

========================================================= */


/* ===============================
   ECONOMY SETTINGS
================================= */

const ECONOMY = {

    // INITIAL BONUS
    START_BONUS: 500,

    // INITIAL TOKEN RATE
    BASE_REWARD: 500,

    // DECAY POWER
    DECAY_RATE: 0.000004999995,

    // MINIMUM VALUE
    MIN_REWARD: 0.00005
};


/* ===============================
   DYNAMIC REWARD ENGINE
================================= */

function getDynamicReward(baseAmount = 1){

    let users = globalUsersCount;

    // SATOSHI STYLE DECAY
    let dynamicValue =
        baseAmount / (1 + (users * ECONOMY.DECAY_RATE));

    // NEVER BELOW MINIMUM
    if(dynamicValue < ECONOMY.MIN_REWARD){
        dynamicValue = ECONOMY.MIN_REWARD;
    }

    return parseFloat(dynamicValue.toFixed(8));
}


/* ===============================
   DYNAMIC WELCOME BONUS
================================= */

function getWelcomeBonus(){

    return Math.floor(
        getDynamicReward(ECONOMY.START_BONUS)
    );
}


/* ===============================
   DYNAMIC BUY RATE
================================= */

function getCurrentTokenRate(){

    return getDynamicReward(ECONOMY.BASE_REWARD);
}


/* ===============================
   FETCH GLOBAL USERS
================================= */

async function fetchGlobalNetworkCount() {

    try {

        const userRes =
            await fetch(`${FIREBASE_URL}.json?shallow=true`);

        const allUsers = await userRes.json();

        if(allUsers) {

            globalUsersCount =
                Object.keys(allUsers).length;

            if(globalUsersCount < 1){
                globalUsersCount = 1;
            }

            document.getElementById('network-users').innerText =
                `Global Active Miners: ${globalUsersCount.toLocaleString()}`;

            console.log(
                "🌍 USERS:",
                globalUsersCount,
                "CURRENT RATE:",
                getCurrentTokenRate()
            );
        }

    } catch(e){
        console.log(e);
    }
}


/* ===============================
   WELCOME BONUS UPDATED
================================= */

async function loadUserData(){

    const greet =
        document.getElementById("user-greeting");

    if(greet){
        greet.innerText =
            `🐱 Welcome, @${username}`;
    }

    const baseAppUrl =
        window.location.href.split('?')[0];

    const refField =
        document.getElementById('ref-link-field');

    if(refField){
        refField.value =
            `${baseAppUrl}?ref=${userId}`;
    }

    try{

        await fetchGlobalNetworkCount();

        const response =
            await fetch(`${FIREBASE_URL}/${userId}.json`);

        const data =
            await response.json();

        // EXISTING USER
        if(data){

            userBalance =
                parseFloat(data.points || 0);

            let wField =
                document.getElementById('wallet-input-field');

            if(
                wField &&
                data.wallet &&
                data.wallet !== "Not Connected"
            ){
                wField.value = data.wallet;
            }

            document.getElementById('total-ref-count').innerText =
                data.referrals_count || "0";

            document.getElementById('total-ref-earnings').innerText =
                `${(data.referral_rewards || 0).toLocaleString()} ACAT`;

            document.getElementById('refer-earning-view').innerText =
                (data.referral_rewards || 0).toLocaleString();

        }

        // NEW USER
        else{

            // DYNAMIC BONUS
            let welcomeBonus =
                getWelcomeBonus();

            userBalance = welcomeBonus;

            await updateFirebase({
                username: username,
                points: userBalance,
                wallet: "Not Connected",
                referrals_count: 0,
                referral_rewards: 0,
                welcome_bonus: true,
                created_at: Date.now()
            });

            console.log(
                `🎁 Welcome Bonus: ${welcomeBonus} ACAT`
            );
        }

        document.getElementById('balance-view').innerText =
            Number(userBalance).toLocaleString();

        checkReferralParameters();

    }catch(error){

        console.log(error);
    }
}


/* ===============================
   MINING ENGINE UPDATED
================================= */

function toggleMining(){

    const btn =
        document.getElementById('mining-toggle-btn');

    const log =
        document.getElementById('term-log');

    const hashrate =
        document.getElementById('live-hashrate');

    if(!miningInterval) {

        log.innerHTML +=
            "[SYS] Starting mining processors...<br>";

        btn.innerText =
            "Pause Mining Engine";

        btn.style.background =
            "var(--red)";

        miningInterval = setInterval(async()=>{

            // SATOSHI STYLE DYNAMIC MINING
            let dynamicMined =
                getDynamicReward(0.5);

            userBalance += dynamicMined;

            document.getElementById('balance-view').innerText =
                Number(userBalance).toLocaleString();

            log.innerHTML +=
                `[MINED] +${dynamicMined} ACAT block verified.<br>`;

            log.scrollTop =
                log.scrollHeight;

            hashrate.innerText =
                (11 + Math.random()*3).toFixed(2) + " GH/s";

            await updateFirebase({
                points: userBalance
            });

        }, 3000);

    } else {

        clearInterval(miningInterval);

        miningInterval = null;

        log.innerHTML +=
            "[SYS] Mining paused.<br>";

        btn.innerText =
            "Start Mining Engine";

        btn.style.background =
            "var(--accent)";

        hashrate.innerText =
            "0.00 H/s";
    }
}


/* ===============================
   GAME REWARD UPDATED
================================= */

function updateGameFrame() {

    if(!gameActive)
        return;

    butterflyY += speed;

    const bEl =
        document.getElementById('falling-butterfly');

    bEl.style.top =
        butterflyY + "px";

    if (
        butterflyY >= 190 &&
        butterflyY <= 230 &&
        butterflyColumn === flowerPos
    ) {
        gameOver();
        return;
    }

    if (butterflyY > 260) {

        // DYNAMIC GAME REWARD
        let calculatedReward =
            getDynamicReward(1);

        sessionEarnings += calculatedReward;

        userBalance += calculatedReward;

        document.getElementById('balance-view').innerText =
            Number(userBalance).toLocaleString();

        spawnButterfly();
    }
}


/* ===============================
   BUY POOL UPDATED
================================= */

function calcTokens() {

    const usd =
        Number(document.getElementById('usd-amount').value);

    // DYNAMIC TOKEN RATE
    let tokenRate =
        getCurrentTokenRate();

    let estimatedTokens =
        usd * tokenRate;

    document.getElementById('acat-preview').innerText =
        Number(estimatedTokens).toLocaleString();

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


/* ===============================
   PAYMENT UPDATED
================================= */

async function payWithGateway(){

    if(!calcTokens()) {

        alert("Transaction aborted!");
        return;
    }

    let chosenUsd =
        Number(document.getElementById('usd-amount').value);

    let tokenRate =
        getCurrentTokenRate();

    let boughtTokens =
        chosenUsd * tokenRate;

    userBalance += boughtTokens;

    document.getElementById('balance-view').innerText =
        Number(userBalance).toLocaleString();

    await updateFirebase({
        points: userBalance
    });

    alert(
        `🎉 Success! +${boughtTokens.toLocaleString()} ACAT credited.`
    );
}


/* ===============================
   TRADING PAYOUT UPDATED
================================= */

async function resolveTrade() {

    tradeActive = false;

    document.getElementById('trade-timer').style.display =
        "none";

    document.getElementById('call-btn').disabled =
        false;

    document.getElementById('put-btn').disabled =
        false;

    document.getElementById('trade-amount-input').disabled =
        false;

    let finalCandle =
        candleBars[candleBars.length - 1];

    let finalPrice =
        parseFloat(finalCandle.close.toFixed(2));

    let won = false;

    if(tradeType === "BUY" && finalPrice > strikePrice)
        won = true;

    if(tradeType === "SELL" && finalPrice < strikePrice)
        won = true;

    if(won) {

        // DYNAMIC PAYOUT
        let multiplier =
            getDynamicReward(1.8);

        let payout =
            currentBetCost * multiplier;

        userBalance += payout;

        document.getElementById('trade-status').style.color =
            "var(--green)";

        document.getElementById('trade-status').innerText =
            `🎉 WIN! +${payout.toFixed(8)} ACAT`;

    } else {

        document.getElementById('trade-status').style.color =
            "var(--red)";

        document.getElementById('trade-status').innerText =
            `❌ LOSE! -${currentBetCost} ACAT`;
    }

    document.getElementById('balance-view').innerText =
        Number(userBalance).toLocaleString();

    await updateFirebase({
        points: userBalance
    });
}


/* ===============================
   WITHDRAW UPDATED
================================= */

async function submitWithdraw(){

    const walletAddr =
        document.getElementById('wallet-input-field')
        .value
        .trim();

    const amount =
        parseFloat(
            document.getElementById('withdraw-amount').value
        );

    if(
        !walletAddr ||
        !walletAddr.startsWith("0x") ||
        walletAddr.length !== 42
    ) {

        alert("❌ Invalid BEP20 Address");

        return;
    }

    // MINIMUM
    if(isNaN(amount) || amount < 1000){

        alert("❌ Minimum withdrawal is 1000 ACAT");

        return;
    }

    // SECURE DEDUCTION
    const deducted =
        await deductBalance(amount);

    if(!deducted)
        return;

    await updateFirebase({
        points: userBalance,
        wallet: walletAddr,
        last_withdraw: amount,
        last_withdraw_time: Date.now()
    });

    alert("🚀 Withdrawal Ledger Synchronized!");
}
```
