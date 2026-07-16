import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Flex, Image, message, Upload } from "antd";
import type { GetProp, UploadProps } from "antd";
import { MdOutlineUpdate } from "react-icons/md";
import ImgCrop from "antd-img-crop";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG/WEBP file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

interface CoverProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setCover: (file: FileType) => void;
  buttonText?: string;
}

const Cover = ({ imageUrl, setImageUrl, setCover, buttonText }: CoverProps) => {
  const [loading, setLoading] = useState(false);

  const handleChange: UploadProps["onChange"] = (info) => {
    console.log(info);
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setCover(info.file.originFileObj as FileType);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <Button
      type="dashed"
      icon={loading ? <LoadingOutlined /> : <MdOutlineUpdate />}
    >
      {buttonText ? buttonText : "Update Cover"}
    </Button>
  );
  const dummyRequest = ({ file, onSuccess }: any) => {
    onSuccess("ok");
  };
  return (
    <>
      <Card
        extra={
          <Alert
            style={{ fontSize: 12, margin: 10 }}
            type="info"
            showIcon={true}
            message="No custom cover image selected. The default image will be displayed until you upload a new one."
          />
        }
        actions={[
          <>
            <ImgCrop rotationSlider aspectSlider>
              <Upload
                style={{ width: "100%" }}
                showUploadList={false}
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                <>{uploadButton}</>
              </Upload>
            </ImgCrop>
          </>,
        ]}
        style={{ width: "100%", marginBottom: 20 }}
      >
        <Flex style={{ width: "100%" }} justify="center" align="center">
          <Image
            src={
              imageUrl
                ? imageUrl
                : "https://cdn.thrico.network/defaultEventCover.png"
            }
            alt="alt"
            width={"100%"}
            style={{ objectFit: "contain" }}
            height={200}
          />
        </Flex>
      </Card>
    </>
  );
};

export default Cover;
