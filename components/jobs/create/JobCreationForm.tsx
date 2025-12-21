"use client";

import {
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Space,
  Select,
  DatePicker,
  Tag,
  Form,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { CompanyAutocompleteSelect } from "./CommanyAutoComplete";

import GooglePlacesInput from "../../comman/location/Google-places-autocomplete";
// import { CommunityPreview } from "./community-preview";

const { Title, Paragraph } = Typography;

interface ListingCreationFormProps {
  initialValues?: Record<string, any>;
  loading?: boolean;
  onFinish: (values: any) => void;
  form: any;
  cover: any;
  setCover: (cover: any) => void;
}

export function JobCreationForm({
  initialValues,
  loading,
  onFinish,
  form,
  cover,
  setCover,
}: ListingCreationFormProps) {
  const formData = form?.getFieldsValue();
  const values = Form.useWatch([], form);
  const { TextArea } = Input;
  const { Option } = Select;

  const renderListField = (
    name: string,
    label: string,
    placeholder: string
  ) => (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          <Form.Item label={label}>
            {fields.map(({ key, name: fieldName, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={fieldName}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Input placeholder={placeholder} />
                </Form.Item>
                {fields.length > 1 && (
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(fieldName)}
                    danger
                  />
                )}
              </Space>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add {label.slice(0, -1)}
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );

  return (
    <>
      <Row gutter={24}>
        <Col span={14}>
          <Form
            onFinish={onFinish}
            form={form}
            layout="vertical"
            initialValues={{
              requirements: [""],
              responsibilities: [""],
              benefits: [""],
              skills: [""],
              ...initialValues,
            }}
          >
            <Card style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label="Job Title"
                    rules={[
                      { required: true, message: "Please enter job title" },
                    ]}
                  >
                    <Input placeholder="e.g., Senior Frontend Developer" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="company"
                    label="Company"
                    rules={[
                      { required: true, message: "Please enter company name" },
                    ]}
                  >
                    <CompanyAutocompleteSelect
                      onChange={(value) =>
                        form.setFieldsValue({ school: value })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label={"Location"}
                    rules={[
                      {
                        required: true,
                        message: "Please select a location",
                      },
                    ]}
                    extra="Select the Job Location"
                  >
                    <GooglePlacesInput
                      onChange={(value) =>
                        form.setFieldsValue({ location: value })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="salary" label="Salary Range">
                    <Input placeholder="e.g., $120,000 - $160,000" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="jobType"
                    label="Type"
                    rules={[
                      { required: true, message: "Please select job type" },
                    ]}
                  >
                    <Select placeholder="Select job type">
                      <Option value="FULL-TIME">Full-time</Option>
                      <Option value="PART-TIME">Part-time</Option>
                      <Option value="CONTRACT">Contract</Option>
                      <Option value="TEMPORARY">Temporary</Option>
                      <Option value="INTERNSHIP">Internship</Option>
                      <Option value="VOLUNTEER">Volunteer</Option>
                      <Option value="OTHER">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="workplaceType"
                    label="Work Arrangement"
                    rules={[
                      {
                        required: true,
                        message: "Please select work arrangement",
                      },
                    ]}
                  >
                    <Select placeholder="Select work arrangement">
                      <Option value="ON-SITE">On-site</Option>
                      <Option value="HYBRID">Hybrid</Option>
                      <Option value="REMOTE">Remote</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="experienceLevel"
                    label="Experience Level"
                    rules={[
                      {
                        required: true,
                        message: "Please select experience level",
                      },
                    ]}
                  >
                    <Select placeholder="Select experience level">
                      <Option value="ENTRY-LEVEL">Entry-Level</Option>
                      <Option value="MID-LEVEL">Mid-Level</Option>
                      <Option value="SENIOR">Senior</Option>
                      <Option value="LEAD">Lead</Option>
                      <Option value="EXECUTIVE">Executive</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="applicationDeadline"
                label="Application Deadline"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current &&
                    current.valueOf() < new Date().setHours(0, 0, 0, 0)
                  }
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Job Description"
                rules={[
                  { required: true, message: "Please enter job description" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                />
              </Form.Item>

              {renderListField(
                "requirements",
                "Requirements",
                "Enter requirement"
              )}
              {renderListField(
                "responsibilities",
                "Key Responsibilities",
                "Enter responsibility"
              )}
              {renderListField("benefits", "Benefits & Perks", "Enter benefit")}
              {renderListField("skills", "Required Skills", "Enter skill")}
            </Card>
          </Form>
        </Col>

        <Col span={10}>
          <div style={{ position: "sticky", top: 0 }}>
            <Title level={4}>Live Preview</Title>
            <Paragraph type="secondary">
              See how your job posting will appear to candidates
            </Paragraph>
            <Divider />

            <Card>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {form.getFieldValue("company")?.name?.toUpperCase() || "C"}
                </div>
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    {form.getFieldValue("title") || "Job Title"}
                  </Title>
                  <Paragraph style={{ margin: 0, fontSize: "16px" }}>
                    {form.getFieldValue("company")?.name || "Company Name"}
                  </Paragraph>
                  <Space wrap style={{ marginTop: 8 }}>
                    <Tag>
                      {form.getFieldValue("location")?.name || "Location"}
                    </Tag>
                    <Tag>{form.getFieldValue("type") || "Job Type"}</Tag>
                    <Tag>
                      {form.getFieldValue("remote") || "Work Arrangement"}
                    </Tag>
                  </Space>
                </div>
              </div>

              {form.getFieldValue("description") && (
                <>
                  <Title level={5}>About this role</Title>
                  <Paragraph>{form.getFieldValue("description")}</Paragraph>
                </>
              )}

              {form
                .getFieldValue("skills")
                ?.filter((skill: string) => skill?.trim()).length > 0 && (
                <>
                  <Title level={5}>Required Skills</Title>
                  <Space wrap>
                    {form
                      .getFieldValue("skills")
                      ?.filter((skill: string) => skill?.trim())
                      .map((skill: string, index: number) => (
                        <Tag key={index} color="blue">
                          {skill}
                        </Tag>
                      ))}
                  </Space>
                </>
              )}
            </Card>
          </div>
        </Col>
      </Row>

      {/* Image Cropper Modal */}
    </>
  );
}
