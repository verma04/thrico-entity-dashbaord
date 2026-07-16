import { Card, Col, List, Progress, Row, Typography } from "antd";
import React from "react";
const { Title, Text, Paragraph } = Typography;
const Analytics = () => {
  return (
    <Row gutter={24}>
      <Col xs={24} md={8}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ color: "#52c41a", margin: "0 0 8px 0" }}>
              +23
            </Title>
            <Text type="secondary">New members this week</Text>
            <Progress
              percent={75}
              strokeColor="#52c41a"
              style={{ marginTop: 16 }}
            />
          </div>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ color: "#1890ff", margin: "0 0 8px 0" }}>
              47
            </Title>
            <Text type="secondary">Posts this week</Text>
            <Progress
              percent={60}
              strokeColor="#1890ff"
              style={{ marginTop: 16 }}
            />
          </div>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ color: "#722ed1", margin: "0 0 8px 0" }}>
              84%
            </Title>
            <Text type="secondary">Member engagement</Text>
            <Progress
              percent={84}
              strokeColor="#722ed1"
              style={{ marginTop: 16 }}
            />
          </div>
        </Card>
      </Col>
      <Col xs={24}>
        <Card title="Recent Activity" style={{ marginTop: 24 }}>
          <List
            dataSource={[
              {
                action: "New member joined",
                user: "Emma Thompson",
                time: "2 hours ago",
              },
              {
                action: "Post approved",
                user: "David Rodriguez",
                time: "4 hours ago",
              },
              {
                action: "Member promoted to admin",
                user: "Sarah Wilson",
                time: "1 day ago",
              },
              {
                action: "Group rules updated",
                user: "You",
                time: "2 days ago",
              },
              {
                action: "New join request",
                user: "Lisa Chen",
                time: "3 days ago",
              },
            ]}
            renderItem={(activity) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text strong>{activity.action}</Text>}
                  description={activity.user}
                />
                <Text type="secondary">{activity.time}</Text>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Analytics;
