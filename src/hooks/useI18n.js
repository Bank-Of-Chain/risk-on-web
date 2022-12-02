import { useState } from 'react'

// === Constants === //
import { DEFAULT_LANGUAGE } from '@/constants/i18n'

const useI18n = () => {
  const [value, setValue] = useState(DEFAULT_LANGUAGE)

  const onChange = val => {
    console.log('onChange, language:', val)
    setValue(val)
  }
  return { value, onChange }
}

export default useI18n
