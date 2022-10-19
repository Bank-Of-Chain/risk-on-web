import { WETH_ADDRESS, USDC_ADDRESS } from './tokens'
import { BN_6, BN_18 } from './big-number'

const decimal = {
  [WETH_ADDRESS]: BN_18,
  [USDC_ADDRESS]: BN_6
}

export default decimal
