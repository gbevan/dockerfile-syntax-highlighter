var DockerfileLexer = (function (undefined) {
function CDFA_base(){
	this.ss=undefined;
	this.as=undefined;
	this.tt=undefined;
this.stt={};
}
CDFA_base.prototype.reset = function (state) {
	this.cs = state || 	this.ss;
this.bol=false;
};
CDFA_base.prototype.readSymbol = function (c) {
	this.cs = this.nextState(this.cs, c);
};
CDFA_base.prototype.isAccepting = function () {
	var acc = this.as.indexOf(this.cs)>=0;
if((this.stt[this.cs]===-1)&&!this.bol){
acc=false;}
return acc;};
CDFA_base.prototype.isInDeadState = function () {
	return this.cs === undefined || this.cs === 0;
};
CDFA_base.prototype.getCurrentToken = function(){
	var t= this.tt[this.cs];
var s=this.stt[this.cs];
if(s!==undefined){return this.bol?t:s;}
return t;};

function CDFA_DEFAULT(){
	this.ss=1;
	this.as=[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,47];
	this.tt=[null,null,14,13,0,13,2,1,14,14,14,14,14,14,14,14,14,14,14,1,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,7];
this.stt={"4":13};
}
CDFA_DEFAULT.prototype= new CDFA_base();
CDFA_DEFAULT.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if((c < "\t" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < " " || " " < c)  && (c < "\"" || "#" < c)  && (c < "A" || "A" < c)  && (c < "C" || "C" < c)  && (c < "E" || "F" < c)  && (c < "L" || "M" < c)  && (c < "O" || "O" < c)  && (c < "R" || "R" < c)  && (c < "U" || "W" < c)  && (c < " " || " " < c) ){
next = 2;
} else if(("\t" === c ) || (" " === c ) || (" " === c )){
next = 3;
} else if(("\n" === c )){
next = 4;
} else if(("\r" === c )){
next = 3;
} else if(("\"" === c )){
next = 6;
} else if(("#" === c )){
next = 7;
} else if(("A" === c )){
next = 8;
} else if(("C" === c )){
next = 9;
} else if(("E" === c )){
next = 10;
} else if(("F" === c )){
next = 11;
} else if(("L" === c )){
next = 12;
} else if(("M" === c )){
next = 13;
} else if(("O" === c )){
next = 14;
} else if(("R" === c )){
next = 15;
} else if(("U" === c )){
next = 16;
} else if(("V" === c )){
next = 17;
} else if(("W" === c )){
next = 18;
}
break;
case 3:
if(("\t" === c ) || ("\r" === c ) || (" " === c ) || (" " === c )){
next = 3;
} else if(("\n" === c )){
next = 4;
}
break;
case 4:
if(("\t" === c ) || ("\r" === c ) || (" " === c ) || (" " === c )){
next = 3;
} else if(("\n" === c )){
next = 4;
}
break;
case 7:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c) ){
next = 7;
}
break;
case 8:
if(("D" === c )){
next = 20;
}
break;
case 9:
if(("M" === c )){
next = 20;
} else if(("O" === c )){
next = 22;
}
break;
case 10:
if(("N" === c )){
next = 23;
} else if(("X" === c )){
next = 24;
}
break;
case 11:
if(("R" === c )){
next = 25;
}
break;
case 12:
if(("A" === c )){
next = 26;
}
break;
case 13:
if(("A" === c )){
next = 27;
}
break;
case 14:
if(("N" === c )){
next = 28;
}
break;
case 15:
if(("U" === c )){
next = 29;
}
break;
case 16:
if(("S" === c )){
next = 30;
}
break;
case 17:
if(("O" === c )){
next = 31;
}
break;
case 18:
if(("O" === c )){
next = 32;
}
break;
case 20:
if(("D" === c )){
next = 33;
}
break;
case 22:
if(("P" === c )){
next = 35;
}
break;
case 23:
if(("T" === c )){
next = 36;
} else if(("V" === c )){
next = 33;
}
break;
case 24:
if(("P" === c )){
next = 38;
}
break;
case 25:
if(("O" === c )){
next = 39;
}
break;
case 26:
if(("B" === c )){
next = 40;
}
break;
case 27:
if(("I" === c )){
next = 41;
}
break;
case 28:
if(("B" === c )){
next = 42;
}
break;
case 29:
if(("N" === c )){
next = 33;
}
break;
case 30:
if(("E" === c )){
next = 44;
}
break;
case 31:
if(("L" === c )){
next = 45;
}
break;
case 32:
if(("R" === c )){
next = 46;
}
break;
case 33:
if(("\t" <= c && c <= "\n")  || ("\r" === c ) || (" " === c ) || (" " === c )){
next = 47;
}
break;
case 35:
if(("Y" === c )){
next = 33;
}
break;
case 36:
if(("R" === c )){
next = 49;
}
break;
case 38:
if(("O" === c )){
next = 50;
}
break;
case 39:
if(("M" === c )){
next = 33;
}
break;
case 40:
if(("E" === c )){
next = 52;
}
break;
case 41:
if(("N" === c )){
next = 53;
}
break;
case 42:
if(("U" === c )){
next = 54;
}
break;
case 44:
if(("R" === c )){
next = 33;
}
break;
case 45:
if(("U" === c )){
next = 56;
}
break;
case 46:
if(("K" === c )){
next = 57;
}
break;
case 47:
if(("\t" <= c && c <= "\n")  || ("\r" === c ) || (" " === c ) || (" " === c )){
next = 47;
}
break;
case 49:
if(("Y" === c )){
next = 58;
}
break;
case 50:
if(("S" === c )){
next = 59;
}
break;
case 52:
if(("L" === c )){
next = 33;
}
break;
case 53:
if(("T" === c )){
next = 61;
}
break;
case 54:
if(("I" === c )){
next = 62;
}
break;
case 56:
if(("M" === c )){
next = 59;
}
break;
case 57:
if(("D" === c )){
next = 64;
}
break;
case 58:
if(("P" === c )){
next = 65;
}
break;
case 59:
if(("E" === c )){
next = 33;
}
break;
case 61:
if(("A" === c )){
next = 67;
}
break;
case 62:
if(("L" === c )){
next = 20;
}
break;
case 64:
if(("I" === c )){
next = 44;
}
break;
case 65:
if(("O" === c )){
next = 71;
}
break;
case 67:
if(("I" === c )){
next = 72;
}
break;
case 71:
if(("I" === c )){
next = 75;
}
break;
case 72:
if(("N" === c )){
next = 30;
}
break;
case 75:
if(("N" === c )){
next = 77;
}
break;
case 77:
if(("T" === c )){
next = 33;
}
break;
	}
	return next;
};

