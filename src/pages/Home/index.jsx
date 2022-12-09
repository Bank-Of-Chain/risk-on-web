import React from 'react'

// === Components === //
import { Row, Col, Typography, Card, Avatar, Space, Button } from '@douyinfe/semi-ui'

// === Styles === //
import styles from './style.module.less'
// const styles = require('./style.less')
console.log('styles=', styles, typeof styles)
const { Meta } = Card
const { Text } = Typography

const Home = () => {
  return (
    <Row>
      <Col span={24}>
        <Card
          style={{ maxWidth: 340 }}
          title={
            <Meta
              title="Semi Doc"
              description="全面、易用、优质"
              avatar={
                <Avatar
                  alt="Card meta img"
                  size="default"
                  src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
                />
              }
            />
          }
          headerExtraContent={
            <Text link>
              <span className={styles.abc}>More</span>
            </Text>
          }
          cover={
            <img
              alt="example"
              src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
            />
          }
          footerLine={true}
          footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
          footer={
            <Space>
              <Button theme="borderless" type="primary">
                精选案例
              </Button>
              <Button theme="solid" type="primary">
                开始使用
              </Button>
            </Space>
          }
        >
          Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
        </Card>
      </Col>
    </Row>
  )
}

export default Home
