import * as jsutils from '@subz390/jsutils'

/**
 * @name processMethod
 * @version 1.0.0
 * @param {Object} options object
 */
export function processMethod(options) {
  try {
    for (const [, value] of Object.entries(options)) {
      // console.log('value:', value)
      for (let index = 0; index < value.identifierSelector.length; index++) {
        const selector = value.identifierSelector[index]
        const identifierNode = jsutils.getNode(selector)
        // console.log('identifierNode:', identifierNode)
        if (identifierNode !== null) {
          value.process()
          return
        }
      }
    }
  }
  catch (error) {console.error(error)}
}