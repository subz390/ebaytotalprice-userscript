// ==UserScript==
// @name         ebaytotalprice-userscript
// @namespace    https://github.com/subz390
// @version      2.2.0.210321235612
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

function realTypeOf(object, lowerCase = true) {
  if (typeof object !== 'object') {return typeof object}
  if (object === null) {return 'null'}
  const internalClass = Object.prototype.toString.call(object).slice(8, -1);
  return lowerCase === true ? internalClass.toLowerCase() : internalClass
}

function waitForMini({tryFor = 3, every = 100, test = () => false, success = () => null, timeout = () => null} = {}) {
  function leadingEdge() {
    const testResult = test();
    if (testResult) {
      success(testResult);
      return true
    }
    return false
  }
  if (leadingEdge() === false) {
    const intervalReference = setInterval(() => {
      const testResult = test();
      if (testResult) {
        clearInterval(intervalReference);
        clearTimeout(setTimeoutReference);
        success(testResult);
      }
    }, every);
    const setTimeoutReference = setTimeout(() => {
      clearInterval(intervalReference);
      timeout();
    }, tryFor * 1000);
  }
}

function getNode(node = '', debug = undefined, scope = document) {
  try {
    scope = scope === null ? document : scope;
    const nodeType = realTypeOf(node);
    if (nodeType == 'string') {
      if (node == '') {return null}
      let scopeType = realTypeOf(scope);
      if (scopeType == 'text') {
        return null
      }
      if (scopeType == 'string') {
        const tempScope = document.querySelector(scope);
        if (tempScope == null) {
          return null
        }
        scope = tempScope;
      }
      scopeType = realTypeOf(scope);
      if (scopeType.search(/array|nodelist|html/i) !== -1) {
        nodeType;
        const element = scope.querySelector(node);
        return element
      }
      else {
        return null
      }
    }
    else if (nodeType.search(/array|nodelist|html/i) !== -1) {
      return node
    }
    else {
      return null
    }
  }
  catch (error) {
    console.error(error);
  }
}

function appendStyle({style: styleString, className = undefined, whereAdjacent = 'afterend', whereTarget = 'body', tryFor = 5, failMessage = undefined}) {
  return new Promise((resolve, reject) => {
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(styleString));
    if (className) {styleElement.className = className;}
    function appendTarget(targetNode, styleElement) {
      if (whereAdjacent !== undefined) {
        return targetNode.insertAdjacentElement(whereAdjacent, styleElement)
      }
      else {
        return targetNode.appendChild(styleElement)
      }
    }
    waitForMini({
      tryFor: tryFor,
      every: 100,
      test: () => getNode(whereTarget),
      success: (targetNode) => {resolve(appendTarget(targetNode, styleElement));},
      timeout: () => reject(Error(failMessage || `appendStyle timed out whilst waiting for targetNode: ${whereTarget}`))
    });
  })
}

function findMatch(string, regex, index = 1) {
  if (string === null) return null
  const m = string.match(regex);
  return (m) ? (index=='all' ? m : (m[index] ? m[index] : m[0])) : null
}

