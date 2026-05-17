const config = require('../config')
const { generateButtonMessage } = require('./pair')
const { cmd, commands } = require('../command')
const axios = require('axios')
const os = require('os');


//==================================================================Ping Cmd eka=============================================================
cmd({
  pattern: "ping",
  alias: ["speed"],
  desc: "Check bot's response speed.",
  category: "main",
  use: ".ping",
  filename: __filename
},
async (conn, mek, m, context) => {

  const { from, reply } = context;

  try {
    const start = Date.now();

    await conn.sendMessage(from, {
      react: {
        text: "⚡",
        key: mek.key
      }
    });

    const fgclink = {
      key: {
        remoteJid: "status@broadcast",
        fromMe: false,
        id: 'FAKE_META_ID_001',
        participant: '13135550002@s.whatsapp.net'
      },
      message: {
        contactMessage: {
          displayName: '© NEXUS MINI V1',
          vcard: `BEGIN:VCARD
VERSION:3.0
N:Alip;;;;
FN:Alip
TEL;waid=13135550002:+1 313 555 0002
END:VCARD`
        }
      }
    };

    const latency = Date.now() - start;

    let performanceEmoji = "";
    let statusText = "";

    if (latency <= 100) {
      performanceEmoji = "🚀";
      statusText = "EXCELLENT";
    } else if (latency <= 200) {
      performanceEmoji = "📶";
      statusText = "GOOD";
    } else if (latency <= 400) {
      performanceEmoji = "⚠️";
      statusText = "NORMAL";
    } else if (latency <= 800) {
      performanceEmoji = "🐌";
      statusText = "SLOW";
    } else {
      performanceEmoji = "❌";
      statusText = "POOR";
    }

    const quality = Math.min(100, Math.max(0, 100 - Math.floor(latency / 10)));

    const replyText =
`⚡ *PING RESULT*

┌─ ❍ *Latency:* ${latency} ms
├─ ❍ *Status:* ${statusText} ${performanceEmoji}
├─ ❍ *Quality:* ${quality}%
└─ ❍ *Response:* ${latency <= 200 ? 'Fast 🚀' : latency <= 400 ? 'Normal ⚠️' : 'Slow 🐌'}`;

    const buttons = [
      {
        buttonId: ".menu",
        buttonText: { displayText: "📜 Menu" },
        type: 1
      },
      {
        buttonId: ".alive",
        buttonText: { displayText: "💚 Alive" },
        type: 1
      }
    ];

    await conn.sendMessage(
      from,
      generateButtonMessage(replyText, buttons),
      { quoted: fgclink }
    );

    let reaction = '✅';

    if (latency < 100) reaction = '🔥';
    else if (latency < 200) reaction = '✅';
    else if (latency < 400) reaction = '⚠️';
    else if (latency < 800) reaction = '🐌';
    else reaction = '❌';

    await conn.sendMessage(from, {
      react: {
        text: reaction,
        key: mek.key
      }
    }).catch(() => {});

  } catch (error) {

    console.error('Ping command error:', error);

    if (error.message?.includes('rate-overlimit') || error.data === 429) {

      await reply(`⚠️ *Bot is busy!*\n└─ Please try again in a few seconds.`);

    } else {

      await reply(`❌ *Error:* ${error.message || 'Failed to measure ping'}`);

    }
  }
});




// Runtime function එක
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
    var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
    var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
    var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

cmd({
    pattern: "alive",
    react: "👾",
    alias: ["online", "test", "bot"],
    desc: "Check if bot is online.",
    category: "main",
    use: ".alive",
    filename: __filename
},
async (conn, mek, m, context) => {
    const { from, prefix, pushname, reply, sender } = context;

    try {
        // Detect hosting environment
        const hostnameLength = os.hostname().length;
        let hostname = "Unknown";

        switch (hostnameLength) {
            case 12: hostname = 'Replit'; break;
            case 36: hostname = 'Heroku'; break;
            case 8: hostname = 'Koyeb'; break;
            default: hostname = os.hostname();
        }

        // RAM + Uptime
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
        const ramUsage = `${ramUsed}MB / ${ramTotal}MB`;
        const rtime = runtime(process.uptime());
        const botNumber = conn.user.id.split(':')[0].replace(/@s\.whatsapp\.net$/, '');

        // Default values if config doesn't have them
        const aliveMsg = config.ALIVE || `*👋 Hello ${pushname} !*
I am alive now 🎈

✨ *NEXION MINI BOT* ✨
_Your trusted WhatsApp Bot_

◈•————————————————•◈
 📊 *System Status*
◈•————————————————•◈
  ⌚ *Uptime* ⩥ ${rtime}
  🚨 *Host* ⩥ ${hostname}
  🍭 *Prefix* ⩥ ${config.PREFIX || '/'}
  👤 *User*  ⩥ ${pushname}
  🗃️ *RAM* ⩥ ${ramUsage}
  📱 *Number* ⩥ ${botNumber}

◈•————————————————•◈
 *Bot is running smoothly!* ✅`;

        const logo = config.LOGO || 'https://files.catbox.moe/srf3p5.mp3'; // Default logo/image URL
        const footer = config.FOOTER || 'NEXION MINI BOT';
        
        // Send as button message using Baileys native buttons
        const buttonMessage = {
            image: { url: logo },
            caption: aliveMsg,
            footer: footer,
            buttons: [
                { buttonId: prefix + 'menu', buttonText: { displayText: '📋 MENU' }, type: 1 },
                { buttonId: prefix + 'ping', buttonText: { displayText: '⚡ SPEED' }, type: 1 }
            ],
            headerType: 4
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });

        // React with success emoji
        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        }).catch(() => {});

    } catch (error) {
        console.error('Alive command error:', error);
        
        // Fallback: send simple text message if button message fails
        try {
            await reply(`✅ *Bot is alive!*\n\nUptime: ${runtime(process.uptime())}\nRAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`);
        } catch (e) {
            await reply('*Bot is alive!* ✅');
        }
    }
});
