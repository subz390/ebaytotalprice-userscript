import {dlh, findMatch, qs, sprintf, styleInject} from '@subz390/jsutils'
import stylesheet from './style.css'
styleInject(stylesheet)

function processListGallery({listItemsSelector, itemPriceElementSelector, itemPriceElementTemplate = null, itemShippingElementSelector, itemShippingElementTemplate = null}) {
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


try {
  // total price element inserted into the page
  const itemPriceElementTemplate = '<span class="total-price">{shippingCurrencySymbol}{totalPrice}</span>'

  // New Gallery Listings
  if (dlh('\\/(b|str)\\/')) {
    processListGallery({
      listItemsSelector: '.s-item',
      itemPriceElementSelector: '.s-item__price',
      itemShippingElementSelector: '.s-item__shipping',
      itemPriceElementTemplate: itemPriceElementTemplate
    })
  }
  // Original style Gallery Listings
  else if (dlh('\\/sch\\/')) {
    processListGallery({
      listItemsSelector: '#mainContent li',
      itemPriceElementSelector: '.lvprice span',
      itemShippingElementSelector: '.lvshipping span.fee',
      itemPriceElementTemplate: itemPriceElementTemplate
    })
  }
  // Auction item pages
  else if (dlh('\\/itm\\/')) {
    processItemListing({
      listItemsSelector: '#mainContent',
      itemPriceElementSelector: '#prcIsum_bidPrice',
      convertPriceElementSelector: '#prcIsumConv',
      itemShippingElementSelector: '#fshippingCost',
      convertShippingElementSelector: '#convetedPriceId',
      itemPriceElementTemplate: itemPriceElementTemplate
    })
  }
}
catch (error) {console.error(error)}
