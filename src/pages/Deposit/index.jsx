import React from 'react'

// === Components === //
import { Link, useParams } from 'react-router-dom'
import { Button } from 'antd'

const Deposit = () => {
  const params = useParams()
  return (
    <div>
      <p>Deposit-{params?.vaultId}</p>
      <Button type="primary">
        <Link to="/">go to /home</Link>
      </Button>
      <Button type="primary">
        <Link to="/analysis">go to /analysis</Link>
      </Button>
    </div>
  )
}

export default Deposit
