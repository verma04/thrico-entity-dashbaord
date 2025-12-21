"use client";

import { useState, useEffect } from "react";
import { Select, Spin, Avatar, Space, Typography, Button, Drawer } from "antd";
import debounce from "lodash/debounce";

import type { SelectProps } from "antd";

import { useAllPages } from "../../../graphql/actions/commany";
import PageForm from "../../page/PageForm";

// Define Page type if not imported from elsewhere
type Page = {
  id: string;
  name: string;
  logo: string;
};

const { Text } = Typography;

export function CompanyAutocompleteSelect({
  onChange,
  initialValue,
}: {
  onChange: (value: { id: string; name: string; logo: string }) => void;
  initialValue?: {
    id: string;
    logo: string;
    name: string;
  };
}) {
  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const [selectedValue, setSelectedValue] = useState<
    { id: string; name: string; logo: string } | undefined
  >(initialValue);

  const [value, setValue] = useState<string>("");

  const { data, loading, refetch } = useAllPages({
    variables: {
      input: {
        value: value,
        limit: 10,
      },
    },
  });

  const debouncedFetchUsers = debounce(async (searchText: string) => {
    if (!searchText) {
      setOptions([]);

      return;
    }

    try {
      refetch();

      const formattedOptions = data?.getAllPages.map((data: Page) => ({
        value: data.id,
        label: data.name,
        data: {
          label: data.name,
          logo: data.logo,
        },
      }));
      setOptions(formattedOptions);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }, 500);

  useEffect(() => {
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [debouncedFetchUsers]);

  const handleSearch = async (searchText: string) => {
    await setValue(searchText);
    await debouncedFetchUsers(searchText);
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  interface AddPageData {
    addPage?: {
      id: string;
      name: string;
      logo: string;
    };
  }

  const onCompleted = (data: AddPageData): void => {
    onClose();
    const { addPage } = data;

    if (addPage) {
      const newValue = {
        id: addPage.id,
        name: addPage.name,
        logo: addPage.logo,
      };

      setSelectedValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <>
      <Select
        showSearch
        placeholder="Search for a School/Institute"
        notFoundContent={
          loading ? (
            <Spin size="small" />
          ) : (
            <>
              {value ? (
                <>
                  Add {value} <Button onClick={showDrawer}>Add</Button>
                </>
              ) : (
                <>Search Company</>
              )}
            </>
          )
        }
        filterOption={false}
        onSearch={handleSearch}
        onChange={(newValue, option: any) => {
          onChange({
            id: newValue,
            name: option?.data?.label,
            logo: option?.data?.logo,
          });
          setSelectedValue({
            id: newValue,
            name: option?.data?.label,
            logo: option?.data?.logo,
          });
        }}
        style={{ width: "100%" }}
        options={options}
        optionRender={(option: any) => (
          <>
            <Space>
              <Avatar
                src={
                  `https://cdn.thrico.network/${option.data.data.logo}` ||
                  "/placeholder.svg"
                }
                size="small"
              />
              <Space direction="vertical" size={0}>
                <Text>{option.data.label}</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {option.data.label}
                </Text>
              </Space>
            </Space>
          </>
        )}
        value={
          selectedValue && {
            value: selectedValue.id,
            label: (
              <Space>
                <Avatar
                  src={
                    `https://cdn.thrico.network/${selectedValue.logo}` ||
                    "/placeholder.svg"
                  }
                  size="small"
                />
                <Space direction="vertical" size={0}>
                  <Text>{selectedValue.name}</Text>
                </Space>
              </Space>
            ),
          }
        }
      />
      <Drawer title="" width={"100%"} onClose={onClose} open={open}>
        <PageForm value={value} onCompleted={onCompleted} />
      </Drawer>
    </>
  );
}
