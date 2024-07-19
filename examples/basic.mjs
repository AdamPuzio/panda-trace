import Trace from '../dist/index.mjs'

const heading = (instance, title, subtitle) => {
  const magenta = (txt) => `\x1b[38;5;5m${txt}\x1b[0m`
  const cyan = (txt) => `\x1b[38;5;6m${txt}\x1b[0m`
  const yellow = (txt) => `\x1b[38;5;11m${txt}\x1b[0m`
  console.log()
  console.log(`${magenta(title)}`)
  console.log(`  ${cyan('on')}     ${instance.cfg.on}`)
  console.log(`  ${cyan('level')}  ${instance.cfg.level}`)
  console.log(`  ${cyan('all')}    ${instance.cfg.all}`)
  console.log(`  ${cyan('tags')}   ${instance.cfg.tags.join(', ')}`)
  if (subtitle) console.log(`\n${yellow(subtitle)}`)
  console.log()
}
const sep = () => { console.log('\n-----------------') }

const logger = new Trace('Basic', { on: true, level: 'trace' })
heading(logger, 'Basic - on (programatically) with a level of "trace"')
logger.error('Error message')
logger.warn('Warning message')
logger.info('Info message')
logger.debug('Debug message')
logger.trace('Trace message')
sep()

const logger2 = new Trace('Basic2', { on: true })
heading(logger2, 'Basic2 - on (programatically) with default level (w/o env vars, you should only see up to "info")')
logger2.error('Error message')
logger2.warn('Warning message')
logger2.info('Info message')
logger2.debug('Debug message')
logger2.trace('Trace message')
sep()

const logger3 = new Trace('Basic3', { on: true, tags: ['foo.bar'] })
heading(logger3, 'Basic3 - on (programatically) with default level and "foo.bar" tag')
logger3.info('You should see this', ['foo.bar'])
logger3.info('You should also see this', ['foo.bar.baz'])
logger3.info('You should NOT see this', ['foo'])
logger3.info('You should also not see this', ['bar'])
logger3.info('You should also also not see this')
sep()

const logger4 = new Trace('Basic4')
heading(
  logger4, 
  'Basic4 - off (no config), so you won\'t see unless ENV variables are passed',
  'run `TRACE=on node examples/basic.mjs` in the terminal to see the following'
)
logger4.error('Error message')
logger4.warn('Warning message')
logger4.info('Info message')
logger4.debug('Debug message')
logger4.trace('Trace message')

console.log()
