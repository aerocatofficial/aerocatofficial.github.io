import os
import asyncio
import logging
import aiohttp
from aiogram import Bot, Dispatcher, executor, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiohttp import web

# SYSTEM LOGGING CONFIGURATION
logging.basicConfig(level=logging.INFO)

# ========================================== #
# CORE CONFIGURATION CORES                   #
# ========================================== #
# CRITICAL FIX: Put your exact BotFather token inside the quotes below!
BOT_TOKEN = "7547849...AAG..."  # <— Yahan apna asli token set karein
FIREBASE_URL = "https://aero-cat-mining-default-rtdb.firebaseio.com/users"
WEB_PORTAL_URL = "https://aerocatofficial.github.io/"  # GitHub Pages link

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)

# ========================================== #
# 1. TELEGRAM BOT INITIALIZATION EVENTS      #
# ========================================== #
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    user_id = str(message.from_user.id)
    username = message.from_user.username or f"User_{user_id[:4]}"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{FIREBASE_URL}/{user_id}.json") as resp:
            user_data = await resp.json()
            
        if not user_data:
            initial_payload = {
                "username": username,
                "points": 500,
                "wallet": "Not Connected",
                "referrals_count": 0,
                "referral_rewards": 0
            }
            await session.patch(f"{FIREBASE_URL}/{user_id}.json", json=initial_payload)
            logging.info(f"[NEW USER] Node initialized securely for @{username}")

    markup = InlineKeyboardMarkup()
    web_app_link = WebAppInfo(url=WEB_PORTAL_URL)
    markup.add(InlineKeyboardButton(text="⛏️ Open Aero Cat Hub", web_app=web_app_link))
    
    welcome_text = (
        f"🐱 *Welcome to Aero Cat Protocol, @{username}!*\n\n"
        "Your decentralized validation node workspace is successfully initialized.\n\n"
        "Click the button below to start free mining, execute binary trades, and manage secure withdrawals straight from your dashboard console."
    )
    await message.reply(welcome_text, reply_markup=markup, parse_mode="Markdown")

# ========================================== #
# 2. RENDER PORT KEEPALIVE ENGINE (NO CRASH) #
# ========================================== #
async def handle_render_ping(request):
    return web.Response(text="[SYS] Aero Cat Server Node is Operational and Healthy.")

async def start_web_server():
    app = web.Application()
    app.router.add_get('/', handle_render_ping)
    runner = web.AppRunner(app)
    await runner.setup()
    
    # Render automatically passes PORT environment variable dynamically
    port = int(os.environ.get("PORT", 8080))
    site = web.TCPSite(runner, '0.0.0.0', port)
    await site.start()
    logging.info(f"[RENDER] Keep-alive web interface started on port {port}")

if __name__ == '__main__':
    print("[SYS] Python Asynchronous Server Bot Engine Booting...")
    
    # Run the web server loop in background to satisfy Render health checks
    loop = asyncio.get_event_loop()
    loop.create_task(start_web_server())
    
    # Start Telegram Bot Polling
    executor.start_polling(dp, skip_updates=True, loop=loop)
