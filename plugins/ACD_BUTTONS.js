const { cmd } = require('../command');
const config = require('../config');

// ========== WEATHER BUTTON EXAMPLE ==========
cmd({
    pattern: "weather",
    desc: "Get weather information with buttons",
    category: "utility",
    react: "🌤️",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    
    if (!q) {
        const cities = [
            { id: "weather_colombo", text: "🌆 Colombo" },
            { id: "weather_kandy", text: "🏔️ Kandy" },
            { id: "weather_galle", text: "🌊 Galle" },
            { id: "weather_jaffna", text: "☀️ Jaffna" }
        ];
        return await m.replyButtons("🌤️ *Weather Information*\n\nSelect a city:", cities);
    }
    
    // Weather API integration
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=YOUR_API_KEY&units=metric`);
        const data = response.data;
        
        const weatherText = `🌤️ *Weather in ${data.name}*\n\n` +
                           `🌡️ Temperature: ${data.main.temp}°C\n` +
                           `💨 Humidity: ${data.main.humidity}%\n` +
                           `🌬️ Wind: ${data.wind.speed} m/s\n` +
                           `📝 Condition: ${data.weather[0].description}`;
        
        const buttons = [
            { id: `weather_refresh_${q}`, text: "🔄 Refresh" },
            { id: "weather_forecast", text: "📅 Forecast" }
        ];
        
        await m.replyInteractive(weatherText, buttons, "Weather Info");
    } catch (error) {
        await reply("❌ City not found! Please try again.");
    }
});

// ========== CALCULATOR WITH BUTTONS ==========
cmd({
    pattern: "calc",
    alias: ["calculator"],
    desc: "Simple calculator",
    category: "utility",
    react: "🧮",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    
    const calcButtons = [
        { id: "calc_1", text: "1" }, { id: "calc_2", text: "2" }, { id: "calc_3", text: "3" }, { id: "calc_add", text: "+" },
        { id: "calc_4", text: "4" }, { id: "calc_5", text: "5" }, { id: "calc_6", text: "6" }, { id: "calc_sub", text: "-" },
        { id: "calc_7", text: "7" }, { id: "calc_8", text: "8" }, { id: "calc_9", text: "9" }, { id: "calc_mul", text: "×" },
        { id: "calc_clear", text: "C" }, { id: "calc_0", text: "0" }, { id: "calc_eq", text: "=" }, { id: "calc_div", text: "÷" }
    ];
    
    await m.replyButtons("🧮 *Calculator*\n\nTap buttons to calculate:", calcButtons);
});

// ========== POLL WITH BUTTONS ==========
cmd({
    pattern: "poll",
    desc: "Create a poll",
    category: "group",
    react: "📊",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, isGroup }) => {
    
    if (!isGroup) return reply("❌ Polls can only be created in groups!");
    
    const pollButtons = [
        { id: "poll_option1", text: "✅ Yes" },
        { id: "poll_option2", text: "❌ No" },
        { id: "poll_option3", text: "🤷 Maybe" }
    ];
    
    await m.replyInteractive(`📊 *POLL*\n\nQuestion: ${q || "Default question?"}\n\nVote by tapping a button:`, pollButtons);
});

// ========== CONFIRMATION DIALOG BUTTONS ==========
cmd({
    pattern: "delete",
    desc: "Delete bot's message with confirmation",
    category: "utility",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted }) => {
    
    if (!quoted) return reply("❌ Please reply to a message to delete!");
    
    const confirmButtons = [
        { id: "delete_confirm", text: "✅ Yes, Delete" },
        { id: "delete_cancel", text: "❌ Cancel" }
    ];
    
    await m.replyInteractive("⚠️ *Confirm Delete*\n\nAre you sure you want to delete this message?", confirmButtons);
});

// Handle delete confirmation
cmd({
    on: "body",
    pattern: "delete_.*",
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted }) => {
    if (m.body === "delete_confirm") {
        if (quoted) {
            await quoted.delete();
            await reply("✅ Message deleted successfully!");
        } else {
            await reply("❌ No message to delete!");
        }
    } else if (m.body === "delete_cancel") {
        await reply("❌ Deletion cancelled.");
    }
});

// ========== LANGUAGE SELECTOR BUTTONS ==========
cmd({
    pattern: "language",
    alias: ["lang"],
    desc: "Change bot language",
    category: "settings",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    
    const languages = [
        { id: "lang_en", text: "🇬🇧 English" },
        { id: "lang_si", text: "🇱🇰 Sinhala" },
        { id: "lang_ta", text: "🇱🇰 Tamil" },
        { id: "lang_hi", text: "🇮🇳 Hindi" }
    ];
    
    await m.replyInteractive("🌐 *Select Language*\n\nChoose your preferred language:", languages, "Language Settings");
});
