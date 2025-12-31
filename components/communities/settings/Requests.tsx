import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, List, Popconfirm, Typography } from "antd";
import React from "react";
import { getCommunityRequest } from "../../../graphql/actions/group";
import { useParams } from "next/navigation";
import { requests } from "../ts-types";
import UserAvatar from "../../../screen/comman/UserAvatar";
import moment from "moment";
const { Text } = Typography;

const Requests = () => {
  const params = useParams();
  const { data, loading } = getCommunityRequest({
    variables: {
      input: {
        groupId: params?.id,
      },
    },
  });
  return (
    <Card
      loading={loading}
      title={`Join Requests (${data?.getCommunityRequest?.length})`}
    >
      {data?.getCommunityRequest?.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <UserAddOutlined
            style={{
              fontSize: 48,
              color: "#d9d9d9",
              marginBottom: 16,
            }}
          />
          <Text type="secondary">No pending join requests</Text>
        </div>
      ) : (
        <List
          itemLayout="vertical"
          loading={loading}
          dataSource={data?.getCommunityRequest}
          renderItem={(request: requests) => (
            <List.Item
              actions={[
                <Popconfirm
                  key="approve"
                  title="Approve this request?"
                  onConfirm={() => handleApproveRequest(request.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" icon={<CheckCircleOutlined />}>
                    Approve
                  </Button>
                </Popconfirm>,
                <Popconfirm
                  key="reject"
                  title="Reject this request?"
                  onConfirm={() => handleRejectRequest(request.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<CloseCircleOutlined />}>
                    Reject
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<UserAvatar src={request?.user?.avatar} />}
                title={
                  <Text strong>
                    {request?.user.firstName + " " + request?.user?.lastName}
                  </Text>
                }
                description={`Requested ${moment(request.createdAt).fromNow()}`}
              />
              {request.notes && (
                <Card
                  size="small"
                  style={{
                    backgroundColor: "#fafafa",
                    marginTop: 8,
                  }}
                >
                  <Text italic>"{request.notes}"</Text>
                </Card>
              )}
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default Requests;
