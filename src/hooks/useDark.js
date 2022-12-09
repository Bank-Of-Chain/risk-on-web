import { useState } from 'react'

const KEY = 'theme-mode'
const currentTheme = window.localStorage.getItem(KEY)

const useDark = () => {
  const [isDark, setIsDark] = useState(currentTheme === 'true')
  const onChange = value => {
    setIsDark(value)
    const body = document.getElementsByTagName('body')[0]
    if (body.hasAttribute('theme-mode')) {
      body.removeAttribute('theme-mode')
    } else {
      body.setAttribute('theme-mode', 'dark')
    }
    window.localStorage.setItem(KEY, value)
  }
  return { isDark, onChange }
}
export default useDark