function CDFA_QUOTEDSTRING(){
	this.ss=1;
	this.as=[2,3,4,5];
	this.tt=[null,null,4,4,4,3];
this.stt={};
}
CDFA_QUOTEDSTRING.prototype= new CDFA_base();
CDFA_QUOTEDSTRING.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < "\"" || "\"" < c) ){
next = 2;
} else if(("\n" === c )){
next = 2;
} else if(("\r" === c )){
next = 2;
} else if(("\"" === c )){
next = 5;
}
break;
	}
	return next;
};

function CDFA_UNQUOTEDSTRING(){
	this.ss=1;
	this.as=[2,3,4];
	this.tt=[null,null,6,6,5];
this.stt={};
}
CDFA_UNQUOTEDSTRING.prototype= new CDFA_base();
CDFA_UNQUOTEDSTRING.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < "\\" || "\\" < c) ){
next = 2;
} else if(("\n" === c ) || ("\r" === c )){
next = 3;
} else if(("\\" === c )){
next = 4;
}
break;
case 2:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < "\\" || "\\" < c) ){
next = 2;
} else if(("\n" === c ) || ("\r" === c )){
next = 3;
} else if(("\\" === c )){
next = 4;
}
break;
case 3:
if((c < "\\" || "\\" < c) ){
next = 3;
}
break;
case 4:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < "\\" || "\\" < c) ){
next = 5;
} else if(("\\" === c )){
next = 4;
}
break;
case 5:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < "\\" || "\\" < c) ){
next = 5;
} else if(("\\" === c )){
next = 4;
}
break;
	}
	return next;
};

