import React from 'react'

// === Components === //
import { Row, Col, Switch, Space, Select } from '@douyinfe/semi-ui'
import { IconMoon, IconSun } from '@douyinfe/semi-icons'

// === Hooks === //
import useDark from '@/hooks/useDark'
import useI18n from '@/hooks/useI18n'

// === Utils === //
import map from 'lodash/map'

// === Constants === //
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/constants/i18n'

const Setting = () => {
  const { isDark, onChange } = useDark()
  const { value, onChange: onLanguageChange } = useI18n()
  return (
    <Row>
      <Col span={24}>
        <Space>
          {isDark ? <IconMoon style={{ color: '#fff' }} /> : <IconSun />}
          <Switch checked={isDark} checkedChildren="dark" unCheckedChildren="light" onChange={onChange} />
        </Space>
      </Col>
      <Col span={24}>
        <Space>
          <span>language:</span>
          <Select defaultValue={DEFAULT_LANGUAGE} value={value} onChange={onLanguageChange} style={{ width: 220 }}>
            {map(LANGUAGES, item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Col>
    </Row>
  )
}

export default Setting
