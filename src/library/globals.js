export const globals = {
  priceMatchRegExp: /((\d+[,\.])+\d+)/,
  currencySymbolsRegExp: /((((AU|C|US) )?\$)|EUR|PHP|zł|£)/,
  itemPriceElementTemplate: '<span class="total-price">{currencySymbol}{totalPrice}</span>' // {itemPrice} {itemShippingAmount} {currencySymbol} {totalPrice}
}