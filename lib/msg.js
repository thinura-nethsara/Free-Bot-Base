const { proto, downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys')
const fs = require('fs')

const downloadMediaMessage = async(m, filename) => {
	if (m.type === 'viewOnceMessage') {
		m.type = m.msg.type
	}
	if (m.type === 'imageMessage') {
		var nameJpg = filename ? filename + '.jpg' : 'undefined.jpg'
		const stream = await downloadContentFromMessage(m.msg, 'image')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameJpg, buffer)
		return fs.readFileSync(nameJpg)
	} else if (m.type === 'videoMessage') {
		var nameMp4 = filename ? filename + '.mp4' : 'undefined.mp4'
		const stream = await downloadContentFromMessage(m.msg, 'video')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameMp4, buffer)
		return fs.readFileSync(nameMp4)
	} else if (m.type === 'audioMessage') {
		var nameMp3 = filename ? filename + '.mp3' : 'undefined.mp3'
		const stream = await downloadContentFromMessage(m.msg, 'audio')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameMp3, buffer)
		return fs.readFileSync(nameMp3)
	} else if (m.type === 'stickerMessage') {
		var nameWebp = filename ? filename + '.webp' : 'undefined.webp'
		const stream = await downloadContentFromMessage(m.msg, 'sticker')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameWebp, buffer)
		return fs.readFileSync(nameWebp)
	} else if (m.type === 'documentMessage') {
		var ext = m.msg.fileName.split('.')[1].toLowerCase().replace('jpeg', 'jpg').replace('png', 'jpg').replace('m4a', 'mp3')
		var nameDoc = filename ? filename + '.' + ext : 'undefined.' + ext
		const stream = await downloadContentFromMessage(m.msg, 'document')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameDoc, buffer)
		return fs.readFileSync(nameDoc)
	}
}

