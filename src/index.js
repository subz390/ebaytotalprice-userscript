import {findMatch, qs, getNode, sprintf, styleInject} from '@subz390/jsutils'
import stylesheet from './style.css'
styleInject(stylesheet)

function processListGallery({listItemsSelector, itemPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, itemShippingElementTemplate = null}) {
  // console.log('listItemsSelector', listItemsSelector)
  const listItems = qs({selector: listItemsSelector, all: true, array: true})
  // console.log('listItems', listItems)

  if (listItems) {
    for (let i=0; listItems[i]; i++) {
      const itemPriceElement = qs({selector: itemPriceElementSelector, scope: listItems[i]})
      // console.log('itemPriceElement', itemPriceElement)

      const itemShippingElement = qs({selector: itemShippingElementSelector, scope: listItems[i], contains: /\d/})
      // console.log('itemShippingElement', itemShippingElement)

      if (itemPriceElement && itemShippingElement) {
        const priceCurrencySymbol = findMatch(itemPriceElement.textContent.trim(), /(\$|£|EUR)/)
        // console.log('priceCurrencySymbol', priceCurrencySymbol)

        const shippingCurrencySymbol = findMatch(itemShippingElement.textContent.trim(), /(\$|£|EUR)/)
        // console.log('shippingCurrencySymbol', shippingCurrencySymbol)
        // console.log('shippingCurrencySymbol === priceCurrencySymbol', shippingCurrencySymbol, priceCurrencySymbol, shippingCurrencySymbol === priceCurrencySymbol)

        if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
          const totalPrice = parseFloat(findMatch(itemPriceElement.textContent.trim(), /(\d+[\.,]\d+)/).replace(',', '.')) +
                             parseFloat(findMatch(itemShippingElement.textContent.trim(), /(\d+[\.,]\d+)/).replace(',', '.'))

          // template substitution properties {itemShippingAmount} {shippingCurrencySymbol} {totalPrice}
          const HTML = sprintf(
            itemShippingElementTemplate || itemPriceElementTemplate, {
              itemPrice: itemPriceElement.textContent.trim(),
              itemShippingAmount: itemShippingElement.textContent.trim(),
              shippingCurrencySymbol: shippingCurrencySymbol,
              totalPrice: totalPrice.toFixed(2)})

          if (itemPriceElementTemplate) {
            itemPriceElement.insertAdjacentHTML('afterend', HTML)
          }
          else {
            itemShippingElement.innerHTML = HTML
          }
        }
      }
    }
  }
}

function processItemListing({listItemsSelector, itemPriceElementSelector, convertPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, convertShippingElementSelector, itemShippingElementTemplate = null}) {
  const content = qs({selector: listItemsSelector})
  // console.log('content', content)

  if (content) {
    // when viewing international listings in foreign currency eBay provide an approximate conversion into local currency
    // so search for the approximate conversion element first
    const priceElement = qs({selector: convertPriceElementSelector, scope: content}) || qs({selector: itemPriceElementSelector, scope: content})
    // console.log('priceElement', priceElement)

    const shippingElement = qs({selector: convertShippingElementSelector, scope: content, contains: /\d/}) || qs({selector: itemShippingElementSelector, scope: content, contains: /\d/})
    // console.log('shippingElement', shippingElement)

    if (priceElement && shippingElement) {
      const priceCurrencySymbol = findMatch(priceElement.textContent.trim(), /([^\d ]+) ?\d+\.\d+/)
      // console.log('priceCurrencySymbol', priceCurrencySymbol)

      const shippingCurrencySymbol = findMatch(shippingElement.textContent.trim(), /([^\d ]+) ?\d+\.\d+/)
      // console.log('shippingCurrencySymbol', shippingCurrencySymbol)
      // console.log('shippingCurrencySymbol === priceCurrencySymbol', shippingCurrencySymbol, priceCurrencySymbol, shippingCurrencySymbol === priceCurrencySymbol)

      if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
        const totalPrice = parseFloat(findMatch(priceElement.textContent.trim(), /(\d+\.\d+)/)) + parseFloat(findMatch(shippingElement.textContent.trim(), /(\d+\.\d+)/))

        // template substitution properties {itemPrice} {itemShippingAmount} {shippingCurrencySymbol} {totalPrice}
        const HTML = sprintf(
          itemShippingElementTemplate || itemPriceElementTemplate, {
            itemPrice: priceElement.textContent.trim(),
            itemShippingAmount: shippingElement.textContent.trim(),
            shippingCurrencySymbol: shippingCurrencySymbol,
            totalPrice: totalPrice.toFixed(2)})

        if (itemPriceElementTemplate) {
          priceElement.insertAdjacentHTML('afterend', HTML)
        }
        else {
          shippingElement.innerHTML = HTML
        }
      }
    }
  }
}

// total price element inserted into the page
const itemPriceElementTemplate = '<span class="total-price">{shippingCurrencySymbol}{totalPrice}</span>'

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
}

function identifyMethod(option, value) {
  for (const [option, value] of Object.entries(options)) {
    // console.log('option: value', option, value)
    for (let index = 0; index < value.identifierSelector.length; index++) {
      const selector = value.identifierSelector[index]
      const identifierNode = getNode(selector)
      // console.log('identifierNode', option, identifierNode)
      if (identifierNode !== null) {
        value.process()
        return
      }
    }
  }
}

try {
  identifyMethod()
}
catch (error) {console.error(error)}
