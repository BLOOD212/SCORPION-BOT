import { xpRange } from '../lib/levelling.js'

const emojicategoria = {
  iatesto: '📝',
  iaaudio: '🎧',
  iaimmagini: '🖼️'
}

let tags = {
  'iatesto': '𝐈𝐀 𝐓𝐄𝐒𝐓𝐎',
  'iaaudio': '𝐈𝐀 𝐀𝐔𝐃𝐈𝐎',
  'iaimmagini': '𝐈𝐀 𝐈𝐌𝐌𝐀𝐆𝐈𝐍𝐈'
}

const defaultMenu = {
  before: `
   *𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 ꪶ⃬🦂ꫂ*
   ──────────────
   *USER:* _%name_
   *LVL:* _%level_
   *UPTIME:* _%uptime_
   ──────────────

   *〔 🧠 NEURAL NETWORK 〕*
   > _Accesso ai nodi cognitivi..._
`.trimStart(),
  header: '   *╒══  🧠 %category  ══╕*',
  body: '   ┇ %emoji %cmd',
  footer: '   *╘══════════════╛*\n',
  after: `_Scorpion AI Operational v3.0_`
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    let { level = 0 } = global.db.data.users[m.sender] || {}
    let name = await conn.getName(m.sender) || 'Utente'
    let uptime = clockString(process.uptime() * 1000)
    let totalreg = Object.keys(global.db.data.users).length

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled && plugin.tags)
      .filter(plugin => ['iatesto', 'iaaudio', 'iaimmagini'].some(t => plugin.tags.includes(t)))
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin
      }))

    let menuTags = Object.keys(tags)
    let _text = [
      defaultMenu.before,
      ...menuTags.map(tag => {
        return defaultMenu.header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(cmd => {
              return defaultMenu.body
                .replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)
                .replace(/%emoji/g, emojicategoria[tag] || '🧠')
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
      name, level, uptime, totalreg
    }

    let text = _text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'), (_, name) => '' + replace[name])

    await m.react('🦂')

    // Invio solo testo con anteprima tecnica
    await conn.sendMessage(m.chat, {
      text: text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "𝐒𝐂𝚯𝐑𝐏𝐈𝚯𝚴 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐂𝐄 ⚡",
          body: "Neural Network Interface",
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
    conn.reply(m.chat, '🦂 *ERRORE:* Impossibile inizializzare i moduli IA.', m)
  }
}

handler.help = ['menuia']
handler.tags = ['menu']
handler.command = ['menuia', 'menuai']

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '00' : Math.floor(ms / 3600000).toString().padStart(2, '0')
  let m = isNaN(ms) ? '00' : (Math.floor(ms / 60000) % 60).toString().padStart(2, '0')
  let s = isNaN(ms) ? '00' : (Math.floor(ms / 1000) % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}
