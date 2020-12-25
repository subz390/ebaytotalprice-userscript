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

function realTypeOf(object, lowerCase = true) {
  if (typeof object !== 'object') {return typeof object}
  if (object === null) {return 'null'}
  const internalClass = Object.prototype.toString.call(object).match(/\[object\s(\w+)\]/)[1];
  return lowerCase === true ? internalClass.toLowerCase() : internalClass
}

function styleInject(style, className = undefined) {
  const el = document.createElement('style');
  el.appendChild(document.createTextNode(style));
  if (className) {el.className = className;}
  document.head.appendChild(el);
  return el
}

function findMatch(string, regex, index) {
  if (string === null) return null
  index = index || 1;
  let m = string.match(regex);
  return (m) ? (index=='all' ? m : (m[index] ? m[index] : m[0])) : null
}

function getNode(node = '', debug = undefined, scope = document) {
  try {
    if (typeof node == 'string') {
      if (node == '') {return null}
      if (typeof scope == 'string') {
        const tempScope = document.querySelector(scope);
        if (tempScope == null) {
          return null
        }
        scope = tempScope;
      }
      const element = scope.querySelector(node);
      return element
    }
    return node
  }
  catch (error) {
    console.error(error);
  }
}

function setDefault(paramOptions, paramDefault = undefined, paramAction = undefined, debugging = undefined) {
  let globalObject;
  let globalOptions;
  let globalAction;
  let globalDefault;
  if (realTypeOf(paramOptions) === 'object') {
    const getProp = (object, array) => {
      const name = array.find(name => object.hasOwnProperty(name));
      if (typeof name !== 'undefined') {
        return object[name]
      }
      else {
        return undefined
      }
    };
    globalOptions = getProp(paramOptions, ['option', 'options', 'property', 'props', 'properties']);
    globalObject = getProp(paramOptions, ['object']);
    globalDefault = getProp(paramOptions, ['default']);
    globalAction = getProp(paramOptions, ['action', 'callback']);
  }
  else {
    globalOptions = paramOptions;
    globalDefault = paramDefault;
    globalAction = paramAction;
  }
  if (globalOptions === undefined) {
    return globalDefault
  }
  if (typeof globalAction === 'string' && globalAction === 'set') {
    return globalDefault
  }
  function doAction(option, action = undefined, object = {}) {
    if (typeof action === 'function') {
      return action(option, object)
    }
    else {
      return option
    }
  }
  if (realTypeOf(globalObject) === 'object') {
    if (realTypeOf(globalOptions) === 'array') {
      for (let i=0; i < globalOptions.length; i++) {
        if (globalObject.hasOwnProperty(globalOptions[i])) {
          const result = doAction(globalObject[globalOptions[i]], globalAction, globalObject);
          if (result !== undefined) {
            return result
          }
        }
      }
    }
    else if (typeof globalOptions === 'string' && globalObject.hasOwnProperty(globalOptions)) {
      const result = doAction(globalObject[globalOptions], globalAction, globalObject);
      if (result !== undefined) {
        return result
      }
    }
  }
  else if (realTypeOf(globalOptions) === 'array') {
    for (let i=0; i < globalOptions.length; i++) {
      if (globalOptions[i] !== undefined) {
        const result = doAction(globalOptions[i], globalAction, globalObject);
        if (result !== undefined) {
          return result
        }
      }
    }
  }
  else {
    const result = doAction(globalOptions, globalAction, globalObject);
    if (result !== undefined) {
      return result
    }
  }
  return globalDefault
}

function qs({selector = null, scope = document, array = false, all = false, contains = null, unittest = false} = {}) {
  try {
    if (selector === null) {
      return null
    }
    if (scope !== document) {
      scope = getNode(scope);
      if (scope === null) {
        return null
      }
    }
    if (unittest === 'scope') {return scope}
    if (all === true) {
      const qsNodeList = scope.querySelectorAll(selector);
      if (qsNodeList.length === 0) {return null}
      if (array === true) {
        if (contains !== null) {
          let tempArray = [];
          qsNodeList.forEach((element) => {
            if (element.textContent.search(contains) !== -1) {
              tempArray.push(element);
            }
          });
          if (tempArray.length === 0) {return null}
          else {return tempArray}
        }
        return Array.from(qsNodeList)
      }
      else {
        if (contains !== null) {
          for (let index = 0; index < qsNodeList.length; index++) {
            if (qsNodeList[index].textContent.search(contains) !== -1) {return qsNodeList[index]}
          }
          return null
        }
        return qsNodeList
      }
    }
    else {
      const qsHTMLElement = scope.querySelector(selector);
      if (qsHTMLElement === null) {return null}
      if (typeof contains === 'string' || contains instanceof RegExp) {
        if (qsHTMLElement.textContent.search(contains) === -1) {return null}
      }
      if (array === true) {return [qsHTMLElement]}
      else {return qsHTMLElement}
    }
  }
  catch (error) {
    console.error(error);
  }
}

function sprintf(...args) {
  if (Object.keys(args).length == 0) {
    return null
  }
  if (args[0] === '') {
    return null
  }
  const options = setDefault({
    options: [realTypeOf(args[0]) == 'object' ? args[0] : undefined],
    default: {regex: /{([^{}]+)}/g, template: args[0]},
  });
  if (realTypeOf(args[1]) == 'object') {
    return options.template.replace(options.regex, function(match, n) {
      for (let k = 1; args[k]; k++) {
        if (args[k][n]) {
          if (typeof args[k][n] == 'function') {return args[k][n]().toString()}
          return args[k][n]
        }
      }
      return match
    })
  }
  else {
    return options.template.replace(options.regex, function(match, n) {
      return args[n] || match
    })
  }
}

