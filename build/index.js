!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var o in n)("object"==typeof exports?exports:t)[o]=n[o]}}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return t[o].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!t)throw new Error("uri is required.");e=e||{};var n=(0,u.default)(t),o=n.source,r=n.id,i=n.path,c=a[r]&&i in a[r].nsps,p=e.forceNew||e["force new connection"]||!1===e.multiplex||c,f=void 0;return p?f=(0,s.default)(o,e):(a[r]||(a[r]=(0,s.default)(o,e)),f=a[r]),f.socket(n.path)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=r;var i=n(2),s=o(i),c=n(50),u=o(c),a={}},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){return this instanceof r?(e.path=e.path||"socket.io",this.nsps={},this.subs=[],this.opts=e,this.uri=t,this.readyState="closed",this.connected=!1,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new p.default({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.encoder=b.encoder,this.decoder=b.decoder,this.connecting=[],this.autoConnect=e.autoConnect!==!1,void(this.autoConnect&&this.open())):new r(t,e)}Object.defineProperty(e,"__esModule",{value:!0});var i=n(3),s=o(i),c=n(4),u=o(c),a=n(5),p=o(a),f=n(6),h=o(f),l=n(7),d=o(l),y=n(8),v=o(y),b=n(46),m=n(49),g=o(m),_=Object.prototype.hasOwnProperty;(0,s.default)(r.prototype),e.default=r,r.prototype.open=r.prototype.connect=function(t){var e=this;if(~this.readyState.indexOf("open"))return this;this.engine=new v.default(this.uri,this.opts),this.readyState="opening";var n=this.engine;return this.subs.push((0,d.default)(n,"open",function(){e.onopen(),t&&t()})),this.subs.push((0,d.default)(n,"error",function(n){if(e.cleanup(),e.readyState="closed",e.emitAll("connect_error",n),t){var o=new Error("Connect error");o.data=n,t(o)}else e.maybeReconnectOnOpen()})),n.connect(),this},r.prototype.onopen=function(){this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push((0,d.default)(t,"data",(0,u.default)(this,"ondata"))),this.subs.push((0,d.default)(t,"ping",(0,u.default)(this,"onping"))),this.subs.push((0,d.default)(t,"pong",(0,u.default)(this,"onpong"))),this.subs.push((0,d.default)(t,"error",(0,u.default)(this,"onerror"))),this.subs.push((0,d.default)(t,"close",(0,u.default)(this,"onclose")))},r.prototype.onclose=function(t){this.cleanup(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},r.prototype.onerror=function(t){this.emitAll("error")},r.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},r.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},r.prototype.ondata=function(t){var e=this;this.decoder(t,function(t){e.emit("packet",t)})},r.prototype.packet=function(t){var e=this;this.encoder(t,function(n){for(var o=0;o<n.length;o++)e.engine.write(n[o],t.options)})},r.prototype.socket=function(t){var e=this.nsps[t];return e||(e=new g.default(this,t),this.nsps[t]=e),e},r.prototype.cleanup=function(){for(var t=void 0;t=this.subs.shift();)t.destroy();this.packetBuffer=[],this.lastPing=null},r.prototype.emitAll=function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];this.emit.apply(this,e);for(var o in this.nsps)_.call(this.nsps,o)&&this.nsps[o].emit.apply(this.nsps[o],e)},r.prototype.reconnect=function(){var t=this;return this.reconnecting||this.skipReconnect?this:void(this.backoff.attempts>=this._reconnectionAttempts?(this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1):!function(){var e=t.backoff.duration();t.reconnecting=!0;var n=setTimeout(function(){t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):t.onreconnect()})},e);t.subs.push({destroy:function(){clearTimeout(n)}})}())},r.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)},r.prototype.updateSocketIds=function(){for(var t in this.nsps)_.call(this.nsps,t)&&(this.nsps[t].id=this.engine.id)},r.prototype.destroy=function(t){var e=(0,h.default)(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},r.prototype.close=r.prototype.disconnect=function(){this.skipReconnect=!0,this.reconnecting=!1,"opening"==this.readyState&&this.cleanup(),this.readyState="closed",this.engine&&this.engine.destroy()},r.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},r.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},r.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},r.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},r.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},r.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},r.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()}},function(t,e,n){function o(t){if(t)return r(t)}function r(t){for(var e in o.prototype)t[e]=o.prototype[e];return t}t.exports=o,o.prototype.on=o.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},o.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},o.prototype.off=o.prototype.removeListener=o.prototype.removeAllListeners=o.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var o,r=0;r<n.length;r++)if(o=n[r],o===e||o.fn===e){n.splice(r,1);break}return this},o.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks["$"+t];if(n){n=n.slice(0);for(var o=0,r=n.length;o<r;++o)n[o].apply(this,e)}return this},o.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},o.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e){var n=[].slice;t.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var o=n.call(arguments,2);return function(){return e.apply(t,o.concat(n.call(arguments)))}}},function(t,e){function n(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=n,n.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-n:t+n}return 0|Math.min(t,this.max)},n.prototype.reset=function(){this.attempts=0},n.prototype.setMin=function(t){this.ms=t},n.prototype.setMax=function(t){this.max=t},n.prototype.setJitter=function(t){this.jitter=t}},function(t,e){var n=[].indexOf;t.exports=function(t,e){if(n)return t.indexOf(e);for(var o=0;o<t.length;++o)if(t[o]===e)return o;return-1}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e,n){return t.on(e,n),{destroy:function(){t.removeListener(e,n)}}}},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){return this instanceof r?(this.subs=[],t=(0,b.default)(t),this.protocol=t.protocol,this.host=t.host,this.query=t.query,this.port=t.port,this.opts=this.opts||{},this.path=e.path.replace(/\/$/,""),this.connected=!1,this.lastPing=null,this.pingInterval=2e4,void this.bindEvents()):new r(t,e)}function i(t){var e=t.charAt(0);return t.length>1?{type:_[e],data:t.substring(1)}:{type:_[e]}}Object.defineProperty(e,"__esModule",{value:!0});var s=n(9),c=o(s),u=n(3),a=o(u),p=n(7),f=o(p),h=n(44),l=o(h),d=n(4),y=o(d),v=n(45),b=o(v);e.default=r;var m=(0,a.default)({hasEmitte:!1});(0,a.default)(r.prototype);var g={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},_=(0,c.default)(g);r.prototype.connect=function(){m.hasEmitte||r.subEvents();var t=this.protocol+"://"+this.host+":"+this.port+"/"+this.path+"/?"+(this.query?this.query+"&":"")+"EIO=3&transport=websocket";wx.connectSocket({url:t})},r.prototype.onopen=function(){this.emit("open")},r.prototype.onclose=function(t){this.destroy(),this.emit("close",t)},r.prototype.onerror=function(t){this.emit("error"),wx.closeSocket()},r.prototype.onpacket=function(t){switch(t.type){case"open":this.onHandshake((0,l.default)(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onerror(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}},r.prototype.onHandshake=function(t){this.id=t.sid,this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.setPing()},r.prototype.setPing=function(){var t=this;clearTimeout(this.pingIntervalTimer),this.pingIntervalTimer=setTimeout(function(){t.ping()},this.pingInterval)},r.prototype.ping=function(){this.emit("ping"),this._send(g.ping+"probe")},r.prototype.write=r.prototype.send=function(t){this._send([g.message,t].join(""))},r.prototype._send=function(t){wx.sendSocketMessage({data:t})},r.subEvents=function(){wx.onSocketOpen(function(){m.emit("open")}),wx.onSocketClose(function(t){m.emit("close",t)}),wx.onSocketError(function(t){m.emit("error",t)}),wx.onSocketMessage(function(t){m.emit("packet",i(t.data))}),m.hasEmitte=!0},r.prototype.bindEvents=function(){this.subs.push((0,f.default)(m,"open",(0,y.default)(this,"onopen"))),this.subs.push((0,f.default)(m,"close",(0,y.default)(this,"onclose"))),this.subs.push((0,f.default)(m,"error",(0,y.default)(this,"onerror"))),this.subs.push((0,f.default)(m,"packet",(0,y.default)(this,"onpacket")))},r.prototype.destroy=function(){for(var t=void 0;t=this.subs.shift();)t.destroy();clearTimeout(this.pingIntervalTimer),this.readyState="closed",this.id=null,this.writeBuffer=[],this.prevBufferLen=0}},function(t,e,n){t.exports={default:n(10),__esModule:!0}},function(t,e,n){n(11),t.exports=n(31).Object.keys},function(t,e,n){var o=n(12),r=n(14);n(29)("keys",function(){return function(t){return r(o(t))}})},function(t,e,n){var o=n(13);t.exports=function(t){return Object(o(t))}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){var o=n(15),r=n(28);t.exports=Object.keys||function(t){return o(t,r)}},function(t,e,n){var o=n(16),r=n(17),i=n(20)(!1),s=n(24)("IE_PROTO");t.exports=function(t,e){var n,c=r(t),u=0,a=[];for(n in c)n!=s&&o(c,n)&&a.push(n);for(;e.length>u;)o(c,n=e[u++])&&(~i(a,n)||a.push(n));return a}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var o=n(18),r=n(13);t.exports=function(t){return o(r(t))}},function(t,e,n){var o=n(19);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==o(t)?t.split(""):Object(t)}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e,n){var o=n(17),r=n(21),i=n(23);t.exports=function(t){return function(e,n,s){var c,u=o(e),a=r(u.length),p=i(s,a);if(t&&n!=n){for(;a>p;)if(c=u[p++],c!=c)return!0}else for(;a>p;p++)if((t||p in u)&&u[p]===n)return t||p||0;return!t&&-1}}},function(t,e,n){var o=n(22),r=Math.min;t.exports=function(t){return t>0?r(o(t),9007199254740991):0}},function(t,e){var n=Math.ceil,o=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?o:n)(t)}},function(t,e,n){var o=n(22),r=Math.max,i=Math.min;t.exports=function(t,e){return t=o(t),t<0?r(t+e,0):i(t,e)}},function(t,e,n){var o=n(25)("keys"),r=n(27);t.exports=function(t){return o[t]||(o[t]=r(t))}},function(t,e,n){var o=n(26),r="__core-js_shared__",i=o[r]||(o[r]={});t.exports=function(t){return i[t]||(i[t]={})}},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){var n=0,o=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+o).toString(36))}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var o=n(30),r=n(31),i=n(40);t.exports=function(t,e){var n=(r.Object||{})[t]||Object[t],s={};s[t]=e(n),o(o.S+o.F*i(function(){n(1)}),"Object",s)}},function(t,e,n){var o=n(26),r=n(31),i=n(32),s=n(34),c="prototype",u=function(t,e,n){var a,p,f,h=t&u.F,l=t&u.G,d=t&u.S,y=t&u.P,v=t&u.B,b=t&u.W,m=l?r:r[e]||(r[e]={}),g=m[c],_=l?o:d?o[e]:(o[e]||{})[c];l&&(n=e);for(a in n)p=!h&&_&&void 0!==_[a],p&&a in m||(f=p?_[a]:n[a],m[a]=l&&"function"!=typeof _[a]?n[a]:v&&p?i(f,o):b&&_[a]==f?function(t){var e=function(e,n,o){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,o)}return t.apply(this,arguments)};return e[c]=t[c],e}(f):y&&"function"==typeof f?i(Function.call,f):f,y&&((m.virtual||(m.virtual={}))[a]=f,t&u.R&&g&&!g[a]&&s(g,a,f)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,t.exports=u},function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},function(t,e,n){var o=n(33);t.exports=function(t,e,n){if(o(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,o){return t.call(e,n,o)};case 3:return function(n,o,r){return t.call(e,n,o,r)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,n){var o=n(35),r=n(43);t.exports=n(39)?function(t,e,n){return o.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var o=n(36),r=n(38),i=n(42),s=Object.defineProperty;e.f=n(39)?Object.defineProperty:function(t,e,n){if(o(t),e=i(e,!0),o(n),r)try{return s(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var o=n(37);t.exports=function(t){if(!o(t))throw TypeError(t+" is not an object!");return t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){t.exports=!n(39)&&!n(40)(function(){return 7!=Object.defineProperty(n(41)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){t.exports=!n(40)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var o=n(37),r=n(26).document,i=o(r)&&o(r.createElement);t.exports=function(t){return i?r.createElement(t):{}}},function(t,e,n){var o=n(37);t.exports=function(t,e){if(!o(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!o(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!o(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!o(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){"use strict";var n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,r=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,i=/(?:^|:|,)(?:\s*\[)+/g,s=/^\s+/,c=/\s+$/;t.exports=function(t){return"string"==typeof t&&t?(t=t.replace(s,"").replace(c,""),JSON.parse?JSON.parse(t):n.test(t.replace(o,"@").replace(r,"]").replace(i,""))?new Function("return "+t)():void 0):null}},function(t,e){var n=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,o=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,r=t.indexOf("["),i=t.indexOf("]");r!=-1&&i!=-1&&(t=t.substring(0,r)+t.substring(r,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=n.exec(t||""),c={},u=14;u--;)c[o[u]]=s[u]||"";return r!=-1&&i!=-1&&(c.source=e,c.host=c.host.substring(1,c.host.length-1).replace(/;/g,":"),c.authority=c.authority.replace("[","").replace("]","").replace(/;/g,":"),c.ipv6uri=!0),c}},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){var n=i(t);e([n])}function i(t){var e="",n=!1;return e+=t.type,t.nsp&&"/"!=t.nsp&&(n=!0,e+=t.nsp),null!=t.id&&(n&&(e+=",",n=!1),e+=t.id),null!=t.data&&(n&&(e+=","),e+=(0,p.default)(t.data)),e}function s(t,e){var n=void 0;"string"==typeof t&&(n=c(t)),e(n)}function c(t){var n={},o=0;if(n.type=Number(t.charAt(0)),null==e.types[n.type])return u();if("/"==t.charAt(o+1))for(n.nsp="";++o;){var r=t.charAt(o);if(","==r)break;if(n.nsp+=r,o==t.length)break}else n.nsp="/";var i=t.charAt(o+1);if(""!==i&&Number(i)==i){for(n.id="";++o;){var s=t.charAt(o);if(null==s||Number(s)!=s){--o;break}if(n.id+=t.charAt(o),o==t.length)break}n.id=Number(n.id)}if(t.charAt(++o))try{n.data=JSON.parse(t.substr(o))}catch(t){return u()}return n}function u(t){return{type:e.ERROR,data:"parser error"}}Object.defineProperty(e,"__esModule",{value:!0});var a=n(47),p=o(a);e.encoder=r,e.decoder=s,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"]},function(t,e,n){t.exports={default:n(48),__esModule:!0}},function(t,e,n){var o=n(31),r=o.JSON||(o.JSON={stringify:JSON.stringify});t.exports=function(t){return r.stringify.apply(r,arguments)}},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){this.io=t,this.nsp=e,this.id=0,this.connected=!1,this.disconnected=!0,this.receiveBuffer=[],this.sendBuffer=[],this.io.autoConnect&&this.open()}Object.defineProperty(e,"__esModule",{value:!0});var i=n(3),s=o(i),c=n(7),u=o(c),a=n(4),p=o(a);(0,s.default)(r.prototype);var f={CONNECT:0,DISCONNECT:1,EVENT:2,ACK:3,ERROR:4,BINARY_EVENT:5,BINARY_ACK:6},h={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},l=s.default.prototype.emit;e.default=r,r.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[(0,u.default)(t,"open",(0,p.default)(this,"onopen")),(0,u.default)(t,"packet",(0,p.default)(this,"onpacket")),(0,u.default)(t,"close",(0,p.default)(this,"onclose"))]}},r.prototype.open=r.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"==this.io.readyState&&this.onopen(),this)},r.prototype.onopen=function(){"/"!=this.nsp&&this.packet({type:f.CONNECT})},r.prototype.onclose=function(t){this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},r.prototype.onpacket=function(t){if(t.nsp==this.nsp)switch(t.type){case f.CONNECT:this.onconnect();break;case f.EVENT:this.onevent(t);break;case f.DISCONNECT:this.disconnect();break;case f.ERROR:this.emit("error",t.data)}},r.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect")},r.prototype.onevent=function(t){var e=t.data||[];this.connected?l.apply(this,e):this.receiveBuffer.push(e)},r.prototype.close=r.prototype.disconnect=function(){return this.connected&&this.packet({type:f.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},r.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},r.prototype.emit=function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];if(h.hasOwnProperty(e[0]))return l.apply(this,e),this;var o=f.EVENT,r={type:o,data:e,options:{}};return this.connected?this.packet(r):this.sendBuffer.push(r),this},r.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)}},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(45),i=o(r);e.default=function(t){var e=(0,i.default)(t);e.port||(/^(http|ws)$/.test(e.protocol)?e.port="80":/^(http|ws)s$/.test(e.protocol)&&(e.port="443")),e.path=e.path||"/";var n=e.host.indexOf(":")!==-1,o=n?"["+e.host+"]":e.host;return e.id=e.protocol+"://"+o+":"+e.port,e}}])});