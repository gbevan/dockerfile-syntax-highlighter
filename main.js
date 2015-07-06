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

    var bashMode = CodeMirror.getMode(config, {
      name: 'shell'
    });

    self.tokenize = function (stream, state) {
      var ch;

      if (state.localMode) {
        var res = state.localMode.token(stream, state.localState);
        if (stream.eol()) {
          if (stream.current() !== '\\') {
            state.localState = state.localMode = null;
          }
        }
        return res;
      }

      if (state.inAssignment) {
        stream.eatSpace();
        stream.eat(/[=]/);
        stream.eatSpace();
        state.inAssignment = false;
        state.inDirective = true;
        return null;
      }

      if (state.inEnv) {
        stream.eatWhile(/\w/);
        state.inEnv = false;
        state.inAssignment = true;
        return 'def';
      }

      if (state.inDirective) {
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

      } else {
        // Comments
        if (stream.match(/(#)(\s*|$)/, false)) {
          stream.skipToEnd();
          return 'comment';
        }


        if (stream.sol()) {
          var dirMatch = stream.match(/^\s*(FROM|MAINTAINER|ENV|ADD|ENTRYPOINT|EXPOSE|RUN|CMD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ONBUILD)/i);
          if (dirMatch) {
            state.currentDirective = dirMatch[1];
            if (stream.peek() === ' ') {
              stream.eatSpace();
            }
            if (!stream.eol()) {
              if (dirMatch[1].match(/RUN|CMD/i)) {
                state.localMode = bashMode;
                state.localState = bashMode.startState();

              } else if (dirMatch[1].match(/ENV/i)) {
                state.inEnv = true;

              } else {
                state.inDirective = true;
              }
            }
            return 'dockdir';
          }
        }

      }


      // eat the rest
      stream.eat(/./);
      return null;
    };

    // Start it all
    return {
      startState: function () {
        var state = {};

        state.inDirective = false;
        state.inEnv = false;
        state.inAssignment = false;
        state.localMode = null;
        state.localState = null;

        state.currentDirective = '';

        return state;
      },

      token: self.tokenize

    };

  });
  // Register with Brackets
  LanguageManager.defineLanguage("dockerfile", {
    name: "Dockerfile",
    mode: "dockerfile_plus",
    fileNames: ["Dockerfile"],
    lineComment: ["#"]
  });

});
