import * as jsutils from '@subz390/jsutils'
import {getValue} from './getValue.js'

export function processItemListing({listItemsSelector, itemPriceElementSelector, convertPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, convertShippingElementSelector, itemShippingElementTemplate = null}) {
  const content = jsutils.qs({selector: listItemsSelector})
  // console.log('content', content)

  if (content) {
    // when viewing international listings in foreign currency eBay provide an approximate conversion into local currency
    // so search for the approximate conversion element first
    const priceElement = jsutils.qs({selector: convertPriceElementSelector, scope: content}) || jsutils.qs({selector: itemPriceElementSelector, scope: content})
    // console.log('priceElement', priceElement)

    const shippingElement = jsutils.qs({selector: convertShippingElementSelector, scope: content, contains: /\d/}) || jsutils.qs({selector: itemShippingElementSelector, scope: content, contains: /\d/})
    // console.log('shippingElement', shippingElement)

    if (priceElement && shippingElement) {
      const priceCurrencySymbol = jsutils.findMatch(priceElement.textContent.trim(), /([^\d ]+) ?\d+\.\d+/)
      // console.log('priceCurrencySymbol', priceCurrencySymbol)

      const shippingCurrencySymbol = jsutils.findMatch(shippingElement.textContent.trim(), /([^\d ]+) ?\d+\.\d+/)
      // console.log('shippingCurrencySymbol', shippingCurrencySymbol)
      // console.log('shippingCurrencySymbol === priceCurrencySymbol', shippingCurrencySymbol, priceCurrencySymbol, shippingCurrencySymbol === priceCurrencySymbol)

      if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
        const totalPrice = ((getValue(itemPriceElement) + getValue(itemShippingElement)) / 100).toFixed(2)

        // template substitution properties {itemPrice} {itemShippingAmount} {shippingCurrencySymbol} {totalPrice}
        const HTML = jsutils.sprintf(
          itemShippingElementTemplate || itemPriceElementTemplate, {
            itemPrice: priceElement.textContent.trim(),
            itemShippingAmount: shippingElement.textContent.trim(),
            shippingCurrencySymbol: shippingCurrencySymbol,
            totalPrice: totalPrice})

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