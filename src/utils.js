function reverseDict (dict) {
  var newDict = {}
  for (var key in dict) {
    newDict[dict[key]] = key
  }
  return newDict
}

function isInt (n) {
  return n % 1 === 0
}

export { reverseDict, isInt }
