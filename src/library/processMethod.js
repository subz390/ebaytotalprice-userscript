import * as jsutils from '@subz390/jsutils'

/**
 * @name processMethod
 * @version 1.1.0
 * @param {Object} options object
 */
export function processMethod(options) {
  try {
    function getMethod() {
      for (const [, method] of Object.entries(options)) {
        // console.log('method:', method)
        for (let index = 0; index < method.identifierSelector.length; index++) {
          const selector = method.identifierSelector[index]
          const identifierNode = jsutils.getNode(selector)
          // console.log('identifierNode:', identifierNode)
          if (identifierNode !== null) {return method}
        }
      }
      return null
    }

    const method = getMethod(options)
    if (method !== null) {method.process()}
    // console.info('processMethod: method not found')
  }
  catch (error) {console.error(error)}
}