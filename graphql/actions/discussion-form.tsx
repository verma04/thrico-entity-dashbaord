import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_DISCUSSION_FORUM,
  ADD_DISCUSSION_FORUM_CATEGORY,
  CHANGE_STATUS_DISCUSSION_FORUM,
  CHANGE_STATUS_DISCUSSION_FORUM_CATEGORY,
  CHANGE_VERIFICATION_DISCUSSION_FORUM,
  DELETE_DISCUSSION_FORUM_COMMENT,
  DOWNVOTE_DISCUSSION_FORUM,
  EDIT_DISCUSSION_FORUM,
  EDIT_DISCUSSION_FORUM_CATEGORY,
  GET_BY_ID_DISCUSSION_FORUM,
  GET_DISCUSSION_FORUM,
  GET_DISCUSSION_FORUM_CATEGORY,
  GET_DISCUSSION_FORUM_COMMENTS,
  POST_DISCUSSION_FORUM_COMMENTS,
  UPVOTE_DISCUSSION_FORUM,
} from "../quries/discussion-form";

export const addDiscussionForumCategory = (options: any) =>
  useMutation(ADD_DISCUSSION_FORUM_CATEGORY, {
    ...options,
    refetchQueries: [
      {
        query: GET_DISCUSSION_FORUM_CATEGORY,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM_CATEGORY,
        variables: {
          input: {
            status: "ACTIVE",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM_CATEGORY,
        variables: {
          input: {
            status: "INACTIVE",
          },
        },
      },
    ],
    // awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const getDiscussionForumCategory = (options: any) =>
  useQuery(GET_DISCUSSION_FORUM_CATEGORY, options);

export const editDiscussionForumCategory = (options: any) =>
  useMutation(EDIT_DISCUSSION_FORUM_CATEGORY, {
    ...options,
    // refetchQueries: [
    //   {
    //     query: GET_ENTITY_SETTINGS,
    //   },
    // ],
    // awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const changeStatusDiscussionForumCategory = (options: any) =>
  useMutation(CHANGE_STATUS_DISCUSSION_FORUM_CATEGORY, {
    ...options,
    refetchQueries: [
      {
        query: GET_DISCUSSION_FORUM_CATEGORY,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM_CATEGORY,
        variables: {
          input: {
            status: "ACTIVE",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM_CATEGORY,
        variables: {
          input: {
            status: "INACTIVE",
          },
        },
      },
    ],
    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const addDiscussionForum = (options: any) =>
  useMutation(ADD_DISCUSSION_FORUM, {
    ...options,
    refetchQueries: [
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },

      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "REJECTED",
          },
        },
      },

      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },
    ],
    // refetchQueries: [
    //   {
    //     query: GET_DISCUSSION_FORUM_CATEGORY,
    //     variables: {
    //       input: {
    //         status: "ALL",
    //       },
    //     },
    //   },
    //   {
    //     query: GET_DISCUSSION_FORUM_CATEGORY,
    //     variables: {
    //       input: {
    //         status: "ACTIVE",
    //       },
    //     },
    //   },
    //   {
    //     query: GET_DISCUSSION_FORUM_CATEGORY,
    //     variables: {
    //       input: {
    //         status: "INACTIVE",
    //       },
    //     },
    //   },
    // ],
    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const getDiscussionForum = (options: any) =>
  useQuery(GET_DISCUSSION_FORUM, options);

export const getDiscussionForumComments = (options: any) =>
  useQuery(GET_DISCUSSION_FORUM_COMMENTS, options);

export const postDiscussionForumComments = (options: any) =>
  useMutation(POST_DISCUSSION_FORUM_COMMENTS, {
    ...options,
    update(cache, { data: { postDiscussionForumComments } }) {
      try {
        console.log(postDiscussionForumComments);
        const { getDiscussionForumComments }: any = cache.readQuery({
          query: GET_DISCUSSION_FORUM_COMMENTS,
          variables: {
            input: {
              id: postDiscussionForumComments.discussionForumId,
            },
          },
        });

        console.log(getDiscussionForumComments);
        cache.writeQuery({
          query: GET_DISCUSSION_FORUM_COMMENTS,

          data: {
            getDiscussionForumComments: [
              postDiscussionForumComments,
              ...getDiscussionForumComments,
            ],
          },
          variables: {
            input: {
              id: postDiscussionForumComments.discussionForumId,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const changeDiscussionForumStatus = (options: any) =>
  useMutation(CHANGE_STATUS_DISCUSSION_FORUM, {
    ...options,
    refetchQueries: [
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },

      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "REJECTED",
          },
        },
      },

      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },
    ],
    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const changeDiscussionForumVerification = (options: any) =>
  useMutation(CHANGE_VERIFICATION_DISCUSSION_FORUM, {
    ...options,
    refetchQueries: [
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },

      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "REJECTED",
          },
        },
      },

      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },
    ],
    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const upVoteDiscussionForum = (options: any) =>
  useMutation(UPVOTE_DISCUSSION_FORUM, {
    ...options,
    // refetchQueries: [
    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "ALL",
    //       },
    //     },
    //   },
    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "PENDING",
    //       },
    //     },
    //   },
    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "APPROVED",
    //       },
    //     },
    //   },

    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "REJECTED",
    //       },
    //     },
    //   },

    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "DISABLED",
    //       },
    //     },
    //   },
    // ],
    // awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const downVoteDiscussionForum = (options: any) =>
  useMutation(DOWNVOTE_DISCUSSION_FORUM, {
    ...options,
    // refetchQueries: [
    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "ALL",
    //       },
    //     },
    //   },
    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "PENDING",
    //       },
    //     },
    //   },
    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "APPROVED",
    //       },
    //     },
    //   },

    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "REJECTED",
    //       },
    //     },
    //   },

    //   {
    //     query: GET_DISCUSSION_FORUM,
    //     variables: {
    //       input: {
    //         status: "DISABLED",
    //       },
    //     },
    //   },
    // ],
    // awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const getDiscussionForumDetailsByID = (options: any) =>
  useQuery(GET_BY_ID_DISCUSSION_FORUM, options);

export const deleteDiscussionForumComments = (options: any) =>
  useMutation(DELETE_DISCUSSION_FORUM_COMMENT, {
    ...options,

    update(cache, { data: { deleteDiscussionForumComments } }) {
      try {
        console.log(deleteDiscussionForumComments, "ddds");
        const discussionForumId =
          deleteDiscussionForumComments?.discussionForumId;
        if (!discussionForumId) return;

        const existing: any = cache.readQuery({
          query: GET_DISCUSSION_FORUM_COMMENTS,
          variables: {
            input: {
              id: discussionForumId,
            },
          },
        });

        if (!existing?.getDiscussionForumComments) return;

        cache.writeQuery({
          query: GET_DISCUSSION_FORUM_COMMENTS,
          data: {
            getDiscussionForumComments:
              existing.getDiscussionForumComments.filter(
                (comment: any) =>
                  comment.id !== deleteDiscussionForumComments.id
              ),
          },
          variables: {
            input: {
              id: discussionForumId,
            },
          },
        });
      } catch (error) {
        console.error("Failed to update cache after deleting comment:", error);
      }
    },
  });

export const editDiscussionForum = (options: any) =>
  useMutation(EDIT_DISCUSSION_FORUM, {
    ...options,
    refetchQueries: [
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },

      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "REJECTED",
          },
        },
      },

      {
        query: GET_DISCUSSION_FORUM,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },
    ],

    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });
