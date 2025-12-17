"use client"

import { useState, useEffect } from "react"
import { Table, Card, Tag, DatePicker, Button, Select, Input, Modal } from "antd"
import { SearchOutlined, FileTextOutlined, EyeOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"

const { RangePicker } = DatePicker
const { Option } = Select

interface LogData {
  id: string
  action: string
  listingId: string
  listingTitle: string
  performedBy: string
  details: string
  timestamp: string
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<LogData[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogData[]>([])
  const [searchText, setSearchText] = useState("")
  const [selectedLog, setSelectedLog] = useState<LogData | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const actions = [
      "listing_created",
      "listing_updated",
      "listing_deleted",
      "listing_approved",
      "listing_rejected",
      "listing_featured",
      "listing_unfeatured",
      "listing_reported",
      "report_resolved",
      "report_dismissed",
    ]

    const mockData: LogData[] = Array.from({ length: 50 }, (_, i) => {
      const action = actions[Math.floor(Math.random() * actions.length)]
      const listingId = `L${Math.floor(Math.random() * 1000) + 1}`
      const listingTitle = `Sample Listing ${Math.floor(Math.random() * 1000) + 1}`
      const performedBy = `admin${Math.floor(Math.random() * 5) + 1}`

      let details = ""
      switch (action) {
        case "listing_created":
          details = `New listing "${listingTitle}" was created`
          break
        case "listing_updated":
          details = `Listing "${listingTitle}" was updated. Fields changed: title, price, description`
          break
        case "listing_deleted":
          details = `Listing "${listingTitle}" was deleted`
          break
        case "listing_approved":
          details = `Listing "${listingTitle}" was approved and is now visible in the marketplace`
          break
        case "listing_rejected":
          details = `Listing "${listingTitle}" was rejected due to policy violation`
          break
        case "listing_featured":
          details = `Listing "${listingTitle}" was marked as featured`
          break
        case "listing_unfeatured":
          details = `Listing "${listingTitle}" was removed from featured listings`
          break
        case "listing_reported":
          details = `Listing "${listingTitle}" was reported by a user for "Prohibited item"`
          break
        case "report_resolved":
          details = `Report for listing "${listingTitle}" was resolved and the listing was removed`
          break
        case "report_dismissed":
          details = `Report for listing "${listingTitle}" was dismissed and the listing remains active`
          break
      }

      // Generate a random date within the last 30 days
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))

      return {
        id: `${i + 1}`,
        action,
        listingId,
        listingTitle,
        performedBy,
        details,
        timestamp: date.toISOString(),
      }
    })

    // Sort by timestamp (newest first)
    mockData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setLogs(mockData)
    setFilteredLogs(mockData)
  }, [])

  const handleSearch = () => {
    let filtered = [...logs]

    if (searchText) {
      filtered = filtered.filter(
        (log) =>
          log.listingTitle.toLowerCase().includes(searchText.toLowerCase()) ||
          log.performedBy.toLowerCase().includes(searchText.toLowerCase()) ||
          log.details.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    setFilteredLogs(filtered)
  }

  const handleReset = () => {
    setSearchText("")
    setFilteredLogs(logs)
  }

  const handleViewDetails = (log: LogData) => {
    setSelectedLog(log)
    setIsModalVisible(true)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getActionColor = (action: string) => {
    if (action.includes("created") || action.includes("approved")) {
      return "green"
    } else if (action.includes("updated") || action.includes("featured") || action.includes("unfeatured")) {
      return "blue"
    } else if (action.includes("deleted") || action.includes("rejected") || action.includes("reported")) {
      return "red"
    } else if (action.includes("resolved")) {
      return "green"
    } else if (action.includes("dismissed")) {
      return "orange"
    }
    return "default"
  }

  const formatActionName = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const columns: ColumnsType<LogData> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action) => <Tag color={getActionColor(action)}>{formatActionName(action)}</Tag>,
      filters: Array.from(new Set(logs.map((item) => item.action))).map((action) => ({
        text: formatActionName(action),
        value: action,
      })),
      onFilter: (value, record) => record.action === value,
    },
    {
      title: "Listing",
      dataIndex: "listingTitle",
      key: "listingTitle",
      render: (text, record) => <a>{`${text} (${record.listingId})`}</a>,
    },
    {
      title: "Performed By",
      dataIndex: "performedBy",
      key: "performedBy",
      filters: Array.from(new Set(logs.map((item) => item.performedBy))).map((user) => ({
        text: user,
        value: user,
      })),
      onFilter: (value, record) => record.performedBy === value,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => formatTimestamp(timestamp),
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
          Details
        </Button>
      ),
    },
  ]

  return (
    <div>
      <h1>Audit Logs</h1>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <Input
            placeholder="Search logs..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            allowClear
          />

          <Select placeholder="Filter by action" style={{ width: 200 }} allowClear>
            {Array.from(new Set(logs.map((item) => item.action))).map((action) => (
              <Option key={action} value={action}>
                {formatActionName(action)}
              </Option>
            ))}
          </Select>

          <RangePicker style={{ width: 300 }} />

          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>

          <Button onClick={handleReset}>Reset</Button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <Button icon={<FileTextOutlined />}>Export Logs</Button>
        </div>

        <Table columns={columns} dataSource={filteredLogs} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title="Log Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedLog && (
          <div>
            <p>
              <strong>Log ID:</strong> {selectedLog.id}
            </p>
            <p>
              <strong>Action:</strong> {formatActionName(selectedLog.action)}
            </p>
            <p>
              <strong>Listing:</strong> {selectedLog.listingTitle} ({selectedLog.listingId})
            </p>
            <p>
              <strong>Performed By:</strong> {selectedLog.performedBy}
            </p>
            <p>
              <strong>Timestamp:</strong> {formatTimestamp(selectedLog.timestamp)}
            </p>
            <p>
              <strong>Details:</strong>
            </p>
            <p>{selectedLog.details}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AuditLogs
