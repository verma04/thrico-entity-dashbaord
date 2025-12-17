"use client"

import { useState } from "react"
import { Form, Input, InputNumber, Select, Upload, Button, Card, message, Divider, Switch, Space } from "antd"
import { SaveOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { useRouter } from "next/navigation"

const { Option } = Select
const { TextArea } = Input

const AddListing = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [fileList, setFileList] = useState([])
  const [isFeatured, setIsFeatured] = useState(false)

  const onFinish = (values: any) => {
    // In a real app, call API to add the listing
    console.log("Form values:", values)
    message.success("Listing added successfully")
    router.push("/all-listings")
  }

  const handleCancel = () => {
    router.push("/all-listings")
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const categories = [
    "Vehicles",
    "Electronics",
    "Real Estate",
    "Furniture",
    "Clothing",
    "Services",
    "Books",
    "Sports & Outdoors",
    "Toys & Games",
    "Home & Garden",
  ]

  const conditions = ["New", "Used - Like New", "Used - Good", "Used - Fair", "Refurbished", "For parts"]

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Add New Listing</h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: "pending",
            price: 0,
            quantity: 1,
          }}
        >
          <Divider orientation="left">Basic Information</Divider>

          <Form.Item name="title" label="Listing Title" rules={[{ required: true, message: "Please enter a title" }]}>
            <Input placeholder="Enter a descriptive title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} placeholder="Describe your listing in detail" />
          </Form.Item>

          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Select a category">
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="condition"
              label="Condition"
              rules={[{ required: true, message: "Please select a condition" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Select condition">
                {conditions.map((condition) => (
                  <Option key={condition} value={condition}>
                    {condition}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please enter a price" }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                style={{ width: "100%" }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Please enter quantity" }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Divider orientation="left">Images</Divider>

          <Form.Item name="images" label="Upload Images" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Divider orientation="left">Listing Settings</Divider>

          <Form.Item name="status" label="Initial Status">
            <Select>
              <Option value="pending">Pending Approval</Option>
              <Option value="approved">Approved</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item name="featured" label="Featured Listing" valuePropName="checked">
            <Switch checked={isFeatured} onChange={setIsFeatured} />
          </Form.Item>

          {isFeatured && (
            <Form.Item name="featuredUntil" label="Featured Until">
              <Input type="date" />
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Listing
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AddListing
