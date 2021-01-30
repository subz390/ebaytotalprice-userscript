import * as jsutils from '@subz390/jsutils'

/**
 * @name getValue
 * @version 1.0.0
 * @param {Node} element to extract the numerical value out of
 * @return {Number} the extracted number, or null if there's an error
 * @description extract the numerical string from the textContent.
 * Remove the comma and period making the number into lowest common denominator.
 * Return the value as a number.
 */
export function getValue(element) {
  try {
    let value = jsutils.findMatch(element.textContent.trim(), /((\d+[,\.])+\d+)/)
    value = value.replace(/[,\.]/g, '')
    value = parseFloat(value)
    return value
  }
  catch (error) {
    console.error(error)
    return null
  }
}