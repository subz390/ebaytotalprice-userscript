// ==UserScript==
// @name         ebaytotalprice-userscript
// @namespace    https://github.com/subz390
// @version      2.0.2.201225055452
// @description  Add the total eBay auction price including postage in the auction listing
// @author       SubZ390
// @license      MIT
// @run-at       document-idle
// @grant        none
// @noframes
// @include      /^https?://www\.ebay\.co\.uk/
//
//
// ==/UserScript==

function e(e,t=!0){if("object"!=typeof e)return typeof e;if(null===e)return"null";const n=Object.prototype.toString.call(e).match(/\[object\s(\w+)\]/)[1];return!0===t?n.toLowerCase():n}function t(e,t,n){if(null===e)return null;n=n||1;let r=e.match(t);return r?"all"==n?r:r[n]?r[n]:r[0]:null}function n(e="",t,n=document){try{if("string"==typeof e){if(""==e)return null;if("string"==typeof n){const e=document.querySelector(n);if(null==e)return null;n=e}return n.querySelector(e)}return e}catch(e){console.error(e)}}function r({selector:e=null,scope:t=document,array:r=!1,all:i=!1,contains:o=null,unittest:l=!1}={}){try{if(null===e)return null;if(t!==document&&null===(t=n(t)))return null;if("scope"===l)return t;if(!0===i){const n=t.querySelectorAll(e);if(0===n.length)return null;if(!0===r){if(null!==o){let e=[];return n.forEach((t=>{-1!==t.textContent.search(o)&&e.push(t)})),0===e.length?null:e}return Array.from(n)}if(null!==o){for(let e=0;e<n.length;e++)if(-1!==n[e].textContent.search(o))return n[e];return null}return n}{const n=t.querySelector(e);return null===n||("string"==typeof o||o instanceof RegExp)&&-1===n.textContent.search(o)?null:!0===r?[n]:n}}catch(e){console.error(e)}}function i(...t){if(0==Object.keys(t).length)return null;if(""===t[0])return null;const n=function(t,n,r,i){let o,l,c,s;if("object"===e(t)){const e=(e,t)=>{const n=t.find((t=>e.hasOwnProperty(t)));return void 0!==n?e[n]:void 0};l=e(t,["option","options","property","props","properties"]),o=e(t,["object"]),s=e(t,["default"]),c=e(t,["action","callback"])}else l=t,s=void 0,c=void 0;if(void 0===l)return s;if("string"==typeof c&&"set"===c)return s;function p(e,t,n={}){return"function"==typeof t?t(e,n):e}if("object"===e(o)){if("array"===e(l)){for(let e=0;e<l.length;e++)if(o.hasOwnProperty(l[e])){const t=p(o[l[e]],c,o);if(void 0!==t)return t}}else if("string"==typeof l&&o.hasOwnProperty(l)){const e=p(o[l],c,o);if(void 0!==e)return e}}else if("array"===e(l)){for(let e=0;e<l.length;e++)if(void 0!==l[e]){const t=p(l[e],c,o);if(void 0!==t)return t}}else{const e=p(l,c,o);if(void 0!==e)return e}return s}({options:["object"==e(t[0])?t[0]:void 0],default:{regex:/{([^{}]+)}/g,template:t[0]}});return"object"==e(t[1])?n.template.replace(n.regex,(function(e,n){for(let e=1;t[e];e++)if(t[e][n])return"function"==typeof t[e][n]?t[e][n]().toString():t[e][n];return e})):n.template.replace(n.regex,(function(e,n){return t[n]||e}))}function o({listItemsSelector:e,itemPriceElementSelector:n,itemPriceElementTemplate:o=null,itemShippingElementSelector:l,itemShippingElementTemplate:c=null}){const s=r({selector:e,all:!0,array:!0});if(s)for(let e=0;s[e];e++){const p=r({selector:n,scope:s[e]}),m=r({selector:l,scope:s[e],contains:/\d/});if(p&&m){const e=t(p.textContent.trim(),/(\$|£|EUR)/),n=t(m.textContent.trim(),/(\$|£|EUR)/);if(n&&n===e){const e=parseFloat(t(p.textContent.trim(),/(\d+[\.,]\d+)/).replace(",","."))+parseFloat(t(m.textContent.trim(),/(\d+[\.,]\d+)/).replace(",",".")),r=i(c||o,{itemPrice:p.textContent.trim(),itemShippingAmount:m.textContent.trim(),shippingCurrencySymbol:n,totalPrice:e.toFixed(2)});o?p.insertAdjacentHTML("afterend",r):m.innerHTML=r}}}}!function(e,t){const n=document.createElement("style");n.appendChild(document.createTextNode(".total-price{background:#bf0;color:#111!important;outline:2px solid;padding:1px 4px;margin-left:5px;font-size:20px!important;font-weight:400!important;}.s-item__detail{overflow:visible!important;}")),document.head.appendChild(n)}();const l='<span class="total-price">{shippingCurrencySymbol}{totalPrice}</span>',c={search:{identifierSelector:["#mainContent ul.srp-results","#mainContent ul.b-list__items_nofooter"],process:()=>o({listItemsSelector:"#mainContent li.s-item",itemPriceElementSelector:".s-item__price",itemShippingElementSelector:".s-item__shipping",itemPriceElementTemplate:l})},sch:{identifierSelector:["#mainContent ul#ListViewInner"],process:()=>o({listItemsSelector:"#mainContent li",itemPriceElementSelector:".lvprice span",itemShippingElementSelector:".lvshipping span.fee",itemPriceElementTemplate:l})},itm:{identifierSelector:['#mainContent form[name="viactiondetails"]'],process:()=>function({listItemsSelector:e,itemPriceElementSelector:n,convertPriceElementSelector:o,itemPriceElementTemplate:l=null,itemShippingElementSelector:c,convertShippingElementSelector:s,itemShippingElementTemplate:p=null}){const m=r({selector:e});if(m){const e=r({selector:o,scope:m})||r({selector:n,scope:m}),u=r({selector:s,scope:m,contains:/\d/})||r({selector:c,scope:m,contains:/\d/});if(e&&u){const n=t(e.textContent.trim(),/([^\d ]+) ?\d+\.\d+/),r=t(u.textContent.trim(),/([^\d ]+) ?\d+\.\d+/);if(r&&r===n){const n=parseFloat(t(e.textContent.trim(),/(\d+\.\d+)/))+parseFloat(t(u.textContent.trim(),/(\d+\.\d+)/)),o=i(p||l,{itemPrice:e.textContent.trim(),itemShippingAmount:u.textContent.trim(),shippingCurrencySymbol:r,totalPrice:n.toFixed(2)});l?e.insertAdjacentHTML("afterend",o):u.innerHTML=o}}}}({listItemsSelector:"#mainContent",itemPriceElementSelector:"#prcIsum_bidPrice",convertPriceElementSelector:"#prcIsumConv",itemShippingElementSelector:"#fshippingCost",convertShippingElementSelector:"#convetedPriceId",itemPriceElementTemplate:l})}};try{!function(e,t){for(const[e,t]of Object.entries(c))for(let e=0;e<t.identifierSelector.length;e++)if(null!==n(t.identifierSelector[e]))return void t.process()}()}catch(e){console.error(e)}
