import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix: _p, command, args, isOwner, isAdmin }) => {
  const userName = m.pushName || 'Utente'

  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
  global.db.data.settings[conn.user.jid] = global.db.data.settings[conn.user.jid] || {}
  let chat = global.db.data.chats[m.chat]
  let bot = global.db.data.settings[conn.user.jid]

  // --- CONFIGURAZIONE MODULI (Invariati) ---
  const securityFeatures = [
    { key: 'antigore', name: 'ANTIGORE' },
    { key: 'modoadmin', name: 'SOLOADMIN' },
    { key: 'antivoip', name: 'ANTIVOIP' },
    { key: 'antilink', name: 'ANTILINK' },
    { key: 'antilinksocial', name: 'ANTILINKSOCIAL' },
    { key: 'antitrava', name: 'ANTITRAVA' },
    { key: 'antinuke', name: 'ANTINUKE' },
    { key: 'antiviewonce', name: 'ANTIVIEWONCE' },
    { key: 'antispam', name: 'ANTISPAM' }
  ]

  const automationFeatures = [
    { key: 'ai', name: 'IA' },
    { key: 'vocali', name: 'SIRI' },
    { key: 'reaction', name: 'REAZIONI' },
    { key: 'autolevelup', name: 'AUTOLIVELLO' },
    { key: 'welcome', name: 'WELCOME' }
  ]

  const ownerFeatures = [
    { key: 'anticall', name: 'ANTICHIAMATE' },
    { key: 'antiprivate', name: 'ANTIPRIVATO' },
    { key: 'solocreatore', name: 'SOLO CREATORE' }
  ]

  // --- GENERAZIONE MENU ---
  if (!args.length || /menu|help/i.test(args[0])) {
    let text = `
   *𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 ꪶ⃬🦂ꫂ*
   ──────────────
   *USER:* _${userName}_
   *STATUS:* _Functional_
   ──────────────

   *〔 🛠️ ISTRUZIONI 〕*
   > *${_p}attiva* <nome>
   > *${_p}disattiva* <nome>

   *╒══  🛡️ 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘  ══╕*
${securityFeatures.map(f => `   ┇ ⌬ ${f.name.padEnd(15)} » *${f.key}*`).join('\n')}
   *╘══════════════╛*

   *╒══  🤖 𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍  ══╕*
${automationFeatures.map(f => `   ┇ ⌬ ${f.name.padEnd(15)} » *${f.key}*`).join('\n')}
   *╘══════════════╛*

   *╒══  👑 𝐎𝐖𝐍𝐄𝐑 𝐎𝐍𝐋𝐘  ══╕*
${ownerFeatures.map(f => `   ┇ ⌬ ${f.name.padEnd(15)} » *${f.key}*`).join('\n')}
   *╘══════════════╛*

   _Scorpion Core Interface v2.0_`

    await conn.sendMessage(m.chat, { 
      text: text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 ꪶ⃬🦂ꫂ",
          body: "System Management Console",
          mediaType: 1,
          previewType: 0,
          sourceUrl: 'https://github.com' 
        }
      }
    }, { quoted: m })
    return
  }

  // --- LOGICA DI ATTIVAZIONE (Invariata) ---
  let isEnable = !/disattiva|off|0/i.test(command)
  let type = args[0].toLowerCase()
  let status = isEnable ? 'ATTIVO ✅' : 'DISATTIVATO ❌'

  let dbKey = type
  if (type === 'antilink') dbKey = 'antiLink'
  if (type === 'antilinksocial') dbKey = 'antiLink2'
  if (type === 'antiviewonce') dbKey = 'antioneview'
  if (type === 'antiprivate') dbKey = 'antiPrivate'
  if (type === 'solocreatore') dbKey = 'soloCreatore'

  const isSecurity = securityFeatures.some(f => f.key.toLowerCase() === type)
  const isAuto = automationFeatures.some(f => f.key.toLowerCase() === type)
  const isOwnerKey = ownerFeatures.some(f => f.key.toLowerCase() === type)

  if (isSecurity || isAuto) {
    if (!m.isGroup && !isOwner) return m.reply('❌ Solo nei gruppi')
    if (m.isGroup && !isAdmin && !isOwner) return m.reply('🛡️ Solo per Admin')
    chat[dbKey] = isEnable
  } else if (isOwnerKey) {
    if (!isOwner) return m.reply('👑 Solo per l\'Owner')
    bot[dbKey] = isEnable
  } else {
    return m.reply('❓ Modulo non trovato.')
  }

  await m.react(isEnable ? '🦂' : '💤')
  m.reply(`*𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 ꪶ⃬🦂ꫂ — REPORT*\n\nModulo: *${type.toUpperCase()}*\nStato attuale: *${status}*`)
}

handler.command = ['attiva', 'disattiva', 'on', 'off', 'enable', 'disable']
export default handler
