// === Utils === //
import map from 'lodash/map'

// === Constants === //
import { LUSD_ADDRESS, USDC_ADDRESS, SUSD_ADDRESS, WETH_ADDRESS, GUSD_ADDRESS } from '@/constants/tokens'

const NAME_MAP = {
  [LUSD_ADDRESS]: 'LUSD',
  [USDC_ADDRESS]: 'USDC',
  [SUSD_ADDRESS]: 'SUSD',
  [WETH_ADDRESS]: 'WETH',
  [GUSD_ADDRESS]: 'GUSD'
}

const useNameHooks = (array = []) => {
  return map(array, address => {
    return {
      name: NAME_MAP[address],
      address
    }
  })
}

export default useNameHooks
