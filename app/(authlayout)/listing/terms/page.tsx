"use client"

import { useState } from "react"
import { Card, Form, Input, Button, Switch, Space, message, Tabs, Divider } from "antd"
import { SaveOutlined, EyeOutlined } from "@ant-design/icons"

const { TabPane } = Tabs
const { TextArea } = Input

const TermsAndConditions = () => {
  const [form] = Form.useForm()
  const [previewMode, setPreviewMode] = useState(false)
  const [termsContent, setTermsContent] = useState(`
# Marketplace Terms and Conditions

## 1. Introduction

Welcome to our Marketplace. These Terms and Conditions govern your use of our platform and services.

## 2. Listing Guidelines

### 2.1 Prohibited Items
The following items are prohibited from being listed on our marketplace:
- Illegal items or services
- Counterfeit goods
- Dangerous or hazardous materials
- Items that infringe on intellectual property rights
- Adult content or services

### 2.2 Listing Requirements
All listings must:
- Include accurate descriptions
- Use appropriate categories
- Show clear images of the actual item
- Include all relevant details about condition, dimensions, etc.
- Specify shipping options and costs

## 3. User Conduct

Users must:
- Provide accurate information
- Communicate respectfully with other users
- Honor commitments to buy or sell
- Not engage in price manipulation or fraudulent activities

## 4. Fees and Payments

- Listing fees may apply depending on the category
- Commission fees are charged on successful sales
- Payment processing fees may apply
- All fees are non-refundable unless otherwise stated

## 5. Dispute Resolution

- Users should attempt to resolve disputes directly
- Our platform provides mediation services for unresolved disputes
- We reserve the right to make final decisions on disputes

## 6. Termination

We reserve the right to terminate or suspend accounts that violate these terms.

## 7. Changes to Terms

We may update these terms from time to time. Users will be notified of significant changes.

## 8. Contact Information

For questions about these terms, please contact support@marketplace.com
  `)

  const onFinish = (values: any) => {
    // In a real app, call API to save terms
    console.log("Form values:", values)
    setTermsContent(values.termsContent)
    message.success("Terms & Conditions updated successfully")
  }

  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  return (
    <div>
      <h1>Terms & Conditions Management</h1>

      <Tabs defaultActiveKey="edit">
        <TabPane tab="Edit Terms" key="edit">
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                termsEnabled: true,
                termsContent: termsContent,
              }}
            >
              <Form.Item name="termsEnabled" label="Enable Terms & Conditions" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>

              <Form.Item
                name="termsContent"
                label="Terms & Conditions Content"
                rules={[{ required: true, message: "Please enter terms content" }]}
              >
                <TextArea rows={20} />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Save Terms
                  </Button>
                  <Button icon={<EyeOutlined />} onClick={togglePreview}>
                    {previewMode ? "Edit Mode" : "Preview Mode"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="Preview" key="preview">
          <Card>
            <div
              style={{ padding: "20px" }}
              dangerouslySetInnerHTML={{
                __html: termsContent.replace(/\n/g, "<br>").replace(/#{1,6}\s?(.*)/g, "<h3>$1</h3>"),
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="History" key="history">
          <Card>
            <p>Terms & Conditions revision history will be displayed here.</p>
            <Divider />
            <ul>
              <li>Version 3.0 - Updated on May 15, 2023 by admin1</li>
              <li>Version 2.5 - Updated on February 10, 2023 by admin2</li>
              <li>Version 2.0 - Updated on November 5, 2022 by admin1</li>
              <li>Version 1.5 - Updated on August 20, 2022 by admin3</li>
              <li>Version 1.0 - Created on June 1, 2022 by admin1</li>
            </ul>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default TermsAndConditions
