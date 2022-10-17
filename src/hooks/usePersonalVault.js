import { useCallback, useEffect, useState } from 'react'

// === Utils === //
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

// === Hooks === //
import { useSelector } from 'react-redux'

// === Constants === //
import { IUNISWAPV3_RISK_ON_VAULT } from '@/constants'
import { Contract } from 'ethers'

const usePersonalVault = (array = []) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const userProvider = useSelector(state => state.walletReducer.userProvider)

  const load = useCallback(() => {
    if (isEmpty(array)) return
    setLoading(true)
    Promise.all(
      map(array, async address => {
        if (isEmpty(address)) return {}
        const contract = new Contract(address, IUNISWAPV3_RISK_ON_VAULT, userProvider)
        let name = address
        try {
          name = await contract.name()
        } catch (error) {}
        return {
          name,
          address,
          token: (await contract.getStatus())._wantToken,
          type: ''
        }
      })
    )
      .then(rs => {
        setData(rs)
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 300)
      })
  }, [array.toString(), userProvider])

  useEffect(() => {
    load()
  }, [load])

  return {
    data,
    loading
  }
}

export default usePersonalVault
