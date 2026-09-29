"use strict";Object.defineProperty(exports, "__esModule", {value: true}); var _class; var _class2;// ../panda-colors/dist/index.mjs
var ESC = "\x1B";
var RESET = `${ESC}[0m`;
var proxyFn = (proxy, { prop = void 0 } = {}) => {
  if (!prop) throw new Error("No prop");
  return (...args) => {
    if (args.length === 0) return proxy.chain(prop, proxy);
    const props = [...proxy._genStyles || [], prop];
    return proxy.render(args.shift(), props);
  };
};
var Colors = (_class = class _Colors {
  static __initStatic() {this.debugMode = true}
  static __initStatic2() {this.onError = "warn"}
  // 'throw', 'log', 'ignore'
  static __initStatic3() {this.cfg = {
    colorize: true,
    onError: "warn"
    // 'throw', 'warn', 'ignore'
  }}
  __init() {this.cfg = {}}
  __init2() {this._genStyles = []}
  static __initStatic4() {this.codes = {
    effects: {
      reset: 0,
      bold: { set: 1, reset: 22 },
      dim: { set: 2, reset: 22 },
      italic: { set: 3, reset: 23 },
      underline: { set: 4, reset: 24 },
      inverse: { set: 7, reset: 27 },
      hidden: { set: 8, reset: 28 },
      strikethrough: { set: 9, reset: 29 }
    },
    types: {
      fg: 3,
      bg: 4,
      bfg: 9,
      bbg: 10
    },
    colors: {
      black: 0,
      red: 1,
      green: 2,
      yellow: 3,
      blue: 4,
      magenta: 5,
      cyan: 6,
      white: 7,
      gray: 8,
      grey: 8,
      default: 9
    }
  }}
  static __initStatic5() {this.fns = {
    reset: {
      fg: () => [39],
      bg: () => [49],
      all: () => [39, 49]
    },
    standard: {
      fg: (color) => [`3${color}`],
      bg: (color) => [`4${color}`]
    },
    bright: {
      fg: (color) => [`9${color}`],
      bg: (color) => [`10${color}`]
    },
    ansi: {
      fg: (color) => [38, 5, color],
      bg: (color) => [48, 5, color]
    },
    rgb: {
      fg: (r, g, b) => [38, 2, r, g, b],
      bg: (r, g, b) => [48, 2, r, g, b]
    }
  }}
  constructor(cfg = {}, styles = []) {;_class.prototype.__init.call(this);_class.prototype.__init2.call(this);
    this.cfg = Object.assign(this.cfg, _Colors.cfg, cfg);
    this._genStyles = [...this._genStyles, ...Array.isArray(styles) ? styles : [styles]];
    const proxy = new Proxy(this, {
      get(target, prop) {
        if (target[prop]) return target[prop];
        return proxyFn(target, { prop });
      }
    });
    return proxy;
  }
  chain(style) {
    return new _Colors(this.cfg, [...this._genStyles, style]);
  }
  render(str, styles = []) {
    if (typeof styles === "string") styles = [styles];
    styles = [...this._genStyles, ...styles];
    return _Colors.render(str, styles);
  }
  static chain(style, proxy) {
    return new _Colors({}, [style]);
  }
  static render(str, styles = []) {
    const codes = [];
    if (typeof styles === "string") styles = [styles];
    styles.forEach((style) => {
      let code = _Colors.effect(style);
      if (!code) code = _Colors.color(style);
      if (code) {
        if (Array.isArray(code)) codes.push(...code);
        else codes.push(code);
      } else _Colors.error(`Unknown style: ${style}`);
    });
    return _Colors.apply(str, codes);
  }
  static $infuse(cfg, styles) {
    return new _Colors(cfg, styles);
  }
  static fn(...styles) {
    const instance = new _Colors({}, styles);
    return instance.render.bind(instance);
  }
  static apply(str, codes = []) {
    return `${ESC}[${codes.join(";")}m${str}${RESET}`;
  }
  static effect(effect) {
    effect = effect.toLowerCase();
    let fn = "set";
    if (effect.endsWith("off")) {
      fn = "reset";
      effect = effect.slice(0, -3);
    }
    const e = _Colors.codes.effects[effect];
    return e ? e[fn] : null;
  }
  static color(color) {
    switch (typeof color) {
      case "string":
        color = color.toLowerCase();
        if (color.includes(":")) {
          const colors = color.split(":");
          const action = colors.shift();
          let type2 = "fg";
          switch (action) {
            case "rgb":
              if (colors.length > 3) type2 = colors.pop();
              if (colors.length !== 3) return null;
              return _Colors.fns.rgb[type2](...colors);
            case "256":
            case "ansi":
            case "8bit":
              if (colors.length > 1) type2 = colors.pop();
              if (colors.length !== 1) return null;
              if (!_Colors.fns.ansi[type2]) return _Colors.error(`Unknown ANSI color type: ${type2} (must be 'fg' or 'bg')`);
              return _Colors.fns.ansi[type2](colors[0]);
            case "standard":
              if (colors.length !== 1) return null;
              return _Colors.fns.standard[type2](colors[0]);
            case "bright":
              if (colors.length !== 1) return null;
              return _Colors.fns.bright[type2](colors[0]);
            case "reset":
              if (!_Colors.fns.reset[colors[0]]) return _Colors.error(`Unknown reset type: ${colors[0]}`);
              return _Colors.fns.reset[colors[0]]();
            default:
              return null;
          }
        }
        let type = "fg";
        let bright2 = false;
        if (color.startsWith("bright")) {
          bright2 = true;
          color = color.slice(6);
        }
        if (color.endsWith("bg")) {
          type = "bg";
          color = color.slice(0, -2);
        }
        const cc = _Colors.codes.colors[color];
        const tc = _Colors.codes.types[bright2 ? `b${type}` : type];
        if (cc === void 0 || !tc) return null;
        return `${tc}${cc}`;
      case "number":
        return _Colors.codes.colors[256].fg(color);
      case "object":
        return _Colors.color(`rgb:${color.r}:${color.g}:${color.b}`);
    }
  }
  static error(msg) {
    if (!_Colors.debugMode || _Colors.onError === "ignore") return;
    if (_Colors.onError === "warn") console.error(_Colors.render(`[WARN] ${msg}`, ["yellow"]));
    else throw new Error(msg);
  }
  static __initStatic6() {this.black = proxyFn(this, { prop: "black" })}
  static __initStatic7() {this.red = proxyFn(this, { prop: "red" })}
  static __initStatic8() {this.green = proxyFn(this, { prop: "green" })}
  static __initStatic9() {this.yellow = proxyFn(this, { prop: "yellow" })}
  static __initStatic10() {this.blue = proxyFn(this, { prop: "blue" })}
  static __initStatic11() {this.magenta = proxyFn(this, { prop: "magenta" })}
  static __initStatic12() {this.cyan = proxyFn(this, { prop: "cyan" })}
  static __initStatic13() {this.white = proxyFn(this, { prop: "white" })}
  static __initStatic14() {this.gray = proxyFn(this, { prop: "gray" })}
  static __initStatic15() {this.grey = proxyFn(this, { prop: "grey" })}
  static __initStatic16() {this.default = proxyFn(this, { prop: "default" })}
  static __initStatic17() {this.reset = proxyFn(this, { prop: "reset" })}
  static __initStatic18() {this.bold = proxyFn(this, { prop: "bold" })}
  static __initStatic19() {this.dim = proxyFn(this, { prop: "dim" })}
  static __initStatic20() {this.italic = proxyFn(this, { prop: "italic" })}
  static __initStatic21() {this.underline = proxyFn(this, { prop: "underline" })}
  static __initStatic22() {this.inverse = proxyFn(this, { prop: "inverse" })}
  static __initStatic23() {this.hidden = proxyFn(this, { prop: "hidden" })}
  static __initStatic24() {this.strikethrough = proxyFn(this, { prop: "strikethrough" })}
  static __initStatic25() {this.rgb = (r, g, b) => proxyFn(this, { prop: `rgb:${r}:${g}:${b}` })}
  static __initStatic26() {this.ansi = (color) => proxyFn(this, { prop: `ansi:${color}` })}
  static __initStatic27() {this.bright = (color) => proxyFn(this, { prop: `bright:${color}` })}
  static __initStatic28() {this.standard = (color) => proxyFn(this, { prop: `standard:${color}` })}
  static __initStatic29() {this.fg = (color) => proxyFn(this, { prop: `fg:${color}` })}
  static __initStatic30() {this.bg = (color) => proxyFn(this, { prop: `bg:${color}` })}
  static __initStatic31() {this.brightFg = (color) => proxyFn(this, { prop: `brightFg:${color}` })}
  static __initStatic32() {this.brightBg = (color) => proxyFn(this, { prop: `brightFg:${color}` })}
  static __initStatic33() {this.brightBlack = proxyFn(this, { prop: "brightBlack" })}
  static __initStatic34() {this.brightRed = proxyFn(this, { prop: "brightRed" })}
  static __initStatic35() {this.brightGreen = proxyFn(this, { prop: "brightGreen" })}
  static __initStatic36() {this.brightYellow = proxyFn(this, { prop: "brightYellow" })}
  static __initStatic37() {this.brightBlue = proxyFn(this, { prop: "brightBlue" })}
  static __initStatic38() {this.brightMagenta = proxyFn(this, { prop: "brightMagenta" })}
  static __initStatic39() {this.brightCyan = proxyFn(this, { prop: "brightCyan" })}
  static __initStatic40() {this.brightWhite = proxyFn(this, { prop: "brightWhite" })}
  static __initStatic41() {this.brightGray = proxyFn(this, { prop: "brightGray" })}
  static __initStatic42() {this.brightGrey = proxyFn(this, { prop: "brightGrey" })}
  static __initStatic43() {this.blackBg = proxyFn(this, { prop: "blackBg" })}
  static __initStatic44() {this.redBg = proxyFn(this, { prop: "redBg" })}
  static __initStatic45() {this.greenBg = proxyFn(this, { prop: "greenBg" })}
  static __initStatic46() {this.yellowBg = proxyFn(this, { prop: "yellowBg" })}
  static __initStatic47() {this.blueBg = proxyFn(this, { prop: "blueBg" })}
  static __initStatic48() {this.magentaBg = proxyFn(this, { prop: "magentaBg" })}
  static __initStatic49() {this.cyanBg = proxyFn(this, { prop: "cyanBg" })}
  static __initStatic50() {this.whiteBg = proxyFn(this, { prop: "whiteBg" })}
  static __initStatic51() {this.grayBg = proxyFn(this, { prop: "grayBg" })}
  static __initStatic52() {this.greyBg = proxyFn(this, { prop: "greyBg" })}
  static __initStatic53() {this.brightBlackBg = proxyFn(this, { prop: "brightBlackBg" })}
  static __initStatic54() {this.brightRedBg = proxyFn(this, { prop: "brightRedBg" })}
  static __initStatic55() {this.brightGreenBg = proxyFn(this, { prop: "brightGreenBg" })}
  static __initStatic56() {this.brightYellowBg = proxyFn(this, { prop: "brightYellowBg" })}
  static __initStatic57() {this.brightBlueBg = proxyFn(this, { prop: "brightBlueBg" })}
  static __initStatic58() {this.brightMagentaBg = proxyFn(this, { prop: "brightMagentaBg" })}
  static __initStatic59() {this.brightCyanBg = proxyFn(this, { prop: "brightCyanBg" })}
  static __initStatic60() {this.brightWhiteBg = proxyFn(this, { prop: "brightWhiteBg" })}
  static __initStatic61() {this.brightGrayBg = proxyFn(this, { prop: "brightGrayBg" })}
  static __initStatic62() {this.brightGreyBg = proxyFn(this, { prop: "brightGreyBg" })}
}, _class.__initStatic(), _class.__initStatic2(), _class.__initStatic3(), _class.__initStatic4(), _class.__initStatic5(), _class.__initStatic6(), _class.__initStatic7(), _class.__initStatic8(), _class.__initStatic9(), _class.__initStatic10(), _class.__initStatic11(), _class.__initStatic12(), _class.__initStatic13(), _class.__initStatic14(), _class.__initStatic15(), _class.__initStatic16(), _class.__initStatic17(), _class.__initStatic18(), _class.__initStatic19(), _class.__initStatic20(), _class.__initStatic21(), _class.__initStatic22(), _class.__initStatic23(), _class.__initStatic24(), _class.__initStatic25(), _class.__initStatic26(), _class.__initStatic27(), _class.__initStatic28(), _class.__initStatic29(), _class.__initStatic30(), _class.__initStatic31(), _class.__initStatic32(), _class.__initStatic33(), _class.__initStatic34(), _class.__initStatic35(), _class.__initStatic36(), _class.__initStatic37(), _class.__initStatic38(), _class.__initStatic39(), _class.__initStatic40(), _class.__initStatic41(), _class.__initStatic42(), _class.__initStatic43(), _class.__initStatic44(), _class.__initStatic45(), _class.__initStatic46(), _class.__initStatic47(), _class.__initStatic48(), _class.__initStatic49(), _class.__initStatic50(), _class.__initStatic51(), _class.__initStatic52(), _class.__initStatic53(), _class.__initStatic54(), _class.__initStatic55(), _class.__initStatic56(), _class.__initStatic57(), _class.__initStatic58(), _class.__initStatic59(), _class.__initStatic60(), _class.__initStatic61(), _class.__initStatic62(), _class);
var colors_default = Colors;
var black = colors_default.black;
var red = colors_default.red;
var green = colors_default.green;
var yellow = colors_default.yellow;
var blue = colors_default.blue;
var magenta = colors_default.magenta;
var cyan = colors_default.cyan;
var white = colors_default.white;
var gray = colors_default.gray;
var grey = colors_default.grey;
var bold = colors_default.bold;
var dim = colors_default.dim;
var italic = colors_default.italic;
var underline = colors_default.underline;
var inverse = colors_default.inverse;
var hidden = colors_default.hidden;
var strikethrough = colors_default.strikethrough;
var rgb = colors_default.rgb;
var ansi = colors_default.ansi;
var bright = colors_default.bright;
var standard = colors_default.standard;
var fg = colors_default.fg;
var bg = colors_default.bg;
var brightFg = colors_default.brightFg;
var brightBg = colors_default.brightBg;
var brightBlack = colors_default.brightBlack;
var brightRed = colors_default.brightRed;
var brightGreen = colors_default.brightGreen;
var brightYellow = colors_default.brightYellow;
var brightBlue = colors_default.brightBlue;
var brightMagenta = colors_default.brightMagenta;
var brightCyan = colors_default.brightCyan;
var brightWhite = colors_default.brightWhite;
var brightGray = colors_default.brightGray;
var brightGrey = colors_default.brightGrey;
var blackBg = colors_default.blackBg;
var redBg = colors_default.redBg;
var greenBg = colors_default.greenBg;
var yellowBg = colors_default.yellowBg;
var blueBg = colors_default.blueBg;
var magentaBg = colors_default.magentaBg;
var cyanBg = colors_default.cyanBg;
var whiteBg = colors_default.whiteBg;
var grayBg = colors_default.grayBg;
var greyBg = colors_default.greyBg;
var brightBlackBg = colors_default.brightBlackBg;
var brightRedBg = colors_default.brightRedBg;
var brightGreenBg = colors_default.brightGreenBg;
var brightYellowBg = colors_default.brightYellowBg;
var brightBlueBg = colors_default.brightBlueBg;
var brightMagentaBg = colors_default.brightMagentaBg;
var brightCyanBg = colors_default.brightCyanBg;
var brightWhiteBg = colors_default.brightWhiteBg;
var brightGrayBg = colors_default.brightGrayBg;
var src_default = Colors;

