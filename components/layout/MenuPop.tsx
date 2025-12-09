import React, { useState } from "react";
import { Layout, Menu, List, Typography, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// Sample data structure
const recentlyVisited = [
  {
    title: "EC2",
    description: "Virtual Servers in the Cloud",
  },
  {
    title: "Console Home",
    description:
      "View resource insights, service shortcuts, and feature updates",
  },
  {
    title: "DynamoDB",
    description: "Managed NoSQL Database",
  },
  {
    title: "AWS Billing Conductor",
    description: "Simplifying your billing practice",
  },
  {
    title: "IAM",
    description: "Manage access to AWS resources",
  },
  {
    title: "S3",
    description: "Scalable Storage in the Cloud",
  },
  {
    title: "Amazon Location Service",
    description: "Securely and easily add location data to applications.",
  },
  {
    title: "Simple Queue Service",
    description: "SQS Managed Message Queues",
  },
];

import type { MenuProps } from "antd";

const menuItems: MenuProps["items"] = [
  { key: "favorites", label: "Favorites" },
  { key: "all-applications", label: "All applications" },
  { key: "all-services", label: "All services" },
  { type: "divider" },
  { key: "analytics", label: "Analytics" },
  { key: "application-integration", label: "Application Integration" },
  { key: "blockchain", label: "Blockchain" },
  { key: "business-applications", label: "Business Applications" },
  { key: "cloud-financial-management", label: "Cloud Financial Management" },
  { key: "compute", label: "Compute" },
  { key: "containers", label: "Containers" },
  { key: "customer-enablement", label: "Customer Enablement" },
  { key: "database", label: "Database" },
  { key: "developer-tools", label: "Developer Tools" },
  { key: "end-user-computing", label: "End User Computing" },
  { key: "frontend-web-mobile", label: "Front-end Web & Mobile" },
  { key: "game-development", label: "Game Development" },
  { key: "iot", label: "Internet of Things" },
  { key: "machine-learning", label: "Machine Learning" },
  { key: "management-governance", label: "Management & Governance" },
  { key: "media-services", label: "Media Services" },
  { key: "migration-transfer", label: "Migration & Transfer" },
  {
    key: "networking-content-delivery",
    label: "Networking & Content Delivery",
  },
  { key: "quantum", label: "Quantum Technologies" },
  { key: "robotics", label: "Robotics" },
  { key: "satellite", label: "Satellite" },
];

export default function MenuNavigation() {
  const [selectedKey, setSelectedKey] = useState("all-services");

  return (
    <Layout style={{ minHeight: "100vh", background: "#232f3e" }}>
      <Sider
        width={300}
        style={{
          background: "#232f3e",
          borderRight: "1px solid #1a1a1a",
        }}
      >
        <Title level={4} style={{ color: "#fff", padding: "16px 24px" }}>
          Recently visited
        </Title>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{
            background: "#232f3e",
            color: "#fff",
            border: "none",
          }}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Content style={{ background: "#232f3e", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            paddingTop: "16px",
          }}
        >
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Recently visited
          </Title>
          <Button
            type="text"
            icon={<CloseOutlined />}
            style={{ color: "#fff" }}
          />
        </div>
        <List
          dataSource={recentlyVisited}
          renderItem={(item) => (
            <List.Item
              style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 0" }}
            >
              <List.Item.Meta
                title={
                  <Text style={{ color: "#fff", fontSize: "16px" }}>
                    {item.title}
                  </Text>
                }
                description={
                  <Text style={{ color: "#8b949e" }}>{item.description}</Text>
                }
              />
            </List.Item>
          )}
          style={{
            background: "#232f3e",
            color: "#fff",
          }}
        />
      </Content>
    </Layout>
  );
}
