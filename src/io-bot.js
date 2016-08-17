/**
 *
 * wechaty: Wechat for Bot. and for human who talk to bot/robot
 *
 * Class Io
 * http://www.wechaty.io
 *
 * Licenst: ISC
 * https://github.com/zixia/wechaty
 *
 */
const Wechaty = require('./wechaty')

class IoBot {
  constructor({
    token = 'EPP'
    , profile = 'wechaty-epp'
    , log = null
  }) {
    if (!log) {
      const e = new Error('constructor() log(npmlog/brolog) must be set')
      throw e
    }
    this.log = log
    this.log.verbose('IoBot', 'constructor() with token:[%s]', token)

    if (!token) {
      const e = new Error('constructor() token must be set')
      this.log.error('IoBot', e)
      throw e
    }
    this.token = token

    this.profile = profile
  }

  init() {
    this.log.verbose('IoBot', 'init()')

    this.wechaty = new Wechaty({
      profile: this.profile
      , token: this.token
    })

    this.wechaty
    .on('login'	       , user => this.log.info('IoBot', `${user.name} logined`))
    .on('logout'	     , user => this.log.info('IoBot', `${user} logouted`))
    .on('scan', ({url, code}) => this.log.info('IoBot', `[${code}] ${url}`))
    .on('message'   , message => {
      message.ready()
            .then(this.onMessage.bind(this))
            .catch(e => this.log.error('IoBot', 'message.ready() %s' , e))
    })


    return this.wechaty.init()
              .then(_ => this)
              .catch(e => {
                this.log.error('IoBot', 'init() init fail: %s', e)
                bot.quit()
                return e
              })
  }

  initWeb(port) {
    port = port || process.env.PORT || 8080

//    if (process.env.DYNO) {
//    }
    const app = require('express')()

    app.get('/', function (req, res) {
      res.send('Wechaty IO Bot Alive!')
    })

    return new Promise((resolve, reject) => {
      app.listen(port, () => {
        this.log.verbose('IoBot', 'initWeb() Wechaty IO Bot listening on port ' + port + '!')

        return resolve(this)

      })
    })
  }

  onMessage(m) {
    const from = m.from()
    const to = m.to()
    const content = m.toString()
    const room = m.room()

    // log.info('Bot', '%s<%s>:%s'
    //               , (room ? '['+room.name()+']' : '')
    //               , from.name()
    //               , m.toStringDigest()
    //         )

    if (/^wechaty|botie/i.test(m.get('content')) && !bot.self(m)) {
      bot.reply(m, 'https://www.wechaty.io')
        .then(_ => log.info('Bot', 'REPLIED to magic word "wechaty"'))
    }
  }
}

module.exports = IoBot.default = IoBot.IoBot = IoBot