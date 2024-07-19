"use strict";Object.defineProperty(exports, "__esModule", {value: true}); var _class;// src/trace.ts
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
var Trace = (_class = class _Trace {
  
  __init() {this.cfg = {}}
  static __initStatic() {this.levels = {
    log: { color: 7, label: "log" },
    error: { color: 1, label: "error" },
    warn: { color: 3, label: "warn" },
    info: { color: 4, label: "info" },
    debug: { color: 2, label: "debug" },
    trace: { color: 0, label: "trace" }
  }}
  constructor(label, cfg = {}) {;_class.prototype.__init.call(this);
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
    return `\x1B[38;5;${color}m${str}\x1B[0m`;
  }
  static colorString(str) {
    const color = Math.abs([...str].reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0) | 0) % 216 + 16;
    return `\x1B[38;5;${color}m[${str}]\x1B[0m`;
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
}, _class.__initStatic(), _class);

// src/index.ts
var src_default = Trace;



exports.Trace = Trace; exports.default = src_default;
