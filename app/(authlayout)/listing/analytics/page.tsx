"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, Select, Table, Divider, DatePicker } from "antd"
import { ShopOutlined, UserOutlined, EyeOutlined, LikeOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { Line, Pie, Column } from "@ant-design/plots"

const { RangePicker } = DatePicker

interface CategoryData {
  category: string
  count: number
  percentage: number
}

interface ConditionData {
  condition: string
  count: number
  percentage: number
}

interface UserData {
  username: string
  listingsCount: number
  viewsCount: number
  likesCount: number
}

interface TrendData {
  date: string
  listings: number
  views: number
  likes: number
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("month")
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [conditionData, setConditionData] = useState<ConditionData[]>([])
  const [userData, setUserData] = useState<UserData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Category data
    const mockCategoryData: CategoryData[] = [
      { category: "Vehicles", count: 245, percentage: 24.5 },
      { category: "Electronics", count: 198, percentage: 19.8 },
      { category: "Real Estate", count: 156, percentage: 15.6 },
      { category: "Furniture", count: 132, percentage: 13.2 },
      { category: "Clothing", count: 98, percentage: 9.8 },
      { category: "Services", count: 87, percentage: 8.7 },
      { category: "Other", count: 84, percentage: 8.4 },
    ]

    // Condition data
    const mockConditionData: ConditionData[] = [
      { condition: "New", count: 420, percentage: 42.0 },
      { condition: "Used - Like New", count: 210, percentage: 21.0 },
      { condition: "Used - Good", count: 180, percentage: 18.0 },
      { condition: "Used - Fair", count: 110, percentage: 11.0 },
      { condition: "Refurbished", count: 50, percentage: 5.0 },
      { condition: "For parts", count: 30, percentage: 3.0 },
    ]

    // Top users data
    const mockUserData: UserData[] = [
      { username: "john_doe", listingsCount: 45, viewsCount: 12500, likesCount: 780 },
      { username: "jane_smith", listingsCount: 38, viewsCount: 9800, likesCount: 620 },
      { username: "robert_johnson", listingsCount: 32, viewsCount: 8200, likesCount: 540 },
      { username: "emily_davis", listingsCount: 29, viewsCount: 7500, likesCount: 490 },
      { username: "michael_wilson", listingsCount: 25, viewsCount: 6800, likesCount: 420 },
      { username: "sarah_brown", listingsCount: 22, viewsCount: 5900, likesCount: 380 },
      { username: "david_miller", listingsCount: 20, viewsCount: 5200, likesCount: 340 },
      { username: "lisa_taylor", listingsCount: 18, viewsCount: 4800, likesCount: 310 },
      { username: "james_anderson", listingsCount: 16, viewsCount: 4200, likesCount: 280 },
      { username: "jennifer_thomas", listingsCount: 15, viewsCount: 3900, likesCount: 260 },
    ]

    // Trend data for the last 30 days
    const mockTrendData: TrendData[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))

      return {
        date: date.toISOString().split("T")[0],
        listings: Math.floor(Math.random() * 20) + 10,
        views: Math.floor(Math.random() * 1000) + 500,
        likes: Math.floor(Math.random() * 100) + 50,
      }
    })

    setCategoryData(mockCategoryData)
    setConditionData(mockConditionData)
    setUserData(mockUserData)
    setTrendData(mockTrendData)
  }, [])

  const categoryColumns: ColumnsType<CategoryData> = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Listings",
      dataIndex: "count",
      key: "count",
      sorter: (a, b) => a.count - b.count,
      defaultSortOrder: "descend",
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      render: (percentage) => `${percentage}%`,
    },
  ]

  const conditionColumns: ColumnsType<ConditionData> = [
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
    },
    {
      title: "Listings",
      dataIndex: "count",
      key: "count",
      sorter: (a, b) => a.count - b.count,
      defaultSortOrder: "descend",
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      render: (percentage) => `${percentage}%`,
    },
  ]

  const userColumns: ColumnsType<UserData> = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Listings",
      dataIndex: "listingsCount",
      key: "listingsCount",
      sorter: (a, b) => a.listingsCount - b.listingsCount,
      defaultSortOrder: "descend",
    },
    {
      title: "Views",
      dataIndex: "viewsCount",
      key: "viewsCount",
      sorter: (a, b) => a.viewsCount - b.viewsCount,
    },
    {
      title: "Likes",
      dataIndex: "likesCount",
      key: "likesCount",
      sorter: (a, b) => a.likesCount - b.likesCount,
    },
  ]

  // Calculate totals
  const totalListings = categoryData.reduce((sum, item) => sum + item.count, 0)
  const totalViews = userData.reduce((sum, item) => sum + item.viewsCount, 0)
  const totalLikes = userData.reduce((sum, item) => sum + item.likesCount, 0)

  // Prepare data for charts
  const categoryPieData = categoryData.map((item) => ({
    type: item.category,
    value: item.count,
  }))

  const conditionPieData = conditionData.map((item) => ({
    type: item.condition,
    value: item.count,
  }))

  const lineConfig = {
    data: trendData,
    xField: "date",
    yField: "views",
    smooth: true,
    point: {
      size: 3,
    },
  }

  const columnConfig = {
    data: trendData,
    xField: "date",
    yField: "listings",
    columnWidthRatio: 0.8,
    label: {
      position: "middle",
    },
  }

  const categoryPieConfig = {
    data: categoryPieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
    },
    interactions: [{ type: "element-active" }],
  }

  const conditionPieConfig = {
    data: conditionPieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
    },
    interactions: [{ type: "element-active" }],
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Analytics Dashboard</h1>
        <div style={{ display: "flex", gap: 16 }}>
          <Select
            defaultValue="month"
            style={{ width: 120 }}
            onChange={setTimeRange}
            options={[
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "quarter", label: "This Quarter" },
              { value: "year", label: "This Year" },
            ]}
          />
          <RangePicker />
        </div>
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Listings" value={totalListings} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Users" value={userData.length} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Views" value={totalViews} prefix={<EyeOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Likes" value={totalLikes} prefix={<LikeOutlined />} />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Listing Trends</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Daily Views">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Daily New Listings">
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Category & Condition Distribution</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Listings by Category">
            <Pie {...categoryPieConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Listings by Condition">
            <Pie {...conditionPieConfig} />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Top Categories</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Top Categories">
            <Table columns={categoryColumns} dataSource={categoryData} rowKey="category" pagination={false} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top Conditions">
            <Table columns={conditionColumns} dataSource={conditionData} rowKey="condition" pagination={false} />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Top Users</Divider>

      <Card title="Top Users by Listings">
        <Table columns={userColumns} dataSource={userData} rowKey="username" pagination={false} />
      </Card>
    </div>
  )
}

export default Analytics
