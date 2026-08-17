"use client";

import React, { useState } from "react";
import { GlobalOutlined, LockOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { GiVideoConference } from "react-icons/gi";
import { MdOutlineEventSeat } from "react-icons/md";
import { RiLiveLine } from "react-icons/ri";
import Cover from "../cover";
import type { communityEntity } from "../ts-types";
import { updateBasicInfo } from "@/graphql/actions/group";
import { useModuleStore } from "@/store/useModuleStore";

export const BasicInfo = ({ data }: { data: communityEntity }) => {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const onCompleted = () => {
    message.success(`${singularName} basic info updated successfully.`);
  };
  const [update, { loading }] = updateBasicInfo({
    onCompleted,
  });
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    update({
      variables: {
        input: {
          communityId: data?.id,
          cover: cover,
          ...values,
        },
      },
    });
  };

  const [cover, setCover] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string>(
    `https://cdn.thrico.network/${data?.cover}`,
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        title: data?.title,
        description: data?.description,
        privacy: data?.privacy,
        communityType: data?.communityType,
        joiningTerms: data?.joiningTerms,
      }}
    >
      <Card
        extra={
          <Button loading={loading} type="primary" htmlType="submit">
            Save Changes
          </Button>
        }
        title="Basic Information"
        style={{ width: "60%" }}
      >
        <>
          <Cover
            setCover={setCover}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />

          <Form.Item name={"title"} label="Name" rules={[{ required: true }]}>
            <Input showCount maxLength={50} minLength={10} />
          </Form.Item>

          <Form.Item name={"description"} label="Description">
            <TextArea showCount maxLength={300} />
          </Form.Item>
          <Divider />
          <Form.Item
            name="privacy"
            label="Choose Privacy"
            hasFeedback
            rules={[{ required: true }]}
            style={{ width: "100%" }}
            initialValue={"PUBLIC"}
          >
            <Radio.Group>
              <Radio value="PUBLIC" style={{ width: "100%", padding: 5 }}>
                <Space>
                  <GlobalOutlined
                    style={{ color: "#10b981", fontSize: "20px" }}
                  />
                  <div>
                    <span style={{ fontWeight: 600 }}>Public</span>
                    <br />
                    <span style={{ color: "#888" }}>
                      Anyone can see and join this {singularName.toLowerCase()}
                    </span>
                  </div>
                </Space>
              </Radio>
              <Radio value="PRIVATE" style={{ width: "100%", padding: 5 }}>
                <Space>
                  <LockOutlined
                    style={{ color: "#f59e0b", fontSize: "20px" }}
                  />
                  <div>
                    <span style={{ fontWeight: 600 }}>Private</span>
                    <br />
                    <span style={{ color: "#888" }}>
                      Only invited members can see and join
                    </span>
                  </div>
                </Space>
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="communityType"
            label={`${singularName} Type`}
            hasFeedback
            rules={[{ required: true }]}
            style={{ width: "100%" }}
            initialValue={"VIRTUAL"}
          >
            <Radio.Group style={{ width: "100%" }}>
              <Radio value="VIRTUAL" style={{ width: "100%", padding: 5 }}>
                <Space>
                  <MdOutlineEventSeat
                    style={{ color: "#10b981", fontSize: "20px" }}
                  />
                  <div>
                    <span style={{ fontWeight: 600 }}>Virtual</span>
                    <br />
                    <span style={{ color: "#888" }}>
                      Online-only {singularName.toLowerCase()}
                    </span>
                  </div>
                </Space>
              </Radio>
              <Radio value="INPERSON" style={{ width: "100%", padding: 5 }}>
                <Space>
                  <GiVideoConference
                    style={{ color: "#3b82f6", fontSize: "20px" }}
                  />
                  <div>
                    <span style={{ fontWeight: 600 }}>In Person</span>
                    <br />
                    <span style={{ color: "#888" }}>
                      Meets physically at a location
                    </span>
                  </div>
                </Space>
              </Radio>
              <Radio value="HYBRID" style={{ width: "100%", padding: 5 }}>
                <Space>
                  <RiLiveLine style={{ color: "#f59e0b", fontSize: "20px" }} />
                  <div>
                    <span style={{ fontWeight: 600 }}>Hybrid</span>
                    <br />
                    <span style={{ color: "#888" }}>
                      Both online and in-person
                    </span>
                  </div>
                </Space>
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="joiningTerms"
            label={`${singularName} Joining Terms`}
            hasFeedback
            rules={[{ required: true }]}
            style={{ width: "100%" }}
            initialValue={"ANYONE_CAN_JOIN"}
          >
            <Radio.Group style={{ width: "100%" }}>
              <Radio
                value="ANYONE_CAN_JOIN"
                style={{ width: "100%", padding: 5 }}
              >
                <Space>
                  <GlobalOutlined
                    style={{ color: "#10b981", fontSize: "20px" }}
                  />
                  <div>
                    <span style={{ fontWeight: 600 }}>Anyone Can Join</span>
                    <br />
                    <span style={{ color: "#888" }}>
                      Anyone can join this {singularName.toLowerCase()} directly
                    </span>
                  </div>
                </Space>
              </Radio>
              <Radio
                value="ADMIN_ONLY_ADD"
                style={{ width: "100%", padding: 5 }}
              >
                <Space>
                  <LockOutlined
                    style={{ color: "#f59e0b", fontSize: "20px" }}
                  />
                  <div>
                    <span style={{ fontWeight: 600 }}>Admin Only Add</span>
                    <br />
                    <span style={{ color: "#888" }}>
                      Only admins can add members to this{" "}
                      {singularName.toLowerCase()}
                    </span>
                  </div>
                </Space>
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Divider />
        </>
      </Card>
    </Form>
  );
};

export default BasicInfo;
