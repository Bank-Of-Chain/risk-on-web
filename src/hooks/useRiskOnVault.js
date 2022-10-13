import React, { useCallback, useEffect, useState } from 'react'

// === Components === //
import { Select } from 'antd'

// === Hooks === //
import { useSelector } from 'react-redux'
import useNameHooks from '@/hooks/useNameHooks'

// === Utils === //
import * as ethers from 'ethers'

// === Constants === //
import { USDC_ADDRESS, WETH_ADDRESS } from '@/constants/tokens'
import { VAULT_FACTORY_ABI } from '@/constants'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

const { Option } = Select
const { Contract } = ethers

const tokens = [USDC_ADDRESS, WETH_ADDRESS]

const useRiskOnVault = vaultFactoryAddress => {
  const provider = useSelector(state => state.walletReducer.provider)
  const userProvider = useSelector(state => state.walletReducer.userProvider)
  const [vaultImplList, setVaultImplList] = useState([])
  const tokenArray = useNameHooks(tokens)
  const typeArray = useNameHooks(vaultImplList)
  const [type, setType] = useState()
  const [token, setToken] = useState()

  const userAddress = provider?.selectedAddress

  const reset = () => {
    setToken()
    setType()
  }

  const typeSelector = (
    <Select value={type} onChange={setType} size="small" style={{ width: 120 }}>
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
    <Select value={token} onChange={setToken} size="small" style={{ width: 120 }}>
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

  const addVault = useCallback(() => {
    const UniswapV3RiskOnHelper = '0x47Ec97bFC4E57937087cA8B44B60DeEC860d31a4'
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract.connect(userProvider.getSigner()).createNewVault(token, UniswapV3RiskOnHelper, type)
  }, [vaultFactoryAddress, userProvider, token, type])

  const getVaultImplList = useCallback(() => {
    if (isEmpty(vaultFactoryAddress) || isEmpty(userProvider)) return
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract.getVaultImplList().then(setVaultImplList)
  }, [vaultFactoryAddress, userProvider])

  const getVaultImplListByUser = useCallback(() => {
    if (isEmpty(vaultFactoryAddress) || isEmpty(userProvider)) return
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract.getVaultImplList().then(setVaultImplList)
    const requestArray = map(vaultImplList, i => {
      return vaultFactoryContract.vaultAddressMap(userAddress, i, 0)
    })
    Promise.all(requestArray).then(console.log)
  }, [userAddress, vaultFactoryAddress, userProvider])

  useEffect(getVaultImplList, [getVaultImplList])

  useEffect(getVaultImplListByUser, [getVaultImplListByUser])

  const isSupport = true
  return {
    vaultFactoryAddress,
    isSupport,
    type,
    token,
    vaultImplList,
    // elements
    typeSelector,
    tokenSelector,
    // functions
    reset,
    addVault
  }
}

export default useRiskOnVault
