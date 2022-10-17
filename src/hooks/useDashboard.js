import { useCallback, useEffect, useState } from 'react'

// === Utils === //
import { Contract, BigNumber } from 'ethers'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

// === Hooks === //
import { useSelector } from 'react-redux'

// === Constants === //
import { IUNISWAPV3_RISK_ON_VAULT, IUNISWAPV3_RISK_ON_HELPER, VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, IERC20_ABI } from '@/constants'

const array = [
  { date: '2022-10-14', blockTag: 30246716 },
  { date: '2022-10-15', blockTag: 30276716 },
  { date: '2022-10-16', blockTag: 30306716 },
  { date: '2022-10-17', blockTag: 30336751 }
]

const useDashboard = personalVaultId => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const userProvider = useSelector(state => state.walletReducer.userProvider)

  const load = useCallback(() => {
    if (isEmpty(personalVaultId)) return
    setLoading(true)
    const vaultFactoryContract = new Contract(VAULT_FACTORY_ADDRESS, VAULT_FACTORY_ABI, userProvider)
    vaultFactoryContract.uniswapV3RiskOnHelper().then(helperAddress => {
      const contract = new Contract(personalVaultId, IUNISWAPV3_RISK_ON_VAULT, userProvider)
      const helperContract = new Contract(helperAddress, IUNISWAPV3_RISK_ON_HELPER, userProvider)
      return Promise.all([
        contract.borrowToken().then(async i => {
          const tokenContract = new Contract(i, IERC20_ABI, userProvider)
          return { borrowToken: i, name: await tokenContract.symbol(), borrowTokenDecimals: BigNumber.from(10).pow(await tokenContract.decimals()) }
        }),
        contract.wantToken().then(async i => {
          const tokenContract = new Contract(i, IERC20_ABI, userProvider)
          return { wantToken: i, name: await tokenContract.symbol(), wantTokenDecimals: BigNumber.from(10).pow(await tokenContract.decimals()) }
        })
      ]).then(([borrowInfo, wantInfo]) => {
        const { borrowToken } = borrowInfo
        const { wantToken } = wantInfo
        return Promise.all(
          map(array, item => {
            const { blockTag } = item
            return Promise.all([
              contract.netMarketMakingAmount({ blockTag }).catch(() => null),
              helperContract.getCurrentBorrow(borrowToken, 2, personalVaultId, { blockTag }).catch(() => null),
              helperContract.getTotalCollateralTokenAmount(personalVaultId, wantToken, { blockTag }).catch(() => null),
              contract.depositTo3rdPoolTotalAssets({ blockTag }).catch(() => null),
              contract.estimatedTotalAssets({ blockTag }).catch(() => null)
            ])
          })
        )
          .then(resp => {
            const nextData = map(array, (item, index) => {
              const { date } = item
              return {
                date,
                netMarketMakingAmount: resp[index][1],
                currentBorrow: resp[index][2],
                totalCollateralTokenAmount: resp[index][3],
                depositTo3rdPoolTotalAssets: resp[index][4],
                estimatedTotalAssets: resp[index][5]
              }
            })

            setData(nextData)
          })
          .finally(() => {
            setTimeout(() => {
              setLoading(false)
            }, 300)
          })
      })
    })
  }, [personalVaultId, userProvider])

  useEffect(load, [load])

  return {
    data,
    loading
  }
}

export default useDashboard
