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

    var bashMode = CodeMirror.getMode(config, {
      name: 'shell'
    });

    self.tokenize = function (stream, state) {
      var i;

      //console.log('------------------- new tokenize() ---------------------');

      if (state.start) {
        state.start = false;
        state.localMode = null;
        state.localState = null;
        state.stringAs = null;
        state.quote = null;

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

      //console.log('lexer:', Object.create(state));
      //console.log('lexer states:', state.state);
      //console.log('stream b4 nextToken:', stream);
      state.input = stream;
      var token = state.nextToken();
      //console.log('stream after nextToken:', stream, 'stringAs:', state.stringAs);

      if (token.name === 'STRING' && state.stringAs) {
        token.name = state.stringAs;
      }
      //console.log('token:', token);

      return (token.name ? token.name.toLowerCase() : null);
    };


    // Start it all
    return {
      startState: function () {
        var state = new DockerfileLexer();
        state.start = true;
        return state;
      },

      copyState: function (state) {
        var newState = CodeMirror.copyState((state.localMode || CodeMirror.getMode()), state);
        newState.stringAs = state.stringAs;
        newState.quote = state.quote;
        //console.log('in copyState() newState:', newState);
        return newState;
      },

      token: self.tokenize,
      blankLine: function (state) {
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
