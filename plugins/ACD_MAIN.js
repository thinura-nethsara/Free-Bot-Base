const config = require('../config')
const { cmd, commands } = require('../command')

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



cmd({
  pattern: "menu",
  react: "📁",
  alias: ["panel", "list", "commands"],
  desc: "Get bot's command list.",
  category: "main",
  use: '.menu',
  filename: __filename
}, 
async (conn, mek, m, { from, pushname, prefix,  reply, l }) => {
  try {
    // Hosting platform detection
    let hostname;
    const hostLen = os.hostname().length;
    if (hostLen === 12) hostname = 'Replit';
    else if (hostLen === 36) hostname = 'Heroku';
    else if (hostLen === 8) hostname = 'Koyeb';
    else hostname = os.hostname();

    // RAM + Uptime
    const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
    const ramUsage = `${ramUsed}MB / ${ramTotal}MB`;
    const rtime = await runtime(process.uptime());
const number = conn.user.id.split(':')[0].replace(/@s\.whatsapp\.net$/, '');
    const caption =  `*Hello ${pushname}  👋*
I am *NEXUS-MD* Userbot🎈
*┌────────────────────┐*
*├ \`⏰ 𝐔𝐩𝐭𝐢𝐦𝐞\`* : ${rtime}
*├ \`🚨 𝐇𝐨𝐬𝐭\`* : ${hostname}
*├ \`🎡 𝐏𝐫𝐞𝐟𝐢𝐱\`* : ${config.PREFIX}
*├ \`👤 𝐔𝐬𝐞𝐫\`* : ${pushname}
*├ \`⛵ 𝐑𝐚𝐦 𝐮𝐬𝐬𝐚𝐠𝐞\`* : ${ramUsage}
*├ \`👨🏻‍💻 𝐎𝐰𝐧𝐞𝐫\`* : ${number}
*├ \`⚖ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫𝐬\`* : *NEXUS ᴵᴺᶜ*
*├ \`🧬 𝐕𝐞𝐫𝐬𝐢𝐨𝐧\`* : 6.0.0
*├ \`💼 𝐖𝐨𝐫𝐤 𝐓𝐲𝐩𝐞\`* : ${config.WORK_TYPE}
*└────────────────────┘*

*🫟 Your all-in-one WhatsApp assistant — fast, reliable, and easy to use!*`;

 const captionn =  `*Hello ${pushname}  👋*
I am *NEXUS-MD* Userbot🎈
*┌────────────────────┐*
*├ \`⏰ 𝐔𝐩𝐭𝐢𝐦𝐞\`* : ${rtime}
*├ \`🚨 𝐇𝐨𝐬𝐭\`* : ${hostname}
*├ \`🎡 𝐏𝐫𝐞𝐟𝐢𝐱\`* : ${config.PREFIX}
*├ \`👤 𝐔𝐬𝐞𝐫\`* : ${pushname}
*├ \`⛵ 𝐑𝐚𝐦 𝐮𝐬𝐬𝐚𝐠𝐞\`* : ${ramUsage}
*├ \`👨🏻‍💻 𝐎𝐰𝐧𝐞𝐫\`* : ${number}
*├ \`⚖ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫𝐬\`* : *NEXUS ᴵᴺᶜ*
*├ \`🧬 𝐕𝐞𝐫𝐬𝐢𝐨𝐧\`* : 6.0.0
*├ \`💼 𝐖𝐨𝐫𝐤 𝐓𝐲𝐩𝐞\`* : ${config.WORK_TYPE}
*└────────────────────┘*

*🫟 Your all-in-one WhatsApp assistant — fast, reliable, and easy to use!*`

	  

    // 🔐 Load image from URL as Buffer (safe)
    let imageBuffer;
    try {
      if (!config.LOGO || !config.MAINMENU.startsWith('http')) {
        throw new Error("Invalid config.LOGO URL");
      }
      const res = await axios.get(config.MAINMENU, { responseType: 'arraybuffer' });
      imageBuffer = Buffer.from(res.data, 'binary');
      if (!Buffer.isBuffer(imageBuffer)) throw new Error("Not a valid buffer");
    } catch (err) {
      console.error("❌ Failed to load image:", err.message);
      return reply("⚠️ Could not load menu image. Check your LOGO URL.");
    }

    const buttons = [
      { buttonId: prefix + 'mainmenu', buttonText: { displayText: 'MAIN COMMANDS' }, type: 1 },
	  { buttonId: prefix + 'ownermenu', buttonText: { displayText: 'OWNER COMMANDS' }, type: 1 },
      { buttonId: prefix + 'groupmenu', buttonText: { displayText: 'GROUP COMMANDS' }, type: 1 },
      { buttonId: prefix + 'moviemenu', buttonText: { displayText: 'MOVIE COMMANDS' }, type: 1 },
      { buttonId: prefix + 'downloadmenu', buttonText: { displayText: 'DOWNLOAD COMMANDS' }, type: 1 },
      { buttonId: prefix + 'convertmenu', buttonText: { displayText: 'CONVERT COMMANDS' }, type: 1 },
	  { buttonId: prefix + 'searchmenu', buttonText: { displayText: 'SEARCH COMMANDS' }, type: 1 },
	  { buttonId: prefix + 'logomenu', buttonText: { displayText: 'LOGO COMMANDS' }, type: 1 },
      { buttonId: prefix + 'aimenu', buttonText: { displayText: 'AI COMMANDS' }, type: 1 },
	  { buttonId: prefix + 'othermenu', buttonText: { displayText: 'OTHER COMMANDS' }, type: 1 },
      { buttonId: prefix + 'funmenu', buttonText: { displayText: 'FUN COMMANDS' }, type: 1 },
      { buttonId: prefix + 'stickermenu', buttonText: { displayText: 'STICKER COMMANDS' }, type: 1 }
    ];

    const buttonMessage = {
      image: imageBuffer, // ✅ CORRECT format
      caption: captionn,
      footer: config.FOOTER,
      buttons,
      headerType: 4
    };

    if (config.BUTTON === 'true') {
      const listData = {
        title: "Select Menu :)",
        sections: [
          {
            title: "NEXUS-MD",
            rows: [
              { title: "MAIN COMMANDS", "description":"Main command menu", id: `${prefix}mainmenu` },
			  { title: "OWNER COMMANDS", "description":"Group command menu", id: `${prefix}ownermenu` },
              { title: "GROUP COMMANDS", "description":"Group command menu", id: `${prefix}groupmenu` },
              { title: "MOVIE COMMANDS", "description":"Movie command menu", id: `${prefix}moviemenu` },
              { title: "DOWNLOAD COMMANDS", "description":"Download command menu", id: `${prefix}downloadmenu` },
		      { title: "CONVERT COMMANDS", "description":"Convert command menu", id: `${prefix}convertmenu` },
		      { title: "SEARCH COMMANDS", "description":"Search command menu", id: `${prefix}searchmenu` },
			  { title: "LOGO COMMANDS", "description":"Logo command menu", id: `${prefix}logomenu` },
		      { title: "AI COMMANDS", "description":"AI command menu", id: `${prefix}aimenu` },
			  { title: "OTHER COMMANDS", "description":"Other command menu", id: `${prefix}OTHERmenu` },
	          { title: "FUN COMMANDS", "description":"fun command menu", id: `${prefix}funmenu` },
              { title: "STICKER COMMANDS", "description":"Sticker command menu", id: `${prefix}stickermenu` }
            ]
          }
        ]
      };

      return await conn.sendMessage(from, {
        image: imageBuffer, // ✅ Again, direct Buffer
        caption,
        footer: config.FOOTER,
        buttons: [
          {
            buttonId: "action",
            buttonText: { displayText: "🔽 Select Option" },
            type: 4,
            nativeFlowInfo: {
              name: "single_select",
              paramsJson: JSON.stringify(listData)
            }
          }

		
        ],
        headerType: 1,
        viewOnce: true
      }, { quoted: fkontak });

    } else {
      await conn.buttonMessage(from, buttonMessage, mek);
    }

  } catch (e) {
    reply('*❌ Error occurred!*');
    l(e);
  }
});