function setDefault(paramOptions, paramDefault = undefined, paramAction = undefined, debug = undefined) {
  let globalObject;
  let globalOptions;
  let globalAction;
  let globalDefault;
  if (realTypeOf(paramOptions) === 'object') {
    function getValue(object, array) {
      const name = array.find(name => object.hasOwnProperty(name));
      if (typeof name !== 'undefined') {
        return object[name]
      }
      else {
        return undefined
      }
    }
    globalOptions = getValue(paramOptions, ['option', 'options', 'property', 'props', 'properties']);
    globalObject = getValue(paramOptions, ['object']);
    globalDefault = getValue(paramOptions, ['default']);
    globalAction = getValue(paramOptions, ['action', 'callback']);
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

function qs({selector = null, scope = document, array = false, all = false, contains = null, unittest = false, debugTag = ''} = {}) {
  const language = {
    en: {
      selectorUndefined: `${debugTag}selector is undefined`,
      scopeNotUseable: `${debugTag}scope is not useable`,
    }
  };
  if (unittest === 'language') {return language}
  try {
    if (selector === null) {
      console.error(language.en.selectorUndefined);
      return null
    }
    if (scope !== document) {
      scope = getNode(scope);
      if (scope === null) {
        return null
      }
    }
    if (unittest === 'scope') {return scope}
    if (unittest === 'options') {
      return {
        selector: selector,
        scope: scope,
        array: array,
        all: all,
        contains: contains,
        unittest: unittest
      }
    }
    if (all === true) {
      const staticNodeList = scope.querySelectorAll(selector);
      if (staticNodeList.length === 0) {return null}
      if (array === true) {
        if (contains !== null) {
          const tempArray = [];
          staticNodeList.forEach((element) => {
            if (element.textContent.search(contains) !== -1) {
              tempArray.push(element);
            }
          });
          if (tempArray.length === 0) {return null}
          else {return tempArray}
        }
        return Array.from(staticNodeList)
      }
      else {
        if (contains !== null) {
          for (let index = 0; index < staticNodeList.length; index++) {
            if (staticNodeList[index].textContent.search(contains) !== -1) {
              return staticNodeList
            }
          }
          return null
        }
        return staticNodeList
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
    return options.template.replace(options.regex, (match, n) => {
      for (let key = 1; args[key]; key++) {
        if (typeof args[key][n] == 'string' && args[key][n].length == 0) {
          return ''
        }
        else if (args[key][n]) {
          if (typeof args[key][n] == 'function') {
            return args[key][n]().toString()
          }
          return args[key][n]
        }
      }
      return match
    })
  }
  else {
    return options.template.replace(options.regex, (match, n) => {return args[n] || match})
  }
}

const globals = {
  priceMatchRegExp: /((\d+[,\.])+\d+)/,
  currencySymbolsRegExp: /((((AU|C|US) )?\$)|EUR|PHP|zł|£)/,
  itemPriceElementTemplate: '<span class="total-price">{currencySymbol}{totalPrice}</span>'
};

function processMethod(options) {
  try {
    function getMethod() {
      for (const [, method] of Object.entries(options)) {
        for (let index = 0; index < method.identifierSelector.length; index++) {
          const selector = method.identifierSelector[index];
          const identifierNode = getNode(selector);
          if (identifierNode !== null) {return method}
        }
      }
      return null
    }
    const method = getMethod(options);
    if (method !== null) {method.process();}
  }
  catch (error) {console.error(error);}
}

function getValue(element) {
  try {
    let value = findMatch(element.textContent.trim(), globals.priceMatchRegExp);
    value = value.replace(/[,\.]/g, '');
    value = parseFloat(value);
    return value
  }
  catch (error) {
    console.error(error);
    return null
  }
}

function processItemListing({listItemsSelector, itemPriceElementSelector, convertPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, convertShippingElementSelector, itemShippingElementTemplate = null}) {
  const content = qs({selector: listItemsSelector});
  if (content) {
    const itemPriceElement = qs({selector: convertPriceElementSelector, scope: content, contains: /\d/}) || qs({selector: itemPriceElementSelector, scope: content, contains: /\d/});
    const itemShippingElement = qs({selector: convertShippingElementSelector, scope: content, contains: /\d/}) || qs({selector: itemShippingElementSelector, scope: content, contains: /\d/});
    if (itemPriceElement && itemShippingElement) {
      const priceCurrencySymbol = findMatch(itemPriceElement.textContent.trim(), globals.currencySymbolsRegExp);
      const shippingCurrencySymbol = findMatch(itemShippingElement.textContent.trim(), globals.currencySymbolsRegExp);
      if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
        const totalPrice = ((getValue(itemPriceElement) + getValue(itemShippingElement)) / 100).toFixed(2);
        const HTML = sprintf(
          itemShippingElementTemplate || itemPriceElementTemplate, {
            itemPrice: itemPriceElement.textContent.trim(),
            itemShippingAmount: itemShippingElement.textContent.trim(),
            currencySymbol: shippingCurrencySymbol,
            totalPrice: totalPrice});
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

function processListGallery({listItemsSelector, itemPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, itemShippingElementTemplate = null}) {
  const listItems = qs({selector: listItemsSelector, all: true, array: true});
  if (listItems) {
    for (let i=0; listItems[i]; i++) {
      const itemPriceElement = qs({selector: itemPriceElementSelector, scope: listItems[i]});
      const itemShippingElement = qs({selector: itemShippingElementSelector, scope: listItems[i], contains: /\d/});
      if (itemPriceElement && itemShippingElement) {
        const priceCurrencySymbol = findMatch(itemPriceElement.textContent.trim(), globals.currencySymbolsRegExp);
        const shippingCurrencySymbol = findMatch(itemShippingElement.textContent.trim(), globals.currencySymbolsRegExp);
        if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
          const totalPrice = ((getValue(itemPriceElement) + getValue(itemShippingElement)) / 100).toFixed(2);
          const HTML = sprintf(
            itemShippingElementTemplate || itemPriceElementTemplate, {
              itemPrice: itemPriceElement.textContent.trim(),
              itemShippingAmount: itemShippingElement.textContent.trim(),
              currencySymbol: shippingCurrencySymbol,
              totalPrice: totalPrice});
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

var stylesheet = ".total-price{background:#bf0;color:#f00!important;outline:2px solid;padding:1px 4px;margin-left:5px;font-size:20px!important;font-weight:400!important;}.s-item__detail{overflow:visible!important;}";

appendStyle({style: stylesheet});
processMethod({
  search: {
    identifierSelector: ['#mainContent ul.srp-results', '#mainContent ul.b-list__items_nofooter'],
    process: () => processListGallery({
      listItemsSelector: '#mainContent li.s-item',
      itemPriceElementSelector: '.s-item__price',
      itemShippingElementSelector: '.s-item__shipping',
      itemPriceElementTemplate: globals.itemPriceElementTemplate
    })
  },
  sch: {
    identifierSelector: ['#mainContent ul#ListViewInner'],
    process: () => processListGallery({
      listItemsSelector: '#mainContent li',
      itemPriceElementSelector: '.lvprice span',
      itemShippingElementSelector: '.lvshipping span.fee',
      itemPriceElementTemplate: globals.itemPriceElementTemplate
    })
  },
  itm: {
    identifierSelector: ['#mainContent form[name="viactiondetails"]'],
    process: () => processItemListing({
      listItemsSelector: '#mainContent',
      itemPriceElementSelector: 'span[itemprop="price"]',
      convertPriceElementSelector: '#prcIsumConv',
      itemShippingElementSelector: '#fshippingCost',
      convertShippingElementSelector: '#convetedPriceId',
      itemPriceElementTemplate: globals.itemPriceElementTemplate
    })
  }
});
