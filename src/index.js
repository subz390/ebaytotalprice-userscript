import * as jsutils from '@subz390/jsutils'
import {globals} from './library/globals.js'
import {processMethod} from './library/processMethod.js'
import {processItemListing} from './library/processItemListing.js'
import {processListGallery} from './library/processListGallery.js'

import stylesheet from './style.css'
jsutils.styleInject(stylesheet)


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
})