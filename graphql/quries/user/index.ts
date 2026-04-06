import { gql } from "@apollo/client";

const details = `
  isApproved
   
      isRequested
      lastActive
      id
      verification {
  id
  isVerifiedAt
  isVerified
  verificationReason
}
      user {
        id
        firstName
        lastName
        email
        avatar
       location 
        about {
          social {
            url
            platform
          }
          headline
          currentPosition
          about
        }
        profile {
          country
          language
          skills 
          phone {
            areaCode
            countryCode
            isoCode
            phoneNumber
          }
          timeZone
          
          gender

          headline
          currentPosition
          education {
            id
            school {
              id
              name
              logo
            }
            degree
            grade
            activities
            description
            duration
          }
          experience {
            id
            company {
              id
              name
              logo
            }
            duration
            employmentType
            locationType
            title
            startDate
            currentlyWorking
            location
          }
          categories
          skills
        }
        createdAt
        about {
          social {
            url
            platform
          }
        }
        isOnline
        cover
      }
      status
      userKyc {
        referralSource
        comment
        affliction
      }
`;
export const GET_ALL_USER = gql`
  query GetAllUser($input: allStatusInput) {
    getAllUser(input: $input) {
    ${details}
    }
  }
`;
export const CHANGE_USER_STATUS = gql`
  mutation ChangeUserStatus($input: statusInput) {
    changeUserStatus(input: $input) {
   ${details}
    }
  }
`;
export const CHANGE_USER_VERIFICATION = gql`
mutation ChangeUserVerification($input: statusInput) {
  changeUserVerification(input: $input) {
       ${details}
  }
}`;

export const BULK_CHANGE_USER_STATUS = gql`
  mutation BulkChangeUserStatus($input: bulkStatusInput) {
    bulkChangeUserStatus(input: $input) {
      ${details}
    }
  }
`;

export const GET_USER_DETIALS = gql`
  query GetUserDetailsById($input: inputId) {
    getUserDetailsById(input: $input) {
      verification {
        id
        isVerifiedAt
        isVerified
        verificationReason
      }
      isApproved
      isRequested
      lastActive
      id
      isOnline
      status
      userKyc {
        referralSource
        comment
        affliction
      }
      user {
        id
        email
        firstName
        lastName
        location
        avatar
        cover
        lastLoginAt
        about {
          headline
          social {
            url
            platform
          }
        }
        profile {
          DOB
          skills
          language
          gender
          experience {
            id
            company {
              name
            }
            duration
            employmentType
            locationType
            title
            startDate
            currentlyWorking
            location
          }
          education {
            id
            school {
              name
            }
            degree
            grade
            activities
            description
            duration
          }
        }
      }
    }
  }
`;

export const UPDATE_MEMBERS_TERMS_AND_CONDITIONS = gql`
  mutation UpdateMemberTermsAndConditions(
    $input: inputMemberTermsAndConditions
  ) {
    updateMemberTermsAndConditions(input: $input) {
      termAndConditionsMembers
    }
  }
`;

export const GET_MEMBERS_TERMS_AND_CONDITIONS = gql`
  query getMembersTermsAndConditions {
    getMembersTermsAndConditions {
      termAndConditionsMembers
      termAndConditionsCommunities
    }
  }
`;

export const GET_USER_ANALYTICS = gql`
  query GetUserAnalytics($timeRange: TimeRange) {
    getUserAnalytics(timeRange: $timeRange) {
      totalMembers
      verifiedMembers
      verifiedPercent
      activeMembers
      activePercent
      newMembersThisMonth
    }
  }
`;

export const GET_USER_GROWTH = gql`
  query GetUserGrowth($timeRange: TimeRange!) {
    getUserGrowth(timeRange: $timeRange) {
      date
      count
    }
  }
`;

export const GET_USER_ROLE_DISTRIBUTION = gql`
  query GetUserRoleDistribution($timeRange: TimeRange!) {
    getUserRoleDistribution(timeRange: $timeRange) {
      name
      value
    }
  }
`;

export const GET_USER_STATS = gql`
  query GetUserStats($userId: ID!) {
    getUserStats(input: { userId: $userId }) {
      totalPosts
      totalComments
      totalConnections
      totalGroups
      totalEvents
      totalListings
      totalOffers
      totalJobs
    }
  }
`;

export const ADD_NEW_MEMBER = gql`
  mutation AddNewMember($input: AddNewMemberInput!) {
    addNewMember(input: $input) {
      id
      isApproved
      isRequested
      status
      lastActive
      isOnline
      user {
        id
        firstName
        lastName
        email
        avatar
      }
    }
  }
`;
