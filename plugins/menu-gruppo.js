import { promises } from 'fs'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'

const defaultMenu = {
  before: `
   *𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 ꪶ⃬🦂ꫂ*
   ──────────────
   *USER:* _%name_
   *ROLE:* _%role_
   *RANK:* _%prems_
   ──────────────

   *〔 🛡️ ADMIN PANEL 〕*
   > _Accesso autorizzato..._
`.trimStart(),
  header: '   *╒══  👥 %category  ══╕*',
  body: '   ┇ ⌬ %cmd',
  footer: '   *╘══════════════╛*\n',
  after: `_Scorpion Group Management v3.0_`
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  let tags = {
    'gruppo': '𝐆𝐑𝐎𝐔𝐏 𝐂𝐎𝐍𝐓𝐑𝐎𝐋'
  }

  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    let name = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)

    let user = global.db.data.users[m.sender] || {}
    let { level, role = 'Utente' } = user
    let prems = user.premiumTime > 0 ? '𝐏𝐫𝐞𝐦𝐢𝐮𝐦' : '𝐒𝐭𝐚𝐧𝐝𝐚𝐫𝐝'

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
      help: Array.isArray(p.help) ? p.help : [p.help],
      tags: Array.isArray(p.tags) ? p.tags : [p.tags],
      prefix: 'customPrefix' in p,
    }))

    let _text = [
      defaultMenu.before,
      ...Object.keys(tags).map(tag => {
        return defaultMenu.header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return defaultMenu.body.replace(/%cmd/g, menu.prefix ? help : _p + help)
                .trim()
            }).join('\n')
          }),
          defaultMenu.footer
        ].join('\n')
      }),
      defaultMenu.after
    ].join('\n')

    let replace = {
      '%': '%',
      p: _p,
      name, level, role, prems, uptime,
      readmore: readMore
    }

    let text = _text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'), (_, name) => '' + replace[name])

    await m.react('🦂')

    // Invio solo testo con layout professionale
    await conn.sendMessage(m.chat, {
      text: text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 𝐆𝐑𝐎𝐔𝐏 𝐌𝐀𝐍𝐀𝐆𝐄𝐑 ⚡",
          body: "Admin Console Active",
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
    conn.reply(m.chat, '🦂 *ERRORE:* Impossibile generare il menu gruppo.', m)
  }
}

handler.help = ['menugruppo']
handler.tags = ['menu']
handler.command = ['menugruppo', 'menugp', 'menuadmin']

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '00' : Math.floor(ms / 3600000).toString().padStart(2, '0')
  let m = isNaN(ms) ? '00' : (Math.floor(ms / 60000) % 60).toString().padStart(2, '0')
  let s = isNaN(ms) ? '00' : (Math.floor(ms / 1000) % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}
