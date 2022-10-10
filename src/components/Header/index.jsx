import React from 'react'

// === Components === //
import { Button } from 'antd'

// === Hooks === //
import { useSelector } from 'react-redux'
import useWallet from '@/hooks/useWallet'

// === Utils === //
import isEmpty from 'lodash/isEmpty'

const Header = () => {
  const { disconnect, connect } = useWallet()
  const provider = useSelector(state => state.walletReducer.provider)
  return (
    <div>
      Header, address:{provider?.selectedAddress}
      {!isEmpty(provider?.selectedAddress) ? (
        <Button type="primary" onClick={disconnect}>
          disconnect
        </Button>
      ) : (
        <Button type="primary" onClick={() => connect()}>
          connect
        </Button>
      )}
    </div>
  )
}

export default Header
