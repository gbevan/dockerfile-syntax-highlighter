/*jslint regexp: true, vars: true*/
// vim:ai:ts=2:sw=2:sts=2:et

/*global define,brackets,console */
define(function (require, exports, module) {
  'use strict';

  // For integration with Brackets' LanguageManager
  var LanguageManager = brackets.getModule("language/LanguageManager");
  var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");

  CodeMirror.defineMode("dockerfile_plus", function (config, parserConfig) {

    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    ExtensionUtils.loadStyleSheet(module, "styles/styles.css");

    var self = {};

    // Initial State Class
    var State = function (state) {
      if (!state) {
        this.inDirective = false;
        this.inEnv = false;
        this.inLabel = false;
        this.inAssignment = false;

        this.inString = false;
        this.startString = true;
        this.quote = '';
        this.upto = '';

        this.localMode = null;
        this.localState = null;

        this.currentDirective = '';

      } else {
        var i;
        for (i in state) {
          if (state.hasOwnProperty(i)) {
            this[i] = state[i];
          }
        }
      }
      this.previous = false;
    };
    State.prototype = {
      // push current state on stack and create new state (dupl of current)
      push: function () {
        var newState = new State(this);
        this.previous = newState;
        return newState;
      },
      // pop previous state of the stack
      pop: function () {
        return this.previous;
      }
    };

    var bashMode = CodeMirror.getMode(config, {
      name: 'shell'
    });

    self.endString = function (state) {
      state.inString = false;
      state.startString = true;
      state.quote = '';
    };

    self.testEatString = function (stream, state) {
      console.log('in testEatString(), inString:', state.inString, 'quote:', state.quote, 'current:', stream.current(), 'peek:', stream.peek());

      var retstyle = 'string';

      if (state.startString) {
        state.startString = false;
        if (stream.peek().match(/['"]/)) {
          state.inString = true;
          state.quote = stream.next();
          console.log('start string, quote:', state.quote);
          return 'quote';
        }
      }

      if (state.quote !== '') {
        var re = new RegExp('[^' + state.quote + ']');
        if (stream.eatWhile(re)) {
          console.log('eaten non quote');
          if (stream.eol()) {
            if (stream.current().slice(-1) === '\\') {
              stream.next();
            }
          }
          return retstyle;
        }

        var re_q = new RegExp('[' + state.quote + ']');
        var m_q = stream.match(re_q, false);
        console.log('m_q:', m_q);
        if (stream.match(re_q, false)) {
          console.log('eos');
          stream.next();
          state.inString = false;
          state.startString = true;
          state.quote = '';
          return 'quote';
        }

      } else {
        console.log('unquoted string:', stream.current());
        if (stream.eatWhile(/\S+/)) {
          console.log('eaten non quote');
          if (stream.eol()) {
            if (stream.current().slice(-1) === '\\') {
              stream.next();
            }
          }
          return retstyle;
        }

        console.log('eos');
        state.inString = false;
        state.startString = true;
        return 'quote';
      }


    };

    self.tokenize = function (stream, state) {
      var ch,
        inQuote;

      if (state.localMode) {
        var res = state.localMode.token(stream, state.localState);
        if (stream.eol()) {
          if (stream.current() !== '\\') {
            state.localState = state.localMode = null;
          }
        }
        return res;
      }

      if (state.inString) {
        var strret2 = self.testEatString(stream, state);
        console.log('strret2:', strret2, 'eol:', stream.eol());
        if (strret2 === 'quote') {  // end quote
          if (state.inDirective) {
            state.inDirective = false;
          }
        }
        if (state.quote === '' && stream.eol()) {
          console.log('strret2 eol, inEnv:', state.inEnv);
          if (state.inEnv) {
            state.inEnv = false;
            self.endString(state);
          }
          if (state.inLabel) {
            state.inLabel = false;
            self.endString(state);
          }
        }
        return strret2;
      }

      if (state.inDirective) {
        if (!state.currentDirective.toUpperCase().match(/(ENTRYPOINT|MAINTAINER|VOLUME)/)) {
          if (stream.peek().match(/['"]/)) {
            var strret = self.testEatString(stream, state);
            console.log('strret:', strret, 'eol:', stream.eol(), 'current:', stream.current(), 'state:', state);
            if (strret) {
              if (strret === 'quote' || (stream.eol() && state.quote === '')) {  // end quote
                if (state.inDirective) {
                  state.inDirective = false;
                }
              }
              return strret;
            }
          }
        }

        if (stream.match(/(#)(\s*|$)/, false)) {
          stream.skipToEnd();
          state.inDirective = false;
          return 'comment';
        }

        // eat lines, allowed escaped eols
        ch = stream.next();
        if (stream.eol()) {
          if (ch !== '\\') {
            state.inDirective = false;
          }
        }
        switch (state.currentDirective.toUpperCase()) {
        case 'FROM':
          return 'from';
        case 'MAINTAINER':
          return 'maintainer';
        case 'EXPOSE':
          return 'expose';
        default:
          return 'string';
        }
      }

      if (state.inAssignment) {
        console.log('inAssignment');
        console.log('eol1:', stream.eol());
        stream.eatSpace();
        console.log('eol2:', stream.eol());
        stream.eat(/[=]/);
        console.log('eol3:', stream.eol());
        stream.eatSpace();
        console.log('eol4:', stream.eol());
        state.inAssignment = false;
        //state.inDirective = true;
        state.inString = true;
        console.log('state:', state);
        return null;
      }

      if (state.inEnv) {
        console.log('inEnv eol:', stream.eol(), 'peek: >' + stream.peek() + '<');
        if (!stream.match(/\s+/)) {
          stream.skipToEnd();
          state.inEnv = false;
          return 'error';
        }
        if (stream.match(/(#)(\s*|$)/, false)) {
          stream.skipToEnd();
          state.inEnv = false;
          return 'comment';
        }
        stream.eatWhile(/\w/);
        state.inAssignment = true;
        return 'def';
      }

      if (state.inLabel) {
        console.log('inLabel eol:', stream.eol(), 'peek: >' + stream.peek() + '<');
        if (!stream.match(/\s+/)) {
          stream.skipToEnd();
          state.inLabel = false;
          return 'error';
        }
        if (stream.match(/(#)(\s*|$)/, false)) {
          stream.skipToEnd();
          state.inLabel = false;
          return 'comment';
        }
        if (stream.peek() !== '"') {
          stream.eatWhile(/[\w\.\-]/);
        } else {
          state.inString = true;
        }
        state.inAssignment = true;
        return 'def';
      }

      // Comments
      if (stream.match(/(#)(\s*|$)/, false)) {
        stream.skipToEnd();
        return 'comment';
      }


      if (stream.sol()) {
        var dirMatch = stream.match(/^\s*(FROM|MAINTAINER|ENV|ADD|ENTRYPOINT|EXPOSE|RUN|CMD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ONBUILD|LABEL)/i);
        if (dirMatch) {
          state.currentDirective = dirMatch[1];
          if (!dirMatch[1].match(/(ENV|LABEL)/) && stream.peek() === ' ') {
            stream.eatSpace();
          }
          if (!stream.eol()) {
            if (dirMatch[1].match(/RUN|CMD/i)) {
              state.localMode = bashMode;
              state.localState = bashMode.startState();

            } else if (dirMatch[1].match(/ENV/i)) {
              state.inEnv = true;

            } else if (dirMatch[1].match(/LABEL/i)) {
              state.inLabel = true;

            } else {
              state.inDirective = true;
            }
          }
          return 'dockdir';
        }
      }

      // eat the rest - treat as unparsed errors
      stream.eat(/./);
      return 'error';
    };

    // Start it all
    return {
      startState: function () {
        var state = new State();

        return state;
      },

      token: function (stream, state) {
        console.log('----------- Tokenize ------------');
        console.log('BEFORE> stream:', stream);
        console.log('BEFORE> state:', state);
        var tok = self.tokenize(stream, state);
        console.log('AFTER> stream:', stream);
        console.log('AFTER> state:', state);
        console.log('AFTER> tok:', tok);
        return tok;
      }

    };

  });
  // Register with Brackets
  LanguageManager.defineLanguage("dockerfile", {
    name: "Dockerfile",
    mode: "dockerfile_plus",
    fileNames: ["Dockerfile", "Dockerfile.bak", "Dockerfile.1"],
    lineComment: ["#"]
  });

});
