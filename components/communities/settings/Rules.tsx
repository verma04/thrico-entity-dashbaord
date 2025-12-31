import { Button, Card, Form, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { updateCommunityRules } from "../../../graphql/actions/group";
import { communityEntity } from "../ts-types";

const Rules = ({ data }: { data: communityEntity }) => {
  const [form] = Form.useForm();

  const onCompleted = () => {
    message.success("Rules updated successfully.");
  };

  const [update, { loading }] = updateCommunityRules({
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

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ width: "60%" }}
      initialValues={{
        rules: data?.rules,
      }}
    >
      <Card
        extra={
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        }
        title="Group Rules"
      >
        <Form.Item
          label="Rules"
          name="rules"
          rules={[{ required: true, message: "Please enter the group rules." }]}
        >
          <TextArea rows={8} placeholder="Enter group rules, one per line..." />
        </Form.Item>
      </Card>
    </Form>
  );
};

export default Rules;