const sms = (sock, m) => {
	if (m.key) {
		m.id = m.key.id
		m.chat = m.key.remoteJid
		m.fromMe = m.key.fromMe
		m.isGroup = m.chat.endsWith('@g.us')
		m.sender = m.fromMe ? sock.user.id.split(':')[0]+'@s.whatsapp.net' : m.isGroup ? m.key.participant : m.key.remoteJid
	}
	if (m.message) {
		m.type = getContentType(m.message)
		m.msg = (m.type === 'viewOnceMessage') ? m.message[m.type].message[getContentType(m.message[m.type].message)] : m.message[m.type]
		if (m.msg) {
			if (m.type === 'viewOnceMessage') {
				m.msg.type = getContentType(m.message[m.type].message)
			}
			var quotedMention = m.msg.contextInfo != null ? m.msg.contextInfo.participant : ''
			var tagMention = m.msg.contextInfo != null ? m.msg.contextInfo.mentionedJid : []
			var mention = typeof(tagMention) == 'string' ? [tagMention] : tagMention
			mention != undefined ? mention.push(quotedMention) : []
			m.mentionUser = mention != undefined ? mention.filter(x => x) : []
			m.body = (m.type === 'conversation') ? m.msg : (m.type === 'extendedTextMessage') ? m.msg.text : (m.type == 'imageMessage') && m.msg.caption ? m.msg.caption : (m.type == 'videoMessage') && m.msg.caption ? m.msg.caption : (m.type == 'templateButtonReplyMessage') && m.msg.selectedId ? m.msg.selectedId : (m.type == 'buttonsResponseMessage') && m.msg.selectedButtonId ? m.msg.selectedButtonId : (m.type == 'interactiveResponseMessage') ? (() => {
				try {
					const params = JSON.parse(m.msg.nativeFlowResponseMessage?.paramsJson || '{}');
					return params.id || m.body || '';
				} catch { return ''; }
			})() : ''
			m.quoted = m.msg.contextInfo != undefined ? m.msg.contextInfo.quotedMessage : null
			if (m.quoted) {
				m.quoted.type = getContentType(m.quoted)
				m.quoted.id = m.msg.contextInfo.stanzaId
				m.quoted.sender = m.msg.contextInfo.participant
				m.quoted.fromMe = m.quoted.sender.split('@')[0].includes(sock.user.id.split(':')[0])
				m.quoted.msg = (m.quoted.type === 'viewOnceMessage') ? m.quoted[m.quoted.type].message[getContentType(m.quoted[m.quoted.type].message)] : m.quoted[m.quoted.type]
				if (m.quoted.type === 'viewOnceMessage') {
					m.quoted.msg.type = getContentType(m.quoted[m.quoted.type].message)
				}
				var quoted_quotedMention = m.quoted.msg.contextInfo != null ? m.quoted.msg.contextInfo.participant : ''
				var quoted_tagMention = m.quoted.msg.contextInfo != null ? m.quoted.msg.contextInfo.mentionedJid : []
				var quoted_mention = typeof(quoted_tagMention) == 'string' ? [quoted_tagMention] : quoted_tagMention
				quoted_mention != undefined ? quoted_mention.push(quoted_quotedMention) : []
				m.quoted.mentionUser = quoted_mention != undefined ? quoted_mention.filter(x => x) : []
				m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
					key: {
						remoteJid: m.chat,
						fromMe: m.quoted.fromMe,
						id: m.quoted.id,
						participant: m.quoted.sender
					},
					message: m.quoted
				})
				m.quoted.download = (filename) => downloadMediaMessage(m.quoted, filename)
				m.quoted.delete = () => sock.sendMessage(m.chat, { delete: m.quoted.fakeObj.key })
				m.quoted.react = (emoji) => sock.sendMessage(m.chat, { react: { text: emoji, key: m.quoted.fakeObj.key } })
			}
		}
		m.download = (filename) => downloadMediaMessage(m, filename)
	}
	
	m.reply = (teks, id = m.chat, option = { mentions: [m.sender] }) => sock.sendMessage(id, { text: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyS = (stik, id = m.chat, option = { mentions: [m.sender] }) => sock.sendMessage(id, { sticker: stik, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyImg = (img, teks, id = m.chat, option = { mentions: [m.sender] }) => sock.sendMessage(id, { image: img, caption: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyVid = (vid, teks, id = m.chat, option = { mentions: [m.sender], gif: false }) => sock.sendMessage(id, { video: vid, caption: teks, gifPlayback: option.gif, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyAud = (aud, id = m.chat, option = { mentions: [m.sender], ptt: false }) => sock.sendMessage(id, { audio: aud, ptt: option.ptt, mimetype: 'audio/mpeg', contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyDoc = (doc, id = m.chat, option = { mentions: [m.sender], filename: 'undefined.pdf', mimetype: 'application/pdf' }) => sock.sendMessage(id, { document: doc, mimetype: option.mimetype, fileName: option.filename, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyContact = (name, info, number) => {
		var vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + name + '\n' + 'ORG:' + info + ';\n' + 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n' + 'END:VCARD'
		sock.sendMessage(m.chat, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: m })
	}
	m.react = (emoji) => sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } })
	
	// ========== BUTTON FUNCTIONS ==========
	
	// Simple buttons (older method but works well)
	m.replyButtons = async (text, buttons, id = m.chat) => {
		try {
			const buttonMessage = {
				text: text,
				buttons: buttons.map((btn, idx) => ({
					buttonId: btn.id || `btn_${idx}`,
					buttonText: { displayText: btn.text },
					type: 1
				})),
				headerType: 1,
				viewOnce: true
			};
			return await sock.sendMessage(id, buttonMessage, { quoted: m });
		} catch (error) {
			console.error('Buttons error:', error);
			// Fallback to text reply
			return await sock.sendMessage(id, { text: text + '\n\n' + buttons.map(b => `▸ ${b.text}`).join('\n') }, { quoted: m });
		}
	};
	
	// Modern interactive buttons (recommended)
	m.replyInteractive = async (text, buttons, footer = "NEXION MINI BOT", id = m.chat) => {
		try {
			const interactiveMessage = {
				viewOnce: true,
				body: { text: text },
				footer: { text: footer },
				action: {
					buttons: buttons.map(btn => ({
						name: "quick_reply",
						buttonParamsJson: JSON.stringify({
							display_text: btn.text,
							id: btn.id || `btn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
						})
					}))
				}
			};
			return await sock.sendMessage(id, { interactive: interactiveMessage }, { quoted: m });
		} catch (error) {
			console.error('Interactive buttons error:', error);
			// Fallback to simple buttons
			return await m.replyButtons(text, buttons, id);
		}
	};
	
	// Template buttons with header (supports URL, Call, Quick Reply)
	m.replyTemplate = async (text, buttons, footer = "NEXION MINI BOT", id = m.chat) => {
		try {
			const templateButtons = buttons.map((btn, idx) => {
				if (btn.url) {
					return { index: idx + 1, urlButton: { text: btn.text, url: btn.url } };
				} else if (btn.phone) {
					return { index: idx + 1, callButton: { text: btn.text, phoneNumber: btn.phone } };
				} else {
					return { index: idx + 1, quickReplyButton: { text: btn.text, id: btn.id || `btn_${idx}` } };
				}
			});
			
			return await sock.sendMessage(id, {
				text: text,
				footer: footer,
				templateButtons: templateButtons,
				viewOnce: true
			}, { quoted: m });
		} catch (error) {
			console.error('Template buttons error:', error);
			return await m.replyButtons(text, buttons.map(b => ({ id: b.id, text: b.text })), id);
		}
	};
	
	// List message (dropdown style)
	m.replyList = async (text, title, sections, footer = "NEXION MINI BOT", id = m.chat) => {
		try {
			const listMessage = {
				text: text,
				title: title,
				footer: footer,
				buttonText: "📋 Tap to view",
				sections: sections,
				viewOnce: true
			};
			return await sock.sendMessage(id, { list: listMessage }, { quoted: m });
		} catch (error) {
			console.error('List message error:', error);
			// Fallback: Show as normal text
			let fallbackText = text + '\n\n' + title + '\n';
			sections.forEach(section => {
				fallbackText += `\n◈ ${section.title}\n`;
				section.rows.forEach(row => {
					fallbackText += `   • ${row.title}: ${row.description || ''}\n`;
				});
			});
			return await sock.sendMessage(id, { text: fallbackText }, { quoted: m });
		}
	};
	
	// Button with image/media
	m.replyButtonsWithImage = async (imageUrl, caption, buttons, id = m.chat) => {
		try {
			const interactiveMessage = {
				viewOnce: true,
				header: {
					hasMedia: true,
					image: { url: imageUrl }
				},
				body: { text: caption },
				footer: { text: "NEXION MINI BOT" },
				action: {
					buttons: buttons.map(btn => ({
						name: "quick_reply",
						buttonParamsJson: JSON.stringify({
							display_text: btn.text,
							id: btn.id || `btn_${Date.now()}`
						})
					}))
				}
			};
			return await sock.sendMessage(id, { interactive: interactiveMessage }, { quoted: m });
		} catch (error) {
			console.error('Image buttons error:', error);
			await sock.sendMessage(id, { image: { url: imageUrl }, caption: caption }, { quoted: m });
			return await m.replyButtons(caption, buttons, id);
		}
	};
	
	return m
}

module.exports = { sms, downloadMediaMessage }