function CDFA__LA_7(){
	this.ss=1;
	this.as=[2,3,4,5,6];
	this.tt=[null,null,9,8,8,8,8];
this.stt={};
}
CDFA__LA_7.prototype= new CDFA_base();
CDFA__LA_7.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if((c < "\t" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < " " || " " < c)  && (c < " " || " " < c) ){
next = 2;
} else if(("\t" === c ) || (" " === c ) || (" " === c )){
next = 3;
} else if(("\n" === c )){
next = 3;
} else if(("\r" === c )){
next = 3;
}
break;
case 3:
if(("\t" <= c && c <= "\n")  || ("\r" === c ) || (" " === c ) || (" " === c )){
next = 3;
}
break;
	}
	return next;
};

function CDFA_DOCKDIR(){
	this.ss=1;
	this.as=[2,3,4];
	this.tt=[null,null,11,10,10];
this.stt={};
}
CDFA_DOCKDIR.prototype= new CDFA_base();
CDFA_DOCKDIR.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if((c < "\t" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < " " || " " < c)  && (c < " " || " " < c) ){
next = 2;
} else if(("\t" === c ) || (" " === c ) || (" " === c )){
next = 3;
} else if(("\n" === c ) || ("\r" === c )){
next = 3;
}
break;
case 3:
if(("\t" <= c && c <= "\n")  || ("\r" === c ) || (" " === c ) || (" " === c )){
next = 3;
}
break;
	}
	return next;
};

function CDFA_ENV(){
	this.ss=1;
	this.as=[5,6];
	this.tt=[null,null,null,null,null,12,12];
this.stt={};
}
CDFA_ENV.prototype= new CDFA_base();
CDFA_ENV.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if(("\t" <= c && c <= "\n")  || ("\r" === c ) || (" " === c ) || (" " === c )){
next = 2;
}
break;
case 2:
if((c < "\t" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < " " || " " < c)  && (c < " " || " " < c) ){
next = 3;
} else if(("\t" === c ) || (" " === c ) || (" " === c )){
next = 4;
} else if(("\n" === c ) || ("\r" === c )){
next = 2;
}
break;
case 3:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c) ){
next = 3;
} else if(("\n" === c )){
next = 5;
}
break;
case 4:
if((c < "\t" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < " " || " " < c)  && (c < " " || " " < c) ){
next = 3;
} else if(("\t" === c ) || (" " === c ) || (" " === c )){
next = 4;
} else if(("\n" === c )){
next = 6;
} else if(("\r" === c )){
next = 2;
}
break;
case 6:
if((c < "\t" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < " " || " " < c)  && (c < " " || " " < c) ){
next = 3;
} else if(("\t" === c ) || (" " === c ) || (" " === c )){
next = 4;
} else if(("\n" === c ) || ("\r" === c )){
next = 2;
}
break;
	}
	return next;
};

