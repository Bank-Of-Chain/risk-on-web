import React from 'react'

// === Components === //
import { Spin } from 'antd'

// === Styles === //
import style from './style.module.css'

const Loading = props => {
  return (
    <div className={style.container}>
      <Spin {...props} />
    </div>
  )
}

export default Loading
