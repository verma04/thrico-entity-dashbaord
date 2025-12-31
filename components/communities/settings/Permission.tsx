import {
  Form,
  Button,
  message,
  Card,
  Space,
  Switch,
  Divider,
  Typography,
} from "antd";
import { communityEntity } from "../ts-types";
import { updateCommunityPermissions } from "../../../graphql/actions/group";

const { Title, Text, Paragraph } = Typography;
const ExampleForm = ({ data }: { data: communityEntity }) => {
  const [form] = Form.useForm();
  const onCompleted = () => {
    message.success("Permissions updated successfully.");
  };

  const [update, { loading }] = updateCommunityPermissions({
    onCompleted,
  });

  const onFinish = (values: any) => {
    update({
      variables: {
        input: {
          communityId: data?.id,
          ...values,
        },
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form and try again.");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "100%", margin: "0 auto" }}>
      <Form
        form={form}
        name="groupPermissions"
        layout="vertical"
        initialValues={{
          allowMemberPosts: data?.allowMemberPosts,
          requireAdminApprovalForPosts: data?.requireAdminApprovalForPosts,
          allowMemberInvites: data?.allowMemberInvites,
          enableEvents: data?.enableEvents,
          enableRatingsAndReviews: data?.enableRatingsAndReviews,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Card
          style={{ width: "60%" }}
          extra={
            <Button type="primary" htmlType="submit">
              Save Permissions
            </Button>
          }
          title="Group Permissions"
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Allow members to create posts</Text>
                <br />
                <Text type="secondary">
                  Members can create new posts in the group
                </Text>
              </div>
              <Form.Item name="allowMemberPosts" style={{ margin: 0 }}>
                <Switch />
              </Form.Item>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Require admin approval for posts</Text>
                <br />
                <Text type="secondary">
                  All posts must be approved before being visible
                </Text>
              </div>
              <Form.Item
                name="requireAdminApprovalForPosts"
                style={{ margin: 0 }}
              >
                <Switch />
              </Form.Item>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Allow members to invite others</Text>
                <br />
                <Text type="secondary">
                  Members can invite new people to join the group
                </Text>
              </div>
              <Form.Item name="allowMemberInvites" style={{ margin: 0 }}>
                <Switch />
              </Form.Item>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Enable Events</Text>
                <br />
                <Text type="secondary">
                  Allow members to create and manage group events
                </Text>
              </div>
              <Form.Item
                name="enableEvents"
                valuePropName="checked"
                style={{ margin: 0 }}
              >
                <Switch />
              </Form.Item>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Enable Ratings and Reviews</Text>
                <br />
                <Text type="secondary">
                  Allow members to rate and review group content
                </Text>
              </div>
              <Form.Item name="enableRatingsAndReviews" style={{ margin: 0 }}>
                <Switch />
              </Form.Item>
            </div>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default ExampleForm;
