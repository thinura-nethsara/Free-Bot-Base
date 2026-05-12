const config = require('../config')
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
  const { from, reply, sender, pushname } = context;

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
    }

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

    const replyText = `⚡ PING RESULT\n\n` +
                      `┌─ ❍ *Latency:* ${latency} ms\n` +
                      `├─ ❍ *Status:*  ${statusText}\n` +
                      `├─ ❍ *Quality:* ${quality}%\n` +
                      `└─ ❍ *Response:* ${latency <= 200 ? 'Fast 🚀' : latency <= 400 ? 'Normal ⚠️' : 'Slow 🐌'}`;

    await conn.sendMessage(from, { text: replyText }, { quoted: fgclink });

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


//======================================================apk download cmd eka==================================================================================


cmd({
    pattern: "apk",
    alias: ["apkdown", "apkdl", "getapk"],
    desc: "Search and download APK files",
    category: "download",
    use: ".apk <app name>",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, args, isOwner, pushname }) => {
    try {
        if (!q) {
            return reply(`❌ *Please provide an app name!*\n\nExample: .apk whatsapp`);
        }

        const apiUrl = `https://saviya-kolla-api.koyeb.app/download/apk?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.result) {
            return reply(`❌ *APK not found!*\nPlease try another app name.`);
        }

        const result = data.result;

        const caption = `◉ *APK DOWNLOADER* ◉

╭━━━━━━━━━━━━━━━━━●◌
│ ■ *App:* ${result.name}
│ ■ *Package:* ${result.package}
│ ■ *Size:* ${result.size}
│ ■ *Rating:* ${result.rating || 'N/A'}
╰━━━━━━━━━━━━━━━━━●◌

> *© Powered by Nexus Mini Bot*`;

        // Send with button for download
        const buttonMessage = {
            text: caption,
            footer: 'Tap the button below to download',
            buttons: [
                {
                    buttonId: `${config.PREFIX}apkdownload ${result.name}`,
                    buttonText: { displayText: '⬇️ DOWNLOAD APK' },
                    type: 1
                }
            ],
            headerType: 1
        };

        // Send app icon if available
        if (result.icon) {
            await conn.sendMessage(from, {
                image: { url: result.icon },
                caption: caption,
                buttons: [
                    {
                        buttonId: `${config.PREFIX}apkdownload ${result.name}`,
                        buttonText: { displayText: '⬇️ DOWNLOAD APK' },
                        type: 1
                    }
                ]
            }, { quoted: m });
        } else {
            await conn.sendMessage(from, buttonMessage, { quoted: m });
        }

    } catch (error) {
        console.error('APK command error:', error);
        reply(`❌ *Error:* ${error.message || 'Failed to fetch APK info'}`);
    }
});

// Download Button Handler
cmd({
    pattern: "apkdownload",
    desc: "Download APK file",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const apkName = args.join(' ');
        if (!apkName) {
            return reply('❌ Invalid request');
        }

        const apiUrl = `https://saviya-kolla-api.koyeb.app/download/apk?q=${encodeURIComponent(apkName)}`;
        const { data } = await axios.get(apiUrl);
        const result = data.result;

        if (!result || !result.dllink) {
            return reply('❌ Download link not available');
        }

        // Send as document (APK file)
        await conn.sendMessage(from, {
            document: { url: result.dllink },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${result.name.replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
            caption: `✅ *Download Ready!*\n\n📱 *App:* ${result.name}\n📦 *Size:* ${result.size}\n\n> *Powered by Nexus Mini Bot*`
        }, { quoted: m });

    } catch (error) {
        console.error('APK Download error:', error);
        reply(`❌ *Download Failed!*\n${error.message || 'Please try again later'}`);
    }
});
