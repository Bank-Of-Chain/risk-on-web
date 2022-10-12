import React, { useState } from 'react'

// === Components === //
import { Select } from 'antd'

// === Hooks === //
import useNameHooks from '@/hooks/useNameHooks'

// === Constants === //
import { LUSD_ADDRESS, USDC_ADDRESS, SUSD_ADDRESS, WETH_ADDRESS, GUSD_ADDRESS } from '@/constants/tokens'
import { map } from 'lodash'

const { Option } = Select

const tokens = [LUSD_ADDRESS, USDC_ADDRESS, SUSD_ADDRESS]
const types = [WETH_ADDRESS, GUSD_ADDRESS]

const useRiskOnVault = vaultAddress => {
  const tokenArray = useNameHooks(tokens)
  const typeArray = useNameHooks(types)
  const [type, setType] = useState(types[0])
  const [token, setToken] = useState(tokens[0])

  console.log('type=', type, token)
  const reset = () => {
    setToken(tokens[0])
    setType(types[0])
  }

  const typeSelector = (
    <Select value={type} onChange={setType} size="small">
      {map(typeArray, item => {
        const { name, address } = item
        return (
          <Option key={address} value={address}>
            {name}
          </Option>
        )
      })}
    </Select>
  )

  const tokenSelector = (
    <Select value={token} onChange={setToken} size="small">
      {map(tokenArray, item => {
        const { name, address } = item
        return (
          <Option key={address} value={address}>
            {name}
          </Option>
        )
      })}
    </Select>
  )

  const isSupport = true
  return {
    vaultAddress,
    isSupport,
    type,
    token,
    // elements
    typeSelector,
    tokenSelector,
    // functions
    reset
  }
}

export default useRiskOnVault