// src/trace.ts
var traceConfig = ({
  on = process.env.TRACE ? true : false,
  tags = [],
  all = false,
  level = "info",
  colorMessage = true
} = {}) => {
  if (process.env.TRACE) {
    const opts = (process.env.TRACE || "").split(":");
    let foundSpecificTags = false;
    opts.forEach((opt) => {
      if (opt === "*") {
        all = true;
      } else if (["error", "warn", "info", "debug", "trace"].includes(opt)) {
        level = opt;
      } else if (opt !== "on") {
        tags.push(opt);
        foundSpecificTags = true;
      }
    });
  }
  if (tags.length === 0 && !all) all = true;
  return { on, tags, all, level, colorMessage };
};
var traceCfg = traceConfig();
var Trace = (_class2 = class _Trace {
  
  __init3() {this.cfg = {}}
  static __initStatic63() {this.levels = {
    log: { color: 7, label: "log" },
    error: { color: 1, label: "error" },
    warn: { color: 3, label: "warn" },
    info: { color: 4, label: "info" },
    debug: { color: 2, label: "debug" },
    trace: { color: 0, label: "trace" }
  }}
  constructor(label, cfg = {}) {;_class2.prototype.__init3.call(this);
    this.label = label;
    this.configure(cfg);
  }
  clone(label) {
    return new _Trace(label, this.cfg);
  }
  configure(cfg = {}) {
    const mixed = { ...this.cfg, ...cfg };
    this.cfg = traceConfig(mixed);
  }
  out(msg, {
    label = void 0,
    tags = [],
    level = "log"
  } = {}) {
    _Trace.out(msg, { label: label || this.label, tags, level }, this.cfg);
  }
  log(msg, tags, label) {
    this.out(msg, { label, tags, level: "log" });
  }
  error(msg, tags, label) {
    this.out(msg, { label, tags, level: "error" });
  }
  warn(msg, tags, label) {
    this.out(msg, { label, tags, level: "warn" });
  }
  info(msg, tags, label) {
    this.out(msg, { label, tags, level: "info" });
  }
  debug(msg, tags, label) {
    this.out(msg, { label, tags, level: "debug" });
  }
  trace(msg, tags, label) {
    this.out(msg, { label, tags, level: "trace" });
  }
  static out(msg, {
    label = void 0,
    tags = [],
    level = "log"
  } = {}, cfg = traceCfg) {
    if (!cfg.on || !_Trace.checkLevel(level, cfg.level) || !_Trace.checkTags(tags, label, cfg)) return;
    if (!_Trace.levels[level]) level = "log";
    const levelColor = _Trace.levels[level].color;
    const levelStr = _Trace.color(`${level.toUpperCase()}`.padEnd(6), levelColor);
    const labelStr = label ? _Trace.colorString(label) : "";
    if (cfg.colorMessage && typeof msg === "string") msg = _Trace.color(msg, levelColor);
    console.log(`${levelStr}${labelStr}`, msg, `\x1B[2m(${tags.join(", ")})\x1B[0m`);
  }
  static checkLevel(level, traceLevel = traceCfg.level) {
    if (level === "log") return true;
    const levels = ["log", "error", "warn", "info", "debug", "trace"];
    return levels.indexOf(level) <= levels.indexOf(traceLevel);
  }
  static checkTags(tags, label, cfg) {
    cfg = Object.assign({}, traceCfg, cfg);
    if (cfg.all) return true;
    const fullTags = label ? [label] : [];
    tags.forEach((tag) => {
      fullTags.push(tag);
      if (tag.includes(".")) {
        const parts = tag.split(".");
        let current = "";
        parts.forEach((part) => {
          current += part;
          fullTags.push(current);
          current += ".";
        });
      }
    });
    return fullTags.some((tag) => cfg.tags.includes(tag));
  }
  static color(str, color) {
    return src_default.render(str, [`ansi:${color}`]);
  }
  static colorString(str) {
    const color = Math.abs([...str].reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0) | 0) % 216 + 16;
    return src_default.render(`[${str}]`, [`ansi:${color}`]);
  }
  static log(msg, tags, label) {
    _Trace.out(msg, { label, tags, level: "log" });
  }
  static error(msg, tags = [], label) {
    _Trace.out(msg, { label, tags, level: "error" });
  }
  static warn(msg, tags = [], label) {
    _Trace.out(msg, { label, tags, level: "warn" });
  }
  static info(msg, tags = [], label) {
    _Trace.out(msg, { label, tags, level: "info" });
  }
  static debug(msg, tags = [], label) {
    _Trace.out(msg, { label, tags, level: "debug" });
  }
  static trace(msg, tags = [], label) {
    _Trace.out(msg, { label, tags, level: "trace" });
  }
}, _class2.__initStatic63(), _class2);

// src/index.ts
var index_default = Trace;



exports.Trace = Trace; exports.default = index_default;
