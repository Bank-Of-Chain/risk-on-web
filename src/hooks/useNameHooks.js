// === Utils === //
import map from 'lodash/map'

// === Constants === //
import { USDC_ADDRESS, WETH_ADDRESS } from '@/constants/tokens'

const NAME_MAP = {
  [USDC_ADDRESS]: 'USDC',
  [WETH_ADDRESS]: 'WETH'
}

const useNameHooks = (array = []) => {
  return map(array, address => {
    return {
      name: NAME_MAP[address] || address,
      address
    }
  })
}

export default useNameHooks
