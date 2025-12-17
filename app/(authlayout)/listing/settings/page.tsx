"use client"

import { useState } from "react"
import { Card, Form, Switch, InputNumber, Select, Button, Divider, message, Tabs, Radio, Input, Space } from "antd"
import { SaveOutlined } from "@ant-design/icons"

const { TabPane } = Tabs
const { Option } = Select

const Settings = () => {
  const [form] = Form.useForm()
  const [autoApproval, setAutoApproval] = useState(false)
  const [allowNewListings, setAllowNewListings] = useState(true)

  const onFinish = (values: any) => {
    // In a real app, call API to save settings
    console.log("Form values:", values)
    message.success("Settings saved successfully")
  }

  return (
    <div>
      <h1>Marketplace Settings</h1>

      <Tabs defaultActiveKey="general">
        <TabPane tab="General Settings" key="general">
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                autoApproval: false,
                allowNewListings: true,
                maxImagesPerListing: 10,
                defaultListingDuration: 30,
                featuredListingCriteria: "manual",
                trendingViewThreshold: 1000,
                trendingLikesThreshold: 50,
                listingApprovalMode: "manual",
              }}
            >
              <Divider orientation="left">Listing Approval</Divider>

              <Form.Item name="autoApproval" label="Auto-Approve New Listings" valuePropName="checked">
                <Switch checked={autoApproval} onChange={setAutoApproval} />
              </Form.Item>

              {autoApproval && (
                <>
                  <Form.Item name="listingApprovalMode" label="Auto-Approval Mode">
                    <Radio.Group>
                      <Radio value="all">All Listings</Radio>
                      <Radio value="trusted">Trusted Sellers Only</Radio>
                      <Radio value="conditional">Based on Conditions</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="trustedSellerThreshold"
                    label="Trusted Seller Threshold (minimum listings)"
                    hidden={form.getFieldValue("listingApprovalMode") !== "trusted"}
                  >
                    <InputNumber min={1} max={100} />
                  </Form.Item>
                </>
              )}

              <Form.Item
                name="allowNewListings"
                label="Allow New Listings"
                valuePropName="checked"
                tooltip="Turn off temporarily if you need to pause new listings"
              >
                <Switch checked={allowNewListings} onChange={setAllowNewListings} />
              </Form.Item>

              <Form.Item name="maxImagesPerListing" label="Maximum Images Per Listing">
                <InputNumber min={1} max={20} />
              </Form.Item>

              <Form.Item name="defaultListingDuration" label="Default Listing Duration (days)">
                <InputNumber min={1} max={365} />
              </Form.Item>

              <Divider orientation="left">Featured & Trending Listings</Divider>

              <Form.Item name="featuredListingCriteria" label="Featured Listing Selection">
                <Select>
                  <Option value="manual">Manual Selection Only</Option>
                  <Option value="automatic">Automatic Based on Performance</Option>
                  <Option value="hybrid">Hybrid (Manual + Automatic)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="trendingViewThreshold"
                label="Trending View Threshold"
                tooltip="Minimum views required to be considered trending"
              >
                <InputNumber min={100} step={100} />
              </Form.Item>

              <Form.Item
                name="trendingLikesThreshold"
                label="Trending Likes Threshold"
                tooltip="Minimum likes required to be considered trending"
              >
                <InputNumber min={10} step={10} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Save Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="Terms & Conditions" key="terms">
          <Card>
            <Form
              layout="vertical"
              onFinish={(values) => {
                message.success("Terms & Conditions updated")
                console.log(values)
              }}
              initialValues={{
                termsEnabled: true,
              }}
            >
              <Form.Item name="termsEnabled" label="Enable Terms & Conditions" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>

              <Form.Item name="termsContent" label="Terms & Conditions Content">
                <Input.TextArea rows={15} />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Save Terms
                  </Button>
                  <Button>Preview</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Settings
