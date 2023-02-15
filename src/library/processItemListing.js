import * as jsutils from '@subz390/jsutils'
import {getValue} from './getValue.js'
import {globals} from './globals.js'
import {findParent} from './findParent.js'

export function processItemListing({listItemsSelector, itemPriceElementSelector, convertPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, convertShippingElementSelector, itemShippingElementTemplate = null}) {
  const content = jsutils.qs({selector: listItemsSelector})
  // console.log('content', content)
  if (content) {
    // when viewing international listings in foreign currency eBay provide an approximate conversion into local currency
    // so search for the approximate conversion element first
    const itemPriceElement = jsutils.qs({selector: convertPriceElementSelector, scope: content, contains: /\d/}) || jsutils.qs({selector: itemPriceElementSelector, scope: content, contains: /\d/})
    // console.log('itemPriceElement', itemPriceElement?.textContent.trim(), itemPriceElement)

    // console.log('convertShippingElementSelector', convertShippingElementSelector)
    // console.log('itemShippingElementSelector', itemShippingElementSelector)
    let itemShippingElement = jsutils.qs({selector: convertShippingElementSelector, scope: content, contains: /\d/}) || jsutils.qs({selector: itemShippingElementSelector, scope: content, contains: /\d/})

    // if shipping not found then try using the findParent method
    if (itemShippingElement === null) {
      // Find postage using the postage parent method
      const postageSpan = jsutils.qs({selector: 'span', scope: content, contains: 'Postage:', all: true, array: true})
      // console.log('postageSpan', postageSpan[0])
      itemShippingElement = findParent({child: postageSpan[0], contains: /\d/})
      // console.log('itemShippingElement', itemShippingElement)
    }


    // console.log('itemShippingElement', itemShippingElement?.textContent.trim(), itemShippingElement)

    if (itemPriceElement && itemShippingElement) {
      const priceCurrencySymbol = jsutils.findMatch(itemPriceElement.textContent.trim(), globals.currencySymbolsRegExp)
      // console.log('priceCurrencySymbol', priceCurrencySymbol)

      const shippingCurrencySymbol = jsutils.findMatch(itemShippingElement.textContent.trim(), globals.currencySymbolsRegExp)
      // console.log('shippingCurrencySymbol', shippingCurrencySymbol)
      // console.log('shippingCurrencySymbol === priceCurrencySymbol', shippingCurrencySymbol, priceCurrencySymbol, shippingCurrencySymbol === priceCurrencySymbol)


      if (shippingCurrencySymbol && (shippingCurrencySymbol === priceCurrencySymbol)) {
        const totalPrice = ((getValue(itemPriceElement) + getValue(itemShippingElement)) / 100).toFixed(2)

        // ==========================================================
        // First Run
        const HTML = jsutils.sprintf2({
          template: itemShippingElementTemplate || itemPriceElementTemplate,
          values: {
            itemPrice: itemPriceElement.textContent.trim(),
            itemShippingAmount: itemShippingElement.textContent.trim(),
            currencySymbol: shippingCurrencySymbol,
            totalPrice: totalPrice
          }
        })

        if (itemPriceElementTemplate) {
          itemPriceElement.insertAdjacentHTML('afterend', HTML)
        }
        else {
          itemShippingElement.innerHTML = HTML
        }

        // ==========================================================
        // Create observer to watch for price changes
        const itemPriceElementObserver = new MutationObserver((mutationList, observer) => {
          mutationList.forEach((mutation) => {
            // console.log('mutation.type', mutation.type)
            // console.log('mutation.addedNodes', mutation.addedNodes)

            mutation.addedNodes.forEach((element) => {
              // console.log('element', element)
              if (element.nodeName == '#text') {
                const totalPriceElement = jsutils.getNode(globals.itemPriceElementTemplateSelector)
                // console.log('createTotalPriceElement', totalPriceElement)

                const totalPrice = ((getValue(itemPriceElement) + getValue(itemShippingElement)) / 100).toFixed(2)
                // console.log('totalPrice:', totalPrice)

                const totalPriceText = jsutils.sprintf2({
                  template: globals.itemPriceElementInnerTextTemplate,
                  values: {
                    itemPrice: itemPriceElement.textContent.trim(),
                    itemShippingAmount: itemShippingElement.textContent.trim(),
                    currencySymbol: shippingCurrencySymbol,
                    totalPrice: totalPrice
                  }
                })

                // console.log('totalPriceText:', totalPriceText)
                totalPriceElement.textContent = totalPriceText
              }
            })
          })
        })
        itemPriceElementObserver.observe(itemPriceElement, {childList: true})
      }
    }
  }
}