var EOF={};
function Lexer(){

if(!(this instanceof Lexer)) return new Lexer();

this.pos={line:0,col:0};

this.states={};
this.state = ['DEFAULT'];
this.lastChar = '\n';
this.actions = [function anonymous() {

},function anonymous() {

  console.log('comment');
  return 'COMMENT';

},function anonymous() {
 this.pushState('QUOTEDSTRING');
},function anonymous() {
 this.popState(); return 'QUOTEDSTRING';
},,function anonymous() {

  console.log('UNQUOTEDSTRING #2');
  return 'STRING';

},function anonymous() {

  console.log('UNQUOTEDSTRING #1, state:', this.state);
  this.popState();
  return 'STRING';

},function anonymous() {
this.pushState('_LA_7');
this.lawhole=this.jjtext;
},function anonymous() {
this.restoreLookAhead();
return (function anonymous() {

  var d = this.jjtext.match(/(\w+)/)[1];
  this.jjval = d;
  if (!d.match(/(ENV)/)) {
    d = 'DOCKDIR';
  }
  console.log('DEBUG: d:', d, 'state:', this.state);
  this.pushState(d);
  return d;

}).apply(this);
},function anonymous() {
this.less(2);

},function anonymous() {

  this.jjval = this.jjtext.trim();
  this.popState();
  console.log('pushing UNQUOTEDSTRING');
  this.pushState('UNQUOTEDSTRING');
  //return 'STRING';
  return null;

},function anonymous() {

  console.error('DOCKDIR error');
  return 'ERROR';

},function anonymous() {

  this.jjval = this.jjtext.trim();
  this.popState();
  return 'STRING';

},function anonymous() {

  console.log('caught remaining whitespace');

},function anonymous() {

  console.error('caught error');
  return 'ERROR';

}];
this.states["DEFAULT"] = {};
this.states["DEFAULT"].dfa = new CDFA_DEFAULT();
this.states["QUOTEDSTRING"] = {};
this.states["QUOTEDSTRING"].dfa = new CDFA_QUOTEDSTRING();
this.states["UNQUOTEDSTRING"] = {};
this.states["UNQUOTEDSTRING"].dfa = new CDFA_UNQUOTEDSTRING();
this.states["_LA_7"] = {};
this.states["_LA_7"].dfa = new CDFA__LA_7();
this.states["DOCKDIR"] = {};
this.states["DOCKDIR"].dfa = new CDFA_DOCKDIR();
this.states["ENV"] = {};
this.states["ENV"].dfa = new CDFA_ENV();
}
Lexer.prototype.setInput=function (input){
        this.pos={row:0, col:0};
        if(typeof input === 'string')
        {input = new StringReader(input);}
        this.input = input;
        this.state = ['DEFAULT'];
        this.lastChar='\n';
        this.getDFA().reset();
        return this;
    };
Lexer.prototype.nextToken=function () {


        var ret = undefined;
        while(ret === undefined){
            this.resetToken();
            ret = this.more();
        }


        if (ret === EOF) {
            this.current = EOF;
        } else {
            this.current = {};
            this.current.name = ret;
            this.current.value = this.jjval;
            this.current.lexeme = this.jjtext;
            this.current.position = this.jjpos;
            this.current.pos = {col: this.jjcol, line: this.jjline};
        }
        return this.current;
    };
Lexer.prototype.resetToken=function (){
        this.getDFA().reset();
        this.getDFA().bol = (this.lastChar === '\n');
        this.lastValid = undefined;
        this.lastValidPos = -1;
        this.jjtext = '';
        this.remains = '';
        this.buffer = '';
        this.startpos = this.input.getPos();
        this.jjline = this.input.line;
        this.jjcol = this.input.col;
    };
Lexer.prototype.halt=function () {
        if (this.lastValidPos >= 0) {
            var lastValidLength = this.lastValidPos-this.startpos+1;
            this.jjtext = this.buffer.substring(0, lastValidLength);
            this.remains = this.buffer.substring(lastValidLength);
            this.jjval = this.jjtext;
            this.jjpos = this.lastValidPos + 1-this.jjtext.length;
            this.input.rollback(this.remains);
            var action = this.getAction(this.lastValid);
            if (typeof ( action) === 'function') {
                return action.call(this);
            }
            this.resetToken();
        }
        else if(!this.input.more()){//EOF
            var actionid = this.states[this.getState()].eofaction;
            if(actionid){
                action = this.getAction(actionid);
                if (typeof ( action) === 'function') {
                    //Note we don't care of returned token, must return 'EOF'
                    action.call(this);
                }
            }
            return EOF;
        } else {//Unexpected character
            throw new Error('Unexpected char \''+this.input.peek()+'\' at '+this.jjline +':'+this.jjcol);
        }
    };
