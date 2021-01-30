import * as jsutils from '@subz390/jsutils'
import {getValue} from './getValue.js'
import {globals} from './globals.js'

export function processItemListing({listItemsSelector, itemPriceElementSelector, convertPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, convertShippingElementSelector, itemShippingElementTemplate = null}) {
  const content = jsutils.qs({selector: listItemsSelector})
  // console.log('content', content)

  if (content) {
    // when viewing international listings in foreign currency eBay provide an approximate conversion into local currency
    // so search for the approximate conversion element first
    const itemPriceElement = jsutils.qs({selector: convertPriceElementSelector, scope: content, contains: /\d/}) || jsutils.qs({selector: itemPriceElementSelector, scope: content, contains: /\d/})
    // console.log('itemPriceElement', itemPriceElement.textContent.trim(), itemPriceElement)

    const itemShippingElement = jsutils.qs({selector: convertShippingElementSelector, scope: content, contains: /\d/}) || jsutils.qs({selector: itemShippingElementSelector, scope: content, contains: /\d/})
    // console.log('itemShippingElement', itemShippingElement.textContent.trim(), itemShippingElement)

    if (itemPriceElement && itemShippingElement) {
      const priceCurrencySymbol = jsutils.findMatch(itemPriceElement.textContent.trim(), globals.currencySymbolsRegExp)
      // console.log('priceCurrencySymbol', priceCurrencySymbol)

      const shippingCurrencySymbol = jsutils.findMatch(itemShippingElement.textContent.trim(), globals.currencySymbolsRegExp)
      // console.log('shippingCurrencySymbol', shippingCurrencySymbol)
      // console.log('shippingCurrencySymbol === priceCurrencySymbol', shippingCurrencySymbol, priceCurrencySymbol, shippingCurrencySymbol === priceCurrencySymbol)

      if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
        const totalPrice = ((getValue(itemPriceElement) + getValue(itemShippingElement)) / 100).toFixed(2)

        const HTML = jsutils.sprintf(
          itemShippingElementTemplate || itemPriceElementTemplate, {
            itemPrice: itemPriceElement.textContent.trim(),
            itemShippingAmount: itemShippingElement.textContent.trim(),
            currencySymbol: shippingCurrencySymbol,
            totalPrice: totalPrice})

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