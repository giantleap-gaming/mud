"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/isexe/windows.js
var require_windows = __commonJS({
  "../../node_modules/isexe/windows.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs = require("fs");
    function checkPathExt(path3, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path3.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path3, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path3, options);
    }
    function isexe(path3, options, cb) {
      fs.stat(path3, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path3, options));
      });
    }
    function sync(path3, options) {
      return checkStat(fs.statSync(path3), path3, options);
    }
  }
});

// ../../node_modules/isexe/mode.js
var require_mode = __commonJS({
  "../../node_modules/isexe/mode.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs = require("fs");
    function isexe(path3, options, cb) {
      fs.stat(path3, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync(path3, options) {
      return checkStat(fs.statSync(path3), options);
    }
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// ../../node_modules/isexe/index.js
var require_isexe = __commonJS({
  "../../node_modules/isexe/index.js"(exports, module2) {
    var fs = require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path3, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve, reject) {
          isexe(path3, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve(is);
            }
          });
        });
      }
      core(path3, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path3, options) {
      try {
        return core.sync(path3, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// ../../node_modules/cross-spawn/node_modules/which/which.js
var require_which = __commonJS({
  "../../node_modules/cross-spawn/node_modules/which/which.js"(exports, module2) {
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path3 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i) => new Promise((resolve, reject) => {
        if (i === pathEnv.length)
          return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path3.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve(subStep(p, i, 0));
      });
      const subStep = (p, i, ii) => new Promise((resolve, reject) => {
        if (ii === pathExt.length)
          return resolve(step(i + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve(p + ext);
          }
          return resolve(subStep(p, i, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i = 0; i < pathEnv.length; i++) {
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path3.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module2.exports = which;
    which.sync = whichSync;
  }
});

// ../../node_modules/path-key/index.js
var require_path_key = __commonJS({
  "../../node_modules/path-key/index.js"(exports, module2) {
    "use strict";
    var pathKey2 = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module2.exports = pathKey2;
    module2.exports.default = pathKey2;
  }
});

// ../../node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "../../node_modules/cross-spawn/lib/util/resolveCommand.js"(exports, module2) {
    "use strict";
    var path3 = require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env2 = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env2[getPathKey({ env: env2 })],
          pathExt: withoutPathExt ? path3.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path3.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// ../../node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "../../node_modules/cross-spawn/lib/util/escape.js"(exports, module2) {
    "use strict";
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(\\*)"/g, '$1$1\\"');
      arg = arg.replace(/(\\*)$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module2.exports.command = escapeCommand;
    module2.exports.argument = escapeArgument;
  }
});

// ../../node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "../../node_modules/shebang-regex/index.js"(exports, module2) {
    "use strict";
    module2.exports = /^#!(.*)/;
  }
});

// ../../node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "../../node_modules/shebang-command/index.js"(exports, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path3, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path3.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// ../../node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "../../node_modules/cross-spawn/lib/util/readShebang.js"(exports, module2) {
    "use strict";
    var fs = require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command2) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs.openSync(command2, "r");
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// ../../node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/cross-spawn/lib/parse.js"(exports, module2) {
    "use strict";
    var path3 = require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path3.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command2, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command: command2,
        args,
        options,
        file: void 0,
        original: {
          command: command2,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// ../../node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "../../node_modules/cross-spawn/lib/enoent.js"(exports, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed, "spawn");
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module2.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// ../../node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "../../node_modules/cross-spawn/index.js"(exports, module2) {
    "use strict";
    var cp = require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn(command2, args, options) {
      const parsed = parse(command2, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command2, args, options) {
      const parsed = parse(command2, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn;
    module2.exports.spawn = spawn;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// ../../node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "../../node_modules/signal-exit/signals.js"(exports, module2) {
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
      );
    }
    if (process.platform === "linux") {
      module2.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// ../../node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "../../node_modules/signal-exit/index.js"(exports, module2) {
    var process5 = global.process;
    var processOk = function(process6) {
      return process6 && typeof process6 === "object" && typeof process6.removeListener === "function" && typeof process6.emit === "function" && typeof process6.reallyExit === "function" && typeof process6.listeners === "function" && typeof process6.kill === "function" && typeof process6.pid === "number" && typeof process6.on === "function";
    };
    if (!processOk(process5)) {
      module2.exports = function() {
        return function() {
        };
      };
    } else {
      assert = require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process5.platform);
      EE = require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process5.__signal_exit_emitter__) {
        emitter = process5.__signal_exit_emitter__;
      } else {
        emitter = process5.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module2.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process5.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process5.emit = originalProcessEmit;
        process5.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module2.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process5.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process5.kill(process5.pid, sig);
          }
        };
      });
      module2.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process5.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process5.emit = processEmit;
        process5.reallyExit = processReallyExit;
      };
      module2.exports.load = load;
      originalProcessReallyExit = process5.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process5.exitCode = code || 0;
        emit("exit", process5.exitCode, null);
        emit("afterexit", process5.exitCode, null);
        originalProcessReallyExit.call(process5, process5.exitCode);
      };
      originalProcessEmit = process5.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process5.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process5.exitCode, null);
          emit("afterexit", process5.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// ../../node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "../../node_modules/get-stream/buffer-stream.js"(exports, module2) {
    "use strict";
    var { PassThrough: PassThroughStream } = require("stream");
    module2.exports = (options) => {
      options = { ...options };
      const { array } = options;
      let { encoding } = options;
      const isBuffer = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || isBuffer);
      } else {
        encoding = encoding || "utf8";
      }
      if (isBuffer) {
        encoding = null;
      }
      const stream = new PassThroughStream({ objectMode });
      if (encoding) {
        stream.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream.on("data", (chunk) => {
        chunks.push(chunk);
        if (objectMode) {
          length = chunks.length;
        } else {
          length += chunk.length;
        }
      });
      stream.getBufferedValue = () => {
        if (array) {
          return chunks;
        }
        return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream.getBufferedLength = () => length;
      return stream;
    };
  }
});