Lexer.prototype.more=function (){
        var ret;
        while (this.input.more()) {
            var c = this.input.peek();
            this.getDFA().readSymbol(c);
            if (this.getDFA().isInDeadState()) {

                ret = this.halt();
                return ret;

            } else {
                if (this.getDFA().isAccepting()) {
                    this.lastValid = this.getDFA().getCurrentToken();
                    this.lastValidPos = this.input.getPos();

                }
                this.buffer = this.buffer + c;
                this.lastChar = c;
                this.input.next();
            }

        }
        ret = this.halt();
        return ret;
    };
Lexer.prototype.less=function (length){
        this.input.rollback(length);
    };
Lexer.prototype.getDFA=function (){
        return this.states[this.getState()].dfa;
    };
Lexer.prototype.getAction=function (i){
        return this.actions[i];
    };
Lexer.prototype.pushState=function (state){
        this.state.push(state);
        this.getDFA().reset();
    };
Lexer.prototype.popState=function (){
        if(this.state.length>1) {
            this.state.pop();
            this.getDFA().reset();
        }
    };
Lexer.prototype.getState=function (){
        return this.state[this.state.length-1];
    };
Lexer.prototype.restoreLookAhead=function (){
        this.tailLength = this.jjtext.length;
        this.popState();
        this.less(this.tailLength);
        this.jjtext = this.lawhole.substring(0,this.lawhole.length-this.tailLength);


    };
Lexer.prototype.evictTail=function (length){
        this.less(length);
        this.jjtext = this.jjtext.substring(0,this.jjtext.length-length);
    };
Lexer.prototype.isEOF=function (o){
        return o===EOF;
    }
;
function StringReader(str){
        if(!(this instanceof StringReader)) return new StringReader(str);
		this.str = str;
		this.pos = 0;
        this.line = 0;
        this.col = 0;
	}
StringReader.prototype.getPos=function (){
        return this.pos;
    };
StringReader.prototype.peek=function ()
	{
		//TODO: handle EOF
		return this.str.charAt(this.pos);
	};
StringReader.prototype.eat=function (str)
	{
		var istr = this.str.substring(this.pos,this.pos+str.length);
		if(istr===str){
			this.pos+=str.length;
            this.updatePos(str,1);
		} else {
			throw new Error('Expected "'+str+'", got "'+istr+'"!');
		}
	};
StringReader.prototype.updatePos=function (str,delta){
        for(var i=0;i<str.length;i++){
            if(str[i]=='\n'){
                this.col=0;
                this.line+=delta;
            }else{
                this.col+=delta;
            }
        }
    };
StringReader.prototype.rollback=function (str)
    {
        if(typeof str === 'string')
        {
            var istr = this.str.substring(this.pos-str.length,this.pos);
            if(istr===str){
                this.pos-=str.length;
                this.updatePos(str,-1);
            } else {
                throw new Error('Expected "'+str+'", got "'+istr+'"!');
            }
        } else {
            this.pos-=str;
            this.updatePos(str,-1);
        }

    };
StringReader.prototype.next=function ()
	{
		var s = this.str.charAt(this.pos);
		this.pos=this.pos+1;
		this.updatePos(s,1);
		return s;
	};
StringReader.prototype.more=function ()
	{
		return this.pos<this.str.length;
	};
StringReader.prototype.reset=function (){
        this.pos=0;
    };
if (typeof(module) !== 'undefined') { module.exports = Lexer; }
return Lexer;})();
