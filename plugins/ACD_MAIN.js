const config = require('../config')
const { generateButtonMessage } = require('./pair')
const { cmd, commands } = require('../command')
const axios = require('axios')


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