// ../../node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "../../node_modules/get-stream/index.js"(exports, module2) {
    "use strict";
    var { constants: BufferConstants } = require("buffer");
    var stream = require("stream");
    var { promisify } = require("util");
    var bufferStream = require_buffer_stream();
    var streamPipelinePromisified = promisify(stream.pipeline);
    var MaxBufferError = class extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    async function getStream2(inputStream, options) {
      if (!inputStream) {
        throw new Error("Expected a stream");
      }
      options = {
        maxBuffer: Infinity,
        ...options
      };
      const { maxBuffer } = options;
      const stream2 = bufferStream(options);
      await new Promise((resolve, reject) => {
        const rejectPromise = (error) => {
          if (error && stream2.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
            error.bufferedData = stream2.getBufferedValue();
          }
          reject(error);
        };
        (async () => {
          try {
            await streamPipelinePromisified(inputStream, stream2);
            resolve();
          } catch (error) {
            rejectPromise(error);
          }
        })();
        stream2.on("data", () => {
          if (stream2.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream2.getBufferedValue();
    }
    module2.exports = getStream2;
    module2.exports.buffer = (stream2, options) => getStream2(stream2, { ...options, encoding: "buffer" });
    module2.exports.array = (stream2, options) => getStream2(stream2, { ...options, array: true });
    module2.exports.MaxBufferError = MaxBufferError;
  }
});

// ../../node_modules/merge-stream/index.js
var require_merge_stream = __commonJS({
  "../../node_modules/merge-stream/index.js"(exports, module2) {
    "use strict";
    var { PassThrough } = require("stream");
    module2.exports = function() {
      var sources = [];
      var output = new PassThrough({ objectMode: true });
      output.setMaxListeners(0);
      output.add = add;
      output.isEmpty = isEmpty;
      output.on("unpipe", remove);
      Array.prototype.slice.call(arguments).forEach(add);
      return output;
      function add(source) {
        if (Array.isArray(source)) {
          source.forEach(add);
          return this;
        }
        sources.push(source);
        source.once("end", remove.bind(null, source));
        source.once("error", output.emit.bind(output, "error"));
        source.pipe(output, { end: false });
        return this;
      }
      function isEmpty() {
        return sources.length == 0;
      }
      function remove(source) {
        sources = sources.filter(function(it) {
          return it !== source;
        });
        if (!sources.length && output.readable) {
          output.end();
        }
      }
    };
  }
});

// ../../node_modules/strip-ansi/node_modules/ansi-regex/index.js
var require_ansi_regex = __commonJS({
  "../../node_modules/strip-ansi/node_modules/ansi-regex/index.js"(exports, module2) {
    "use strict";
    module2.exports = ({ onlyFirst = false } = {}) => {
      const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
      ].join("|");
      return new RegExp(pattern, onlyFirst ? void 0 : "g");
    };
  }
});

// ../../node_modules/strip-ansi/index.js
var require_strip_ansi = __commonJS({
  "../../node_modules/strip-ansi/index.js"(exports, module2) {
    "use strict";
    var ansiRegex = require_ansi_regex();
    module2.exports = (string) => typeof string === "string" ? string.replace(ansiRegex(), "") : string;
  }
});

// ../../node_modules/string-width/node_modules/is-fullwidth-code-point/index.js
var require_is_fullwidth_code_point = __commonJS({
  "../../node_modules/string-width/node_modules/is-fullwidth-code-point/index.js"(exports, module2) {
    "use strict";
    var isFullwidthCodePoint = (codePoint) => {
      if (Number.isNaN(codePoint)) {
        return false;
      }
      if (codePoint >= 4352 && (codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || 11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || 12880 <= codePoint && codePoint <= 19903 || 19968 <= codePoint && codePoint <= 42182 || 43360 <= codePoint && codePoint <= 43388 || 44032 <= codePoint && codePoint <= 55203 || 63744 <= codePoint && codePoint <= 64255 || 65040 <= codePoint && codePoint <= 65049 || 65072 <= codePoint && codePoint <= 65131 || 65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || 110592 <= codePoint && codePoint <= 110593 || 127488 <= codePoint && codePoint <= 127569 || 131072 <= codePoint && codePoint <= 262141)) {
        return true;
      }
      return false;
    };
    module2.exports = isFullwidthCodePoint;
    module2.exports.default = isFullwidthCodePoint;
  }
});

// ../../node_modules/emoji-regex/index.js
var require_emoji_regex = __commonJS({
  "../../node_modules/emoji-regex/index.js"(exports, module2) {
    "use strict";
    module2.exports = function() {
      return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
    };
  }
});

// ../../node_modules/string-width/index.js
var require_string_width = __commonJS({
  "../../node_modules/string-width/index.js"(exports, module2) {
    "use strict";
    var stripAnsi = require_strip_ansi();
    var isFullwidthCodePoint = require_is_fullwidth_code_point();
    var emojiRegex = require_emoji_regex();
    var stringWidth = (string) => {
      if (typeof string !== "string" || string.length === 0) {
        return 0;
      }
      string = stripAnsi(string);
      if (string.length === 0) {
        return 0;
      }
      string = string.replace(emojiRegex(), "  ");
      let width = 0;
      for (let i = 0; i < string.length; i++) {
        const code = string.codePointAt(i);
        if (code <= 31 || code >= 127 && code <= 159) {
          continue;
        }
        if (code >= 768 && code <= 879) {
          continue;
        }
        if (code > 65535) {
          i++;
        }
        width += isFullwidthCodePoint(code) ? 2 : 1;
      }
      return width;
    };
    module2.exports = stringWidth;
    module2.exports.default = stringWidth;
  }
});

// ../../node_modules/slice-ansi/node_modules/is-fullwidth-code-point/index.js
var require_is_fullwidth_code_point2 = __commonJS({
  "../../node_modules/slice-ansi/node_modules/is-fullwidth-code-point/index.js"(exports, module2) {
    "use strict";
    var isFullwidthCodePoint = (codePoint) => {
      if (Number.isNaN(codePoint)) {
        return false;
      }
      if (codePoint >= 4352 && (codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || 11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || 12880 <= codePoint && codePoint <= 19903 || 19968 <= codePoint && codePoint <= 42182 || 43360 <= codePoint && codePoint <= 43388 || 44032 <= codePoint && codePoint <= 55203 || 63744 <= codePoint && codePoint <= 64255 || 65040 <= codePoint && codePoint <= 65049 || 65072 <= codePoint && codePoint <= 65131 || 65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || 110592 <= codePoint && codePoint <= 110593 || 127488 <= codePoint && codePoint <= 127569 || 131072 <= codePoint && codePoint <= 262141)) {
        return true;
      }
      return false;
    };
    module2.exports = isFullwidthCodePoint;
    module2.exports.default = isFullwidthCodePoint;
  }
});

// ../../node_modules/astral-regex/index.js
var require_astral_regex = __commonJS({
  "../../node_modules/astral-regex/index.js"(exports, module2) {
    "use strict";
    var regex = "[\uD800-\uDBFF][\uDC00-\uDFFF]";
    var astralRegex = (options) => options && options.exact ? new RegExp(`^${regex}$`) : new RegExp(regex, "g");
    module2.exports = astralRegex;
  }
});

// ../../node_modules/color-name/index.js
var require_color_name = __commonJS({
  "../../node_modules/color-name/index.js"(exports, module2) {
    "use strict";
    module2.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// ../../node_modules/color-convert/conversions.js
var require_conversions = __commonJS({
  "../../node_modules/color-convert/conversions.js"(exports, module2) {
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
    var convert = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    module2.exports = convert;
    for (const model of Object.keys(convert)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert[model];
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", { value: channels });
      Object.defineProperty(convert[model], "labels", { value: labels });
    }
    convert.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Infinity;
      let currentClosestKeyword;
      for (const keyword of Object.keys(cssKeywords)) {
        const value = cssKeywords[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb) {
      let r = rgb[0] / 255;
      let g = rgb[1] / 255;
      let b = rgb[2] / 255;
      r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
      g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
      b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      const xyz = convert.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t2;
      let t3;
      let val;
      if (s === 0) {
        val = l * 255;
        return [val, val, val];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (~~(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map((char) => {
          return char + char;
        }).join("");
      }
      const integer = parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let grayscale;
      let hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hsv = convert.gray.hsl;
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      const val = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (val << 16) + (val << 8) + val;
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [val / 255 * 100];
    };
  }
});

// ../../node_modules/color-convert/route.js
var require_route = __commonJS({
  "../../node_modules/color-convert/route.js"(exports, module2) {
    var conversions = require_conversions();
    function buildGraph() {
      const graph = {};
      const models = Object.keys(conversions);
      for (let len = models.length, i = 0; i < len; i++) {
        graph[models[i]] = {
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions[current]);
        for (let len = adjacents.length, i = 0; i < len; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      const path3 = [graph[toModel].parent, toModel];
      let fn = conversions[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path3.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path3;
      return fn;
    }
    module2.exports = function(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models = Object.keys(graph);
      for (let len = models.length, i = 0; i < len; i++) {
        const toModel = models[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// ../../node_modules/color-convert/index.js
var require_color_convert = __commonJS({
  "../../node_modules/color-convert/index.js"(exports, module2) {
    var conversions = require_conversions();
    var route = require_route();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    models.forEach((fromModel) => {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
      const routes = route(fromModel);
      const routeModels = Object.keys(routes);
      routeModels.forEach((toModel) => {
        const fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module2.exports = convert;
  }
});

// ../../node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS({
  "../../node_modules/ansi-styles/index.js"(exports, module2) {
    "use strict";
    var wrapAnsi162 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${code + offset}m`;
    };
    var wrapAnsi2562 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${38 + offset};5;${code}m`;
    };
    var wrapAnsi16m2 = (fn, offset) => (...args) => {
      const rgb = fn(...args);
      return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
    };
    var ansi2ansi = (n) => n;
    var rgb2rgb = (r, g, b) => [r, g, b];
    var setLazyProperty = (object, property, get) => {
      Object.defineProperty(object, property, {
        get: () => {
          const value = get();
          Object.defineProperty(object, property, {
            value,
            enumerable: true,
            configurable: true
          });
          return value;
        },
        enumerable: true,
        configurable: true
      });
    };
    var colorConvert;
    var makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
      if (colorConvert === void 0) {
        colorConvert = require_color_convert();
      }
      const offset = isBackground ? 10 : 0;
      const styles2 = {};
      for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
        const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
        if (sourceSpace === targetSpace) {
          styles2[name] = wrap(identity, offset);
        } else if (typeof suite === "object") {
          styles2[name] = wrap(suite[targetSpace], offset);
        }
      }
      return styles2;
    };
    function assembleStyles2() {
      const codes = /* @__PURE__ */ new Map();
      const styles2 = {
        modifier: {
          reset: [0, 0],
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      styles2.color.gray = styles2.color.blackBright;
      styles2.bgColor.bgGray = styles2.bgColor.bgBlackBright;
      styles2.color.grey = styles2.color.blackBright;
      styles2.bgColor.bgGrey = styles2.bgColor.bgBlackBright;
      for (const [groupName, group] of Object.entries(styles2)) {
        for (const [styleName, style] of Object.entries(group)) {
          styles2[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles2[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles2, groupName, {
          value: group,
          enumerable: false
        });
      }
      Object.defineProperty(styles2, "codes", {
        value: codes,
        enumerable: false
      });
      styles2.color.close = "\x1B[39m";
      styles2.bgColor.close = "\x1B[49m";
      setLazyProperty(styles2.color, "ansi", () => makeDynamicStyles(wrapAnsi162, "ansi16", ansi2ansi, false));
      setLazyProperty(styles2.color, "ansi256", () => makeDynamicStyles(wrapAnsi2562, "ansi256", ansi2ansi, false));
      setLazyProperty(styles2.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m2, "rgb", rgb2rgb, false));
      setLazyProperty(styles2.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi162, "ansi16", ansi2ansi, true));
      setLazyProperty(styles2.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi2562, "ansi256", ansi2ansi, true));
      setLazyProperty(styles2.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m2, "rgb", rgb2rgb, true));
      return styles2;
    }
    Object.defineProperty(module2, "exports", {
      enumerable: true,
      get: assembleStyles2
    });
  }
});

// ../../node_modules/slice-ansi/index.js
var require_slice_ansi = __commonJS({
  "../../node_modules/slice-ansi/index.js"(exports, module2) {
    "use strict";
    var isFullwidthCodePoint = require_is_fullwidth_code_point2();
    var astralRegex = require_astral_regex();
    var ansiStyles2 = require_ansi_styles();
    var ESCAPES = [
      "\x1B",
      "\x9B"
    ];
    var wrapAnsi = (code) => `${ESCAPES[0]}[${code}m`;
    var checkAnsi = (ansiCodes, isEscapes, endAnsiCode) => {
      let output = [];
      ansiCodes = [...ansiCodes];
      for (let ansiCode of ansiCodes) {
        const ansiCodeOrigin = ansiCode;
        if (ansiCode.includes(";")) {
          ansiCode = ansiCode.split(";")[0][0] + "0";
        }
        const item = ansiStyles2.codes.get(Number.parseInt(ansiCode, 10));
        if (item) {
          const indexEscape = ansiCodes.indexOf(item.toString());
          if (indexEscape === -1) {
            output.push(wrapAnsi(isEscapes ? item : ansiCodeOrigin));
          } else {
            ansiCodes.splice(indexEscape, 1);
          }
        } else if (isEscapes) {
          output.push(wrapAnsi(0));
          break;
        } else {
          output.push(wrapAnsi(ansiCodeOrigin));
        }
      }
      if (isEscapes) {
        output = output.filter((element, index) => output.indexOf(element) === index);
        if (endAnsiCode !== void 0) {
          const fistEscapeCode = wrapAnsi(ansiStyles2.codes.get(Number.parseInt(endAnsiCode, 10)));
          output = output.reduce((current, next) => next === fistEscapeCode ? [next, ...current] : [...current, next], []);
        }
      }
      return output.join("");
    };
    module2.exports = (string, begin, end) => {
      const characters = [...string];
      const ansiCodes = [];
      let stringEnd = typeof end === "number" ? end : characters.length;
      let isInsideEscape = false;
      let ansiCode;
      let visible = 0;
      let output = "";
      for (const [index, character] of characters.entries()) {
        let leftEscape = false;
        if (ESCAPES.includes(character)) {
          const code = /\d[^m]*/.exec(string.slice(index, index + 18));
          ansiCode = code && code.length > 0 ? code[0] : void 0;
          if (visible < stringEnd) {
            isInsideEscape = true;
            if (ansiCode !== void 0) {
              ansiCodes.push(ansiCode);
            }
          }
        } else if (isInsideEscape && character === "m") {
          isInsideEscape = false;
          leftEscape = true;
        }
        if (!isInsideEscape && !leftEscape) {
          visible++;
        }
        if (!astralRegex({ exact: true }).test(character) && isFullwidthCodePoint(character.codePointAt())) {
          visible++;
          if (typeof end !== "number") {
            stringEnd++;
          }
        }
        if (visible > begin && visible <= stringEnd) {
          output += character;
        } else if (visible === begin && !isInsideEscape && ansiCode !== void 0) {
          output = checkAnsi(ansiCodes);
        } else if (visible >= stringEnd) {
          output += checkAnsi(ansiCodes, true, ansiCode);
          break;
        }
      }
      return output;
    };
  }
});

// ../../node_modules/table/dist/src/getBorderCharacters.js
var require_getBorderCharacters = __commonJS({
  "../../node_modules/table/dist/src/getBorderCharacters.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBorderCharacters = void 0;
    var getBorderCharacters2 = (name) => {
      if (name === "honeywell") {
        return {
          topBody: "\u2550",
          topJoin: "\u2564",
          topLeft: "\u2554",
          topRight: "\u2557",
          bottomBody: "\u2550",
          bottomJoin: "\u2567",
          bottomLeft: "\u255A",
          bottomRight: "\u255D",
          bodyLeft: "\u2551",
          bodyRight: "\u2551",
          bodyJoin: "\u2502",
          headerJoin: "\u252C",
          joinBody: "\u2500",
          joinLeft: "\u255F",
          joinRight: "\u2562",
          joinJoin: "\u253C",
          joinMiddleDown: "\u252C",
          joinMiddleUp: "\u2534",
          joinMiddleLeft: "\u2524",
          joinMiddleRight: "\u251C"
        };
      }
      if (name === "norc") {
        return {
          topBody: "\u2500",
          topJoin: "\u252C",
          topLeft: "\u250C",
          topRight: "\u2510",
          bottomBody: "\u2500",
          bottomJoin: "\u2534",
          bottomLeft: "\u2514",
          bottomRight: "\u2518",
          bodyLeft: "\u2502",
          bodyRight: "\u2502",
          bodyJoin: "\u2502",
          headerJoin: "\u252C",
          joinBody: "\u2500",
          joinLeft: "\u251C",
          joinRight: "\u2524",
          joinJoin: "\u253C",
          joinMiddleDown: "\u252C",
          joinMiddleUp: "\u2534",
          joinMiddleLeft: "\u2524",
          joinMiddleRight: "\u251C"
        };
      }
      if (name === "ramac") {
        return {
          topBody: "-",
          topJoin: "+",
          topLeft: "+",
          topRight: "+",
          bottomBody: "-",
          bottomJoin: "+",
          bottomLeft: "+",
          bottomRight: "+",
          bodyLeft: "|",
          bodyRight: "|",
          bodyJoin: "|",
          headerJoin: "+",
          joinBody: "-",
          joinLeft: "|",
          joinRight: "|",
          joinJoin: "|",
          joinMiddleDown: "+",
          joinMiddleUp: "+",
          joinMiddleLeft: "+",
          joinMiddleRight: "+"
        };
      }
      if (name === "void") {
        return {
          topBody: "",
          topJoin: "",
          topLeft: "",
          topRight: "",
          bottomBody: "",
          bottomJoin: "",
          bottomLeft: "",
          bottomRight: "",
          bodyLeft: "",
          bodyRight: "",
          bodyJoin: "",
          headerJoin: "",
          joinBody: "",
          joinLeft: "",
          joinRight: "",
          joinJoin: "",
          joinMiddleDown: "",
          joinMiddleUp: "",
          joinMiddleLeft: "",
          joinMiddleRight: ""
        };
      }
      throw new Error('Unknown border template "' + name + '".');
    };
    exports.getBorderCharacters = getBorderCharacters2;
  }
});

// ../../node_modules/table/dist/src/utils.js
var require_utils = __commonJS({
  "../../node_modules/table/dist/src/utils.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isCellInRange = exports.areCellEqual = exports.calculateRangeCoordinate = exports.findOriginalRowIndex = exports.flatten = exports.extractTruncates = exports.sumArray = exports.sequence = exports.distributeUnevenly = exports.countSpaceSequence = exports.groupBySizes = exports.makeBorderConfig = exports.splitAnsi = exports.normalizeString = void 0;
    var slice_ansi_1 = __importDefault(require_slice_ansi());
    var string_width_1 = __importDefault(require_string_width());
    var strip_ansi_1 = __importDefault(require_strip_ansi());
    var getBorderCharacters_1 = require_getBorderCharacters();
    var normalizeString = (input) => {
      return input.replace(/\r\n/g, "\n");
    };
    exports.normalizeString = normalizeString;
    var splitAnsi = (input) => {
      const lengths = (0, strip_ansi_1.default)(input).split("\n").map(string_width_1.default);
      const result = [];
      let startIndex = 0;
      lengths.forEach((length) => {
        result.push(length === 0 ? "" : (0, slice_ansi_1.default)(input, startIndex, startIndex + length));
        startIndex += length + 1;
      });
      return result;
    };
    exports.splitAnsi = splitAnsi;
    var makeBorderConfig = (border) => {
      return {
        ...(0, getBorderCharacters_1.getBorderCharacters)("honeywell"),
        ...border
      };
    };
    exports.makeBorderConfig = makeBorderConfig;
    var groupBySizes = (array, sizes) => {
      let startIndex = 0;
      return sizes.map((size) => {
        const group = array.slice(startIndex, startIndex + size);
        startIndex += size;
        return group;
      });
    };
    exports.groupBySizes = groupBySizes;
    var countSpaceSequence = (input) => {
      var _a, _b;
      return (_b = (_a = input.match(/\s+/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    };
    exports.countSpaceSequence = countSpaceSequence;
    var distributeUnevenly = (sum, length) => {
      const result = Array.from({ length }).fill(Math.floor(sum / length));
      return result.map((element, index) => {
        return element + (index < sum % length ? 1 : 0);
      });
    };
    exports.distributeUnevenly = distributeUnevenly;
    var sequence = (start, end) => {
      return Array.from({ length: end - start + 1 }, (_, index) => {
        return index + start;
      });
    };
    exports.sequence = sequence;
    var sumArray = (array) => {
      return array.reduce((accumulator, element) => {
        return accumulator + element;
      }, 0);
    };
    exports.sumArray = sumArray;
    var extractTruncates = (config) => {
      return config.columns.map(({ truncate }) => {
        return truncate;
      });
    };
    exports.extractTruncates = extractTruncates;
    var flatten = (array) => {
      return [].concat(...array);
    };
    exports.flatten = flatten;
    var findOriginalRowIndex = (mappedRowHeights, mappedRowIndex) => {
      const rowIndexMapping = (0, exports.flatten)(mappedRowHeights.map((height, index) => {
        return Array.from({ length: height }, () => {
          return index;
        });
      }));
      return rowIndexMapping[mappedRowIndex];
    };
    exports.findOriginalRowIndex = findOriginalRowIndex;
    var calculateRangeCoordinate = (spanningCellConfig) => {
      const { row, col, colSpan = 1, rowSpan = 1 } = spanningCellConfig;
      return {
        bottomRight: {
          col: col + colSpan - 1,
          row: row + rowSpan - 1
        },
        topLeft: {
          col,
          row
        }
      };
    };
    exports.calculateRangeCoordinate = calculateRangeCoordinate;
    var areCellEqual = (cell1, cell2) => {
      return cell1.row === cell2.row && cell1.col === cell2.col;
    };
    exports.areCellEqual = areCellEqual;
    var isCellInRange = (cell, { topLeft, bottomRight }) => {
      return topLeft.row <= cell.row && cell.row <= bottomRight.row && topLeft.col <= cell.col && cell.col <= bottomRight.col;
    };
    exports.isCellInRange = isCellInRange;
  }
});

// ../../node_modules/table/dist/src/alignString.js
var require_alignString = __commonJS({
  "../../node_modules/table/dist/src/alignString.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.alignString = void 0;
    var string_width_1 = __importDefault(require_string_width());
    var utils_1 = require_utils();
    var alignLeft = (subject, width) => {
      return subject + " ".repeat(width);
    };
    var alignRight = (subject, width) => {
      return " ".repeat(width) + subject;
    };
    var alignCenter = (subject, width) => {
      return " ".repeat(Math.floor(width / 2)) + subject + " ".repeat(Math.ceil(width / 2));
    };
    var alignJustify = (subject, width) => {
      const spaceSequenceCount = (0, utils_1.countSpaceSequence)(subject);
      if (spaceSequenceCount === 0) {
        return alignLeft(subject, width);
      }
      const addingSpaces = (0, utils_1.distributeUnevenly)(width, spaceSequenceCount);
      if (Math.max(...addingSpaces) > 3) {
        return alignLeft(subject, width);
      }
      let spaceSequenceIndex = 0;
      return subject.replace(/\s+/g, (groupSpace) => {
        return groupSpace + " ".repeat(addingSpaces[spaceSequenceIndex++]);
      });
    };
    var alignString = (subject, containerWidth, alignment) => {
      const subjectWidth = (0, string_width_1.default)(subject);
      if (subjectWidth === containerWidth) {
        return subject;
      }
      if (subjectWidth > containerWidth) {
        throw new Error("Subject parameter value width cannot be greater than the container width.");
      }
      if (subjectWidth === 0) {
        return " ".repeat(containerWidth);
      }
      const availableWidth = containerWidth - subjectWidth;
      if (alignment === "left") {
        return alignLeft(subject, availableWidth);
      }
      if (alignment === "right") {
        return alignRight(subject, availableWidth);
      }
      if (alignment === "justify") {
        return alignJustify(subject, availableWidth);
      }
      return alignCenter(subject, availableWidth);
    };
    exports.alignString = alignString;
  }
});

// ../../node_modules/table/dist/src/alignTableData.js
var require_alignTableData = __commonJS({
  "../../node_modules/table/dist/src/alignTableData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.alignTableData = void 0;
    var alignString_1 = require_alignString();
    var alignTableData = (rows, config) => {
      return rows.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          var _a;
          const { width, alignment } = config.columns[cellIndex];
          const containingRange = (_a = config.spanningCellManager) === null || _a === void 0 ? void 0 : _a.getContainingRange({
            col: cellIndex,
            row: rowIndex
          }, { mapped: true });
          if (containingRange) {
            return cell;
          }
          return (0, alignString_1.alignString)(cell, width, alignment);
        });
      });
    };
    exports.alignTableData = alignTableData;
  }
});

// ../../node_modules/table/dist/src/wrapString.js
var require_wrapString = __commonJS({
  "../../node_modules/table/dist/src/wrapString.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapString = void 0;
    var slice_ansi_1 = __importDefault(require_slice_ansi());
    var string_width_1 = __importDefault(require_string_width());
    var wrapString = (subject, size) => {
      let subjectSlice = subject;
      const chunks = [];
      do {
        chunks.push((0, slice_ansi_1.default)(subjectSlice, 0, size));
        subjectSlice = (0, slice_ansi_1.default)(subjectSlice, size).trim();
      } while ((0, string_width_1.default)(subjectSlice));
      return chunks;
    };
    exports.wrapString = wrapString;
  }
});

// ../../node_modules/table/dist/src/wrapWord.js
var require_wrapWord = __commonJS({
  "../../node_modules/table/dist/src/wrapWord.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapWord = void 0;
    var slice_ansi_1 = __importDefault(require_slice_ansi());
    var strip_ansi_1 = __importDefault(require_strip_ansi());
    var calculateStringLengths = (input, size) => {
      let subject = (0, strip_ansi_1.default)(input);
      const chunks = [];
      const re = new RegExp("(^.{1," + String(Math.max(size, 1)) + "}(\\s+|$))|(^.{1," + String(Math.max(size - 1, 1)) + "}(\\\\|/|_|\\.|,|;|-))");
      do {
        let chunk;
        const match = re.exec(subject);
        if (match) {
          chunk = match[0];
          subject = subject.slice(chunk.length);
          const trimmedLength = chunk.trim().length;
          const offset = chunk.length - trimmedLength;
          chunks.push([trimmedLength, offset]);
        } else {
          chunk = subject.slice(0, size);
          subject = subject.slice(size);
          chunks.push([chunk.length, 0]);
        }
      } while (subject.length);
      return chunks;
    };
    var wrapWord = (input, size) => {
      const result = [];
      let startIndex = 0;
      calculateStringLengths(input, size).forEach(([length, offset]) => {
        result.push((0, slice_ansi_1.default)(input, startIndex, startIndex + length));
        startIndex += length + offset;
      });
      return result;
    };
    exports.wrapWord = wrapWord;
  }
});

// ../../node_modules/table/dist/src/wrapCell.js
var require_wrapCell = __commonJS({
  "../../node_modules/table/dist/src/wrapCell.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapCell = void 0;
    var utils_1 = require_utils();
    var wrapString_1 = require_wrapString();
    var wrapWord_1 = require_wrapWord();
    var wrapCell = (cellValue, cellWidth, useWrapWord) => {
      const cellLines = (0, utils_1.splitAnsi)(cellValue);
      for (let lineNr = 0; lineNr < cellLines.length; ) {
        let lineChunks;
        if (useWrapWord) {
          lineChunks = (0, wrapWord_1.wrapWord)(cellLines[lineNr], cellWidth);
        } else {
          lineChunks = (0, wrapString_1.wrapString)(cellLines[lineNr], cellWidth);
        }
        cellLines.splice(lineNr, 1, ...lineChunks);
        lineNr += lineChunks.length;
      }
      return cellLines;
    };
    exports.wrapCell = wrapCell;
  }
});

// ../../node_modules/table/dist/src/calculateCellHeight.js
var require_calculateCellHeight = __commonJS({
  "../../node_modules/table/dist/src/calculateCellHeight.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.calculateCellHeight = void 0;
    var wrapCell_1 = require_wrapCell();
    var calculateCellHeight = (value, columnWidth, useWrapWord = false) => {
      return (0, wrapCell_1.wrapCell)(value, columnWidth, useWrapWord).length;
    };
    exports.calculateCellHeight = calculateCellHeight;
  }
});

// ../../node_modules/table/dist/src/calculateRowHeights.js
var require_calculateRowHeights = __commonJS({
  "../../node_modules/table/dist/src/calculateRowHeights.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.calculateRowHeights = void 0;
    var calculateCellHeight_1 = require_calculateCellHeight();
    var utils_1 = require_utils();
    var calculateRowHeights = (rows, config) => {
      const rowHeights = [];
      for (const [rowIndex, row] of rows.entries()) {
        let rowHeight = 1;
        row.forEach((cell, cellIndex) => {
          var _a;
          const containingRange = (_a = config.spanningCellManager) === null || _a === void 0 ? void 0 : _a.getContainingRange({
            col: cellIndex,
            row: rowIndex
          });
          if (!containingRange) {
            const cellHeight = (0, calculateCellHeight_1.calculateCellHeight)(cell, config.columns[cellIndex].width, config.columns[cellIndex].wrapWord);
            rowHeight = Math.max(rowHeight, cellHeight);
            return;
          }
          const { topLeft, bottomRight, height } = containingRange;
          if (rowIndex === bottomRight.row) {
            const totalOccupiedSpanningCellHeight = (0, utils_1.sumArray)(rowHeights.slice(topLeft.row));
            const totalHorizontalBorderHeight = bottomRight.row - topLeft.row;
            const totalHiddenHorizontalBorderHeight = (0, utils_1.sequence)(topLeft.row + 1, bottomRight.row).filter((horizontalBorderIndex) => {
              var _a2;
              return !((_a2 = config.drawHorizontalLine) === null || _a2 === void 0 ? void 0 : _a2.call(config, horizontalBorderIndex, rows.length));
            }).length;
            const cellHeight = height - totalOccupiedSpanningCellHeight - totalHorizontalBorderHeight + totalHiddenHorizontalBorderHeight;
            rowHeight = Math.max(rowHeight, cellHeight);
          }
        });
        rowHeights.push(rowHeight);
      }
      return rowHeights;
    };
    exports.calculateRowHeights = calculateRowHeights;
  }
});

// ../../node_modules/table/dist/src/drawContent.js
var require_drawContent = __commonJS({
  "../../node_modules/table/dist/src/drawContent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.drawContent = void 0;
    var drawContent = (parameters) => {
      const { contents, separatorGetter, drawSeparator, spanningCellManager, rowIndex, elementType } = parameters;
      const contentSize = contents.length;
      const result = [];
      if (drawSeparator(0, contentSize)) {
        result.push(separatorGetter(0, contentSize));
      }
      contents.forEach((content, contentIndex) => {
        if (!elementType || elementType === "border" || elementType === "row") {
          result.push(content);
        }
        if (elementType === "cell" && rowIndex === void 0) {
          result.push(content);
        }
        if (elementType === "cell" && rowIndex !== void 0) {
          const containingRange = spanningCellManager === null || spanningCellManager === void 0 ? void 0 : spanningCellManager.getContainingRange({
            col: contentIndex,
            row: rowIndex
          });
          if (!containingRange || contentIndex === containingRange.topLeft.col) {
            result.push(content);
          }
        }
        if (contentIndex + 1 < contentSize && drawSeparator(contentIndex + 1, contentSize)) {
          const separator = separatorGetter(contentIndex + 1, contentSize);
          if (elementType === "cell" && rowIndex !== void 0) {
            const currentCell = {
              col: contentIndex + 1,
              row: rowIndex
            };
            const containingRange = spanningCellManager === null || spanningCellManager === void 0 ? void 0 : spanningCellManager.getContainingRange(currentCell);
            if (!containingRange || containingRange.topLeft.col === currentCell.col) {
              result.push(separator);
            }
          } else {
            result.push(separator);
          }
        }
      });
      if (drawSeparator(contentSize, contentSize)) {
        result.push(separatorGetter(contentSize, contentSize));
      }
      return result.join("");
    };
    exports.drawContent = drawContent;
  }
});

// ../../node_modules/table/dist/src/drawBorder.js
var require_drawBorder = __commonJS({
  "../../node_modules/table/dist/src/drawBorder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createTableBorderGetter = exports.drawBorderBottom = exports.drawBorderJoin = exports.drawBorderTop = exports.drawBorder = exports.createSeparatorGetter = exports.drawBorderSegments = void 0;
    var drawContent_1 = require_drawContent();
    var drawBorderSegments = (columnWidths, parameters) => {
      const { separator, horizontalBorderIndex, spanningCellManager } = parameters;
      return columnWidths.map((columnWidth, columnIndex) => {
        const normalSegment = separator.body.repeat(columnWidth);
        if (horizontalBorderIndex === void 0) {
          return normalSegment;
        }
        const range = spanningCellManager === null || spanningCellManager === void 0 ? void 0 : spanningCellManager.getContainingRange({
          col: columnIndex,
          row: horizontalBorderIndex
        });
        if (!range) {
          return normalSegment;
        }
        const { topLeft } = range;
        if (horizontalBorderIndex === topLeft.row) {
          return normalSegment;
        }
        if (columnIndex !== topLeft.col) {
          return "";
        }
        return range.extractBorderContent(horizontalBorderIndex);
      });
    };
    exports.drawBorderSegments = drawBorderSegments;
    var createSeparatorGetter = (dependencies) => {
      const { separator, spanningCellManager, horizontalBorderIndex, rowCount } = dependencies;
      return (verticalBorderIndex, columnCount) => {
        const inSameRange = spanningCellManager === null || spanningCellManager === void 0 ? void 0 : spanningCellManager.inSameRange;
        if (horizontalBorderIndex !== void 0 && inSameRange) {
          const topCell = {
            col: verticalBorderIndex,
            row: horizontalBorderIndex - 1
          };
          const leftCell = {
            col: verticalBorderIndex - 1,
            row: horizontalBorderIndex
          };
          const oppositeCell = {
            col: verticalBorderIndex - 1,
            row: horizontalBorderIndex - 1
          };
          const currentCell = {
            col: verticalBorderIndex,
            row: horizontalBorderIndex
          };
          const pairs = [
            [oppositeCell, topCell],
            [topCell, currentCell],
            [currentCell, leftCell],
            [leftCell, oppositeCell]
          ];
          if (verticalBorderIndex === 0) {
            if (inSameRange(currentCell, topCell) && separator.bodyJoinOuter) {
              return separator.bodyJoinOuter;
            }
            return separator.left;
          }
          if (verticalBorderIndex === columnCount) {
            if (inSameRange(oppositeCell, leftCell) && separator.bodyJoinOuter) {
              return separator.bodyJoinOuter;
            }
            return separator.right;
          }
          if (horizontalBorderIndex === 0) {
            if (inSameRange(currentCell, leftCell)) {
              return separator.body;
            }
            return separator.join;
          }
          if (horizontalBorderIndex === rowCount) {
            if (inSameRange(topCell, oppositeCell)) {
              return separator.body;
            }
            return separator.join;
          }
          const sameRangeCount = pairs.map((pair) => {
            return inSameRange(...pair);
          }).filter(Boolean).length;
          if (sameRangeCount === 0) {
            return separator.join;
          }
          if (sameRangeCount === 4) {
            return "";
          }
          if (sameRangeCount === 2) {
            if (inSameRange(...pairs[1]) && inSameRange(...pairs[3]) && separator.bodyJoinInner) {
              return separator.bodyJoinInner;
            }
            return separator.body;
          }
          if (sameRangeCount === 1) {
            if (!separator.joinRight || !separator.joinLeft || !separator.joinUp || !separator.joinDown) {
              throw new Error(`Can not get border separator for position [${horizontalBorderIndex}, ${verticalBorderIndex}]`);
            }
            if (inSameRange(...pairs[0])) {
              return separator.joinDown;
            }
            if (inSameRange(...pairs[1])) {
              return separator.joinLeft;
            }
            if (inSameRange(...pairs[2])) {
              return separator.joinUp;
            }
            return separator.joinRight;
          }
          throw new Error("Invalid case");
        }
        if (verticalBorderIndex === 0) {
          return separator.left;
        }
        if (verticalBorderIndex === columnCount) {
          return separator.right;
        }
        return separator.join;
      };
    };
    exports.createSeparatorGetter = createSeparatorGetter;
    var drawBorder = (columnWidths, parameters) => {
      const borderSegments = (0, exports.drawBorderSegments)(columnWidths, parameters);
      const { drawVerticalLine, horizontalBorderIndex, spanningCellManager } = parameters;
      return (0, drawContent_1.drawContent)({
        contents: borderSegments,
        drawSeparator: drawVerticalLine,
        elementType: "border",
        rowIndex: horizontalBorderIndex,
        separatorGetter: (0, exports.createSeparatorGetter)(parameters),
        spanningCellManager
      }) + "\n";
    };
    exports.drawBorder = drawBorder;
    var drawBorderTop = (columnWidths, parameters) => {
      const { border } = parameters;
      const result = (0, exports.drawBorder)(columnWidths, {
        ...parameters,
        separator: {
          body: border.topBody,
          join: border.topJoin,
          left: border.topLeft,
          right: border.topRight
        }
      });
      if (result === "\n") {
        return "";
      }
      return result;
    };
    exports.drawBorderTop = drawBorderTop;
    var drawBorderJoin = (columnWidths, parameters) => {
      const { border } = parameters;
      return (0, exports.drawBorder)(columnWidths, {
        ...parameters,
        separator: {
          body: border.joinBody,
          bodyJoinInner: border.bodyJoin,
          bodyJoinOuter: border.bodyLeft,
          join: border.joinJoin,
          joinDown: border.joinMiddleDown,
          joinLeft: border.joinMiddleLeft,
          joinRight: border.joinMiddleRight,
          joinUp: border.joinMiddleUp,
          left: border.joinLeft,
          right: border.joinRight
        }
      });
    };
    exports.drawBorderJoin = drawBorderJoin;
    var drawBorderBottom = (columnWidths, parameters) => {
      const { border } = parameters;
      return (0, exports.drawBorder)(columnWidths, {
        ...parameters,
        separator: {
          body: border.bottomBody,
          join: border.bottomJoin,
          left: border.bottomLeft,
          right: border.bottomRight
        }
      });
    };
    exports.drawBorderBottom = drawBorderBottom;
    var createTableBorderGetter = (columnWidths, parameters) => {
      return (index, size) => {
        const drawBorderParameters = {
          ...parameters,
          horizontalBorderIndex: index
        };
        if (index === 0) {
          return (0, exports.drawBorderTop)(columnWidths, drawBorderParameters);
        } else if (index === size) {
          return (0, exports.drawBorderBottom)(columnWidths, drawBorderParameters);
        }
        return (0, exports.drawBorderJoin)(columnWidths, drawBorderParameters);
      };
    };
    exports.createTableBorderGetter = createTableBorderGetter;
  }
});

// ../../node_modules/table/dist/src/drawRow.js
var require_drawRow = __commonJS({
  "../../node_modules/table/dist/src/drawRow.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.drawRow = void 0;
    var drawContent_1 = require_drawContent();
    var drawRow = (row, config) => {
      const { border, drawVerticalLine, rowIndex, spanningCellManager } = config;
      return (0, drawContent_1.drawContent)({
        contents: row,
        drawSeparator: drawVerticalLine,
        elementType: "cell",
        rowIndex,
        separatorGetter: (index, columnCount) => {
          if (index === 0) {
            return border.bodyLeft;
          }
          if (index === columnCount) {
            return border.bodyRight;
          }
          return border.bodyJoin;
        },
        spanningCellManager
      }) + "\n";
    };
    exports.drawRow = drawRow;
  }
});

// ../../node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "../../node_modules/fast-deep-equal/index.js"(exports, module2) {
    "use strict";
    module2.exports = function equal(a, b) {
      if (a === b)
        return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor)
          return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length)
            return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i]))
              return false;
          return true;
        }
        if (a.constructor === RegExp)
          return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
          return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
          return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length)
          return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
            return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key]))
            return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// ../../node_modules/table/node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "../../node_modules/table/node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// ../../node_modules/table/dist/src/generated/validators.js
