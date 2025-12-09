import React, { useEffect } from "react";
import { UserList } from "./user-list";
import { getAllUser } from "@/graphql/actions/user";
import TableLoading from "@/components/layout/table-loading";

const User = ({ status }: any) => {
  const { data, loading } = getAllUser({
    variables: {
      input: {
        status: status,
      },
    },
  });

  console.log("User data:", data);

  return (
    <>
      {loading && (
        <>
          <TableLoading />{" "}
        </>
      )}
      {/* <List
        loading={loading}
        dataSource={data?.getAllUser}
        setDataSource={setDataSource}
      /> */}
      {!loading && <UserList users={data?.getAllUser} />}
    </>
  );
};

export default User;
