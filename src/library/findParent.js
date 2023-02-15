/**
 * # findParent
 * Function that bubbles up the DOM from the `child` node, to find the parent node of that child, which contains the defined text string.
 * Returns the child node if the child contains the text string.
 *
 * @param {{child:(CSSselectorString|node), contains:(string|RegExp)}} options object
 * @return {null|node} parentNode or null if no parent found
 */
export function findParent({child, contains = null}) {
  if (contains === null) return null
  let parentNodeElement = child

  for (let i = 1; parentNodeElement.isEqualNode(document) === false; i++) {
    if (parentNodeElement.textContent.search(contains) !== -1) {
      // console.log('parentNodeElement:', i, parentNodeElement)
      return parentNodeElement
    }

    parentNodeElement = parentNodeElement.parentNode
  }

  return null
}
