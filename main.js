/*jslint nomen: true, regexp: true, vars: true*/
// vim:ai:ts=2:sw=2:sts=2:et

/*global define,brackets,console,DockerfileLexer,jQuery */
define(function (require, exports, module) {
  'use strict';

  //console.log('module:', module);
  require('./dockerlex');


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
        this.start = true;
        //this.lexer = new DockerfileLexer();  // from dockerlex
        /*
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
        */
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
    console.log('bashMode:', bashMode);

    self.tokenize = function (stream, state) {
      var i;

      console.log('------------------- new tokenize() ---------------------');

      if (state.start) {
        state.start = false;
        state.localMode = null;
        state.localState = null;

        state.setInput(stream);
      }
      state.bashMode = bashMode;

      stream.getPos = function () {
        return this.pos;
      };

      stream.more = function () {
        var rc = this.pos < this.string.length;
        return rc;
      };

      stream.updatePos = function (str, delta) {
        for (i = 0; i < str.length; i += 1) {
          if (str[i] === '\n') {
            this.col = 0;
            this.line += delta;
          } else {
            this.col += delta;
          }
        }
      };

      stream.rollback = function (str) {
        if (typeof str === 'string') {
          var istr = this.string.substring(this.pos - str.length, this.pos);
          if (istr === str) {
            this.pos -= str.length;
            this.updatePos(str, -1);
          } else {
            throw new Error('Expected "' + str + '", got "' + istr + '"!');
          }
        } else {
          this.pos -= str;
          this.updatePos(str, -1);
        }
      };

      if (stream.sol()) {
        console.log('sol');
        state.lastChar = '\n';
      }

      if (state.localMode) {
        var res = state.localMode.token(stream, state.localState);
        if (stream.eol()) {
          if (stream.current() !== '\\') {
            state.localState = state.localMode = null;
          }
        }
        return res;
      }

      console.log('lexer:', Object.create(state));
      console.log('lexer states:', state.state);
      console.log('stream b4 nextToken:', stream);
      state.input = stream;
      var token = state.nextToken();
      console.log('stream after nextToken:', stream);
      console.log('token:', token);

        /*
      //while (!stream.eol()) {
        console.log('stream before eat:', stream);
        stream.eatWhile(/./);
        console.log('stream after eat:', stream);
        console.log('eol:', stream.eol());
        var startPos = stream.start;
        //state.content += stream.current() + '\n';
        console.log('current:', stream.current());

        state.lexer.setInput(stream.current());

        var token = state.lexer.nextToken();
        console.log('token #1:', token);
        console.log('stream #1:', stream);

        //stream.pos = startPos + token.position;
        stream.backUp(3);
        //console.log('stream #1 after pos:', stream);
        //stream.start = 5;
        //stream.pos = 5;


        stream.eatWhile(/./);
        console.log('stream after eat #2:', stream);
        console.log('current #2:', stream.current());

        console.log('endPos:', endPos, 'token.position:', token.position);
        var bk = endPos - (endPos - token.position);
        console.log('backing up:', bk);
        stream.backUp(bk);
        console.log('stream after backUp:', stream);
        console.log('current:', stream.current());
        stream.eatWhile(/./);
        console.log('stream after 2nd eat:', stream);
        console.log('current:', stream.current());
        stream.pos = startPos + token.position;
        console.log('stream after new start:', stream);
        console.log('current:', stream.current());
        */
      //}

      return (token.name ? token.name.toLowerCase() : null);
    };

    /*
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
    */

    // Start it all
    return {
      startState: function () {
        var state = new DockerfileLexer();
        return state;
      },

      /*
      copyState: function (state) {
        console.log('in copyState() state:', state);
        var newState = jQuery.extend(new State(), state);
        //newState.lexer = jQuery.extend(new DockerfileLexer(), state.lexer);
        console.log('leaving copyState() newState:', newState);
        //if (state.lexer === newState.lexer) {
        //  console.error('error: lexer objects are the same');
        //}
        return newState;
      },
      */

      token: self.tokenize,
      blankLine: function (state) {
        console.log('blankLine');
        return self.tokenize(new CodeMirror.StringStream('\n'), state);
      }

    };

  });
  // Register with Brackets
  LanguageManager.defineLanguage("dockerfile", {
    name: "Dockerfile",
    mode: "dockerfile_plus",
    fileNames: ["Dockerfile", "Dockerfile.bak", "Dockerfile.1", "Dockerfile.2"],
    lineComment: ["#"]
  });

});
