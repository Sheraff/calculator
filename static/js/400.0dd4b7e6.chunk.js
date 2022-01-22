!function(){"use strict";function n(n,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}function e(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function t(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function r(n,e){return r=Object.setPrototypeOf||function(n,e){return n.__proto__=e,n},r(n,e)}function u(n,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");n.prototype=Object.create(e&&e.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),Object.defineProperty(n,"prototype",{writable:!1}),e&&r(n,e)}function a(n){return a=Object.setPrototypeOf?Object.getPrototypeOf:function(n){return n.__proto__||Object.getPrototypeOf(n)},a(n)}function i(n){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},i(n)}function o(n){if(void 0===n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function s(n,e){if(e&&("object"===i(e)||"function"===typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return o(n)}function c(n){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(n){return!1}}();return function(){var t,r=a(n);if(e){var u=a(this).constructor;t=Reflect.construct(r,arguments,u)}else t=r.apply(this,arguments);return s(this,t)}}function l(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function f(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,r)}return t}function p(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?f(Object(t),!0).forEach((function(e){l(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):f(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}var h=e((function n(e){var r=e.value,u=void 0===r?"":r,a=e.inputRange,i=void 0===a?[]:a;t(this,n),this.value=u,this.inputRange=i})),v=function(n){u(a,n);var r=c(a);function a(n){var e,u=n.type,i=void 0===u?"node":u,o=n.value,s=n.inputRange;return t(this,a),(e=r.call(this,{value:o,inputRange:s})).outputRange=[],e.parent=null,e.type=i,e}return e(a,null,[{key:"clone",value:function(n){var e=new n.constructor(n);return e.outputRange=n.outputRange,e.parent=n.parent,e}}]),a}(h),d=function(){function n(){t(this,n)}return e(n,null,[{key:"tokenize",value:function(n){return new this.token({value:n.item,inputRange:[n.i,n.i]})}},{key:"isOwnToken",value:function(n,e){return n instanceof this.token}},{key:"reduce",value:function(n,e){return new this.node(p({type:"node"},n.item))}},{key:"isOwnNode",value:function(n,e){return n instanceof this.node}},{key:"resolve",value:function(n){return NaN}},{key:"stringify",value:function(n){return n.value}},{key:"hasIntrinsicValue",value:function(n,e){return!1}},{key:"mapRange",value:function(n,e){return[n.inputRange[0],n.inputRange[0]+n.asString.length-1]}}]),n}();function y(n,e){(null==e||e>n.length)&&(e=n.length);for(var t=0,r=new Array(e);t<e;t++)r[t]=n[t];return r}function g(n,e){if(n){if("string"===typeof n)return y(n,e);var t=Object.prototype.toString.call(n).slice(8,-1);return"Object"===t&&n.constructor&&(t=n.constructor.name),"Map"===t||"Set"===t?Array.from(n):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?y(n,e):void 0}}function k(n){return function(n){if(Array.isArray(n))return y(n)}(n)||function(n){if("undefined"!==typeof Symbol&&null!=n[Symbol.iterator]||null!=n["@@iterator"])return Array.from(n)}(n)||g(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function R(n,e,t){for(var r=[];n<e.length&&t(e[n]);)r.push(e[n]),n++;return r}d.token=h,d.node=v;var m=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(d.token),b=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(d.node),w=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"tokenize",value:function(n){var e=n.i,t=n.stack,r=n.item;if(/[^\s]/.test(r)){var u=R(e+1,t,(function(n){return/[a-zA-Z\u207b\xb9]/.test(n)||"."===n})),a=u.length;return n.i+=a,new this.token({value:[r].concat(k(u)).join(""),inputRange:[e,e+a]})}}},{key:"reduce",value:function(n){var e=n.item;return new this.node(p(p({},e),{},{type:"string"}))}}]),a}(d);w.token=m,w.node=b;var O=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(d.node),P=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"reduce",value:function(n){if(this.constants.includes(n.item.value))return new this.node({type:"const",value:n.item.value,inputRange:n.item.inputRange})}},{key:"resolve",value:function(n){switch(n.value){case"pi":return Math.PI;case"e":return Math.E;case"gold":case"phi":return 1.618033988749895;case"tau":return 2*Math.PI}}},{key:"stringify",value:function(n){switch(n.value){case"pi":return"\u03c0";case"e":return"e";case"gold":case"phi":return"\u0278";case"tau":return"\u03c4"}}},{key:"hasIntrinsicValue",value:function(n){return!0}},{key:"mapRange",value:function(n){switch(n.value){case"pi":case"e":case"gold":case"phi":case"tau":return[n.inputRange[0],n.inputRange[0]]}}}]),a}(d);function j(n,e){for(;!Object.prototype.hasOwnProperty.call(n,e)&&null!==(n=a(n)););return n}function S(){return S="undefined"!==typeof Reflect&&Reflect.get?Reflect.get:function(n,e,t){var r=j(n,e);if(r){var u=Object.getOwnPropertyDescriptor(r,e);return u.get?u.get.call(arguments.length<3?n:t):u.value}},S.apply(this,arguments)}function M(n,e){if(null==n)return{};var t,r,u=function(n,e){if(null==n)return{};var t,r,u={},a=Object.keys(n);for(r=0;r<a.length;r++)t=a[r],e.indexOf(t)>=0||(u[t]=n[t]);return u}(n,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);for(r=0;r<a.length;r++)t=a[r],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(u[t]=n[t])}return u}function I(n,e){var t="undefined"!==typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(!t){if(Array.isArray(n)||(t=g(n))||e&&n&&"number"===typeof n.length){t&&(n=t);var r=0,u=function(){};return{s:u,n:function(){return r>=n.length?{done:!0}:{done:!1,value:n[r++]}},e:function(n){throw n},f:u}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,o=!1;return{s:function(){t=t.call(n)},n:function(){var n=t.next();return i=n.done,n},e:function(n){o=!0,a=n},f:function(){try{i||null==t.return||t.return()}finally{if(o)throw a}}}}P.token=w.token,P.node=O,P.constants=["pi","e","gold","phi","tau"],P.tokenize=null;var N=["nodes"],T=function(n){u(a,n);var r=c(a);function a(n){var e,u=n.nodes,i=M(n,N);if(t(this,a),(e=r.call(this,i)).nodes=u,u){var s,c=I(u);try{for(c.s();!(s=c.n()).done;){s.value.parent=o(e)}}catch(l){c.e(l)}finally{c.f()}}return e}return e(a)}(v),V=["depth","boundary"],z=function(n){u(a,n);var r=c(a);function a(n){var e,u=n.depth,i=n.boundary,o=M(n,V);return t(this,a),(e=r.call(this,o)).depth=u,e.boundary=i,e}return e(a)}(h),A=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(T),E=function(n){u(i,n);var r=c(i);function i(){return t(this,i),r.apply(this,arguments)}return e(i,null,[{key:"tokenize",value:function(n){if("depth"in n||(n.depth=0),"("===n.item){var e=n.i,t=n.depth;return n.depth++,new this.token({value:n.item,inputRange:[e,e],depth:t,boundary:"start"})}if(")"===n.item){n.depth--;var r=n.i,u=n.depth;return new this.token({value:n.item,inputRange:[r,r],depth:u,boundary:"end"})}}},{key:"matchTokenPair",value:function(n,e,t){return!!this.isOwnToken(e,t)&&("end"===e.boundary&&n.depth===e.depth)}},{key:"reduce",value:function(n,e){var t=this;if("start"!==n.item.boundary){var r=n.item;return new w.node({type:"string",value:r.value,inputRange:[r.inputRange[0],r.inputRange[0]+1]})}var u=n.i,a=n.item,i=n.stack,o=R(u+1,i,(function(n){return!t.matchTokenPair(a,n,e)}));if(o.length){var s=n.i+o.length+1;n.i=s;var c=[a.inputRange[0]];return i[s]?c[1]=i[s].inputRange[1]:c[1]=o[o.length-1].inputRange[1],new this.node({type:"group",nodes:[e.reduce(o)],inputRange:c,value:"()"})}if(!i[u+1]||this.matchTokenPair(a,i[u+1],e)){var l=[a.inputRange[0]];return i[u+1]?(l[1]=i[u+1].inputRange[1],n.i++):l[1]=a.inputRange[0],new this.node({type:"group",inputRange:l,nodes:null,value:"()"})}}},{key:"resolve",value:function(n){return n.nodes?n.nodes[0].computed:S(a(i),"resolve",this).call(this,n)}},{key:"stringify",value:function(n){return n.nodes?"(".concat(n.nodes[0].asString,")"):"()"}},{key:"hasIntrinsicValue",value:function(n){return!0}},{key:"mapRange",value:function(n,e){if(n.nodes){var t=n.nodes[0].outputRange[1]-n.nodes[0].outputRange[0],r=n.nodes[0].inputRange[0]-(n.inputRange[0]+1);return e.walk(n.nodes[0],[function(n){n.outputRange[0]-=r,n.outputRange[1]-=r}]),[n.inputRange[0],n.inputRange[0]+t+2]}return S(a(i),"mapRange",this).call(this,n,e)}}]),i}(d);function D(n){if(Number.isInteger(n))return 0;var e=n-Math.floor(n);return Math.floor(Math.log(e)/Math.log(10))}function x(n,e){var t=-1*Math.min(D(n),D(e));return Math.pow(10,Math.max(0,t))}function C(n,e){var t=x(n,e);return n*t/(e*t)}E.token=z,E.node=A;var _=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(d.token),W=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(T),q=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"tokenize",value:function(n){if(this.operators.includes(n.item))return new this.token({value:n.item,inputRange:[n.i,n.i]})}},{key:"reduce",value:function(n,e){var t=n.stack,r=n.result,u=n.item,a=n.i;if(r.length>0&&a+1<t.length&&e.hasIntrinsicValue(r[r.length-1])&&e.hasIntrinsicValue(t[a+1])){var i=e.reduce([r.pop()]),o=e.reduce([t[a+1]]),s=[i.inputRange[0],o.inputRange[1]];return n.i++,new this.node({type:"operation-binary",value:u.value,nodes:[i,o],inputRange:s})}}},{key:"stringify",value:function(n){return"".concat(n.nodes[0].asString," ").concat(n.value," ").concat(n.nodes[1].asString)}},{key:"hasIntrinsicValue",value:function(n){return!0}},{key:"mapRange",value:function(n,e){var t=n.inputRange[1]-n.inputRange[0]+1,r=n.nodes[0].outputRange[1]-n.nodes[0].outputRange[0]+1,u=n.nodes[1].outputRange[1]-n.nodes[1].outputRange[0]+1,a=t-(r+u+3),i=a-(n.nodes[1].inputRange[1]-n.nodes[1].inputRange[0]+1-u);return e.walk(n.nodes[1],[function(n){n.outputRange[0]-=i,n.outputRange[1]-=i}]),[n.inputRange[0],n.inputRange[1]-a]}}]),a}(d);q.token=_,q.node=W,q.operators=[];var F=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(q.token),B=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(q.node),L=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"resolve",value:function(n){var e=n.nodes[0].computed,t=n.nodes[1].computed;switch(n.value){case"+":return function(n,e){var t=x(n,e);return(n*t+e*t)/t}(e,t);case"-":return function(n,e){var t=x(n,e);return(n*t-e*t)/t}(e,t)}}}]),a}(q);L.token=F,L.node=B,L.operators=["+","-"];var U=["operatorPosition","addParenthesis"],Z=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(d.token),$=function(n){u(a,n);var r=c(a);function a(n){var e,u=n.operatorPosition,i=n.addParenthesis,o=M(n,U);return t(this,a),(e=r.call(this,o)).operatorPosition=u,e.addParenthesis=i,e}return e(a)}(T),G=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"tokenize",value:function(n){if(this.operators.includes(n.item))return new this.token({value:n.item,inputRange:[n.i,n.i]})}},{key:"hasIntrinsicValue",value:function(n){return!0}}]),a}(d);G.token=Z,G.node=$,G.operators=[];var H=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(G.token),J=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(G.node),K=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"isOwnToken",value:function(n,e){return n instanceof this.token||w.isOwnToken(n,e)&&this.operators.includes(n.value)}},{key:"reduce",value:function(n,e){var t=n.stack,r=n.item,u=n.i;if(u+1<t.length&&e.hasIntrinsicValue(t[u+1])){var a=e.reduce([t[u+1]]),i=[r.inputRange[0],a.inputRange[1]];n.i++;var o="\u221a"!==r.value&&!E.isOwnNode(a,e);return new this.node({type:"operation-unary",value:r.value,nodes:[a],operatorPosition:"left",inputRange:i,addParenthesis:o})}}},{key:"resolve",value:function(n){var e=n.nodes[0].computed;switch(n.value){case"sin":return Math.sin(e);case"cos":return Math.cos(e);case"tan":return Math.tan(e);case"log":return Math.log10(e);case"ln":return Math.log(e);case"sqrt":case"\u221a":return Math.sqrt(e);case"abs":return Math.abs(e);case"floor":return Math.floor(e);case"ceil":return Math.ceil(e);case"round":return Math.round(e);case"sin\u207b\xb9":case"asin":return Math.asin(e);case"cos\u207b\xb9":case"acos":return Math.acos(e);case"tan\u207b\xb9":case"atan":return Math.atan(e)}}},{key:"stringify",value:function(n){return n.addParenthesis?"".concat(n.value,"(").concat(n.nodes[0].asString,")"):"".concat(n.value).concat(n.nodes[0].asString)}},{key:"mapRange",value:function(n,e){var t=n.inputRange[1]-n.inputRange[0]+1,r=n.nodes[0].outputRange[1]-n.nodes[0].outputRange[0]+1,u=t-(r+n.value.length),a=u-(n.nodes[0].inputRange[1]-n.nodes[0].inputRange[0]+1-r)-(n.addParenthesis?1:0);return e.walk(n.nodes[0],[function(n){n.outputRange[0]-=a,n.outputRange[1]-=a}]),[n.inputRange[0],n.inputRange[1]-u+(n.addParenthesis?2:0)]}}]),a}(G);K.token=H,K.node=J,K.operators=["sin","cos","tan","log","ln","sqrt","\u221a","abs","floor","ceil","round","sin\u207b\xb9","cos\u207b\xb9","tan\u207b\xb9","asin","acos","atan"];var Q=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(K.node),X=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"isOwnToken",value:function(n,e){return L.isOwnToken(n,e)&&this.operators.includes(n.value)}},{key:"reduce",value:function(n,e){var t=n.stack,r=n.result,u=n.item,a=n.i;if(a+1<t.length&&e.hasIntrinsicValue(t[a+1])&&(0===r.length||!e.hasIntrinsicValue(r[r.length-1]))){var i=e.reduce([t[a+1]]),o=[u.inputRange[0],i.inputRange[1]];return n.i++,new this.node({type:"operation-unary",value:u.value,nodes:[i],operatorPosition:"left",inputRange:o,addParenthesis:!1})}}},{key:"resolve",value:function(n){return-n.nodes[0].computed}}]),a}(K);function Y(n){return n<2?1:Y(n-1)*n}X.node=Q,X.operators=["-"],X.tokenize=null;var nn=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(G.token),en=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(G.node),tn=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"reduce",value:function(n,e){var t=n.result,r=n.item;if(t.length>0&&e.hasIntrinsicValue(t[t.length-1])){var u=e.reduce([t.pop()]),a=[u.inputRange[0],r.inputRange[1]];return new this.node({type:"operation-unary",value:r.value,nodes:[u],operatorPosition:"right",inputRange:a,addParenthesis:!1})}}},{key:"resolve",value:function(n){var e=n.nodes[0].computed;switch(n.value){case"!":return Y(e);case"\xb2":return Math.pow(e,2);case"\xb3":return Math.pow(e,3);case"%":return C(e,100)}}},{key:"stringify",value:function(n){return"".concat(n.nodes[0].asString).concat(n.value)}},{key:"mapRange",value:function(n,e){return[n.nodes[0].outputRange[0],n.nodes[0].outputRange[1]+1]}}]),a}(G);tn.token=nn,tn.node=en,tn.operators=["!","\xb2","\xb3","%"];var rn=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(q.token),un=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(q.node),an=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"resolve",value:function(n){var e=n.nodes[0].computed,t=n.nodes[1].computed;return Math.pow(e,t)}}]),a}(q);an.token=rn,an.node=un,an.operators=["^"];var on=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(q.token),sn=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(q.node),cn=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"resolve",value:function(n){var e=n.nodes[0].computed,t=n.nodes[1].computed;switch(n.value){case"*":case"\xd7":return function(n,e){var t=x(n,e);return n*t*(e*t)/(t*t)}(e,t);case"/":case"\xf7":return C(e,t)}}}]),a}(q);cn.token=on,cn.node=sn,cn.operators=["*","/","\xd7","\xf7"];var ln=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"isOwnToken",value:function(n,e){return n instanceof v&&e.hasIntrinsicValue(n)}},{key:"reduce",value:function(n,e){var t=n.result,r=n.item;if(t.length>0&&e.hasIntrinsicValue(t[t.length-1])){var u=t.pop(),a=r;if(u.inputRange[1]+1<a.inputRange[0]||E.isOwnNode(u)||E.isOwnNode(a)||K.isOwnNode(a)||tn.isOwnNode(u)){var i=[u.inputRange[0],a.inputRange[1]];return new this.node({type:"operation-binary",value:"\xd7",nodes:[u,a],inputRange:i})}}}},{key:"isOwnNode",value:function(n){return!1}}]),a}(cn);ln.tokenize=null;var fn=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(d.node),pn=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"tokenize",value:function(n){if(/[0-9]/.test(n.item)){var e=n.i,t=R(e,n.stack,(function(n){return/[0-9]/.test(n)||"."===n})),r=t.length-1;return n.i+=r,new this.node({type:"number",value:t.join(""),inputRange:[e,e+r]})}}},{key:"resolve",value:function(n){return Number.parseFloat(n.value)}},{key:"hasIntrinsicValue",value:function(n){return!0}}]),a}(d);pn.node=fn,pn.reduce=null;var hn=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a)}(T),vn=function(n){u(a,n);var r=c(a);function a(){return t(this,a),r.apply(this,arguments)}return e(a,null,[{key:"isOwnToken",value:function(){return!0}},{key:"reduce",value:function(n,e){if(n.stack.length>1){var t=n.stack,r=[t[0].inputRange[0],t[t.length-1].inputRange[1]];return n.i+=t.length-1,new this.node({type:"partials",nodes:k(t),inputRange:r,value:""})}}},{key:"isOwnNode",value:function(){return!0}},{key:"resolve",value:function(n){if(n instanceof this.node){var e=n.nodes.filter((function(n){return!isNaN(n.computed)}));return 1===e.length?e[0].computed:NaN}}},{key:"stringify",value:function(n){return n instanceof this.node?n.nodes.map((function(n){return n.asString})).join(" "):n.asString?void 0:n.value}},{key:"getDefaultRange",value:function(n){var e=Math.max(0,n.value.length-1);return[n.inputRange[0],n.inputRange[0]+e]}},{key:"mapRange",value:function(n,e){var t=this;if(n instanceof this.node){for(var r=function(r){var u=n.nodes[r-1],a=n.nodes[r],i=u.inputRange[1]-u.outputRange[1]+(a.inputRange[0]-u.inputRange[1]-2);e.walk(a,[function(n){n.outputRange&&n.outputRange.length||(n.outputRange=t.getDefaultRange(n)),n.outputRange[0]-=i,n.outputRange[1]-=i}])},u=1;u<n.nodes.length;u++)r(u);return[n.nodes[0].outputRange[0],n.nodes[n.nodes.length-1].outputRange[1]]}if(!n.outputRange||!n.outputRange.length)return this.getDefaultRange(n)}}]),a}(d);vn.token=null,vn.node=hn,vn.tokenize=null,vn.hasIntrinsicValue=null;var dn=vn;function yn(n,e){return function(n){if(Array.isArray(n))return n}(n)||function(n,e){var t=null==n?null:"undefined"!==typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(null!=t){var r,u,a=[],i=!0,o=!1;try{for(t=t.call(n);!(i=(r=t.next()).done)&&(a.push(r.value),!e||a.length!==e);i=!0);}catch(s){o=!0,u=s}finally{try{i||null==t.return||t.return()}finally{if(o)throw u}}return a}}(n,e)||g(n,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var gn=function(){function n(e){t(this,n),this.plugins=[],this.plugins=k(e),this.walk=n.walk}return e(n,[{key:"tokenize",value:function(e){for(var t={stack:e.split(""),tokens:[],i:0};t.i<t.stack.length;t.i++)t.item=t.stack[t.i],n.tokenize.call(this,t,!0);return t.tokens}},{key:"reduce",value:function(n){var e,t={result:[],stack:k(n)},r=I(this.plugins);try{for(r.s();!(e=r.n()).done;){var u=e.value;if(u.reduce){for(t.i=0;t.i<t.stack.length;t.i++)if(t.item=t.stack[t.i],u.isOwnToken(t.item,this)){var a=u.reduce(t,this);a?t.result.push(a):t.result.push(t.item)}else t.result.push(t.item);t.stack=k(t.result),t.result=[]}}}catch(i){r.e(i)}finally{r.f()}return t.stack[0]}},{key:"parse",value:function(e){var t=this.tokenize(e);if(0===t.length){var r=new v({type:"string",inputRange:[0,0],value:""});return r.outputRange=[0,0],r.computed=0,r.asString="",r}var u=this.reduce(t);return n.walk(u,[n.resolve.bind(this),n.stringify.bind(this),n.mapRange.bind(this)])}},{key:"hasIntrinsicValue",value:function(n){var e,t=I(this.plugins);try{for(t.s();!(e=t.n()).done;){var r=e.value;if(r.hasIntrinsicValue&&r.isOwnNode(n,this)&&r.hasIntrinsicValue(n,this))return!0}}catch(u){t.e(u)}finally{t.f()}return!1}}],[{key:"makeWalker",value:function(n,e){this[n]=function(t){var r,u=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=I(this.plugins);try{for(a.s();!(r=a.n()).done;){var i=r.value;if(i[n]&&(u||i.isOwnNode(t,this))){var o=i[n](t,this);if(void 0!==o){e(t,o);break}}}}catch(s){a.e(s)}finally{a.f()}}}},{key:"walk",value:function(e,t){var r=v.clone(e);return r.nodes&&(r.nodes=r.nodes.map((function(e){return n.walk(e,t)}))),t.forEach((function(n){return n(r)})),r}},{key:"locateCaret",value:function(e,t){if(e.nodes)for(var r=0;r<e.nodes.length;r++){var u=e.nodes[r];if(n.testNodeForCaret(u,t))return n.locateCaret(u,t)}return e.outputRange}},{key:"testNodeForCaret",value:function(n,e){var t=yn(n.inputRange,2),r=t[0],u=t[1],a=yn(e,2),i=a[0],o=a[1];return r<=i&&u+1>=o}}]),n}();gn.makeWalker("resolve",(function(n,e){return n.computed=e})),gn.makeWalker("stringify",(function(n,e){return n.asString=e})),gn.makeWalker("mapRange",(function(n,e){return n.outputRange=e})),gn.makeWalker("tokenize",(function(n,e){return n.tokens.push(e)}));var kn=new gn([P,E,K,tn,X,an,cn,ln,L,pn,w,dn]),Rn={},mn="",bn=new Map;var wn=null,On=new Map;function Pn(n,e){if(!e)return wn=null,void(n.caret=null);var t="".concat(e[0],":::").concat(e[1],":::").concat(mn),r=On.has(t),u=r?On.get(t):function(n,e){if(!e||!n.inputRange)return null;if(e[0]===e[1]&&n.inputRange[1]<e[0])return null;return gn.locateCaret(n,e)}(Rn,e),a=(null===wn)+(null===u);1!==a&&(0!==a||wn[0]===u[0]&&wn[1]===u[1])||(wn=u,n.caret=u),r||On.set(t,u)}onmessage=function(n){var e=n.data,t=e.value,r=e.caret,u={};"string"===typeof t&&function(n,e){bn.has(e)?Rn=bn.get(e):(Rn=kn.parse(e),mn=e,bn.set(e,Rn)),n.parsed=Rn}(u,t.toLowerCase());void 0!==r&&Pn(u,r),postMessage(u)}}();
//# sourceMappingURL=400.0dd4b7e6.chunk.js.map