var stylesheet = ".total-price{background:#bf0;color:#111!important;outline:2px solid;padding:1px 4px;margin-left:5px;font-size:20px!important;font-weight:400!important;}.s-item__detail{overflow:visible!important;}";

styleInject(stylesheet);
function processListGallery({listItemsSelector, itemPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, itemShippingElementTemplate = null}) {
  const listItems = qs({selector: listItemsSelector, all: true, array: true});
  if (listItems) {
    for (let i=0; listItems[i]; i++) {
      const itemPriceElement = qs({selector: itemPriceElementSelector, scope: listItems[i]});
      const itemShippingElement = qs({selector: itemShippingElementSelector, scope: listItems[i], contains: /\d/});
      if (itemPriceElement && itemShippingElement) {
        const priceCurrencySymbol = findMatch(itemPriceElement.textContent.trim(), /(\$|£|EUR)/);
        const shippingCurrencySymbol = findMatch(itemShippingElement.textContent.trim(), /(\$|£|EUR)/);
        if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
          const totalPrice = parseFloat(findMatch(itemPriceElement.textContent.trim(), /(\d+[\.,]\d+)/).replace(',', '.')) +
                             parseFloat(findMatch(itemShippingElement.textContent.trim(), /(\d+[\.,]\d+)/).replace(',', '.'));
          const HTML = sprintf(
            itemShippingElementTemplate || itemPriceElementTemplate, {
              itemPrice: itemPriceElement.textContent.trim(),
              itemShippingAmount: itemShippingElement.textContent.trim(),
              shippingCurrencySymbol: shippingCurrencySymbol,
              totalPrice: totalPrice.toFixed(2)});
          if (itemPriceElementTemplate) {
            itemPriceElement.insertAdjacentHTML('afterend', HTML);
          }
          else {
            itemShippingElement.innerHTML = HTML;
          }
        }
      }
    }
  }
}
function processItemListing({listItemsSelector, itemPriceElementSelector, convertPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, convertShippingElementSelector, itemShippingElementTemplate = null}) {
  const content = qs({selector: listItemsSelector});
  if (content) {
    const priceElement = qs({selector: convertPriceElementSelector, scope: content}) || qs({selector: itemPriceElementSelector, scope: content});
    const shippingElement = qs({selector: convertShippingElementSelector, scope: content, contains: /\d/}) || qs({selector: itemShippingElementSelector, scope: content, contains: /\d/});
    if (priceElement && shippingElement) {
      const priceCurrencySymbol = findMatch(priceElement.textContent.trim(), /([^\d ]+) ?\d+\.\d+/);
      const shippingCurrencySymbol = findMatch(shippingElement.textContent.trim(), /([^\d ]+) ?\d+\.\d+/);
      if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
        const totalPrice = parseFloat(findMatch(priceElement.textContent.trim(), /(\d+\.\d+)/)) + parseFloat(findMatch(shippingElement.textContent.trim(), /(\d+\.\d+)/));
        const HTML = sprintf(
          itemShippingElementTemplate || itemPriceElementTemplate, {
            itemPrice: priceElement.textContent.trim(),
            itemShippingAmount: shippingElement.textContent.trim(),
            shippingCurrencySymbol: shippingCurrencySymbol,
            totalPrice: totalPrice.toFixed(2)});
        if (itemPriceElementTemplate) {
          priceElement.insertAdjacentHTML('afterend', HTML);
        }
        else {
          shippingElement.innerHTML = HTML;
        }
      }
    }
  }
}
const itemPriceElementTemplate = '<span class="total-price">{shippingCurrencySymbol}{totalPrice}</span>';
const options = {
  search: {
    identifierSelector: ['#mainContent ul.srp-results', '#mainContent ul.b-list__items_nofooter'],
    process: () => processListGallery({
      listItemsSelector: '#mainContent li.s-item',
      itemPriceElementSelector: '.s-item__price',
      itemShippingElementSelector: '.s-item__shipping',
      itemPriceElementTemplate: itemPriceElementTemplate
    })
  },
  sch: {
    identifierSelector: ['#mainContent ul#ListViewInner'],
    process: () => processListGallery({
      listItemsSelector: '#mainContent li',
      itemPriceElementSelector: '.lvprice span',
      itemShippingElementSelector: '.lvshipping span.fee',
      itemPriceElementTemplate: itemPriceElementTemplate
    })
  },
  itm: {
    identifierSelector: ['#mainContent form[name="viactiondetails"]'],
    process: () => processItemListing({
      listItemsSelector: '#mainContent',
      itemPriceElementSelector: '#prcIsum_bidPrice',
      convertPriceElementSelector: '#prcIsumConv',
      itemShippingElementSelector: '#fshippingCost',
      convertShippingElementSelector: '#convetedPriceId',
      itemPriceElementTemplate: itemPriceElementTemplate
    })
  }
};
function identifyMethod(option, value) {
  for (const [option, value] of Object.entries(options)) {
    for (let index = 0; index < value.identifierSelector.length; index++) {
      const selector = value.identifierSelector[index];
      const identifierNode = getNode(selector);
      if (identifierNode !== null) {
        value.process();
        return
      }
    }
  }
}
try {
  identifyMethod();
}
catch (error) {console.error(error);}
