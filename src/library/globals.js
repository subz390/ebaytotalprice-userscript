export const globals = {
  priceMatchRegExp: /((\d+[,\.])+\d+)/,
  // currencySymbolsRegExp: /((((AU|C|US) )?\$)|EUR|PHP|zł|£)/,
  currencySymbolsRegExp: /(\$|EUR|PHP|zł|£)/,
  itemPriceElementTemplate: '<span class="total-price">{currencySymbol}{totalPrice}</span>', // {itemPrice} {itemShippingAmount} {currencySymbol} {totalPrice}
  itemPriceElementTemplateSelector: 'span.total-price',
  itemPriceElementInnerTextTemplate: '{currencySymbol}{totalPrice}', // for updating the contents of the total price element with an observer
}