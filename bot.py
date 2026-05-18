import telebot
import firebase_admin
from firebase_admin import credentials, db

# 1. Firebase System Sync
if not firebase_admin._apps:
    firebase_admin.initialize_app(options={
        'databaseURL': 'https://aero-cat-mining-default-rtdb.firebaseio.com/'
    })

# 2. Add Your Real Token From BotFather Here
BOT_TOKEN = "YOUR_REAL_TELEGRAM_BOT_TOKEN_HERE" 
bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start_command(message):
    user_id = str(message.from_user.id)
    username = message.from_user.username or "Anonymous"
    
    # Check if miner already exists in database
    ref = db.reference(f'users/{user_id}')
    user_data = ref.get()
    
    if not user_data:
        # Register new miner with start bonus
        initial_points = 50000
        ref.set({
            'username': username,
            'points': initial_points,
            'wallet': 'Not Connected'
        })
        welcome_text = (
            f"✈️ **Welcome to Aero Cat Mining Network, @{username}!**\n\n"
            f"💰 Account created! **{initial_points:,} $ACAT** bonus points credited.\n\n"
            f"👉 Next Step: Use `/setwallet YOUR_WALLET_ADDRESS` to link your MetaMask/Trust Wallet."
        )
    else:
        welcome_text = (
            f"Welcome back, @{username}!\n\n"
            f"💎 Balance: **{user_data['points']:,} $ACAT**\n"
            f"💳 Linked Wallet: `{user_data.get('wallet', 'Not Connected')}`\n\n"
            f"To change wallet, use: `/setwallet YOUR_WALLET_ADDRESS`"
        )
        
    bot.reply_to(message, welcome_text, parse_mode="Markdown")

@bot.message_handler(commands=['setwallet'])
def set_wallet(message):
    user_id = str(message.from_user.id)
    
    # Extract wallet address from command text
    try:
        parts = message.text.split()
        if len(parts) < 2:
            bot.reply_to(message, "❌ Format: `/setwallet 0xYourWalletAddress`", parse_mode="Markdown")
            return
            
        wallet_address = parts[1].strip()
        
        # Simple Ethereum/BSC address length check
        if not wallet_address.startswith("0x") or len(wallet_address) != 42:
            bot.reply_to(message, "❌ Invalid Wallet Address! Please enter a valid BSC (0x...) address.")
            return
            
        ref = db.reference(f'users/{user_id}')
        user_data = ref.get()
        
        if user_data:
            ref.update({'wallet': wallet_address})
            bot.reply_to(message, f"✅ **Wallet Linked Successfully!**\n\nAddress: `{wallet_address}`\n\nGo to the Aero Cat website, connect the same wallet, and claim your balance.", parse_mode="Markdown")
        else:
            bot.reply_to(message, "❌ Please type `/start` first to register your profile.")
            
    except Exception as e:
        bot.reply_to(message, "❌ Something went wrong. Try again.")

if __name__ == "__main__":
    print("Aero Cat Production Bot Engine running...")
    bot.infinity_polling()
