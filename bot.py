import os
import requests
import json
import telebot

# CORE API INFRASTRUCTURE
BOT_TOKEN = "8889229014:AAGUsskvyZFnHhmkN5ENqovVDkbdAKiDOvQ"
bot = telebot.TeleBot(BOT_TOKEN)

FIREBASE_URL = "https://aero-cat-mining-default-rtdb.firebaseio.com/users"
WEB_PORTAL_URL = "https://aerocatofficial.github.io/"

# 1. START COMMAND HANDLER
@bot.message_handler(commands=['start'])
def start_command(message):
    try:
        user_id = str(message.from_user.id)
        username = message.from_user.username or "Anonymous"
        
        response = requests.get(f"{FIREBASE_URL}/{user_id}.json")
        user_data = response.json()

        # WebApp Inline Button Setup
        markup = telebot.types.InlineKeyboardMarkup()
        markup.add(telebot.types.InlineKeyboardButton(text="⛏️ Open Aero Cat Hub", web_app=telebot.types.WebAppInfo(url=WEB_PORTAL_URL)))

        if user_data is None:
            new_data = {'username': username, 'points': 50000, 'wallet': 'Not Connected'}
            requests.put(f"{FIREBASE_URL}/{user_id}.json", json=new_data)
            welcome_text = (
                f"✈️ <b>Welcome to Aero Cat Mining Network, @{username}!</b>\n\n"
                f"🎁 <b>50,000 ACAT</b> Bonus Added Successfully!\n\n"
                f"💳 Connect Wallet:\n<code>/setwallet 0xYourWalletAddress</code>"
            )
        else:
            current_points = int(user_data.get('points', 0))
            wallet = user_data.get('wallet', 'Not Connected')
            welcome_text = (
                f"👋 <b>Welcome Back, @{username}</b>\n\n"
                f"💎 Balance: <b>{current_points:,} ACAT</b>\n"
                f"💳 Wallet:\n<code>{wallet}</code>"
            )

        bot.reply_to(message, welcome_text, parse_mode="HTML", reply_markup=markup)
    except Exception as e:
        print("Error:", e)

# 2. WALLET SET HANDLER
@bot.message_handler(commands=['setwallet'])
def set_wallet(message):
    try:
        user_id = str(message.from_user.id)
        parts = message.text.split()
        if len(parts) < 2:
            bot.reply_to(message, "❌ Usage:\n<code>/setwallet 0xYourWalletAddress</code>", parse_mode="HTML")
            return
        
        wallet_address = parts[1].strip()
        if not wallet_address.startswith("0x") or len(wallet_address) != 42:
            bot.reply_to(message, "❌ Invalid wallet address format!")
            return

        requests.patch(f"{FIREBASE_URL}/{user_id}.json", json={'wallet': wallet_address})
        bot.reply_to(message, f"✅ <b>Wallet Linked Successfully!</b>\n\n<code>{wallet_address}</code>", parse_mode="HTML")
    except:
        pass

if __name__ == '__main__':
    print("[ACTIVE] Aero Cat Bot Core is running flawlessly via Replit Polling...")
    bot.infinity_polling()
