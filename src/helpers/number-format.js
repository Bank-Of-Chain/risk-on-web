import BN from 'bignumber.js'
import isNil from 'lodash/isNil'
import isNull from 'lodash/isNull'
import isEmpty from 'lodash/isEmpty'

export const toFixed = (value, precision = 1, ...args) => {
  if (isNil(value)) return undefined
  if (isNull(precision)) return value.toString()
  const precisionBN = BN(precision.toString())
  if (isEmpty(value) || precisionBN.isZero()) {
    return '0'
  }
  const results = BN(value.toString()).div(precisionBN)
  if (results.isInteger()) {
    return results.toFixed()
  }
  return results.toFixed(...args)
}
