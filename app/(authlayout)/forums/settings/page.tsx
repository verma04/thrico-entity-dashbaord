"use client";

import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import Settings from "../../../../components/discussion-forum/forum-settings";

const Page = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  return (
    <>
      {!loading && (
        <Settings
          update={update}
          loading={loadingBtn}
          data={{
            allowDiscussionForum: data?.getEntitySettings?.allowDiscussionForum,
            autoApproveDiscussionForum:
              data?.getEntitySettings?.autoApproveDiscussionForum,
          }}
        />
      )}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </>
  );
};

export default Page;
