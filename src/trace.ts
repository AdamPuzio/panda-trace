
const traceConfig = ({
  on = process.env.TRACE ? true : false,
  tags = [],
  all = false,
  level = 'info',
  colorMessage = true
} = {}) => {
  if (process.env.TRACE) {
    const opts = (process.env.TRACE || '').split(':')
    let foundSpecificTags = false
    opts.forEach(opt => {
      if (opt === '*') {
        all = true
      } else if (['error', 'warn', 'info', 'debug', 'trace'].includes(opt)) {
        level = opt
      } else if (opt !== 'on') {
        tags.push(opt)
        foundSpecificTags = true
      }
    })
  }
  if (tags.length === 0 && !all) all = true
  return { on, tags, all, level, colorMessage }
}

const traceCfg = traceConfig()

export class Trace {
  label
  cfg = {}

  static levels = {
    log: { color: 7, label: 'log' },
    error: { color: 1, label: 'error' },
    warn: { color: 3, label: 'warn' },
    info: { color: 4, label: 'info' },
    debug: { color: 2, label: 'debug'},
    trace: { color: 0, label: 'trace'}
  }
  
  constructor (label?, cfg = {}) {
    this.label = label
    this.configure(cfg)
  }

  clone (label?) {
    return new Trace(label, this.cfg)
  }

  configure (cfg = {}) {
    const mixed = { ...this.cfg, ...cfg }
    this.cfg = traceConfig(mixed)
  }

  out (msg, {
    label = undefined,
    tags = [],
    level = 'log'
  } = {}) {
    Trace.out(msg, { label: label || this.label, tags, level }, this.cfg)
  }

  log (msg: string, tags?: string[], label?: string) {
    this.out(msg, { label, tags, level: 'log' })
  }

  error (msg: string, tags?: string[], label?: string) {
    this.out(msg, { label, tags, level: 'error' })
  }

  warn (msg: string, tags?: string[], label?: string) {
    this.out(msg, { label, tags, level: 'warn' })
  }

  info (msg: string, tags?: string[], label?: string) {
    this.out(msg, { label, tags, level: 'info' })
  }

  debug (msg: string, tags?: string[], label?: string) {
    this.out(msg, { label, tags, level: 'debug' })
  }

  trace (msg: string, tags?: string[], label?: string) {
    this.out(msg, { label, tags, level: 'trace' })
  }

  static out (msg, {
    label = undefined,
    tags = [],
    level = 'log'
  } = {}, cfg: { [key:string]: any } = traceCfg) {
    if (!cfg.on || !Trace.checkLevel(level, cfg.level) || !Trace.checkTags(tags, label, cfg)) return
    if (!Trace.levels[level]) level = 'log'
    const levelColor = Trace.levels[level].color
    // const levelStr = level === 'log' ? '' : Trace.color(`${level.toUpperCase()}`.padEnd(6), levelColor)
    const levelStr = Trace.color(`${level.toUpperCase()}`.padEnd(6), levelColor)
    const labelStr = label ? Trace.colorString(label) : ''
    if (cfg.colorMessage && typeof msg === 'string') msg = Trace.color(msg, levelColor)
    console.log(`${levelStr}${labelStr}`, msg, `\x1b[2m(${tags.join(', ')})\x1b[0m`)
  }

  static checkLevel (level, traceLevel = traceCfg.level) {
    if (level === 'log') return true
    const levels = ['log', 'error', 'warn', 'info', 'debug', 'trace']
    return levels.indexOf(level) <= levels.indexOf(traceLevel)
  }

  static checkTags (tags, label?, cfg?) {
    cfg = Object.assign({}, traceCfg, cfg)

    if (cfg.all) return true

    const fullTags = label ? [label] : []
    tags.forEach(tag => {
      fullTags.push(tag)
      if (tag.includes('.')) {
        const parts = tag.split('.')
        let current = ''
        parts.forEach(part => {
          current += part
          fullTags.push(current)
          current += '.'
        })
      }
    })
    return fullTags.some(tag => cfg.tags.includes(tag))
  }

  static color (str, color) {
    return `\x1b[38;5;${color}m${str}\x1b[0m`
  }

  static colorString (str) {
    const color = Math.abs([...str].reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0) | 0) % 216 + 16
    return `\x1b[38;5;${color}m[${str}]\x1b[0m`
  }

  static log (msg:any, tags?:string[], label?:string) {
    Trace.out(msg, { label, tags, level: 'log' })
  }

  static error (msg, tags = [], label) {
    Trace.out(msg, { label, tags, level: 'error' })
  }

  static warn (msg, tags = [], label) {
    Trace.out(msg, { label, tags, level: 'warn' })
  }

  static info (msg, tags = [], label) {
    Trace.out(msg, { label, tags, level: 'info' })
  }

  static debug (msg, tags = [], label) {
    Trace.out(msg, { label, tags, level: 'debug' })
  }

  static trace (msg, tags = [], label) {
    Trace.out(msg, { label, tags, level: 'trace' })
  }
}