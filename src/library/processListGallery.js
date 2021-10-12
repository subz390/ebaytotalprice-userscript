import * as jsutils from '@subz390/jsutils'
import {getValue} from './getValue.js'
import {globals} from './globals.js'


export function processListGallery({listItemsSelector, itemPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, itemShippingElementTemplate = null}) {
  // console.log('listItemsSelector', listItemsSelector)
  const listItems = jsutils.qs({selector: listItemsSelector, all: true, array: true})
  // console.log('listItems', listItems)

  if (listItems) {
    for (let i=0; listItems[i]; i++) {
      const itemPriceElement = jsutils.qs({selector: itemPriceElementSelector, scope: listItems[i]})
      // console.log('itemPriceElement', itemPriceElement)

      const itemShippingElement = jsutils.qs({selector: itemShippingElementSelector, scope: listItems[i], contains: /\d/})
      // console.log('itemShippingElement', itemShippingElement)

      if (itemPriceElement && itemShippingElement) {
        const priceCurrencySymbol = jsutils.findMatch(itemPriceElement.textContent.trim(), globals.currencySymbolsRegExp)
        // console.log('priceCurrencySymbol', priceCurrencySymbol)

        const shippingCurrencySymbol = jsutils.findMatch(itemShippingElement.textContent.trim(), globals.currencySymbolsRegExp)
        // console.log('shippingCurrencySymbol', shippingCurrencySymbol)
        // console.log('shippingCurrencySymbol === priceCurrencySymbol', shippingCurrencySymbol, priceCurrencySymbol, shippingCurrencySymbol === priceCurrencySymbol)

        if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
          const totalPrice = ((getValue(itemPriceElement) + getValue(itemShippingElement)) / 100).toFixed(2)

          const HTML = jsutils.sprintf2({
            template: itemShippingElementTemplate || itemPriceElementTemplate,
            values: {
              itemPrice: itemPriceElement.textContent.trim(),
              itemShippingAmount: itemShippingElement.textContent.trim(),
              currencySymbol: shippingCurrencySymbol,
              totalPrice: totalPrice
            }})

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