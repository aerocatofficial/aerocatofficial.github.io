import telebot
import requests
import json

# REPLIT TOKEN SECURITY:
# Agar Replit Secrets mein TOKEN save kiya hai, toh ye line use karo:
# import os
# BOT_TOKEN = os.environ['BOT_TOKEN']
# Warna yahan apna naya wala token likho (Quotes mein):
BOT_TOKEN = "8889229014:AAH5dA_lgvUoP6-7yJl4ZBeESmJ-5_GZv7k"

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

        # WebApp Button Markup
        markup = telebot.types.InlineKeyboardMarkup()
        web_app_info = telebot.types.WebAppInfo(url=WEB_PORTAL_URL)
        markup.add(telebot.types.InlineKeyboardButton(text="⛏️ Open Aero Cat Hub", web_app=web_app_info))

        if user_data is None:
            new_data = {'username': username, 'points': 50000, 'wallet': 'Not Connected'}
            requests.put(f"{FIREBASE_URL}/{user_id}.json", json=new_data)
            welcome_text = (f"✈️ <b>Welcome, @{username}!</b>\n\n🎁 <b>50,000 ACAT</b> Bonus Added!\n\n"
                            f"💳 Connect Wallet:\n<code>/setwallet 0xYourWalletAddress</code>")
        else:
            pts = "{:,}".format(int(user_data.get('points', 0)))
            wallet = user_data.get('wallet', 'Not Connected')
            welcome_text = (f"👋 <b>Welcome Back, @{username}</b>\n\n💎 Balance: <b>{pts} ACAT</b>\n"
                            f"💳 Wallet:\n<code>{wallet}</code>")

        bot.reply_to(message, welcome_text, parse_mode="HTML", reply_markup=markup)
    except Exception as e:
        print("START ERROR:", e)

@bot.message_handler(commands=['setwallet'])
def set_wallet(message):
    try:
        parts = message.text.split()
        if len(parts) < 2:
            bot.reply_to(message, "❌ Usage: <code>/setwallet 0xAddress</code>", parse_mode="HTML")
            return
        
        addr = parts[1].strip()
        if not addr.startswith("0x") or len(addr) != 42:
            bot.reply_to(message, "❌ Invalid format!")
            return

        requests.patch(f"{FIREBASE_URL}/{message.from_user.id}.json", json={'wallet': addr})
        bot.reply_to(message, f"✅ <b>Wallet Linked:</b>\n<code>{addr}</code>", parse_mode="HTML")
    except Exception as e:
        print("WALLET ERROR:", e)

if __name__ == "__main__":
    print("[ACTIVE] Aero Cat Bot Core is running flawlessly via Replit Polling...")
    bot.infinity_polling()
