cat << 'EOF' > bot.py
import telebot
import requests
import json

BOT_TOKEN = "8889229014:AAGUsskvyZFnHhmkN5ENqovVDkbdAKiDOvQ"
bot = telebot.TeleBot(BOT_TOKEN)

FIREBASE_URL = "https://aero-cat-mining-default-rtdb.firebaseio.com/users"

@bot.message_handler(commands=['start'])
def start_command(message):
    try:
        user_id = str(message.from_user.id)
        username = message.from_user.username or "Anonymous"

        response = requests.get(f"{FIREBASE_URL}/{user_id}.json")
        user_data = response.json()

        # NEW USER
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
                f"💳 Connect Wallet:\n<code>/setwallet 0xYourWalletAddress</code>"
            )

        # EXISTING USER
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
                f"🔄 Change Wallet:\n<code>/setwallet 0xYourWalletAddress</code>"
            )

        bot.reply_to(message, welcome_text, parse_mode="HTML")
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

if __name__ == "__main__":
    print("Aero Cat Bot is running flawlessly via REST API...")
    bot.infinity_polling()
EOF
