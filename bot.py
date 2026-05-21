import telebot
import requests
import json
import os
from flask import Flask
from threading import Thread

# --- KEEP ALIVE SERVER ---
app = Flask('')
@app.route('/')
def home():
    return "Bot is alive!"
def run():
    app.run(host='0.0.0.0', port=8080)
def keep_alive():
    t = Thread(target=run)
    t.start()

keep_alive() # Ye aapke bot ko 24/7 zinda rakhega
# -------------------------

BOT_TOKEN = "8889229014:AAH5dA_lgvUoP6-7yJl4ZBeESmJ-5_Gzv7k"
bot = telebot.TeleBot(BOT_TOKEN)
FIREBASE_URL = "https://aero-cat-mining-default-rtdb.firebaseio.com/users"
WEB_PORTAL_URL = "https://aerocatofficial.github.io/"

@bot.message_handler(commands=['start'])
def start_command(message):
    try:
        user_id = str(message.from_user.id)
        username = message.from_user.username or "Anonymous"

        response = requests.get(f"{FIREBASE_URL}/{user_id}.json")
        user_data = response.json()

        markup = telebot.types.InlineKeyboardMarkup()
        web_app_info = telebot.types.WebAppInfo(url=WEB_PORTAL_URL)
        markup.add(telebot.types.InlineKeyboardButton(text="⛏️ Open Aero Cat Hub", web_app=web_app_info))
        markup.add(
            telebot.types.InlineKeyboardButton(text="📢 WhatsApp Channel", url="https://whatsapp.com/channel/0029Vb88Z3ABKfhrcBWys11W"),
            telebot.types.InlineKeyboardButton(text="𝕏 Follow on X", url="https://x.com/AerocatTeam")
        )

        if user_data is None:
            new_data = {'username': username, 'points': 0, 'wallet': 'Not Connected'}
            requests.put(f"{FIREBASE_URL}/{user_id}.json", json=new_data)
            welcome_text = (f"✈️ <b>Welcome to Aero Cat Mining, @{username}!</b>\n\n"
                            f"Aero Cat Mining Network is now live! Join our community.\n\n"
                            f"Mining is simple—just click the button below.")
        else:
            welcome_text = (f"👋 <b>Welcome Back, @{username}</b>\n\n"
                            f"Ready to mine more? Open your Mining Portal below.")

        bot.reply_to(message, welcome_text, parse_mode="HTML", reply_markup=markup)
    except Exception as e:
        print("START ERROR:", e)

@bot.message_handler(commands=['setwallet'])
def set_wallet(message):
    try:
        parts = message.text.split()
        if len(parts) < 2:
            bot.reply_to(message, "❌ Usage: <code>/setwallet 0xYourWalletAddress</code>", parse_mode="HTML")
            return
        addr = parts[1].strip()
        if not addr.startswith("0x") or len(addr) != 42:
            bot.reply_to(message, "❌ Invalid wallet address format!")
            return
        requests.patch(f"{FIREBASE_URL}/{message.from_user.id}.json", json={'wallet': addr})
        bot.reply_to(message, f"✅ <b>Wallet Linked:</b>\n<code>{addr}</code>", parse_mode="HTML")
    except Exception as e:
        print("WALLET ERROR:", e)

if __name__ == "__main__":
    print("[ACTIVE] Aero Cat Bot Core is running flawlessly...")
    bot.infinity_polling()
