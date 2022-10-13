import React, { useCallback, useEffect, useState } from 'react'

// === Components === //
import { Select } from 'antd'

// === Hooks === //
import { useSelector } from 'react-redux'
import useNameHooks from '@/hooks/useNameHooks'

// === Utils === //
import * as ethers from 'ethers'

// === Constants === //
import { USDC_ADDRESS, WETH_ADDRESS, ZERO_ADDRESS } from '@/constants/tokens'
import { VAULT_FACTORY_ABI } from '@/constants'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import flatten from 'lodash/flatten'
import { Spin } from 'antd'
import { filter } from 'lodash'

const { Option } = Select
const { Contract } = ethers

const tokens = [USDC_ADDRESS, WETH_ADDRESS]

const useRiskOnVault = vaultFactoryAddress => {
  const provider = useSelector(state => state.walletReducer.provider)
  const userProvider = useSelector(state => state.walletReducer.userProvider)
  const [vaultImplList, setVaultImplList] = useState([])
  const [personalVault, setPersonalVault] = useState([])
  const { data: tokenArray, loading: tokenLoading } = useNameHooks(tokens)
  const { data: typeArray, loading: typeLoading } = useNameHooks(vaultImplList)
  const [type, setType] = useState()
  const [token, setToken] = useState()

  const userAddress = provider?.selectedAddress

  const reset = () => {
    setToken()
    setType()
  }

  const typeSelector = (
    <Spin size="small" spinning={typeLoading}>
      <Select value={type} onChange={setType} size="small" style={{ minWidth: 200 }}>
        {map(typeArray, item => {
          const { name, address } = item
          return (
            <Option key={address} value={address}>
              {name}
            </Option>
          )
        })}
      </Select>
    </Spin>
  )

  const tokenSelector = (
    <Spin size="small" spinning={tokenLoading}>
      <Select value={token} onChange={setToken} size="small" style={{ minWidth: 200 }}>
        {map(tokenArray, item => {
          const { name, address } = item
          return (
            <Option key={address} value={address}>
              {name}
            </Option>
          )
        })}
      </Select>
    </Spin>
  )

  const addVault = useCallback(() => {
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract
      .connect(userProvider.getSigner())
      .createNewVault(token, type)
      .then(tx => tx.wait())
  }, [vaultFactoryAddress, userProvider, token, type])

  const getVaultImplList = useCallback(() => {
    if (isEmpty(vaultFactoryAddress) || isEmpty(userProvider)) return
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract.getVaultImplList().then(setVaultImplList)
  }, [vaultFactoryAddress, userProvider])

  const getVaultImplListByUser = useCallback(() => {
    if (isEmpty(vaultFactoryAddress) || isEmpty(userProvider) || isEmpty(vaultImplList)) return
    const vaultFactoryContract = new Contract(vaultFactoryAddress, VAULT_FACTORY_ABI, userProvider)
    const requestArray = map(vaultImplList, implAddress => {
      return [vaultFactoryContract.vaultAddressMap(userAddress, implAddress, 0), vaultFactoryContract.vaultAddressMap(userAddress, implAddress, 1)]
    })
    Promise.all(flatten(requestArray)).then(resp => {
      setPersonalVault(filter(resp, i => i !== ZERO_ADDRESS))
    })
  }, [userAddress, vaultFactoryAddress, userProvider, vaultImplList])

  useEffect(getVaultImplList, [getVaultImplList])

  useEffect(getVaultImplListByUser, [getVaultImplListByUser])

  const isSupport = true
  return {
    vaultFactoryAddress,
    isSupport,
    type,
    token,
    vaultImplList,
    personalVault,
    // elements
    typeSelector,
    tokenSelector,
    // functions
    reset,
    addVault
  }
}

export default useRiskOnVault