var require_validators = __commonJS({
  "../../node_modules/table/dist/src/generated/validators.js"(exports) {
    "use strict";
    exports["config.json"] = validate43;
    var schema13 = {
      "$id": "config.json",
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
        "border": {
          "$ref": "shared.json#/definitions/borders"
        },
        "header": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string"
            },
            "alignment": {
              "$ref": "shared.json#/definitions/alignment"
            },
            "wrapWord": {
              "type": "boolean"
            },
            "truncate": {
              "type": "integer"
            },
            "paddingLeft": {
              "type": "integer"
            },
            "paddingRight": {
              "type": "integer"
            }
          },
          "required": ["content"],
          "additionalProperties": false
        },
        "columns": {
          "$ref": "shared.json#/definitions/columns"
        },
        "columnDefault": {
          "$ref": "shared.json#/definitions/column"
        },
        "drawVerticalLine": {
          "typeof": "function"
        },
        "drawHorizontalLine": {
          "typeof": "function"
        },
        "singleLine": {
          "typeof": "boolean"
        },
        "spanningCells": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "col": {
                "type": "integer",
                "minimum": 0
              },
              "row": {
                "type": "integer",
                "minimum": 0
              },
              "colSpan": {
                "type": "integer",
                "minimum": 1
              },
              "rowSpan": {
                "type": "integer",
                "minimum": 1
              },
              "alignment": {
                "$ref": "shared.json#/definitions/alignment"
              },
              "verticalAlignment": {
                "$ref": "shared.json#/definitions/verticalAlignment"
              },
              "wrapWord": {
                "type": "boolean"
              },
              "truncate": {
                "type": "integer"
              },
              "paddingLeft": {
                "type": "integer"
              },
              "paddingRight": {
                "type": "integer"
              }
            },
            "required": ["row", "col"],
            "additionalProperties": false
          }
        }
      },
      "additionalProperties": false
    };
    var schema15 = {
      "type": "object",
      "properties": {
        "topBody": {
          "$ref": "#/definitions/border"
        },
        "topJoin": {
          "$ref": "#/definitions/border"
        },
        "topLeft": {
          "$ref": "#/definitions/border"
        },
        "topRight": {
          "$ref": "#/definitions/border"
        },
        "bottomBody": {
          "$ref": "#/definitions/border"
        },
        "bottomJoin": {
          "$ref": "#/definitions/border"
        },
        "bottomLeft": {
          "$ref": "#/definitions/border"
        },
        "bottomRight": {
          "$ref": "#/definitions/border"
        },
        "bodyLeft": {
          "$ref": "#/definitions/border"
        },
        "bodyRight": {
          "$ref": "#/definitions/border"
        },
        "bodyJoin": {
          "$ref": "#/definitions/border"
        },
        "headerJoin": {
          "$ref": "#/definitions/border"
        },
        "joinBody": {
          "$ref": "#/definitions/border"
        },
        "joinLeft": {
          "$ref": "#/definitions/border"
        },
        "joinRight": {
          "$ref": "#/definitions/border"
        },
        "joinJoin": {
          "$ref": "#/definitions/border"
        },
        "joinMiddleUp": {
          "$ref": "#/definitions/border"
        },
        "joinMiddleDown": {
          "$ref": "#/definitions/border"
        },
        "joinMiddleLeft": {
          "$ref": "#/definitions/border"
        },
        "joinMiddleRight": {
          "$ref": "#/definitions/border"
        }
      },
      "additionalProperties": false
    };
    var func8 = Object.prototype.hasOwnProperty;
    function validate46(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (typeof data !== "string") {
        const err0 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "string"
          },
          message: "must be string"
        };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      validate46.errors = vErrors;
      return errors === 0;
    }
    function validate45(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == "object" && !Array.isArray(data)) {
        for (const key0 in data) {
          if (!func8.call(schema15.properties, key0)) {
            const err0 = {
              instancePath,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: {
                additionalProperty: key0
              },
              message: "must NOT have additional properties"
            };
            if (vErrors === null) {
              vErrors = [err0];
            } else {
              vErrors.push(err0);
            }
            errors++;
          }
        }
        if (data.topBody !== void 0) {
          if (!validate46(data.topBody, {
            instancePath: instancePath + "/topBody",
            parentData: data,
            parentDataProperty: "topBody",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.topJoin !== void 0) {
          if (!validate46(data.topJoin, {
            instancePath: instancePath + "/topJoin",
            parentData: data,
            parentDataProperty: "topJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.topLeft !== void 0) {
          if (!validate46(data.topLeft, {
            instancePath: instancePath + "/topLeft",
            parentData: data,
            parentDataProperty: "topLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.topRight !== void 0) {
          if (!validate46(data.topRight, {
            instancePath: instancePath + "/topRight",
            parentData: data,
            parentDataProperty: "topRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bottomBody !== void 0) {
          if (!validate46(data.bottomBody, {
            instancePath: instancePath + "/bottomBody",
            parentData: data,
            parentDataProperty: "bottomBody",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bottomJoin !== void 0) {
          if (!validate46(data.bottomJoin, {
            instancePath: instancePath + "/bottomJoin",
            parentData: data,
            parentDataProperty: "bottomJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bottomLeft !== void 0) {
          if (!validate46(data.bottomLeft, {
            instancePath: instancePath + "/bottomLeft",
            parentData: data,
            parentDataProperty: "bottomLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bottomRight !== void 0) {
          if (!validate46(data.bottomRight, {
            instancePath: instancePath + "/bottomRight",
            parentData: data,
            parentDataProperty: "bottomRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bodyLeft !== void 0) {
          if (!validate46(data.bodyLeft, {
            instancePath: instancePath + "/bodyLeft",
            parentData: data,
            parentDataProperty: "bodyLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bodyRight !== void 0) {
          if (!validate46(data.bodyRight, {
            instancePath: instancePath + "/bodyRight",
            parentData: data,
            parentDataProperty: "bodyRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bodyJoin !== void 0) {
          if (!validate46(data.bodyJoin, {
            instancePath: instancePath + "/bodyJoin",
            parentData: data,
            parentDataProperty: "bodyJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.headerJoin !== void 0) {
          if (!validate46(data.headerJoin, {
            instancePath: instancePath + "/headerJoin",
            parentData: data,
            parentDataProperty: "headerJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinBody !== void 0) {
          if (!validate46(data.joinBody, {
            instancePath: instancePath + "/joinBody",
            parentData: data,
            parentDataProperty: "joinBody",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinLeft !== void 0) {
          if (!validate46(data.joinLeft, {
            instancePath: instancePath + "/joinLeft",
            parentData: data,
            parentDataProperty: "joinLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinRight !== void 0) {
          if (!validate46(data.joinRight, {
            instancePath: instancePath + "/joinRight",
            parentData: data,
            parentDataProperty: "joinRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinJoin !== void 0) {
          if (!validate46(data.joinJoin, {
            instancePath: instancePath + "/joinJoin",
            parentData: data,
            parentDataProperty: "joinJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinMiddleUp !== void 0) {
          if (!validate46(data.joinMiddleUp, {
            instancePath: instancePath + "/joinMiddleUp",
            parentData: data,
            parentDataProperty: "joinMiddleUp",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinMiddleDown !== void 0) {
          if (!validate46(data.joinMiddleDown, {
            instancePath: instancePath + "/joinMiddleDown",
            parentData: data,
            parentDataProperty: "joinMiddleDown",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinMiddleLeft !== void 0) {
          if (!validate46(data.joinMiddleLeft, {
            instancePath: instancePath + "/joinMiddleLeft",
            parentData: data,
            parentDataProperty: "joinMiddleLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinMiddleRight !== void 0) {
          if (!validate46(data.joinMiddleRight, {
            instancePath: instancePath + "/joinMiddleRight",
            parentData: data,
            parentDataProperty: "joinMiddleRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err1 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "object"
          },
          message: "must be object"
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      validate45.errors = vErrors;
      return errors === 0;
    }
    var schema17 = {
      "type": "string",
      "enum": ["left", "right", "center", "justify"]
    };
    var func0 = require_equal().default;
    function validate68(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (typeof data !== "string") {
        const err0 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "string"
          },
          message: "must be string"
        };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if (!(data === "left" || data === "right" || data === "center" || data === "justify")) {
        const err1 = {
          instancePath,
          schemaPath: "#/enum",
          keyword: "enum",
          params: {
            allowedValues: schema17.enum
          },
          message: "must be equal to one of the allowed values"
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      validate68.errors = vErrors;
      return errors === 0;
    }
    var pattern0 = new RegExp("^[0-9]+$", "u");
    function validate72(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (typeof data !== "string") {
        const err0 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "string"
          },
          message: "must be string"
        };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if (!(data === "left" || data === "right" || data === "center" || data === "justify")) {
        const err1 = {
          instancePath,
          schemaPath: "#/enum",
          keyword: "enum",
          params: {
            allowedValues: schema17.enum
          },
          message: "must be equal to one of the allowed values"
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      validate72.errors = vErrors;
      return errors === 0;
    }
    var schema21 = {
      "type": "string",
      "enum": ["top", "middle", "bottom"]
    };
    function validate74(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (typeof data !== "string") {
        const err0 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "string"
          },
          message: "must be string"
        };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if (!(data === "top" || data === "middle" || data === "bottom")) {
        const err1 = {
          instancePath,
          schemaPath: "#/enum",
          keyword: "enum",
          params: {
            allowedValues: schema21.enum
          },
          message: "must be equal to one of the allowed values"
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      validate74.errors = vErrors;
      return errors === 0;
    }
    function validate71(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == "object" && !Array.isArray(data)) {
        for (const key0 in data) {
          if (!(key0 === "alignment" || key0 === "verticalAlignment" || key0 === "width" || key0 === "wrapWord" || key0 === "truncate" || key0 === "paddingLeft" || key0 === "paddingRight")) {
            const err0 = {
              instancePath,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: {
                additionalProperty: key0
              },
              message: "must NOT have additional properties"
            };
            if (vErrors === null) {
              vErrors = [err0];
            } else {
              vErrors.push(err0);
            }
            errors++;
          }
        }
        if (data.alignment !== void 0) {
          if (!validate72(data.alignment, {
            instancePath: instancePath + "/alignment",
            parentData: data,
            parentDataProperty: "alignment",
            rootData
          })) {
            vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
            errors = vErrors.length;
          }
        }
        if (data.verticalAlignment !== void 0) {
          if (!validate74(data.verticalAlignment, {
            instancePath: instancePath + "/verticalAlignment",
            parentData: data,
            parentDataProperty: "verticalAlignment",
            rootData
          })) {
            vErrors = vErrors === null ? validate74.errors : vErrors.concat(validate74.errors);
            errors = vErrors.length;
          }
        }
        if (data.width !== void 0) {
          let data2 = data.width;
          if (!(typeof data2 == "number" && (!(data2 % 1) && !isNaN(data2)) && isFinite(data2))) {
            const err1 = {
              instancePath: instancePath + "/width",
              schemaPath: "#/properties/width/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          if (typeof data2 == "number" && isFinite(data2)) {
            if (data2 < 1 || isNaN(data2)) {
              const err2 = {
                instancePath: instancePath + "/width",
                schemaPath: "#/properties/width/minimum",
                keyword: "minimum",
                params: {
                  comparison: ">=",
                  limit: 1
                },
                message: "must be >= 1"
              };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
          }
        }
        if (data.wrapWord !== void 0) {
          if (typeof data.wrapWord !== "boolean") {
            const err3 = {
              instancePath: instancePath + "/wrapWord",
              schemaPath: "#/properties/wrapWord/type",
              keyword: "type",
              params: {
                type: "boolean"
              },
              message: "must be boolean"
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
        }
        if (data.truncate !== void 0) {
          let data4 = data.truncate;
          if (!(typeof data4 == "number" && (!(data4 % 1) && !isNaN(data4)) && isFinite(data4))) {
            const err4 = {
              instancePath: instancePath + "/truncate",
              schemaPath: "#/properties/truncate/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
        }
        if (data.paddingLeft !== void 0) {
          let data5 = data.paddingLeft;
          if (!(typeof data5 == "number" && (!(data5 % 1) && !isNaN(data5)) && isFinite(data5))) {
            const err5 = {
              instancePath: instancePath + "/paddingLeft",
              schemaPath: "#/properties/paddingLeft/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
        if (data.paddingRight !== void 0) {
          let data6 = data.paddingRight;
          if (!(typeof data6 == "number" && (!(data6 % 1) && !isNaN(data6)) && isFinite(data6))) {
            const err6 = {
              instancePath: instancePath + "/paddingRight",
              schemaPath: "#/properties/paddingRight/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
      } else {
        const err7 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "object"
          },
          message: "must be object"
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
      validate71.errors = vErrors;
      return errors === 0;
    }
    function validate70(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      const _errs0 = errors;
      let valid0 = false;
      let passing0 = null;
      const _errs1 = errors;
      if (data && typeof data == "object" && !Array.isArray(data)) {
        for (const key0 in data) {
          if (!pattern0.test(key0)) {
            const err0 = {
              instancePath,
              schemaPath: "#/oneOf/0/additionalProperties",
              keyword: "additionalProperties",
              params: {
                additionalProperty: key0
              },
              message: "must NOT have additional properties"
            };
            if (vErrors === null) {
              vErrors = [err0];
            } else {
              vErrors.push(err0);
            }
            errors++;
          }
        }
        for (const key1 in data) {
          if (pattern0.test(key1)) {
            if (!validate71(data[key1], {
              instancePath: instancePath + "/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),
              parentData: data,
              parentDataProperty: key1,
              rootData
            })) {
              vErrors = vErrors === null ? validate71.errors : vErrors.concat(validate71.errors);
              errors = vErrors.length;
            }
          }
        }
      } else {
        const err1 = {
          instancePath,
          schemaPath: "#/oneOf/0/type",
          keyword: "type",
          params: {
            type: "object"
          },
          message: "must be object"
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      var _valid0 = _errs1 === errors;
      if (_valid0) {
        valid0 = true;
        passing0 = 0;
      }
      const _errs5 = errors;
      if (Array.isArray(data)) {
        const len0 = data.length;
        for (let i0 = 0; i0 < len0; i0++) {
          if (!validate71(data[i0], {
            instancePath: instancePath + "/" + i0,
            parentData: data,
            parentDataProperty: i0,
            rootData
          })) {
            vErrors = vErrors === null ? validate71.errors : vErrors.concat(validate71.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err2 = {
          instancePath,
          schemaPath: "#/oneOf/1/type",
          keyword: "type",
          params: {
            type: "array"
          },
          message: "must be array"
        };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
      var _valid0 = _errs5 === errors;
      if (_valid0 && valid0) {
        valid0 = false;
        passing0 = [passing0, 1];
      } else {
        if (_valid0) {
          valid0 = true;
          passing0 = 1;
        }
      }
      if (!valid0) {
        const err3 = {
          instancePath,
          schemaPath: "#/oneOf",
          keyword: "oneOf",
          params: {
            passingSchemas: passing0
          },
          message: "must match exactly one schema in oneOf"
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      } else {
        errors = _errs0;
        if (vErrors !== null) {
          if (_errs0) {
            vErrors.length = _errs0;
          } else {
            vErrors = null;
          }
        }
      }
      validate70.errors = vErrors;
      return errors === 0;
    }
    function validate79(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == "object" && !Array.isArray(data)) {
        for (const key0 in data) {
          if (!(key0 === "alignment" || key0 === "verticalAlignment" || key0 === "width" || key0 === "wrapWord" || key0 === "truncate" || key0 === "paddingLeft" || key0 === "paddingRight")) {
            const err0 = {
              instancePath,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: {
                additionalProperty: key0
              },
              message: "must NOT have additional properties"
            };
            if (vErrors === null) {
              vErrors = [err0];
            } else {
              vErrors.push(err0);
            }
            errors++;
          }
        }
        if (data.alignment !== void 0) {
          if (!validate72(data.alignment, {
            instancePath: instancePath + "/alignment",
            parentData: data,
            parentDataProperty: "alignment",
            rootData
          })) {
            vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
            errors = vErrors.length;
          }
        }
        if (data.verticalAlignment !== void 0) {
          if (!validate74(data.verticalAlignment, {
            instancePath: instancePath + "/verticalAlignment",
            parentData: data,
            parentDataProperty: "verticalAlignment",
            rootData
          })) {
            vErrors = vErrors === null ? validate74.errors : vErrors.concat(validate74.errors);
            errors = vErrors.length;
          }
        }
        if (data.width !== void 0) {
          let data2 = data.width;
          if (!(typeof data2 == "number" && (!(data2 % 1) && !isNaN(data2)) && isFinite(data2))) {
            const err1 = {
              instancePath: instancePath + "/width",
              schemaPath: "#/properties/width/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          if (typeof data2 == "number" && isFinite(data2)) {
            if (data2 < 1 || isNaN(data2)) {
              const err2 = {
                instancePath: instancePath + "/width",
                schemaPath: "#/properties/width/minimum",
                keyword: "minimum",
                params: {
                  comparison: ">=",
                  limit: 1
                },
                message: "must be >= 1"
              };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
          }
        }
        if (data.wrapWord !== void 0) {
          if (typeof data.wrapWord !== "boolean") {
            const err3 = {
              instancePath: instancePath + "/wrapWord",
              schemaPath: "#/properties/wrapWord/type",
              keyword: "type",
              params: {
                type: "boolean"
              },
              message: "must be boolean"
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
        }
        if (data.truncate !== void 0) {
          let data4 = data.truncate;
          if (!(typeof data4 == "number" && (!(data4 % 1) && !isNaN(data4)) && isFinite(data4))) {
            const err4 = {
              instancePath: instancePath + "/truncate",
              schemaPath: "#/properties/truncate/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
        }
        if (data.paddingLeft !== void 0) {
          let data5 = data.paddingLeft;
          if (!(typeof data5 == "number" && (!(data5 % 1) && !isNaN(data5)) && isFinite(data5))) {
            const err5 = {
              instancePath: instancePath + "/paddingLeft",
              schemaPath: "#/properties/paddingLeft/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
        if (data.paddingRight !== void 0) {
          let data6 = data.paddingRight;
          if (!(typeof data6 == "number" && (!(data6 % 1) && !isNaN(data6)) && isFinite(data6))) {
            const err6 = {
              instancePath: instancePath + "/paddingRight",
              schemaPath: "#/properties/paddingRight/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
      } else {
        const err7 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "object"
          },
          message: "must be object"
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
      validate79.errors = vErrors;
      return errors === 0;
    }
    function validate84(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (typeof data !== "string") {
        const err0 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "string"
          },
          message: "must be string"
        };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
      if (!(data === "top" || data === "middle" || data === "bottom")) {
        const err1 = {
          instancePath,
          schemaPath: "#/enum",
          keyword: "enum",
          params: {
            allowedValues: schema21.enum
          },
          message: "must be equal to one of the allowed values"
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      validate84.errors = vErrors;
      return errors === 0;
    }
    function validate43(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      ;
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == "object" && !Array.isArray(data)) {
        for (const key0 in data) {
          if (!(key0 === "border" || key0 === "header" || key0 === "columns" || key0 === "columnDefault" || key0 === "drawVerticalLine" || key0 === "drawHorizontalLine" || key0 === "singleLine" || key0 === "spanningCells")) {
            const err0 = {
              instancePath,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: {
                additionalProperty: key0
              },
              message: "must NOT have additional properties"
            };
            if (vErrors === null) {
              vErrors = [err0];
            } else {
              vErrors.push(err0);
            }
            errors++;
          }
        }
        if (data.border !== void 0) {
          if (!validate45(data.border, {
            instancePath: instancePath + "/border",
            parentData: data,
            parentDataProperty: "border",
            rootData
          })) {
            vErrors = vErrors === null ? validate45.errors : vErrors.concat(validate45.errors);
            errors = vErrors.length;
          }
        }
        if (data.header !== void 0) {
          let data1 = data.header;
          if (data1 && typeof data1 == "object" && !Array.isArray(data1)) {
            if (data1.content === void 0) {
              const err1 = {
                instancePath: instancePath + "/header",
                schemaPath: "#/properties/header/required",
                keyword: "required",
                params: {
                  missingProperty: "content"
                },
                message: "must have required property 'content'"
              };
              if (vErrors === null) {
                vErrors = [err1];
              } else {
                vErrors.push(err1);
              }
              errors++;
            }
            for (const key1 in data1) {
              if (!(key1 === "content" || key1 === "alignment" || key1 === "wrapWord" || key1 === "truncate" || key1 === "paddingLeft" || key1 === "paddingRight")) {
                const err2 = {
                  instancePath: instancePath + "/header",
                  schemaPath: "#/properties/header/additionalProperties",
                  keyword: "additionalProperties",
                  params: {
                    additionalProperty: key1
                  },
                  message: "must NOT have additional properties"
                };
                if (vErrors === null) {
                  vErrors = [err2];
                } else {
                  vErrors.push(err2);
                }
                errors++;
              }
            }
            if (data1.content !== void 0) {
              if (typeof data1.content !== "string") {
                const err3 = {
                  instancePath: instancePath + "/header/content",
                  schemaPath: "#/properties/header/properties/content/type",
                  keyword: "type",
                  params: {
                    type: "string"
                  },
                  message: "must be string"
                };
                if (vErrors === null) {
                  vErrors = [err3];
                } else {
                  vErrors.push(err3);
                }
                errors++;
              }
            }
            if (data1.alignment !== void 0) {
              if (!validate68(data1.alignment, {
                instancePath: instancePath + "/header/alignment",
                parentData: data1,
                parentDataProperty: "alignment",
                rootData
              })) {
                vErrors = vErrors === null ? validate68.errors : vErrors.concat(validate68.errors);
                errors = vErrors.length;
              }
            }
            if (data1.wrapWord !== void 0) {
              if (typeof data1.wrapWord !== "boolean") {
                const err4 = {
                  instancePath: instancePath + "/header/wrapWord",
                  schemaPath: "#/properties/header/properties/wrapWord/type",
                  keyword: "type",
                  params: {
                    type: "boolean"
                  },
                  message: "must be boolean"
                };
                if (vErrors === null) {
                  vErrors = [err4];
                } else {
                  vErrors.push(err4);
                }
                errors++;
              }
            }
            if (data1.truncate !== void 0) {
              let data5 = data1.truncate;
              if (!(typeof data5 == "number" && (!(data5 % 1) && !isNaN(data5)) && isFinite(data5))) {
                const err5 = {
                  instancePath: instancePath + "/header/truncate",
                  schemaPath: "#/properties/header/properties/truncate/type",
                  keyword: "type",
                  params: {
                    type: "integer"
                  },
                  message: "must be integer"
                };
                if (vErrors === null) {
                  vErrors = [err5];
                } else {
                  vErrors.push(err5);
                }
                errors++;
              }
            }
            if (data1.paddingLeft !== void 0) {
              let data6 = data1.paddingLeft;
              if (!(typeof data6 == "number" && (!(data6 % 1) && !isNaN(data6)) && isFinite(data6))) {
                const err6 = {
                  instancePath: instancePath + "/header/paddingLeft",
                  schemaPath: "#/properties/header/properties/paddingLeft/type",
                  keyword: "type",
                  params: {
                    type: "integer"
                  },
                  message: "must be integer"
                };
                if (vErrors === null) {
                  vErrors = [err6];
                } else {
                  vErrors.push(err6);
                }
                errors++;
              }
            }
            if (data1.paddingRight !== void 0) {
              let data7 = data1.paddingRight;
              if (!(typeof data7 == "number" && (!(data7 % 1) && !isNaN(data7)) && isFinite(data7))) {
                const err7 = {
                  instancePath: instancePath + "/header/paddingRight",
                  schemaPath: "#/properties/header/properties/paddingRight/type",
                  keyword: "type",
                  params: {
                    type: "integer"
                  },
                  message: "must be integer"
                };
                if (vErrors === null) {
                  vErrors = [err7];
                } else {
                  vErrors.push(err7);
                }
                errors++;
              }
            }
          } else {
            const err8 = {
              instancePath: instancePath + "/header",
              schemaPath: "#/properties/header/type",
              keyword: "type",
              params: {
                type: "object"
              },
              message: "must be object"
            };
            if (vErrors === null) {
              vErrors = [err8];
            } else {
              vErrors.push(err8);
            }
            errors++;
          }
        }
        if (data.columns !== void 0) {
          if (!validate70(data.columns, {
            instancePath: instancePath + "/columns",
            parentData: data,
            parentDataProperty: "columns",
            rootData
          })) {
            vErrors = vErrors === null ? validate70.errors : vErrors.concat(validate70.errors);
            errors = vErrors.length;
          }
        }
        if (data.columnDefault !== void 0) {
          if (!validate79(data.columnDefault, {
            instancePath: instancePath + "/columnDefault",
            parentData: data,
            parentDataProperty: "columnDefault",
            rootData
          })) {
            vErrors = vErrors === null ? validate79.errors : vErrors.concat(validate79.errors);
            errors = vErrors.length;
          }
        }
        if (data.drawVerticalLine !== void 0) {
          if (typeof data.drawVerticalLine != "function") {
            const err9 = {
              instancePath: instancePath + "/drawVerticalLine",
              schemaPath: "#/properties/drawVerticalLine/typeof",
              keyword: "typeof",
              params: {},
              message: 'must pass "typeof" keyword validation'
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
        }
        if (data.drawHorizontalLine !== void 0) {
          if (typeof data.drawHorizontalLine != "function") {
            const err10 = {
              instancePath: instancePath + "/drawHorizontalLine",
              schemaPath: "#/properties/drawHorizontalLine/typeof",
              keyword: "typeof",
              params: {},
              message: 'must pass "typeof" keyword validation'
            };
            if (vErrors === null) {
              vErrors = [err10];
            } else {
              vErrors.push(err10);
            }
            errors++;
          }
        }
        if (data.singleLine !== void 0) {
          if (typeof data.singleLine != "boolean") {
            const err11 = {
              instancePath: instancePath + "/singleLine",
              schemaPath: "#/properties/singleLine/typeof",
              keyword: "typeof",
              params: {},
              message: 'must pass "typeof" keyword validation'
            };
            if (vErrors === null) {
              vErrors = [err11];
            } else {
              vErrors.push(err11);
            }
            errors++;
          }
        }
        if (data.spanningCells !== void 0) {
          let data13 = data.spanningCells;
          if (Array.isArray(data13)) {
            const len0 = data13.length;
            for (let i0 = 0; i0 < len0; i0++) {
              let data14 = data13[i0];
              if (data14 && typeof data14 == "object" && !Array.isArray(data14)) {
                if (data14.row === void 0) {
                  const err12 = {
                    instancePath: instancePath + "/spanningCells/" + i0,
                    schemaPath: "#/properties/spanningCells/items/required",
                    keyword: "required",
                    params: {
                      missingProperty: "row"
                    },
                    message: "must have required property 'row'"
                  };
                  if (vErrors === null) {
                    vErrors = [err12];
                  } else {
                    vErrors.push(err12);
                  }
                  errors++;
                }
                if (data14.col === void 0) {
                  const err13 = {
                    instancePath: instancePath + "/spanningCells/" + i0,
                    schemaPath: "#/properties/spanningCells/items/required",
                    keyword: "required",
                    params: {
                      missingProperty: "col"
                    },
                    message: "must have required property 'col'"
                  };
                  if (vErrors === null) {
                    vErrors = [err13];
                  } else {
                    vErrors.push(err13);
                  }
                  errors++;
                }
                for (const key2 in data14) {
                  if (!func8.call(schema13.properties.spanningCells.items.properties, key2)) {
                    const err14 = {
                      instancePath: instancePath + "/spanningCells/" + i0,
                      schemaPath: "#/properties/spanningCells/items/additionalProperties",
                      keyword: "additionalProperties",
                      params: {
                        additionalProperty: key2
                      },
                      message: "must NOT have additional properties"
                    };
                    if (vErrors === null) {
                      vErrors = [err14];
                    } else {
                      vErrors.push(err14);
                    }
                    errors++;
                  }
                }
                if (data14.col !== void 0) {
                  let data15 = data14.col;
                  if (!(typeof data15 == "number" && (!(data15 % 1) && !isNaN(data15)) && isFinite(data15))) {
                    const err15 = {
                      instancePath: instancePath + "/spanningCells/" + i0 + "/col",
                      schemaPath: "#/properties/spanningCells/items/properties/col/type",
                      keyword: "type",
                      params: {
                        type: "integer"
                      },
                      message: "must be integer"
                    };
                    if (vErrors === null) {
                      vErrors = [err15];
                    } else {
                      vErrors.push(err15);
                    }
                    errors++;
                  }
                  if (typeof data15 == "number" && isFinite(data15)) {
                    if (data15 < 0 || isNaN(data15)) {
                      const err16 = {
                        instancePath: instancePath + "/spanningCells/" + i0 + "/col",
                        schemaPath: "#/properties/spanningCells/items/properties/col/minimum",
                        keyword: "minimum",
                        params: {
                          comparison: ">=",
                          limit: 0
                        },
                        message: "must be >= 0"
                      };
                      if (vErrors === null) {
                        vErrors = [err16];
                      } else {
                        vErrors.push(err16);
                      }
                      errors++;
                    }
                  }
                }
                if (data14.row !== void 0) {
                  let data16 = data14.row;
                  if (!(typeof data16 == "number" && (!(data16 % 1) && !isNaN(data16)) && isFinite(data16))) {
                    const err17 = {
                      instancePath: instancePath + "/spanningCells/" + i0 + "/row",
                      schemaPath: "#/properties/spanningCells/items/properties/row/type",
                      keyword: "type",
                      params: {
                        type: "integer"
                      },
                      message: "must be integer"
                    };
                    if (vErrors === null) {
                      vErrors = [err17];
                    } else {
                      vErrors.push(err17);
                    }
                    errors++;
                  }
                  if (typeof data16 == "number" && isFinite(data16)) {
                    if (data16 < 0 || isNaN(data16)) {
                      const err18 = {
                        instancePath: instancePath + "/spanningCells/" + i0 + "/row",
                        schemaPath: "#/properties/spanningCells/items/properties/row/minimum",
                        keyword: "minimum",
                        params: {
                          comparison: ">=",
                          limit: 0
                        },
                        message: "must be >= 0"
                      };
                      if (vErrors === null) {
                        vErrors = [err18];
                      } else {
                        vErrors.push(err18);
                      }
                      errors++;
                    }
                  }
                }
                if (data14.colSpan !== void 0) {
                  let data17 = data14.colSpan;
                  if (!(typeof data17 == "number" && (!(data17 % 1) && !isNaN(data17)) && isFinite(data17))) {
                    const err19 = {
                      instancePath: instancePath + "/spanningCells/" + i0 + "/colSpan",
                      schemaPath: "#/properties/spanningCells/items/properties/colSpan/type",
                      keyword: "type",
                      params: {
                        type: "integer"
                      },
                      message: "must be integer"
                    };
                    if (vErrors === null) {
                      vErrors = [err19];
                    } else {
                      vErrors.push(err19);
                    }
                    errors++;
                  }
                  if (typeof data17 == "number" && isFinite(data17)) {
                    if (data17 < 1 || isNaN(data17)) {
                      const err20 = {
                        instancePath: instancePath + "/spanningCells/" + i0 + "/colSpan",
                        schemaPath: "#/properties/spanningCells/items/properties/colSpan/minimum",
                        keyword: "minimum",
                        params: {
                          comparison: ">=",
                          limit: 1
                        },
                        message: "must be >= 1"
                      };
                      if (vErrors === null) {
                        vErrors = [err20];
                      } else {
                        vErrors.push(err20);
                      }
                      errors++;
                    }
                  }
                }
                if (data14.rowSpan !== void 0) {
                  let data18 = data14.rowSpan;
                  if (!(typeof data18 == "number" && (!(data18 % 1) && !isNaN(data18)) && isFinite(data18))) {
                    const err21 = {
                      instancePath: instancePath + "/spanningCells/" + i0 + "/rowSpan",
                      schemaPath: "#/properties/spanningCells/items/properties/rowSpan/type",
                      keyword: "type",
                      params: {
                        type: "integer"
                      },
                      message: "must be integer"
                    };
                    if (vErrors === null) {
                      vErrors = [err21];
                    } else {
                      vErrors.push(err21);
                    }
                    errors++;
                  }
                  if (typeof data18 == "number" && isFinite(data18)) {
                    if (data18 < 1 || isNaN(data18)) {
                      const err22 = {
                        instancePath: instancePath + "/spanningCells/" + i0 + "/rowSpan",
                        schemaPath: "#/properties/spanningCells/items/properties/rowSpan/minimum",
                        keyword: "minimum",
                        params: {
                          comparison: ">=",
                          limit: 1
                        },
                        message: "must be >= 1"
                      };
                      if (vErrors === null) {
                        vErrors = [err22];
                      } else {
                        vErrors.push(err22);
                      }
                      errors++;
                    }
                  }
                }
                if (data14.alignment !== void 0) {
                  if (!validate68(data14.alignment, {
                    instancePath: instancePath + "/spanningCells/" + i0 + "/alignment",
                    parentData: data14,
                    parentDataProperty: "alignment",
                    rootData
                  })) {
                    vErrors = vErrors === null ? validate68.errors : vErrors.concat(validate68.errors);
                    errors = vErrors.length;
                  }
                }
                if (data14.verticalAlignment !== void 0) {
                  if (!validate84(data14.verticalAlignment, {
                    instancePath: instancePath + "/spanningCells/" + i0 + "/verticalAlignment",
                    parentData: data14,
                    parentDataProperty: "verticalAlignment",
                    rootData
                  })) {
                    vErrors = vErrors === null ? validate84.errors : vErrors.concat(validate84.errors);
                    errors = vErrors.length;
                  }
                }
                if (data14.wrapWord !== void 0) {
                  if (typeof data14.wrapWord !== "boolean") {
                    const err23 = {
                      instancePath: instancePath + "/spanningCells/" + i0 + "/wrapWord",
                      schemaPath: "#/properties/spanningCells/items/properties/wrapWord/type",
                      keyword: "type",
                      params: {
                        type: "boolean"
                      },
                      message: "must be boolean"
                    };
                    if (vErrors === null) {
                      vErrors = [err23];
                    } else {
                      vErrors.push(err23);
                    }
                    errors++;
                  }
                }
                if (data14.truncate !== void 0) {
                  let data22 = data14.truncate;
                  if (!(typeof data22 == "number" && (!(data22 % 1) && !isNaN(data22)) && isFinite(data22))) {
                    const err24 = {
                      instancePath: instancePath + "/spanningCells/" + i0 + "/truncate",
                      schemaPath: "#/properties/spanningCells/items/properties/truncate/type",
                      keyword: "type",
                      params: {
                        type: "integer"
                      },
                      message: "must be integer"
                    };
                    if (vErrors === null) {
                      vErrors = [err24];
                    } else {
                      vErrors.push(err24);
                    }
                    errors++;
                  }
                }
                if (data14.paddingLeft !== void 0) {
                  let data23 = data14.paddingLeft;
                  if (!(typeof data23 == "number" && (!(data23 % 1) && !isNaN(data23)) && isFinite(data23))) {
                    const err25 = {
                      instancePath: instancePath + "/spanningCells/" + i0 + "/paddingLeft",
                      schemaPath: "#/properties/spanningCells/items/properties/paddingLeft/type",
                      keyword: "type",
                      params: {
                        type: "integer"
                      },
                      message: "must be integer"
                    };
                    if (vErrors === null) {
                      vErrors = [err25];
                    } else {
                      vErrors.push(err25);
                    }
                    errors++;
                  }
                }
                if (data14.paddingRight !== void 0) {
                  let data24 = data14.paddingRight;
                  if (!(typeof data24 == "number" && (!(data24 % 1) && !isNaN(data24)) && isFinite(data24))) {
                    const err26 = {
                      instancePath: instancePath + "/spanningCells/" + i0 + "/paddingRight",
                      schemaPath: "#/properties/spanningCells/items/properties/paddingRight/type",
                      keyword: "type",
                      params: {
                        type: "integer"
                      },
                      message: "must be integer"
                    };
                    if (vErrors === null) {
                      vErrors = [err26];
                    } else {
                      vErrors.push(err26);
                    }
                    errors++;
                  }
                }
              } else {
                const err27 = {
                  instancePath: instancePath + "/spanningCells/" + i0,
                  schemaPath: "#/properties/spanningCells/items/type",
                  keyword: "type",
                  params: {
                    type: "object"
                  },
                  message: "must be object"
                };
                if (vErrors === null) {
                  vErrors = [err27];
                } else {
                  vErrors.push(err27);
                }
                errors++;
              }
            }
          } else {
            const err28 = {
              instancePath: instancePath + "/spanningCells",
              schemaPath: "#/properties/spanningCells/type",
              keyword: "type",
              params: {
                type: "array"
              },
              message: "must be array"
            };
            if (vErrors === null) {
              vErrors = [err28];
            } else {
              vErrors.push(err28);
            }
            errors++;
          }
        }
      } else {
        const err29 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "object"
          },
          message: "must be object"
        };
        if (vErrors === null) {
          vErrors = [err29];
        } else {
          vErrors.push(err29);
        }
        errors++;
      }
      validate43.errors = vErrors;
      return errors === 0;
    }
    exports["streamConfig.json"] = validate86;
    function validate87(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == "object" && !Array.isArray(data)) {
        for (const key0 in data) {
          if (!func8.call(schema15.properties, key0)) {
            const err0 = {
              instancePath,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: {
                additionalProperty: key0
              },
              message: "must NOT have additional properties"
            };
            if (vErrors === null) {
              vErrors = [err0];
            } else {
              vErrors.push(err0);
            }
            errors++;
          }
        }
        if (data.topBody !== void 0) {
          if (!validate46(data.topBody, {
            instancePath: instancePath + "/topBody",
            parentData: data,
            parentDataProperty: "topBody",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.topJoin !== void 0) {
          if (!validate46(data.topJoin, {
            instancePath: instancePath + "/topJoin",
            parentData: data,
            parentDataProperty: "topJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.topLeft !== void 0) {
          if (!validate46(data.topLeft, {
            instancePath: instancePath + "/topLeft",
            parentData: data,
            parentDataProperty: "topLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.topRight !== void 0) {
          if (!validate46(data.topRight, {
            instancePath: instancePath + "/topRight",
            parentData: data,
            parentDataProperty: "topRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bottomBody !== void 0) {
          if (!validate46(data.bottomBody, {
            instancePath: instancePath + "/bottomBody",
            parentData: data,
            parentDataProperty: "bottomBody",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bottomJoin !== void 0) {
          if (!validate46(data.bottomJoin, {
            instancePath: instancePath + "/bottomJoin",
            parentData: data,
            parentDataProperty: "bottomJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bottomLeft !== void 0) {
          if (!validate46(data.bottomLeft, {
            instancePath: instancePath + "/bottomLeft",
            parentData: data,
            parentDataProperty: "bottomLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bottomRight !== void 0) {
          if (!validate46(data.bottomRight, {
            instancePath: instancePath + "/bottomRight",
            parentData: data,
            parentDataProperty: "bottomRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bodyLeft !== void 0) {
          if (!validate46(data.bodyLeft, {
            instancePath: instancePath + "/bodyLeft",
            parentData: data,
            parentDataProperty: "bodyLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bodyRight !== void 0) {
          if (!validate46(data.bodyRight, {
            instancePath: instancePath + "/bodyRight",
            parentData: data,
            parentDataProperty: "bodyRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.bodyJoin !== void 0) {
          if (!validate46(data.bodyJoin, {
            instancePath: instancePath + "/bodyJoin",
            parentData: data,
            parentDataProperty: "bodyJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.headerJoin !== void 0) {
          if (!validate46(data.headerJoin, {
            instancePath: instancePath + "/headerJoin",
            parentData: data,
            parentDataProperty: "headerJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinBody !== void 0) {
          if (!validate46(data.joinBody, {
            instancePath: instancePath + "/joinBody",
            parentData: data,
            parentDataProperty: "joinBody",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinLeft !== void 0) {
          if (!validate46(data.joinLeft, {
            instancePath: instancePath + "/joinLeft",
            parentData: data,
            parentDataProperty: "joinLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinRight !== void 0) {
          if (!validate46(data.joinRight, {
            instancePath: instancePath + "/joinRight",
            parentData: data,
            parentDataProperty: "joinRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinJoin !== void 0) {
          if (!validate46(data.joinJoin, {
            instancePath: instancePath + "/joinJoin",
            parentData: data,
            parentDataProperty: "joinJoin",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinMiddleUp !== void 0) {
          if (!validate46(data.joinMiddleUp, {
            instancePath: instancePath + "/joinMiddleUp",
            parentData: data,
            parentDataProperty: "joinMiddleUp",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinMiddleDown !== void 0) {
          if (!validate46(data.joinMiddleDown, {
            instancePath: instancePath + "/joinMiddleDown",
            parentData: data,
            parentDataProperty: "joinMiddleDown",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinMiddleLeft !== void 0) {
          if (!validate46(data.joinMiddleLeft, {
            instancePath: instancePath + "/joinMiddleLeft",
            parentData: data,
            parentDataProperty: "joinMiddleLeft",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.joinMiddleRight !== void 0) {
          if (!validate46(data.joinMiddleRight, {
            instancePath: instancePath + "/joinMiddleRight",
            parentData: data,
            parentDataProperty: "joinMiddleRight",
            rootData
          })) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err1 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "object"
          },
          message: "must be object"
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      validate87.errors = vErrors;
      return errors === 0;
    }
    function validate109(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      const _errs0 = errors;
      let valid0 = false;
      let passing0 = null;
      const _errs1 = errors;
      if (data && typeof data == "object" && !Array.isArray(data)) {
        for (const key0 in data) {
          if (!pattern0.test(key0)) {
            const err0 = {
              instancePath,
              schemaPath: "#/oneOf/0/additionalProperties",
              keyword: "additionalProperties",
              params: {
                additionalProperty: key0
              },
              message: "must NOT have additional properties"
            };
            if (vErrors === null) {
              vErrors = [err0];
            } else {
              vErrors.push(err0);
            }
            errors++;
          }
        }
        for (const key1 in data) {
          if (pattern0.test(key1)) {
            if (!validate71(data[key1], {
              instancePath: instancePath + "/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),
              parentData: data,
              parentDataProperty: key1,
              rootData
            })) {
              vErrors = vErrors === null ? validate71.errors : vErrors.concat(validate71.errors);
              errors = vErrors.length;
            }
          }
        }
      } else {
        const err1 = {
          instancePath,
          schemaPath: "#/oneOf/0/type",
          keyword: "type",
          params: {
            type: "object"
          },
          message: "must be object"
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
      var _valid0 = _errs1 === errors;
      if (_valid0) {
        valid0 = true;
        passing0 = 0;
      }
      const _errs5 = errors;
      if (Array.isArray(data)) {
        const len0 = data.length;
        for (let i0 = 0; i0 < len0; i0++) {
          if (!validate71(data[i0], {
            instancePath: instancePath + "/" + i0,
            parentData: data,
            parentDataProperty: i0,
            rootData
          })) {
            vErrors = vErrors === null ? validate71.errors : vErrors.concat(validate71.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err2 = {
          instancePath,
          schemaPath: "#/oneOf/1/type",
          keyword: "type",
          params: {
            type: "array"
          },
          message: "must be array"
        };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
      var _valid0 = _errs5 === errors;
      if (_valid0 && valid0) {
        valid0 = false;
        passing0 = [passing0, 1];
      } else {
        if (_valid0) {
          valid0 = true;
          passing0 = 1;
        }
      }
      if (!valid0) {
        const err3 = {
          instancePath,
          schemaPath: "#/oneOf",
          keyword: "oneOf",
          params: {
            passingSchemas: passing0
          },
          message: "must match exactly one schema in oneOf"
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      } else {
        errors = _errs0;
        if (vErrors !== null) {
          if (_errs0) {
            vErrors.length = _errs0;
          } else {
            vErrors = null;
          }
        }
      }
      validate109.errors = vErrors;
      return errors === 0;
    }
    function validate113(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == "object" && !Array.isArray(data)) {
        for (const key0 in data) {
          if (!(key0 === "alignment" || key0 === "verticalAlignment" || key0 === "width" || key0 === "wrapWord" || key0 === "truncate" || key0 === "paddingLeft" || key0 === "paddingRight")) {
            const err0 = {
              instancePath,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: {
                additionalProperty: key0
              },
              message: "must NOT have additional properties"
            };
            if (vErrors === null) {
              vErrors = [err0];
            } else {
              vErrors.push(err0);
            }
            errors++;
          }
        }
        if (data.alignment !== void 0) {
          if (!validate72(data.alignment, {
            instancePath: instancePath + "/alignment",
            parentData: data,
            parentDataProperty: "alignment",
            rootData
          })) {
            vErrors = vErrors === null ? validate72.errors : vErrors.concat(validate72.errors);
            errors = vErrors.length;
          }
        }
        if (data.verticalAlignment !== void 0) {
          if (!validate74(data.verticalAlignment, {
            instancePath: instancePath + "/verticalAlignment",
            parentData: data,
            parentDataProperty: "verticalAlignment",
            rootData
          })) {
            vErrors = vErrors === null ? validate74.errors : vErrors.concat(validate74.errors);
            errors = vErrors.length;
          }
        }
        if (data.width !== void 0) {
          let data2 = data.width;
          if (!(typeof data2 == "number" && (!(data2 % 1) && !isNaN(data2)) && isFinite(data2))) {
            const err1 = {
              instancePath: instancePath + "/width",
              schemaPath: "#/properties/width/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          if (typeof data2 == "number" && isFinite(data2)) {
            if (data2 < 1 || isNaN(data2)) {
              const err2 = {
                instancePath: instancePath + "/width",
                schemaPath: "#/properties/width/minimum",
                keyword: "minimum",
                params: {
                  comparison: ">=",
                  limit: 1
                },
                message: "must be >= 1"
              };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
          }
        }
        if (data.wrapWord !== void 0) {
          if (typeof data.wrapWord !== "boolean") {
            const err3 = {
              instancePath: instancePath + "/wrapWord",
              schemaPath: "#/properties/wrapWord/type",
              keyword: "type",
              params: {
                type: "boolean"
              },
              message: "must be boolean"
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
        }
        if (data.truncate !== void 0) {
          let data4 = data.truncate;
          if (!(typeof data4 == "number" && (!(data4 % 1) && !isNaN(data4)) && isFinite(data4))) {
            const err4 = {
              instancePath: instancePath + "/truncate",
              schemaPath: "#/properties/truncate/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
        }
        if (data.paddingLeft !== void 0) {
          let data5 = data.paddingLeft;
          if (!(typeof data5 == "number" && (!(data5 % 1) && !isNaN(data5)) && isFinite(data5))) {
            const err5 = {
              instancePath: instancePath + "/paddingLeft",
              schemaPath: "#/properties/paddingLeft/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
        if (data.paddingRight !== void 0) {
          let data6 = data.paddingRight;
          if (!(typeof data6 == "number" && (!(data6 % 1) && !isNaN(data6)) && isFinite(data6))) {
            const err6 = {
              instancePath: instancePath + "/paddingRight",
              schemaPath: "#/properties/paddingRight/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
      } else {
        const err7 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "object"
          },
          message: "must be object"
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
      validate113.errors = vErrors;
      return errors === 0;
    }
    function validate86(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
      ;
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == "object" && !Array.isArray(data)) {
        if (data.columnDefault === void 0) {
          const err0 = {
            instancePath,
            schemaPath: "#/required",
            keyword: "required",
            params: {
              missingProperty: "columnDefault"
            },
            message: "must have required property 'columnDefault'"
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.columnCount === void 0) {
          const err1 = {
            instancePath,
            schemaPath: "#/required",
            keyword: "required",
            params: {
              missingProperty: "columnCount"
            },
            message: "must have required property 'columnCount'"
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        for (const key0 in data) {
          if (!(key0 === "border" || key0 === "columns" || key0 === "columnDefault" || key0 === "columnCount" || key0 === "drawVerticalLine")) {
            const err2 = {
              instancePath,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: {
                additionalProperty: key0
              },
              message: "must NOT have additional properties"
            };
            if (vErrors === null) {
              vErrors = [err2];
            } else {
              vErrors.push(err2);
            }
            errors++;
          }
        }
        if (data.border !== void 0) {
          if (!validate87(data.border, {
            instancePath: instancePath + "/border",
            parentData: data,
            parentDataProperty: "border",
            rootData
          })) {
            vErrors = vErrors === null ? validate87.errors : vErrors.concat(validate87.errors);
            errors = vErrors.length;
          }
        }
        if (data.columns !== void 0) {
          if (!validate109(data.columns, {
            instancePath: instancePath + "/columns",
            parentData: data,
            parentDataProperty: "columns",
            rootData
          })) {
            vErrors = vErrors === null ? validate109.errors : vErrors.concat(validate109.errors);
            errors = vErrors.length;
          }
        }
        if (data.columnDefault !== void 0) {
          if (!validate113(data.columnDefault, {
            instancePath: instancePath + "/columnDefault",
            parentData: data,
            parentDataProperty: "columnDefault",
            rootData
          })) {
            vErrors = vErrors === null ? validate113.errors : vErrors.concat(validate113.errors);
            errors = vErrors.length;
          }
        }
        if (data.columnCount !== void 0) {
          let data3 = data.columnCount;
          if (!(typeof data3 == "number" && (!(data3 % 1) && !isNaN(data3)) && isFinite(data3))) {
            const err3 = {
              instancePath: instancePath + "/columnCount",
              schemaPath: "#/properties/columnCount/type",
              keyword: "type",
              params: {
                type: "integer"
              },
              message: "must be integer"
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
          if (typeof data3 == "number" && isFinite(data3)) {
            if (data3 < 1 || isNaN(data3)) {
              const err4 = {
                instancePath: instancePath + "/columnCount",
                schemaPath: "#/properties/columnCount/minimum",
                keyword: "minimum",
                params: {
                  comparison: ">=",
                  limit: 1
                },
                message: "must be >= 1"
              };
              if (vErrors === null) {
                vErrors = [err4];
              } else {
                vErrors.push(err4);
              }
              errors++;
            }
          }
        }
        if (data.drawVerticalLine !== void 0) {
          if (typeof data.drawVerticalLine != "function") {
            const err5 = {
              instancePath: instancePath + "/drawVerticalLine",
              schemaPath: "#/properties/drawVerticalLine/typeof",
              keyword: "typeof",
              params: {},
              message: 'must pass "typeof" keyword validation'
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
      } else {
        const err6 = {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {
            type: "object"
          },
          message: "must be object"
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
      validate86.errors = vErrors;
      return errors === 0;
    }
  }
});

// ../../node_modules/table/dist/src/validateConfig.js
var require_validateConfig = __commonJS({
  "../../node_modules/table/dist/src/validateConfig.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateConfig = void 0;
    var validators_1 = __importDefault(require_validators());
    var validateConfig = (schemaId, config) => {
      const validate = validators_1.default[schemaId];
      if (!validate(config) && validate.errors) {
        const errors = validate.errors.map((error) => {
          return {
            message: error.message,
            params: error.params,
            schemaPath: error.schemaPath
          };
        });
        console.log("config", config);
        console.log("errors", errors);
        throw new Error("Invalid config.");
      }
    };
    exports.validateConfig = validateConfig;
  }
});

// ../../node_modules/table/dist/src/makeStreamConfig.js
var require_makeStreamConfig = __commonJS({
  "../../node_modules/table/dist/src/makeStreamConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeStreamConfig = void 0;
    var utils_1 = require_utils();
    var validateConfig_1 = require_validateConfig();
    var makeColumnsConfig = (columnCount, columns = {}, columnDefault) => {
      return Array.from({ length: columnCount }).map((_, index) => {
        return {
          alignment: "left",
          paddingLeft: 1,
          paddingRight: 1,
          truncate: Number.POSITIVE_INFINITY,
          verticalAlignment: "top",
          wrapWord: false,
          ...columnDefault,
          ...columns[index]
        };
      });
    };
    var makeStreamConfig = (config) => {
      (0, validateConfig_1.validateConfig)("streamConfig.json", config);
      if (config.columnDefault.width === void 0) {
        throw new Error("Must provide config.columnDefault.width when creating a stream.");
      }
      return {
        drawVerticalLine: () => {
          return true;
        },
        ...config,
        border: (0, utils_1.makeBorderConfig)(config.border),
        columns: makeColumnsConfig(config.columnCount, config.columns, config.columnDefault)
      };
    };
    exports.makeStreamConfig = makeStreamConfig;
  }
});

// ../../node_modules/table/dist/src/mapDataUsingRowHeights.js
var require_mapDataUsingRowHeights = __commonJS({
  "../../node_modules/table/dist/src/mapDataUsingRowHeights.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mapDataUsingRowHeights = exports.padCellVertically = void 0;
    var utils_1 = require_utils();
    var wrapCell_1 = require_wrapCell();
    var createEmptyStrings = (length) => {
      return new Array(length).fill("");
    };
    var padCellVertically = (lines, rowHeight, verticalAlignment) => {
      const availableLines = rowHeight - lines.length;
      if (verticalAlignment === "top") {
        return [...lines, ...createEmptyStrings(availableLines)];
      }
      if (verticalAlignment === "bottom") {
        return [...createEmptyStrings(availableLines), ...lines];
      }
      return [
        ...createEmptyStrings(Math.floor(availableLines / 2)),
        ...lines,
        ...createEmptyStrings(Math.ceil(availableLines / 2))
      ];
    };
    exports.padCellVertically = padCellVertically;
    var mapDataUsingRowHeights = (unmappedRows, rowHeights, config) => {
      const nColumns = unmappedRows[0].length;
      const mappedRows = unmappedRows.map((unmappedRow, unmappedRowIndex) => {
        const outputRowHeight = rowHeights[unmappedRowIndex];
        const outputRow = Array.from({ length: outputRowHeight }, () => {
          return new Array(nColumns).fill("");
        });
        unmappedRow.forEach((cell, cellIndex) => {
          var _a;
          const containingRange = (_a = config.spanningCellManager) === null || _a === void 0 ? void 0 : _a.getContainingRange({
            col: cellIndex,
            row: unmappedRowIndex
          });
          if (containingRange) {
            containingRange.extractCellContent(unmappedRowIndex).forEach((cellLine, cellLineIndex) => {
              outputRow[cellLineIndex][cellIndex] = cellLine;
            });
            return;
          }
          const cellLines = (0, wrapCell_1.wrapCell)(cell, config.columns[cellIndex].width, config.columns[cellIndex].wrapWord);
          const paddedCellLines = (0, exports.padCellVertically)(cellLines, outputRowHeight, config.columns[cellIndex].verticalAlignment);
          paddedCellLines.forEach((cellLine, cellLineIndex) => {
            outputRow[cellLineIndex][cellIndex] = cellLine;
          });
        });
        return outputRow;
      });
      return (0, utils_1.flatten)(mappedRows);
    };
    exports.mapDataUsingRowHeights = mapDataUsingRowHeights;
  }
});

// ../../node_modules/table/dist/src/padTableData.js
var require_padTableData = __commonJS({
  "../../node_modules/table/dist/src/padTableData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.padTableData = exports.padString = void 0;
    var padString = (input, paddingLeft, paddingRight) => {
      return " ".repeat(paddingLeft) + input + " ".repeat(paddingRight);
    };
    exports.padString = padString;
    var padTableData = (rows, config) => {
      return rows.map((cells, rowIndex) => {
        return cells.map((cell, cellIndex) => {
          var _a;
          const containingRange = (_a = config.spanningCellManager) === null || _a === void 0 ? void 0 : _a.getContainingRange({
            col: cellIndex,
            row: rowIndex
          }, { mapped: true });
          if (containingRange) {
            return cell;
          }
          const { paddingLeft, paddingRight } = config.columns[cellIndex];
          return (0, exports.padString)(cell, paddingLeft, paddingRight);
        });
      });
    };
    exports.padTableData = padTableData;
  }
});

// ../../node_modules/table/dist/src/stringifyTableData.js
var require_stringifyTableData = __commonJS({
  "../../node_modules/table/dist/src/stringifyTableData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringifyTableData = void 0;
    var utils_1 = require_utils();
    var stringifyTableData = (rows) => {
      return rows.map((cells) => {
        return cells.map((cell) => {
          return (0, utils_1.normalizeString)(String(cell));
        });
      });
    };
    exports.stringifyTableData = stringifyTableData;
  }
});

// ../../node_modules/lodash.truncate/index.js
var require_lodash = __commonJS({
  "../../node_modules/lodash.truncate/index.js"(exports, module2) {
    var DEFAULT_TRUNC_LENGTH = 30;
    var DEFAULT_TRUNC_OMISSION = "...";
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var regexpTag = "[object RegExp]";
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reFlags = /\w*$/;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23";
    var rsComboSymbolsRange = "\\u20d0-\\u20f0";
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsAstral = "[" + rsAstralRange + "]";
    var rsCombo = "[" + rsComboMarksRange + rsComboSymbolsRange + "]";
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
    var rsNonAstral = "[^" + rsAstralRange + "]";
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsZWJ = "\\u200d";
    var reOptMod = rsModifier + "?";
    var rsOptVar = "[" + rsVarRange + "]?";
    var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + "]");
    var freeParseInt = parseInt;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        return freeProcess && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;
    var asciiSize = baseProperty("length");
    function asciiToArray(string) {
      return string.split("");
    }
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;
      while (reUnicode.test(string)) {
        result++;
      }
      return result;
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var Symbol2 = root.Symbol;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseIsRegExp(value) {
      return isObject(value) && objectToString.call(value) == regexpTag;
    }
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === void 0 ? length : end;
      return !start && end >= length ? array : baseSlice(array, start, end);
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    function toString(value) {
      return value == null ? "" : baseToString(value);
    }
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
      if (isObject(options)) {
        var separator = "separator" in options ? options.separator : separator;
        length = "length" in options ? toInteger(options.length) : length;
        omission = "omission" in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);
      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
      if (separator === void 0) {
        return result + omission;
      }
      if (strSymbols) {
        end += result.length - end;
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match, substring = result;
          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + "g");
          }
          separator.lastIndex = 0;
          while (match = separator.exec(substring)) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === void 0 ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }
    module2.exports = truncate;
  }
});

// ../../node_modules/table/dist/src/truncateTableData.js
var require_truncateTableData = __commonJS({
  "../../node_modules/table/dist/src/truncateTableData.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.truncateTableData = exports.truncateString = void 0;
    var lodash_truncate_1 = __importDefault(require_lodash());
    var truncateString = (input, length) => {
      return (0, lodash_truncate_1.default)(input, {
        length,
        omission: "\u2026"
      });
    };
    exports.truncateString = truncateString;
    var truncateTableData = (rows, truncates) => {
      return rows.map((cells) => {
        return cells.map((cell, cellIndex) => {
          return (0, exports.truncateString)(cell, truncates[cellIndex]);
        });
      });
    };
    exports.truncateTableData = truncateTableData;
  }
});

// ../../node_modules/table/dist/src/createStream.js
var require_createStream = __commonJS({
  "../../node_modules/table/dist/src/createStream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createStream = void 0;
    var alignTableData_1 = require_alignTableData();
    var calculateRowHeights_1 = require_calculateRowHeights();
    var drawBorder_1 = require_drawBorder();
    var drawRow_1 = require_drawRow();
    var makeStreamConfig_1 = require_makeStreamConfig();
    var mapDataUsingRowHeights_1 = require_mapDataUsingRowHeights();
    var padTableData_1 = require_padTableData();
    var stringifyTableData_1 = require_stringifyTableData();
    var truncateTableData_1 = require_truncateTableData();
    var utils_1 = require_utils();
    var prepareData = (data, config) => {
      let rows = (0, stringifyTableData_1.stringifyTableData)(data);
      rows = (0, truncateTableData_1.truncateTableData)(rows, (0, utils_1.extractTruncates)(config));
      const rowHeights = (0, calculateRowHeights_1.calculateRowHeights)(rows, config);
      rows = (0, mapDataUsingRowHeights_1.mapDataUsingRowHeights)(rows, rowHeights, config);
      rows = (0, alignTableData_1.alignTableData)(rows, config);
      rows = (0, padTableData_1.padTableData)(rows, config);
      return rows;
    };
    var create = (row, columnWidths, config) => {
      const rows = prepareData([row], config);
      const body = rows.map((literalRow) => {
        return (0, drawRow_1.drawRow)(literalRow, config);
      }).join("");
      let output;
      output = "";
      output += (0, drawBorder_1.drawBorderTop)(columnWidths, config);
      output += body;
      output += (0, drawBorder_1.drawBorderBottom)(columnWidths, config);
      output = output.trimEnd();
      process.stdout.write(output);
    };
    var append = (row, columnWidths, config) => {
      const rows = prepareData([row], config);
      const body = rows.map((literalRow) => {
        return (0, drawRow_1.drawRow)(literalRow, config);
      }).join("");
      let output = "";
      const bottom = (0, drawBorder_1.drawBorderBottom)(columnWidths, config);
      if (bottom !== "\n") {
        output = "\r\x1B[K";
      }
      output += (0, drawBorder_1.drawBorderJoin)(columnWidths, config);
      output += body;
      output += bottom;
      output = output.trimEnd();
      process.stdout.write(output);
    };
    var createStream = (userConfig) => {
      const config = (0, makeStreamConfig_1.makeStreamConfig)(userConfig);
      const columnWidths = Object.values(config.columns).map((column) => {
        return column.width + column.paddingLeft + column.paddingRight;
      });
      let empty = true;
      return {
        write: (row) => {
          if (row.length !== config.columnCount) {
            throw new Error("Row cell count does not match the config.columnCount.");
          }
          if (empty) {
            empty = false;
            create(row, columnWidths, config);
          } else {
            append(row, columnWidths, config);
          }
        }
      };
    };
    exports.createStream = createStream;
  }
});

// ../../node_modules/table/dist/src/calculateOutputColumnWidths.js
var require_calculateOutputColumnWidths = __commonJS({
  "../../node_modules/table/dist/src/calculateOutputColumnWidths.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.calculateOutputColumnWidths = void 0;
    var calculateOutputColumnWidths = (config) => {
      return config.columns.map((col) => {
        return col.paddingLeft + col.width + col.paddingRight;
      });
    };
    exports.calculateOutputColumnWidths = calculateOutputColumnWidths;
  }
});

// ../../node_modules/table/dist/src/drawTable.js
var require_drawTable = __commonJS({
  "../../node_modules/table/dist/src/drawTable.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.drawTable = void 0;
    var drawBorder_1 = require_drawBorder();
    var drawContent_1 = require_drawContent();
    var drawRow_1 = require_drawRow();
    var utils_1 = require_utils();
    var drawTable = (rows, outputColumnWidths, rowHeights, config) => {
      const { drawHorizontalLine, singleLine } = config;
      const contents = (0, utils_1.groupBySizes)(rows, rowHeights).map((group, groupIndex) => {
        return group.map((row) => {
          return (0, drawRow_1.drawRow)(row, {
            ...config,
            rowIndex: groupIndex
          });
        }).join("");
      });
      return (0, drawContent_1.drawContent)({
        contents,
        drawSeparator: (index, size) => {
          if (index === 0 || index === size) {
            return drawHorizontalLine(index, size);
          }
          return !singleLine && drawHorizontalLine(index, size);
        },
        elementType: "row",
        rowIndex: -1,
        separatorGetter: (0, drawBorder_1.createTableBorderGetter)(outputColumnWidths, {
          ...config,
          rowCount: contents.length
        }),
        spanningCellManager: config.spanningCellManager
      });
    };
    exports.drawTable = drawTable;
  }
});

// ../../node_modules/table/dist/src/injectHeaderConfig.js
var require_injectHeaderConfig = __commonJS({
  "../../node_modules/table/dist/src/injectHeaderConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.injectHeaderConfig = void 0;
    var injectHeaderConfig = (rows, config) => {
      var _a;
      let spanningCellConfig = (_a = config.spanningCells) !== null && _a !== void 0 ? _a : [];
      const headerConfig = config.header;
      const adjustedRows = [...rows];
      if (headerConfig) {
        spanningCellConfig = spanningCellConfig.map(({ row, ...rest }) => {
          return {
            ...rest,
            row: row + 1
          };
        });
        const { content, ...headerStyles } = headerConfig;
        spanningCellConfig.unshift({
          alignment: "center",
          col: 0,
          colSpan: rows[0].length,
          paddingLeft: 1,
          paddingRight: 1,
          row: 0,
          wrapWord: false,
          ...headerStyles
        });
        adjustedRows.unshift([content, ...Array.from({ length: rows[0].length - 1 }).fill("")]);
      }
      return [
        adjustedRows,
        spanningCellConfig
      ];
    };
    exports.injectHeaderConfig = injectHeaderConfig;
  }
});

// ../../node_modules/table/dist/src/calculateMaximumColumnWidths.js
var require_calculateMaximumColumnWidths = __commonJS({
  "../../node_modules/table/dist/src/calculateMaximumColumnWidths.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.calculateMaximumColumnWidths = exports.calculateMaximumCellWidth = void 0;
    var string_width_1 = __importDefault(require_string_width());
    var utils_1 = require_utils();
    var calculateMaximumCellWidth = (cell) => {
      return Math.max(...cell.split("\n").map(string_width_1.default));
    };
    exports.calculateMaximumCellWidth = calculateMaximumCellWidth;
    var calculateMaximumColumnWidths = (rows, spanningCellConfigs = []) => {
      const columnWidths = new Array(rows[0].length).fill(0);
      const rangeCoordinates = spanningCellConfigs.map(utils_1.calculateRangeCoordinate);
      const isSpanningCell = (rowIndex, columnIndex) => {
        return rangeCoordinates.some((rangeCoordinate) => {
          return (0, utils_1.isCellInRange)({
            col: columnIndex,
            row: rowIndex
          }, rangeCoordinate);
        });
      };
      rows.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (isSpanningCell(rowIndex, cellIndex)) {
            return;
          }
          columnWidths[cellIndex] = Math.max(columnWidths[cellIndex], (0, exports.calculateMaximumCellWidth)(cell));
        });
      });
      return columnWidths;
    };
    exports.calculateMaximumColumnWidths = calculateMaximumColumnWidths;
  }
});

// ../../node_modules/table/dist/src/alignSpanningCell.js
var require_alignSpanningCell = __commonJS({
  "../../node_modules/table/dist/src/alignSpanningCell.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.alignVerticalRangeContent = exports.wrapRangeContent = void 0;
    var string_width_1 = __importDefault(require_string_width());
    var alignString_1 = require_alignString();
    var mapDataUsingRowHeights_1 = require_mapDataUsingRowHeights();
    var padTableData_1 = require_padTableData();
    var truncateTableData_1 = require_truncateTableData();
    var utils_1 = require_utils();
    var wrapCell_1 = require_wrapCell();
    var wrapRangeContent = (rangeConfig, rangeWidth, context) => {
      const { topLeft, paddingRight, paddingLeft, truncate, wrapWord, alignment } = rangeConfig;
      const originalContent = context.rows[topLeft.row][topLeft.col];
      const contentWidth = rangeWidth - paddingLeft - paddingRight;
      return (0, wrapCell_1.wrapCell)((0, truncateTableData_1.truncateString)(originalContent, truncate), contentWidth, wrapWord).map((line) => {
        const alignedLine = (0, alignString_1.alignString)(line, contentWidth, alignment);
        return (0, padTableData_1.padString)(alignedLine, paddingLeft, paddingRight);
      });
    };
    exports.wrapRangeContent = wrapRangeContent;
    var alignVerticalRangeContent = (range, content, context) => {
      const { rows, drawHorizontalLine, rowHeights } = context;
      const { topLeft, bottomRight, verticalAlignment } = range;
      if (rowHeights.length === 0) {
        return [];
      }
      const totalCellHeight = (0, utils_1.sumArray)(rowHeights.slice(topLeft.row, bottomRight.row + 1));
      const totalBorderHeight = bottomRight.row - topLeft.row;
      const hiddenHorizontalBorderCount = (0, utils_1.sequence)(topLeft.row + 1, bottomRight.row).filter((horizontalBorderIndex) => {
        return !drawHorizontalLine(horizontalBorderIndex, rows.length);
      }).length;
      const availableRangeHeight = totalCellHeight + totalBorderHeight - hiddenHorizontalBorderCount;
      return (0, mapDataUsingRowHeights_1.padCellVertically)(content, availableRangeHeight, verticalAlignment).map((line) => {
        if (line.length === 0) {
          return " ".repeat((0, string_width_1.default)(content[0]));
        }
        return line;
      });
    };
    exports.alignVerticalRangeContent = alignVerticalRangeContent;
  }
});

// ../../node_modules/table/dist/src/calculateSpanningCellWidth.js
var require_calculateSpanningCellWidth = __commonJS({
  "../../node_modules/table/dist/src/calculateSpanningCellWidth.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.calculateSpanningCellWidth = void 0;
    var utils_1 = require_utils();
    var calculateSpanningCellWidth = (rangeConfig, dependencies) => {
      const { columnsConfig, drawVerticalLine } = dependencies;
      const { topLeft, bottomRight } = rangeConfig;
      const totalWidth = (0, utils_1.sumArray)(columnsConfig.slice(topLeft.col, bottomRight.col + 1).map(({ width }) => {
        return width;
      }));
      const totalPadding = topLeft.col === bottomRight.col ? columnsConfig[topLeft.col].paddingRight + columnsConfig[bottomRight.col].paddingLeft : (0, utils_1.sumArray)(columnsConfig.slice(topLeft.col, bottomRight.col + 1).map(({ paddingLeft, paddingRight }) => {
        return paddingLeft + paddingRight;
      }));
      const totalBorderWidths = bottomRight.col - topLeft.col;
      const totalHiddenVerticalBorders = (0, utils_1.sequence)(topLeft.col + 1, bottomRight.col).filter((verticalBorderIndex) => {
        return !drawVerticalLine(verticalBorderIndex, columnsConfig.length);
      }).length;
      return totalWidth + totalPadding + totalBorderWidths - totalHiddenVerticalBorders;
    };
    exports.calculateSpanningCellWidth = calculateSpanningCellWidth;
  }
});

// ../../node_modules/table/dist/src/makeRangeConfig.js
var require_makeRangeConfig = __commonJS({
  "../../node_modules/table/dist/src/makeRangeConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeRangeConfig = void 0;
    var utils_1 = require_utils();
    var makeRangeConfig = (spanningCellConfig, columnsConfig) => {
      var _a;
      const { topLeft, bottomRight } = (0, utils_1.calculateRangeCoordinate)(spanningCellConfig);
      const cellConfig = {
        ...columnsConfig[topLeft.col],
        ...spanningCellConfig,
        paddingRight: (_a = spanningCellConfig.paddingRight) !== null && _a !== void 0 ? _a : columnsConfig[bottomRight.col].paddingRight
      };
      return {
        ...cellConfig,
        bottomRight,
        topLeft
      };
    };
    exports.makeRangeConfig = makeRangeConfig;
  }
});

// ../../node_modules/table/dist/src/spanningCellManager.js
var require_spanningCellManager = __commonJS({
  "../../node_modules/table/dist/src/spanningCellManager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createSpanningCellManager = void 0;
    var alignSpanningCell_1 = require_alignSpanningCell();
    var calculateSpanningCellWidth_1 = require_calculateSpanningCellWidth();
    var makeRangeConfig_1 = require_makeRangeConfig();
    var utils_1 = require_utils();
    var findRangeConfig = (cell, rangeConfigs) => {
      return rangeConfigs.find((rangeCoordinate) => {
        return (0, utils_1.isCellInRange)(cell, rangeCoordinate);
      });
    };
    var getContainingRange = (rangeConfig, context) => {
      const width = (0, calculateSpanningCellWidth_1.calculateSpanningCellWidth)(rangeConfig, context);
      const wrappedContent = (0, alignSpanningCell_1.wrapRangeContent)(rangeConfig, width, context);
      const alignedContent = (0, alignSpanningCell_1.alignVerticalRangeContent)(rangeConfig, wrappedContent, context);
      const getCellContent = (rowIndex) => {
        const { topLeft } = rangeConfig;
        const { drawHorizontalLine, rowHeights } = context;
        const totalWithinHorizontalBorderHeight = rowIndex - topLeft.row;
        const totalHiddenHorizontalBorderHeight = (0, utils_1.sequence)(topLeft.row + 1, rowIndex).filter((index) => {
          return !(drawHorizontalLine === null || drawHorizontalLine === void 0 ? void 0 : drawHorizontalLine(index, rowHeights.length));
        }).length;
        const offset = (0, utils_1.sumArray)(rowHeights.slice(topLeft.row, rowIndex)) + totalWithinHorizontalBorderHeight - totalHiddenHorizontalBorderHeight;
        return alignedContent.slice(offset, offset + rowHeights[rowIndex]);
      };
      const getBorderContent = (borderIndex) => {
        const { topLeft } = rangeConfig;
        const offset = (0, utils_1.sumArray)(context.rowHeights.slice(topLeft.row, borderIndex)) + (borderIndex - topLeft.row - 1);
        return alignedContent[offset];
      };
      return {
        ...rangeConfig,
        extractBorderContent: getBorderContent,
        extractCellContent: getCellContent,
        height: wrappedContent.length,
        width
      };
    };
    var inSameRange = (cell1, cell2, ranges) => {
      const range1 = findRangeConfig(cell1, ranges);
      const range2 = findRangeConfig(cell2, ranges);
      if (range1 && range2) {
        return (0, utils_1.areCellEqual)(range1.topLeft, range2.topLeft);
      }
      return false;
    };
    var hashRange = (range) => {
      const { row, col } = range.topLeft;
      return `${row}/${col}`;
    };
    var createSpanningCellManager = (parameters) => {
      const { spanningCellConfigs, columnsConfig } = parameters;
      const ranges = spanningCellConfigs.map((config) => {
        return (0, makeRangeConfig_1.makeRangeConfig)(config, columnsConfig);
      });
      const rangeCache = {};
      let rowHeights = [];
      return {
        getContainingRange: (cell, options) => {
          var _a;
          const originalRow = (options === null || options === void 0 ? void 0 : options.mapped) ? (0, utils_1.findOriginalRowIndex)(rowHeights, cell.row) : cell.row;
          const range = findRangeConfig({
            ...cell,
            row: originalRow
          }, ranges);
          if (!range) {
            return void 0;
          }
          if (rowHeights.length === 0) {
            return getContainingRange(range, {
              ...parameters,
              rowHeights
            });
          }
          const hash = hashRange(range);
          (_a = rangeCache[hash]) !== null && _a !== void 0 ? _a : rangeCache[hash] = getContainingRange(range, {
            ...parameters,
            rowHeights
          });
          return rangeCache[hash];
        },
        inSameRange: (cell1, cell2) => {
          return inSameRange(cell1, cell2, ranges);
        },
        rowHeights,
        setRowHeights: (_rowHeights) => {
          rowHeights = _rowHeights;
        }
      };
    };
    exports.createSpanningCellManager = createSpanningCellManager;
  }
});

// ../../node_modules/table/dist/src/validateSpanningCellConfig.js
var require_validateSpanningCellConfig = __commonJS({
  "../../node_modules/table/dist/src/validateSpanningCellConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSpanningCellConfig = void 0;
    var utils_1 = require_utils();
    var inRange = (start, end, value) => {
      return start <= value && value <= end;
    };
    var validateSpanningCellConfig = (rows, configs) => {
      const [nRow, nCol] = [rows.length, rows[0].length];
      configs.forEach((config, configIndex) => {
        const { colSpan, rowSpan } = config;
        if (colSpan === void 0 && rowSpan === void 0) {
          throw new Error(`Expect at least colSpan or rowSpan is provided in config.spanningCells[${configIndex}]`);
        }
        if (colSpan !== void 0 && colSpan < 1) {
          throw new Error(`Expect colSpan is not equal zero, instead got: ${colSpan} in config.spanningCells[${configIndex}]`);
        }
        if (rowSpan !== void 0 && rowSpan < 1) {
          throw new Error(`Expect rowSpan is not equal zero, instead got: ${rowSpan} in config.spanningCells[${configIndex}]`);
        }
      });
      const rangeCoordinates = configs.map(utils_1.calculateRangeCoordinate);
      rangeCoordinates.forEach(({ topLeft, bottomRight }, rangeIndex) => {
        if (!inRange(0, nCol - 1, topLeft.col) || !inRange(0, nRow - 1, topLeft.row) || !inRange(0, nCol - 1, bottomRight.col) || !inRange(0, nRow - 1, bottomRight.row)) {
          throw new Error(`Some cells in config.spanningCells[${rangeIndex}] are out of the table`);
        }
      });
      const configOccupy = Array.from({ length: nRow }, () => {
        return Array.from({ length: nCol });
      });
      rangeCoordinates.forEach(({ topLeft, bottomRight }, rangeIndex) => {
        (0, utils_1.sequence)(topLeft.row, bottomRight.row).forEach((row) => {
          (0, utils_1.sequence)(topLeft.col, bottomRight.col).forEach((col) => {
            if (configOccupy[row][col] !== void 0) {
              throw new Error(`Spanning cells in config.spanningCells[${configOccupy[row][col]}] and config.spanningCells[${rangeIndex}] are overlap each other`);
            }
            configOccupy[row][col] = rangeIndex;
          });
        });
      });
    };
    exports.validateSpanningCellConfig = validateSpanningCellConfig;
  }
});

// ../../node_modules/table/dist/src/makeTableConfig.js
var require_makeTableConfig = __commonJS({
  "../../node_modules/table/dist/src/makeTableConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeTableConfig = void 0;
    var calculateMaximumColumnWidths_1 = require_calculateMaximumColumnWidths();
    var spanningCellManager_1 = require_spanningCellManager();
    var utils_1 = require_utils();
    var validateConfig_1 = require_validateConfig();
    var validateSpanningCellConfig_1 = require_validateSpanningCellConfig();
    var makeColumnsConfig = (rows, columns, columnDefault, spanningCellConfigs) => {
      const columnWidths = (0, calculateMaximumColumnWidths_1.calculateMaximumColumnWidths)(rows, spanningCellConfigs);
      return rows[0].map((_, columnIndex) => {
        return {
          alignment: "left",
          paddingLeft: 1,
          paddingRight: 1,
          truncate: Number.POSITIVE_INFINITY,
          verticalAlignment: "top",
          width: columnWidths[columnIndex],
          wrapWord: false,
          ...columnDefault,
          ...columns === null || columns === void 0 ? void 0 : columns[columnIndex]
        };
      });
    };
    var makeTableConfig = (rows, config = {}, injectedSpanningCellConfig) => {
      var _a, _b, _c, _d, _e;
      (0, validateConfig_1.validateConfig)("config.json", config);
      (0, validateSpanningCellConfig_1.validateSpanningCellConfig)(rows, (_a = config.spanningCells) !== null && _a !== void 0 ? _a : []);
      const spanningCellConfigs = (_b = injectedSpanningCellConfig !== null && injectedSpanningCellConfig !== void 0 ? injectedSpanningCellConfig : config.spanningCells) !== null && _b !== void 0 ? _b : [];
      const columnsConfig = makeColumnsConfig(rows, config.columns, config.columnDefault, spanningCellConfigs);
      const drawVerticalLine = (_c = config.drawVerticalLine) !== null && _c !== void 0 ? _c : () => {
        return true;
      };
      const drawHorizontalLine = (_d = config.drawHorizontalLine) !== null && _d !== void 0 ? _d : () => {
        return true;
      };
      return {
        ...config,
        border: (0, utils_1.makeBorderConfig)(config.border),
        columns: columnsConfig,
        drawHorizontalLine,
        drawVerticalLine,
        singleLine: (_e = config.singleLine) !== null && _e !== void 0 ? _e : false,
        spanningCellManager: (0, spanningCellManager_1.createSpanningCellManager)({
          columnsConfig,
          drawHorizontalLine,
          drawVerticalLine,
          rows,
          spanningCellConfigs
        })
      };
    };
    exports.makeTableConfig = makeTableConfig;
  }
});

// ../../node_modules/table/dist/src/validateTableData.js
var require_validateTableData = __commonJS({
  "../../node_modules/table/dist/src/validateTableData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTableData = void 0;
    var utils_1 = require_utils();
    var validateTableData = (rows) => {
      if (!Array.isArray(rows)) {
        throw new TypeError("Table data must be an array.");
      }
      if (rows.length === 0) {
        throw new Error("Table must define at least one row.");
      }
      if (rows[0].length === 0) {
        throw new Error("Table must define at least one column.");
      }
      const columnNumber = rows[0].length;
      for (const row of rows) {
        if (!Array.isArray(row)) {
          throw new TypeError("Table row data must be an array.");
        }
        if (row.length !== columnNumber) {
          throw new Error("Table must have a consistent number of cells.");
        }
        for (const cell of row) {
          if (/[\u0001-\u0006\u0008\u0009\u000B-\u001A]/.test((0, utils_1.normalizeString)(String(cell)))) {
            throw new Error("Table data must not contain control characters.");
          }
        }
      }
    };
    exports.validateTableData = validateTableData;
  }
});

// ../../node_modules/table/dist/src/table.js
var require_table = __commonJS({
  "../../node_modules/table/dist/src/table.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.table = void 0;
    var alignTableData_1 = require_alignTableData();
    var calculateOutputColumnWidths_1 = require_calculateOutputColumnWidths();
    var calculateRowHeights_1 = require_calculateRowHeights();
    var drawTable_1 = require_drawTable();
    var injectHeaderConfig_1 = require_injectHeaderConfig();
    var makeTableConfig_1 = require_makeTableConfig();
    var mapDataUsingRowHeights_1 = require_mapDataUsingRowHeights();
    var padTableData_1 = require_padTableData();
    var stringifyTableData_1 = require_stringifyTableData();
    var truncateTableData_1 = require_truncateTableData();
    var utils_1 = require_utils();
    var validateTableData_1 = require_validateTableData();
    var table2 = (data, userConfig = {}) => {
      (0, validateTableData_1.validateTableData)(data);
      let rows = (0, stringifyTableData_1.stringifyTableData)(data);
      const [injectedRows, injectedSpanningCellConfig] = (0, injectHeaderConfig_1.injectHeaderConfig)(rows, userConfig);
      const config = (0, makeTableConfig_1.makeTableConfig)(injectedRows, userConfig, injectedSpanningCellConfig);
      rows = (0, truncateTableData_1.truncateTableData)(injectedRows, (0, utils_1.extractTruncates)(config));
      const rowHeights = (0, calculateRowHeights_1.calculateRowHeights)(rows, config);
      config.spanningCellManager.setRowHeights(rowHeights);
      rows = (0, mapDataUsingRowHeights_1.mapDataUsingRowHeights)(rows, rowHeights, config);
      rows = (0, alignTableData_1.alignTableData)(rows, config);
      rows = (0, padTableData_1.padTableData)(rows, config);
      const outputColumnWidths = (0, calculateOutputColumnWidths_1.calculateOutputColumnWidths)(config);
      return (0, drawTable_1.drawTable)(rows, outputColumnWidths, rowHeights, config);
    };
    exports.table = table2;
  }
});

// ../../node_modules/table/dist/src/types/api.js
var require_api = __commonJS({
  "../../node_modules/table/dist/src/types/api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/table/dist/src/index.js
var require_src = __commonJS({
  "../../node_modules/table/dist/src/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBorderCharacters = exports.createStream = exports.table = void 0;
    var createStream_1 = require_createStream();
    Object.defineProperty(exports, "createStream", { enumerable: true, get: function() {
      return createStream_1.createStream;
    } });
    var getBorderCharacters_1 = require_getBorderCharacters();
    Object.defineProperty(exports, "getBorderCharacters", { enumerable: true, get: function() {
      return getBorderCharacters_1.getBorderCharacters;
    } });
    var table_1 = require_table();
    Object.defineProperty(exports, "table", { enumerable: true, get: function() {
      return table_1.table;
    } });
    __exportStar(require_api(), exports);
  }
});

// src/commands/gas-report.ts
var gas_report_exports = {};
__export(gas_report_exports, {
  builder: () => builder,
  command: () => command,
  desc: () => desc,
  handler: () => handler
});
module.exports = __toCommonJS(gas_report_exports);
var import_fs = require("fs");

// node_modules/execa/index.js
var import_node_buffer = require("node:buffer");
var import_node_path2 = __toESM(require("node:path"), 1);
var import_node_child_process = __toESM(require("node:child_process"), 1);
var import_node_process2 = __toESM(require("node:process"), 1);
var import_cross_spawn = __toESM(require_cross_spawn(), 1);

// node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
  const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
  const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
  if (input[input.length - 1] === LF) {
    input = input.slice(0, -1);
  }
  if (input[input.length - 1] === CR) {
    input = input.slice(0, -1);
  }
  return input;
}

// node_modules/npm-run-path/index.js
var import_node_process = __toESM(require("node:process"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_url = __toESM(require("node:url"), 1);

// node_modules/path-key/index.js
function pathKey(options = {}) {
  const {
    env: env2 = process.env,
    platform = process.platform
  } = options;
  if (platform !== "win32") {
    return "PATH";
  }
  return Object.keys(env2).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}

// node_modules/npm-run-path/index.js
function npmRunPath(options = {}) {
  const {
    cwd = import_node_process.default.cwd(),
    path: path_ = import_node_process.default.env[pathKey()],
    execPath = import_node_process.default.execPath
  } = options;
  let previous;
  const cwdString = cwd instanceof URL ? import_node_url.default.fileURLToPath(cwd) : cwd;
  let cwdPath = import_node_path.default.resolve(cwdString);
  const result = [];
  while (previous !== cwdPath) {
    result.push(import_node_path.default.join(cwdPath, "node_modules/.bin"));
    previous = cwdPath;
    cwdPath = import_node_path.default.resolve(cwdPath, "..");
  }
  result.push(import_node_path.default.resolve(cwdString, execPath, ".."));
  return [...result, path_].join(import_node_path.default.delimiter);
}
function npmRunPathEnv({ env: env2 = import_node_process.default.env, ...options } = {}) {
  env2 = { ...env2 };
  const path3 = pathKey({ env: env2 });
  options.path = env2[path3];
  env2[path3] = npmRunPath(options);
  return env2;
}

// node_modules/mimic-fn/index.js
var copyProperty = (to, from, property, ignoreNonConfigurable) => {
  if (property === "length" || property === "prototype") {
    return;
  }
  if (property === "arguments" || property === "caller") {
    return;
  }
  const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
  const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
  if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
    return;
  }
  Object.defineProperty(to, property, fromDescriptor);
};
var canCopyProperty = function(toDescriptor, fromDescriptor) {
  return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
var changePrototype = (to, from) => {
  const fromPrototype = Object.getPrototypeOf(from);
  if (fromPrototype === Object.getPrototypeOf(to)) {
    return;
  }
  Object.setPrototypeOf(to, fromPrototype);
};
var wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`;
var toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
var toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
var changeToString = (to, from, name) => {
  const withName = name === "" ? "" : `with ${name.trim()}() `;
  const newToString = wrappedToString.bind(null, withName, from.toString());
  Object.defineProperty(newToString, "name", toStringName);
  Object.defineProperty(to, "toString", { ...toStringDescriptor, value: newToString });
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name);
  return to;
}

// node_modules/onetime/index.js
var calledFunctions = /* @__PURE__ */ new WeakMap();
var onetime = (function_, options = {}) => {
  if (typeof function_ !== "function") {
    throw new TypeError("Expected a function");
  }
  let returnValue;
  let callCount = 0;
  const functionName = function_.displayName || function_.name || "<anonymous>";
  const onetime2 = function(...arguments_) {
    calledFunctions.set(onetime2, ++callCount);
    if (callCount === 1) {
      returnValue = function_.apply(this, arguments_);
      function_ = null;
    } else if (options.throw === true) {
      throw new Error(`Function \`${functionName}\` can only be called once`);
    }
    return returnValue;
  };
  mimicFunction(onetime2, function_);
  calledFunctions.set(onetime2, callCount);
  return onetime2;
};
onetime.callCount = (function_) => {
  if (!calledFunctions.has(function_)) {
    throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
  }
  return calledFunctions.get(function_);
};
var onetime_default = onetime;

// node_modules/human-signals/build/src/main.js
var import_os2 = require("os");

// node_modules/human-signals/build/src/realtime.js
var getRealtimeSignals = function() {
  const length = SIGRTMAX - SIGRTMIN + 1;
  return Array.from({ length }, getRealtimeSignal);
};
var getRealtimeSignal = function(value, index) {
  return {
    name: `SIGRT${index + 1}`,
    number: SIGRTMIN + index,
    action: "terminate",
    description: "Application-specific signal (realtime)",
    standard: "posix"
  };
};
var SIGRTMIN = 34;
var SIGRTMAX = 64;

// node_modules/human-signals/build/src/signals.js
var import_os = require("os");

// node_modules/human-signals/build/src/core.js
var SIGNALS = [
  {
    name: "SIGHUP",
    number: 1,
    action: "terminate",
    description: "Terminal closed",
    standard: "posix"
  },
  {
    name: "SIGINT",
    number: 2,
    action: "terminate",
    description: "User interruption with CTRL-C",
    standard: "ansi"
  },
  {
    name: "SIGQUIT",
    number: 3,
    action: "core",
    description: "User interruption with CTRL-\\",
    standard: "posix"
  },
  {
    name: "SIGILL",
    number: 4,
    action: "core",
    description: "Invalid machine instruction",
    standard: "ansi"
  },
  {
    name: "SIGTRAP",
    number: 5,
    action: "core",
    description: "Debugger breakpoint",
    standard: "posix"
  },
  {
    name: "SIGABRT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "ansi"
  },
  {
    name: "SIGIOT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "bsd"
  },
  {
    name: "SIGBUS",
    number: 7,
    action: "core",
    description: "Bus error due to misaligned, non-existing address or paging error",
    standard: "bsd"
  },
  {
    name: "SIGEMT",
    number: 7,
    action: "terminate",
    description: "Command should be emulated but is not implemented",
    standard: "other"
  },
  {
    name: "SIGFPE",
    number: 8,
    action: "core",
    description: "Floating point arithmetic error",
    standard: "ansi"
  },
  {
    name: "SIGKILL",
    number: 9,
    action: "terminate",
    description: "Forced termination",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGUSR1",
    number: 10,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGSEGV",
    number: 11,
    action: "core",
    description: "Segmentation fault",
    standard: "ansi"
  },
  {
    name: "SIGUSR2",
    number: 12,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGPIPE",
    number: 13,
    action: "terminate",
    description: "Broken pipe or socket",
    standard: "posix"
  },
  {
    name: "SIGALRM",
    number: 14,
    action: "terminate",
    description: "Timeout or timer",
    standard: "posix"
  },
  {
    name: "SIGTERM",
    number: 15,
    action: "terminate",
    description: "Termination",
    standard: "ansi"
  },
  {
    name: "SIGSTKFLT",
    number: 16,
    action: "terminate",
    description: "Stack is empty or overflowed",
    standard: "other"
  },
  {
    name: "SIGCHLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "posix"
  },
  {
    name: "SIGCLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "other"
  },
  {
    name: "SIGCONT",
    number: 18,
    action: "unpause",
    description: "Unpaused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGSTOP",
    number: 19,
    action: "pause",
    description: "Paused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGTSTP",
    number: 20,
    action: "pause",
    description: 'Paused using CTRL-Z or "suspend"',
    standard: "posix"
  },
  {
    name: "SIGTTIN",
    number: 21,
    action: "pause",
    description: "Background process cannot read terminal input",
    standard: "posix"
  },
  {
    name: "SIGBREAK",
    number: 21,
    action: "terminate",
    description: "User interruption with CTRL-BREAK",
    standard: "other"
  },
  {
    name: "SIGTTOU",
    number: 22,
    action: "pause",
    description: "Background process cannot write to terminal output",
    standard: "posix"
  },
  {
    name: "SIGURG",
    number: 23,
    action: "ignore",
    description: "Socket received out-of-band data",
    standard: "bsd"
  },
  {
    name: "SIGXCPU",
    number: 24,
    action: "core",
    description: "Process timed out",
    standard: "bsd"
  },
  {
    name: "SIGXFSZ",
    number: 25,
    action: "core",
    description: "File too big",
    standard: "bsd"
  },
  {
    name: "SIGVTALRM",
    number: 26,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGPROF",
    number: 27,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGWINCH",
    number: 28,
    action: "ignore",
    description: "Terminal window size changed",
    standard: "bsd"
  },
  {
    name: "SIGIO",
    number: 29,
    action: "terminate",
    description: "I/O is available",
    standard: "other"
  },
  {
    name: "SIGPOLL",
    number: 29,
    action: "terminate",
    description: "Watched event",
    standard: "other"
  },
  {
    name: "SIGINFO",
    number: 29,
    action: "ignore",
    description: "Request for process information",
    standard: "other"
  },
  {
    name: "SIGPWR",
    number: 30,
    action: "terminate",
    description: "Device running out of power",
    standard: "systemv"
  },
  {
    name: "SIGSYS",
    number: 31,
    action: "core",
    description: "Invalid system call",
    standard: "other"
  },
  {
    name: "SIGUNUSED",
    number: 31,
    action: "terminate",
    description: "Invalid system call",
    standard: "other"
  }
];

// node_modules/human-signals/build/src/signals.js
var getSignals = function() {
  const realtimeSignals = getRealtimeSignals();
  const signals = [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
  return signals;
};
var normalizeSignal = function({
  name,
  number: defaultNumber,
  description,
  action,
  forced = false,
  standard
}) {
  const {
    signals: { [name]: constantSignal }
  } = import_os.constants;
  const supported = constantSignal !== void 0;
  const number = supported ? constantSignal : defaultNumber;
  return { name, number, description, supported, action, forced, standard };
};

// node_modules/human-signals/build/src/main.js
var getSignalsByName = function() {
  const signals = getSignals();
  return signals.reduce(getSignalByName, {});
};
var getSignalByName = function(signalByNameMemo, { name, number, description, supported, action, forced, standard }) {
  return {
    ...signalByNameMemo,
    [name]: { name, number, description, supported, action, forced, standard }
  };
};
var signalsByName = getSignalsByName();
var getSignalsByNumber = function() {
  const signals = getSignals();
  const length = SIGRTMAX + 1;
  const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals));
  return Object.assign({}, ...signalsA);
};
var getSignalByNumber = function(number, signals) {
  const signal = findSignalByNumber(number, signals);
  if (signal === void 0) {
    return {};
  }
  const { name, description, supported, action, forced, standard } = signal;
  return {
    [number]: {
      name,
      number,
      description,
      supported,
      action,
      forced,
      standard
    }
  };
};
var findSignalByNumber = function(number, signals) {
  const signal = signals.find(({ name }) => import_os2.constants.signals[name] === number);
  if (signal !== void 0) {
    return signal;
  }
  return signals.find((signalA) => signalA.number === number);
};
var signalsByNumber = getSignalsByNumber();

// node_modules/execa/lib/error.js
var getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
  if (timedOut) {
    return `timed out after ${timeout} milliseconds`;
  }
  if (isCanceled) {
    return "was canceled";
  }
  if (errorCode !== void 0) {
    return `failed with ${errorCode}`;
  }
  if (signal !== void 0) {
    return `was killed with ${signal} (${signalDescription})`;
  }
  if (exitCode !== void 0) {
    return `failed with exit code ${exitCode}`;
  }
  return "failed";
};
var makeError = ({
  stdout,
  stderr,
  all,
  error,
  signal,
  exitCode,
  command: command2,
  escapedCommand,
  timedOut,
  isCanceled,
  killed,
  parsed: { options: { timeout } }
}) => {
  exitCode = exitCode === null ? void 0 : exitCode;
  signal = signal === null ? void 0 : signal;
  const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
  const errorCode = error && error.code;
  const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
  const execaMessage = `Command ${prefix}: ${command2}`;
  const isError = Object.prototype.toString.call(error) === "[object Error]";
  const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
  const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
  if (isError) {
    error.originalMessage = error.message;
    error.message = message;
  } else {
    error = new Error(message);
  }
  error.shortMessage = shortMessage;
  error.command = command2;
  error.escapedCommand = escapedCommand;
  error.exitCode = exitCode;
  error.signal = signal;
  error.signalDescription = signalDescription;
  error.stdout = stdout;
  error.stderr = stderr;
  if (all !== void 0) {
    error.all = all;
  }
  if ("bufferedData" in error) {
    delete error.bufferedData;
  }
  error.failed = true;
  error.timedOut = Boolean(timedOut);
  error.isCanceled = isCanceled;
  error.killed = killed && !timedOut;
  return error;
};

// node_modules/execa/lib/stdio.js
var aliases = ["stdin", "stdout", "stderr"];
var hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
var normalizeStdio = (options) => {
  if (!options) {
    return;
  }
  const { stdio } = options;
  if (stdio === void 0) {
    return aliases.map((alias) => options[alias]);
  }
  if (hasAlias(options)) {
    throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
  }
  if (typeof stdio === "string") {
    return stdio;
  }
  if (!Array.isArray(stdio)) {
    throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
  }
  const length = Math.max(stdio.length, aliases.length);
  return Array.from({ length }, (value, index) => stdio[index]);
};

// node_modules/execa/lib/kill.js
var import_node_os = __toESM(require("node:os"), 1);
var import_signal_exit = __toESM(require_signal_exit(), 1);
var DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
var spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
  const killResult = kill(signal);
  setKillTimeout(kill, signal, options, killResult);
  return killResult;
};
var setKillTimeout = (kill, signal, options, killResult) => {
  if (!shouldForceKill(signal, options, killResult)) {
    return;
  }
  const timeout = getForceKillAfterTimeout(options);
  const t = setTimeout(() => {
    kill("SIGKILL");
  }, timeout);
  if (t.unref) {
    t.unref();
  }
};
var shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
var isSigterm = (signal) => signal === import_node_os.default.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
var getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
  if (forceKillAfterTimeout === true) {
    return DEFAULT_FORCE_KILL_TIMEOUT;
  }
  if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
    throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
  }
  return forceKillAfterTimeout;
};
var spawnedCancel = (spawned, context) => {
  const killResult = spawned.kill();
  if (killResult) {
    context.isCanceled = true;
  }
};
var timeoutKill = (spawned, signal, reject) => {
  spawned.kill(signal);
  reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
};
var setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
  if (timeout === 0 || timeout === void 0) {
    return spawnedPromise;
  }
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      timeoutKill(spawned, killSignal, reject);
    }, timeout);
  });
  const safeSpawnedPromise = spawnedPromise.finally(() => {
    clearTimeout(timeoutId);
  });
  return Promise.race([timeoutPromise, safeSpawnedPromise]);
};
var validateTimeout = ({ timeout }) => {
  if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
    throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
  }
};
var setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
  if (!cleanup || detached) {
    return timedPromise;
  }
  const removeExitHandler = (0, import_signal_exit.default)(() => {
    spawned.kill();
  });
  return timedPromise.finally(() => {
    removeExitHandler();
  });
};

// node_modules/is-stream/index.js
function isStream(stream) {
  return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
}

// node_modules/execa/lib/stream.js
var import_get_stream = __toESM(require_get_stream(), 1);
var import_merge_stream = __toESM(require_merge_stream(), 1);
var handleInput = (spawned, input) => {
  if (input === void 0 || spawned.stdin === void 0) {
    return;
  }
  if (isStream(input)) {
    input.pipe(spawned.stdin);
  } else {
    spawned.stdin.end(input);
  }
};
var makeAllStream = (spawned, { all }) => {
  if (!all || !spawned.stdout && !spawned.stderr) {
    return;
  }
  const mixed = (0, import_merge_stream.default)();
  if (spawned.stdout) {
    mixed.add(spawned.stdout);
  }
  if (spawned.stderr) {
    mixed.add(spawned.stderr);
  }
  return mixed;
};
var getBufferedData = async (stream, streamPromise) => {
  if (!stream) {
    return;
  }
  stream.destroy();
  try {
    return await streamPromise;
  } catch (error) {
    return error.bufferedData;
  }
};
var getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
  if (!stream || !buffer) {
    return;
  }
  if (encoding) {
    return (0, import_get_stream.default)(stream, { encoding, maxBuffer });
  }
  return import_get_stream.default.buffer(stream, { maxBuffer });
};
var getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
  const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
  const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
  const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
  try {
    return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
  } catch (error) {
    return Promise.all([
      { error, signal: error.signal, timedOut: error.timedOut },
      getBufferedData(stdout, stdoutPromise),
      getBufferedData(stderr, stderrPromise),
      getBufferedData(all, allPromise)
    ]);
  }
};

// node_modules/execa/lib/promise.js
var nativePromisePrototype = (async () => {
})().constructor.prototype;
var descriptors = ["then", "catch", "finally"].map((property) => [
  property,
  Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);
var mergePromise = (spawned, promise) => {
  for (const [property, descriptor] of descriptors) {
    const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
    Reflect.defineProperty(spawned, property, { ...descriptor, value });
  }
  return spawned;
};
var getSpawnedPromise = (spawned) => new Promise((resolve, reject) => {
  spawned.on("exit", (exitCode, signal) => {
    resolve({ exitCode, signal });
  });
  spawned.on("error", (error) => {
    reject(error);
  });
  if (spawned.stdin) {
    spawned.stdin.on("error", (error) => {
      reject(error);
    });
  }
});

// node_modules/execa/lib/command.js
var normalizeArgs = (file, args = []) => {
  if (!Array.isArray(args)) {
    return [file];
  }
  return [file, ...args];
};
var NO_ESCAPE_REGEXP = /^[\w.-]+$/;
var DOUBLE_QUOTES_REGEXP = /"/g;
var escapeArg = (arg) => {
  if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
    return arg;
  }
  return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};
var joinCommand = (file, args) => normalizeArgs(file, args).join(" ");
var getEscapedCommand = (file, args) => normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");

// node_modules/execa/index.js
var DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
var getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
  const env2 = extendEnv ? { ...import_node_process2.default.env, ...envOption } : envOption;
  if (preferLocal) {
    return npmRunPathEnv({ env: env2, cwd: localDir, execPath });
  }
  return env2;
};
var handleArguments = (file, args, options = {}) => {
  const parsed = import_cross_spawn.default._parse(file, args, options);
  file = parsed.command;
  args = parsed.args;
  options = parsed.options;
  options = {
    maxBuffer: DEFAULT_MAX_BUFFER,
    buffer: true,
    stripFinalNewline: true,
    extendEnv: true,
    preferLocal: false,
    localDir: options.cwd || import_node_process2.default.cwd(),
    execPath: import_node_process2.default.execPath,
    encoding: "utf8",
    reject: true,
    cleanup: true,
    all: false,
    windowsHide: true,
    ...options
  };
  options.env = getEnv(options);
  options.stdio = normalizeStdio(options);
  if (import_node_process2.default.platform === "win32" && import_node_path2.default.basename(file, ".exe") === "cmd") {
    args.unshift("/q");
  }
  return { file, args, options, parsed };
};
var handleOutput = (options, value, error) => {
  if (typeof value !== "string" && !import_node_buffer.Buffer.isBuffer(value)) {
    return error === void 0 ? void 0 : "";
  }
  if (options.stripFinalNewline) {
    return stripFinalNewline(value);
  }
  return value;
};
function execa(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command2 = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  validateTimeout(parsed.options);
  let spawned;
  try {
    spawned = import_node_child_process.default.spawn(parsed.file, parsed.args, parsed.options);
  } catch (error) {
    const dummySpawned = new import_node_child_process.default.ChildProcess();
    const errorPromise = Promise.reject(makeError({
      error,
      stdout: "",
      stderr: "",
      all: "",
      command: command2,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    }));
    return mergePromise(dummySpawned, errorPromise);
  }
  const spawnedPromise = getSpawnedPromise(spawned);
  const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
  const processDone = setExitHandler(spawned, parsed.options, timedPromise);
  const context = { isCanceled: false };
  spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
  spawned.cancel = spawnedCancel.bind(null, spawned, context);
  const handlePromise = async () => {
    const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
    const stdout = handleOutput(parsed.options, stdoutResult);
    const stderr = handleOutput(parsed.options, stderrResult);
    const all = handleOutput(parsed.options, allResult);
    if (error || exitCode !== 0 || signal !== null) {
      const returnedError = makeError({
        error,
        exitCode,
        signal,
        stdout,
        stderr,
        all,
        command: command2,
        escapedCommand,
        parsed,
        timedOut,
        isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
        killed: spawned.killed
      });
      if (!parsed.options.reject) {
        return returnedError;
      }
      throw returnedError;
    }
    return {
      command: command2,
      escapedCommand,
      exitCode: 0,
      stdout,
      stderr,
      all,
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false
    };
  };
  const handlePromiseOnce = onetime_default(handlePromise);
  handleInput(spawned, parsed.options.input);
  spawned.all = makeAllStream(spawned, parsed.options);
  return mergePromise(spawned, handlePromiseOnce);
}

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  const styles2 = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      blackBright: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  };
  styles2.color.gray = styles2.color.blackBright;
  styles2.bgColor.bgGray = styles2.bgColor.bgBlackBright;
  styles2.color.grey = styles2.color.blackBright;
  styles2.bgColor.bgGrey = styles2.bgColor.bgBlackBright;
  for (const [groupName, group] of Object.entries(styles2)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles2[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles2[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles2, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles2, "codes", {
    value: codes,
    enumerable: false
  });
  styles2.color.close = "\x1B[39m";
  styles2.bgColor.close = "\x1B[49m";
  styles2.color.ansi = wrapAnsi16();
  styles2.color.ansi256 = wrapAnsi256();
  styles2.color.ansi16m = wrapAnsi16m();
  styles2.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles2.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles2.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles2, {
    rgbToAnsi256: {
      value: (red, green, blue) => {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value: (hex) => {
        const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let { colorString } = matches.groups;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles2.rgbToAnsi256(...styles2.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value: (code) => {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles2.ansi256ToAnsi(styles2.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles2.ansi256ToAnsi(styles2.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles2;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
var import_node_process3 = __toESM(require("node:process"), 1);
var import_node_os2 = __toESM(require("node:os"), 1);
var import_node_tty = __toESM(require("node:tty"), 1);
function hasFlag(flag, argv = import_node_process3.default.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = import_node_process3.default;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process3.default.platform === "win32") {
    const osRelease = import_node_os2.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app":
        return version >= 3 ? 3 : 2;
      case "Apple_Terminal":
        return 2;
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
  stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles[styleName] = {
    get() {
      const builder2 = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder2 });
      return builder2;
    }
  };
}
styles.visible = {
  get() {
    const builder2 = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder2 });
    return builder2;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self2, _styler, _isEmpty) => {
  const builder2 = (...arguments_) => applyStyle(builder2, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder2, proto);
  builder2[GENERATOR] = self2;
  builder2[STYLER] = _styler;
  builder2[IS_EMPTY] = _isEmpty;
  return builder2;
};
var applyStyle = (self2, string) => {
  if (self2.level <= 0 || !string) {
    return self2[IS_EMPTY] ? "" : string;
  }
  let styler = self2[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/commands/gas-report.ts
var import_table = __toESM(require_src());
var command = "gas-report";
var desc = "Create a gas report";
var builder = (yargs) => yargs.options({
  path: { type: "array", default: ["Gas.t.sol"], desc: "File containing the gas tests" },
  save: { type: "string", desc: "Save the gas report to a file" },
  compare: { type: "string", desc: "Compare to an existing gas report" }
});
var handler = async (args) => {
  const { path: path3, save } = args;
  let { compare } = args;
  let gasReport = [];
  for (const file of path3) {
    gasReport = gasReport.concat(await runGasReport(file));
  }
  const compareGasReport = [];
  if (compare) {
    try {
      const compareFileContents = (0, import_fs.readFileSync)(compare, "utf8");
      const compareGasReportRegex = new RegExp(/\((.*)\) \| (.*) \[(.*)\]: (.*)/g);
      let compareGasReportMatch;
      while ((compareGasReportMatch = compareGasReportRegex.exec(compareFileContents)) !== null) {
        const source = compareGasReportMatch[1];
        const name = compareGasReportMatch[2];
        const functionCall = compareGasReportMatch[3];
        const gasUsed = compareGasReportMatch[4];
        compareGasReport.push({ source, name, functionCall, gasUsed: parseInt(gasUsed) });
      }
    } catch {
      console.log(source_default.red(`Gas report to compare not found: ${compare}`));
      compare = void 0;
    }
  }
  gasReport = gasReport.map((entry) => {
    const prevEntry = compareGasReport.find((e) => e.name === entry.name && e.functionCall === entry.functionCall);
    return { ...entry, prevGasUsed: prevEntry?.gasUsed };
  });
  printGasReport(gasReport, compare);
  if (save)
    saveGasReport(gasReport, save);
  process.exit(0);
};
async function runGasReport(path3) {
  if (!path3.endsWith(".t.sol")) {
    console.log("Skipping gas report for", source_default.bold(path3), "(not a test file)");
    return [];
  }
  console.log("Running gas report for", source_default.bold(path3));
  const gasReport = [];
  const fileContents = (0, import_fs.readFileSync)(path3, "utf8");
  let newFile = fileContents;
  const functionRegex = new RegExp(/function (.*){/g);
  let functionMatch;
  while ((functionMatch = functionRegex.exec(fileContents)) !== null) {
    const functionSignature = functionMatch[0];
    newFile = newFile.replace(functionSignature, `${functionSignature}
uint256 _gasreport;`);
  }
  const regex = new RegExp(/\/\/ !gasreport (.*)\n(.*)/g);
  let match;
  let i = 0;
  while ((match = regex.exec(fileContents)) !== null) {
    const name = match[1];
    const functionCall = match[2].trim();
    newFile = newFile.replace(
      match[0],
      `
_gasreport = gasleft();
${functionCall}
_gasreport = _gasreport - gasleft();
console.log("GAS REPORT: ${name} [${functionCall.replaceAll('"', '\\"')}]:", _gasreport);`
    );
    i++;
  }
  newFile = newFile.replace(/pure/g, "view");
  const tempFileName = path3.replace(/\.t\.sol$/, "MudGasReport.t.sol");
  (0, import_fs.writeFileSync)(tempFileName, newFile);
  const child = execa("forge", ["test", "--match-path", tempFileName, "-vvv"], {
    stdio: ["inherit", "pipe", "inherit"]
  });
  let logs = "";
  try {
    logs = (await child).stdout;
    (0, import_fs.rmSync)(tempFileName);
  } catch (e) {
    console.log(e.stdout ?? e);
    console.log(source_default.red("\n-----------\nError while running the gas report (see above)"));
    (0, import_fs.rmSync)(tempFileName);
    process.exit();
  }
  const gasReportRegex = new RegExp(/GAS REPORT: (.*) \[(.*)\]: (.*)/g);
  let gasReportMatch;
  while ((gasReportMatch = gasReportRegex.exec(logs)) !== null) {
    const name = gasReportMatch[1];
    const functionCall = gasReportMatch[2].replace(";", "");
    const gasUsed = gasReportMatch[3];
    gasReport.push({ source: path3, name, functionCall, gasUsed: parseInt(gasUsed) });
  }
  return gasReport;
}
function printGasReport(gasReport, compare) {
  if (compare)
    console.log(source_default.bold(`Gas report compared to ${compare}`));
  const headers = [
    source_default.bold("Source"),
    source_default.bold("Name"),
    source_default.bold("Function call"),
    source_default.bold("Gas used"),
    ...compare ? [source_default.bold("Prev gas used"), source_default.bold("Difference")] : []
  ];
  const values = gasReport.map((entry) => {
    const diff = entry.prevGasUsed ? entry.gasUsed - entry.prevGasUsed : 0;
    const diffEntry = diff > 0 ? source_default.red(`+${diff}`) : diff < 0 ? source_default.green(`${diff}`) : diff;
    const compareColumns = compare ? [entry.prevGasUsed ?? "n/a", diffEntry] : [];
    const gasUsedEntry = diff > 0 ? source_default.red(entry.gasUsed) : diff < 0 ? source_default.green(entry.gasUsed) : entry.gasUsed;
    return [entry.source, entry.name, entry.functionCall, gasUsedEntry, ...compareColumns];
  });
  const rows = [headers, ...values];
  console.log((0, import_table.table)(rows, { border: (0, import_table.getBorderCharacters)("norc") }));
}
function saveGasReport(gasReport, path3) {
  console.log(source_default.bold(`Saving gas report to ${path3}`));
  const serializedGasReport = gasReport.map((entry) => `(${entry.source}) | ${entry.name} [${entry.functionCall}]: ${entry.gasUsed}`).join("\n");
  (0, import_fs.writeFileSync)(path3, serializedGasReport);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  builder,
  command,
  desc,
  handler
});
