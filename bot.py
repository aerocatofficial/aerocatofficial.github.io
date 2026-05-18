import telebot
import firebase_admin
from firebase_admin import credentials, db
import requests

# 1. Firebase Live Connection Setup
# Test mode ke liye direct db URL connection utilize kar rahe hain
if not firebase_admin._apps:
    firebase_admin.initialize_app(options={
        'databaseURL': 'https://aero-cat-mining-default-rtdb.firebaseio.com/'
    })

# 2. Telegram Bot Token Setup
BOT_TOKEN = "123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ" # <--- Asli Bot Token yahan aayega
bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start_command(message):
    user_id = str(message.from_user.id)
    username = message.from_user.username or "Anonymous"
    
    # Database reference check
    ref = db.reference(f'users/{user_id}')
    user_data = ref.get()
    
    if not user_data:
        # Naya miner join ho raha he -> Bonus points generate
        initial_points = 50000
        ref.set({
            'username': username,
            'points': initial_points,
            'wallet': 'Not Connected'
        })
        welcome_text = f"✈️ **Welcome to Aero Cat Mining Network!**\n\nYour account registered successfully.\n💰 Start Bonus: **{initial_points:,} $ACAT** points credited!\n\nConnect your wallet on our official website to claim your data."
    else:
        welcome_text = f"Welcome back, @{username}!\n\n💎 Current Balance: **{user_data['points']:,} $ACAT**\n\nKeep holding and checking the website for airdrop distribution."
        
    bot.reply_to(message, welcome_text, parse_mode="Markdown")

# Bot engine activation command
if __name__ == "__main__":
    print("Aero Cat Engine initialized on Firebase successfully...")
    bot.infinity_polling()
