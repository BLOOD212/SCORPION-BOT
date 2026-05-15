import { xpRange } from '../lib/levelling.js'

const defaultMenu = {
  before: `
   *𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 ꪶ⃬🦂ꫂ*
   ──────────────
   *USER:* _%name_
   *RANK:* _%role_
   *STATUS:* _Elite Standard_
   ──────────────

   *〔 ⭐ ELITE PROTOCOL 〕*
   > _Accesso nodi riservati..._
`.trimStart(),
  header: '   *╒══  👑 %category  ══╕*',
  body: '   ┇ ⌬ %cmd',
  footer: '   *╘══════════════╛*\n',
  after: `_Scorpion Exclusive System v3.0_`
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  let tags = {
    'prem': '𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐀𝐂𝐂𝐄𝐒𝐒'
  }

  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    let user = global.db.data.users[m.sender] || {}
    let { level = 0, role = 'User' } = user
    let name = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)

    // Filtraggio plugin premium/prem/premio
    let help = Object.values(global.plugins).filter(p => 
      !p.disabled && p.tags && 
      (p.tags.includes('premium') || p.tags.includes('prem') || p.tags.includes('premio'))
    ).map(p => ({
      help: Array.isArray(p.help) ? p.help : [p.help],
      prefix: 'customPrefix' in p,
    }))

    let _text = [
      defaultMenu.before,
      defaultMenu.header.replace(/%category/g, tags['prem']),
      help.map(menu => menu.help.map(cmd => 
        defaultMenu.body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)
      ).join('\n')).join('\n'),
      defaultMenu.footer,
      defaultMenu.after
    ].join('\n')

    let replace = {
      '%': '%',
      p: _p,
      name, level, role, uptime
    }

    let text = _text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'), (_, name) => '' + replace[name])

    await m.react('🦂')

    // Invio testo con context premium
    await conn.sendMessage(m.chat, {
      text: text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ⚡",
          body: "Exclusive Elite Features",
          mediaType: 1,
          previewType: 0,
          sourceUrl: 'https://github.com',
          renderLargerThumbnail: false
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363232743845068@newsletter',
          newsletterName: "🦂 𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 𝐒𝐘𝐒𝐓𝐄𝐌 🦂"
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '🦂 *ERRORE:* Impossibile autenticare l\'accesso Premium.', m)
  }
}

handler.help = ['menupremium']
handler.tags = ['menu']
handler.command = ['menupremium', 'menuprem']

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '00' : Math.floor(ms / 3600000).toString().padStart(2, '0')
  let m = isNaN(ms) ? '00' : (Math.floor(ms / 60000) % 60).toString().padStart(2, '0')
  let s = isNaN(ms) ? '00' : (Math.floor(ms / 1000) % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}
