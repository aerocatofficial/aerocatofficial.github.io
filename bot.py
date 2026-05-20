import os
import threading
import requests
import json
import asyncio
import telebot
from aiohttp import web

# ========================================== #
# CORE CONFIGURATION & BOT TOKENS            #
# ========================================== #
BOT_TOKEN = "8889229014:AAGUsskvyZFnHhmkN5ENqovVDkbdAKiDOvQ"
bot = telebot.TeleBot(BOT_TOKEN)

FIREBASE_URL = "https://aero-cat-mining-default-rtdb.firebaseio.com/users"
WEB_PORTAL_URL = "https://aerocatofficial.github.io/"  # App frontend connection link

# ========================================== #
# 1. TELEGRAM BOT HANDLERS                   #
# ========================================== #
@bot.message_handler(commands=['start'])
def start_command(message):
    try:
        user_id = str(message.from_user.id)
        username = message.from_user.username or "Anonymous"

        response = requests.get(f"{FIREBASE_URL}/{user_id}.json")
        user_data = response.json()

        # WebApp Inline Button Setup
        markup = telebot.types.InlineKeyboardMarkup()
        web_app_info = telebot.types.WebAppInfo(url=WEB_PORTAL_URL)
        markup.add(telebot.types.InlineKeyboardButton(text="⛏️ Open Aero Cat Hub", web_app=web_app_info))

        # NEW USER PROTOCOL
        if user_data is None:
            initial_points = 50000
            new_data = {
                'username': username,
                'points': initial_points,
                'wallet': 'Not Connected'
            }
            requests.put(f"{FIREBASE_URL}/{user_id}.json", json=new_data)

            welcome_text = (
                f"✈️ <b>Welcome to Aero Cat Mining Network, @{username}!</b>\n\n"
                f"🎁 <b>50,000 ACAT</b> Bonus Added Successfully!\n\n"
                f"💳 Connect Wallet:\n<code>/setwallet 0xYourWalletAddress</code>\n\n"
                f"🛸 Click below to open your mining dashboard console:"
            )

        # EXISTING USER DATA FETCHING
        else:
            try:
                current_points = int(user_data.get('points', 0))
            except:
                current_points = 0
                
            wallet = user_data.get('wallet', 'Not Connected')
            points_str = "{:,}".format(current_points)

            welcome_text = (
                f"👋 <b>Welcome Back, @{username}</b>\n\n"
                f"💎 Balance: <b>{points_str} ACAT</b>\n"
                f"💳 Wallet:\n<code>{wallet}</code>\n\n"
                f"🔄 Change Wallet:\n<code>/setwallet 0xYourWalletAddress</code>\n\n"
                f"🛸 Click below to open your mining dashboard console:"
            )

        bot.reply_to(message, welcome_text, parse_mode="HTML", reply_markup=markup)
    except Exception as e:
        print("START ERROR:", e)

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

        response = requests.get(f"{FIREBASE_URL}/{user_id}.json")
        user_data = response.json()

        if user_data is None:
            bot.reply_to(message, "❌ Please type /start first.")
            return

        requests.patch(f"{FIREBASE_URL}/{user_id}.json", json={'wallet': wallet_address})
        bot.reply_to(message, f"✅ <b>Wallet Linked Successfully!</b>\n\n<code>{wallet_address}</code>", parse_mode="HTML")
    except Exception as e:
        print("WALLET ERROR:", e)

# ========================================== #
# 2. RAILWAY PORT PORTAL KEEPALIVE ENGINE    #
# ========================================== #
async def handle_railway_ping(request):
    return web.Response(text="[ONLINE] Aero Cat Bot Framework is operational and listening to nodes.")

def run_web_server():
    app = web.Application()
    app.router.add_get('/', handle_railway_ping)
    # Railway automatically allocates dynamic ports via env variables
    port = int(os.environ.get("PORT", 8080))
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    runner = web.AppRunner(app)
    loop.run_until_complete(runner.setup())
    site = web.TCPSite(runner, '0.0.0.0', port)
    loop.run_until_complete(site.start())
    print(f"[RAILWAY] Server node bound on interface port: {port}")
    loop.run_forever()

# ========================================== #
# 3. CORE SYSTEM EXECUTOR                     #
# ========================================== #
if __name__ == "__main__":
    print("[SYS] Initializing Aero Cat System Cores...")
    
    # Detach web ping network into an independent daemon threat
    t = threading.Thread(target=run_web_server, daemon=True)
    t.start()
    
    print("[ACTIVE] Bot Core polling is actively handling server traffic...")
    bot.infinity_polling()
