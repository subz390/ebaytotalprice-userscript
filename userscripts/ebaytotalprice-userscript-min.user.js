// ==UserScript==
// @name         ebaytotalprice-userscript
// @namespace    https://github.com/subz390
// @version      2.2.0.210209163142
// @description  Add the total eBay auction price including postage in the auction listing
// @author       SubZ390
// @license      MIT
// @run-at       document-idle
// @grant        none
// @noframes
// @include      /^https?://(ar|b[ory]|c[lor]|do|ec|gt|hn|il|kz|mx|ni|p[aerty]|ru|sv|uy|ve|www)\.ebay\.com/
// @include      /^https?://www\.ebay\.com\.au/
// @include      /^https?://www\.ebay\.co\.uk/
// @include      /^https?://www\.ebay\.(at|ca|de|es|fr|ie|it|nl|ph|pl)/
// @include      /^https?://www\.be(nl|fr)\.ebay\.be/
//
//
// ==/UserScript==

function e(e,t=!0){if("object"!=typeof e)return typeof e;if(null===e)return"null";const n=Object.prototype.toString.call(e).match(/\[object\s(\w+)\]/)[1];return!0===t?n.toLowerCase():n}function t(e="",t,n=document){try{if(n=null===n?document:n,"string"==typeof e){if(""==e)return null;if("string"==typeof n){const e=document.querySelector(n);if(null==e)return null;n=e}return n.querySelector(e)}return e}catch(e){console.error(e)}}function n(e,t,n){if(null===e)return null;n=n||1;const r=e.match(t);return r?"all"==n?r:r[n]?r[n]:r[0]:null}function r({selector:e=null,scope:n=document,t:r=!1,all:o=!1,contains:i=null,o:l=!1,i:c=""}={}){const s={l:{u:`${c}selector is undefined`,p:`${c}scope not found`}};if("language"===l)return s;try{if(null===e)return console.error(s.l.u),null;if(n!==document&&null===(n=t(n)))return null;if("scope"===l)return n;if("options"===l)return{selector:e,scope:n,t:r,all:o,contains:i,o:l};if(!0===o){const t=n.querySelectorAll(e);if(0===t.length)return null;if(!0===r){if(null!==i){const e=[];return t.forEach((t=>{-1!==t.textContent.search(i)&&e.push(t)})),0===e.length?null:e}return Array.from(t)}if(null!==i){for(let e=0;e<t.length;e++)if(-1!==t[e].textContent.search(i))return t;return null}return t}{const t=n.querySelector(e);return null===t||("string"==typeof i||i instanceof RegExp)&&-1===t.textContent.search(i)?null:!0===r?[t]:t}}catch(e){console.error(e)}}function o(...t){if(0==Object.keys(t).length)return null;if(""===t[0])return null;const n=((t,n,r,o)=>{let i,l,c,s;if("object"===e(t)){function u(e,t){const n=t.find((t=>e.hasOwnProperty(t)));return void 0!==n?e[n]:void 0}l=u(t,["option","options","property","props","properties"]),i=u(t,["object"]),s=u(t,["default"]),c=u(t,["action","callback"])}else l=t,s=void 0,c=void 0;if(void 0===l)return s;if("string"==typeof c&&"set"===c)return s;function a(e,t,n={}){return"function"==typeof t?t(e,n):e}if("object"===e(i)){if("array"===e(l)){for(let e=0;e<l.length;e++)if(i.hasOwnProperty(l[e])){const t=a(i[l[e]],c,i);if(void 0!==t)return t}}else if("string"==typeof l&&i.hasOwnProperty(l)){const e=a(i[l],c,i);if(void 0!==e)return e}}else if("array"===e(l)){for(let e=0;e<l.length;e++)if(void 0!==l[e]){const t=a(l[e],c,i);if(void 0!==t)return t}}else{const e=a(l,c,i);if(void 0!==e)return e}return s})({options:["object"==e(t[0])?t[0]:void 0],default:{m:/{([^{}]+)}/g,S:t[0]}});return"object"==e(t[1])?n.S.replace(n.m,((e,n)=>{for(let e=1;t[e];e++)if(t[e][n])return"function"==typeof t[e][n]?t[e][n]().toString():t[e][n];return e})):n.S.replace(n.m,((e,n)=>t[n]||e))}const i=/((\d+[,\.])+\d+)/,l=/((((AU|C|US) )?\$)|EUR|PHP|zł|£)/;function c(e){try{let t=n(e.textContent.trim(),i);return t=t.replace(/[,\.]/g,""),t=parseFloat(t),t}catch(e){return console.error(e),null}}function s({g:e,v:t,h:i=null,P:s,j:u=null}){const a=r({selector:e,all:!0,t:!0});if(a)for(let e=0;a[e];e++){const p=r({selector:t,scope:a[e]}),m=r({selector:s,scope:a[e],contains:/\d/});if(p&&m){const e=n(p.textContent.trim(),l),t=n(m.textContent.trim(),l);if(t&&t===e){const e=((c(p)+c(m))/100).toFixed(2),n=o(u||i,{itemPrice:p.textContent.trim(),itemShippingAmount:m.textContent.trim(),currencySymbol:t,totalPrice:e});i?p.insertAdjacentHTML("afterend",n):m.innerHTML=n}}}}(({style:e,className:n,I:r="afterend",T:o="body",C:i=5,_:l})=>{new Promise(((c,s)=>{const u=document.createElement("style");u.appendChild(document.createTextNode(e)),n&&(u.className=n),(({C:e=3,every:t=100,test:n=(()=>!1),A:r=(()=>null),timeout:o=(()=>null)}={})=>{if(!1===(()=>{const e=n();return!!e&&(r(e),!0)})()){const i=setInterval((()=>{const e=n();e&&(clearInterval(i),clearTimeout(l),r(e))}),t),l=setTimeout((()=>{clearInterval(i),o()}),1e3*e)}})({C:i,every:100,test:()=>t(o),A(e){c(((e,t)=>void 0!==r?e.insertAdjacentElement(r,t):e.appendChild(t))(e,u))},timeout:()=>s(Error(l||`appendStyle timed out whilst waiting for targetNode: ${o}`))})}))})({style:".total-price{background:#bf0;color:#111!important;outline:2px solid;padding:1px 4px;margin-left:5px;font-size:20px!important;font-weight:400!important;}.s-item__detail{overflow:visible!important;}"}),(e=>{try{const n=(()=>{for(const[,n]of Object.entries(e))for(let e=0;e<n.F.length;e++)if(null!==t(n.F[e]))return n;return null})();null!==n&&n.process()}catch(e){console.error(e)}})({search:{F:["#mainContent ul.srp-results","#mainContent ul.b-list__items_nofooter"],process:()=>s({g:"#mainContent li.s-item",v:".s-item__price",P:".s-item__shipping",h:'<span class="total-price">{currencySymbol}{totalPrice}</span>'})},U:{F:["#mainContent ul#ListViewInner"],process:()=>s({g:"#mainContent li",v:".lvprice span",P:".lvshipping span.fee",h:'<span class="total-price">{currencySymbol}{totalPrice}</span>'})},$:{F:['#mainContent form[name="viactiondetails"]'],process:()=>(({g:e,v:t,N:i,h:s=null,P:u,O:a,j:p=null})=>{const m=r({selector:e});if(m){const e=r({selector:i,scope:m,contains:/\d/})||r({selector:t,scope:m,contains:/\d/}),f=r({selector:a,scope:m,contains:/\d/})||r({selector:u,scope:m,contains:/\d/});if(e&&f){const t=n(e.textContent.trim(),l),r=n(f.textContent.trim(),l);if(r&&r===t){const t=((c(e)+c(f))/100).toFixed(2),n=o(p||s,{itemPrice:e.textContent.trim(),itemShippingAmount:f.textContent.trim(),currencySymbol:r,totalPrice:t});s?e.insertAdjacentHTML("afterend",n):f.innerHTML=n}}}})({g:"#mainContent",v:'span[itemprop="price"]',N:"#prcIsumConv",P:"#fshippingCost",O:"#convetedPriceId",h:'<span class="total-price">{currencySymbol}{totalPrice}</span>'})}});
