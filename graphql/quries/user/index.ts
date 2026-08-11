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
      industries {
        updatedAt
        title
        id
      }
      jobFunctions {
        updatedAt
        title
        id
      }
      interests {
        updatedAt
        title
        id
      }
      skills {
        updatedAt
       
        
        skillId
        name
        category
        level
        tags
        yearsOfExperience
        description
      }
      lastSession {
        deviceId
        deviceName
        lastUsed
        isActive
        createdAt
      }
      referrer {
        user {
          id
          firstName
          lastName
          avatar
        }
      }
      membershipTierId
      membershipTier {
        id
        name
        badgeIcon
        badgeColor
      }
      entityCurrencyWallet {
        id
        balance
        totalEarned
        totalSpent
      }
      gamificationSummary {
        totalPointsEarned
        totalBadgesEarned
        rankPosition
      }
      impactScore
`;
export const GET_ALL_USER = gql`
  query GetAllUser($input: allStatusInput) {
    getAllUser(input: $input) {
      data {
        ${details}
      }
      totalCount
      hasNextPage
      message
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
        createdAt
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
      industries {
        updatedAt
        title
        id
      }
      jobFunctions {
        updatedAt
        title
        id
      }
      interests {
        updatedAt
        title
        id
      }
      skills {
        updatedAt
        id
        skillId
        name
        category
        level
        tags
        yearsOfExperience
        description
      }
      stats {
        totalConnections
      }
      referrer {
        user {
          id
          firstName
          lastName
          avatar
        }
      }
      entityCurrencyWallet {
        id
        balance
        totalEarned
        totalSpent
      }
      gamificationSummary {
        totalPointsEarned
        totalBadgesEarned
        rankPosition
      }
      impactScore
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
        location
        profile {
          gender
          language
          phone {
            phoneNumber
          }
        }
      }
      membershipTierId
      industries {
        id
        title
      }
      jobFunctions {
        id
        title
      }
      interests {
        id
        title
      }
      skills {
        id

        skillId
        name
        category
        level
        tags
        yearsOfExperience
        description
      }
    }
  }
`;

export const GET_MEMBERS_STATS = gql`
  query GetMembersStats($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getMembersStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalMembers
      activeMembers
      newMembersThisMonth
      activeRate
      totalMembersChange
      activeMembersChange
      newMembersChange
      activeRateChange
    }
  }
`;

export const GET_GROWTH_STATS = gql`
  query GetGrowthStats($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getGrowthStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalNewMembers
      growthRate
      data {
        date
        count
      }
    }
  }
`;
export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: UpdateMemberInput!) {
    updateMember(input: $input) {
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
      industries {
        id
        title
      }
      jobFunctions {
        id
        title
      }
      interests {
        id
        title
      }
      skills {
        id

        skillId
        name
        category
        level
        tags
        yearsOfExperience
        description
      }
    }
  }
`;

export const GET_USER_REFERRALS = gql`
  query GetUserReferrals($input: UserReportInput!) {
    getUserReferrals(input: $input) {
      data {
        user {
          id
          firstName
          lastName
          email
          location
          avatar
          cover
          createdAt
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GET_TOP_REFERRALS = gql`
  query GetTopReferrals($limit: Int) {
    getTopReferrals(limit: $limit) {
      data {
        referrer {
          user {
            firstName
            lastName
            email
            avatar
          }
        }
        referralsCount
      }
      totalCount
    }
  }
`;

export const GET_ALL_REFERRALS = gql`
  query GetAllReferrals($limit: Int, $offset: Int) {
    getAllReferrals(limit: $limit, offset: $offset) {
      data {
        referrer {
          user {
            createdAt
            lastName
            location
            firstName
            email
            cover
            avatar
            isOnline
            lastLoginAt
          }
          isApproved
          isOnline
          industries {
            id
            title
            createdAt
            updatedAt
          }
          referralsCount
        }
        referee {
          isApproved
          isOnline
          user {
            createdAt
            lastName
            location
            firstName
            email
            cover
            avatar
            isOnline
            lastLoginAt
          }
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

export const SEARCH_USER_WITH_AI = gql`
  query SearchUserWithAI($query: String!, $limit: Int, $offset: Int) {
    searchUserWithAI(query: $query, limit: $limit, offset: $offset) {
      data {
        ${details}
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GET_USER_NEO4J_RELATIONSHIPS = gql`
  query GetUserNeo4jRelationships($userId: ID!) {
    getUserNeo4jRelationships(userId: $userId) {
      type
      otherUserId
      otherFirstName
      otherLastName
      otherAvatar
      createdAt
    }
  }
`;

export const GET_USER_SESSIONS = gql`
  query GetUserSessions($userId: ID!) {
    getUserSessions(userId: $userId) {
      id
      deviceId
      deviceName
      deviceToken
      lastUsed
      createdAt
      isActive
    }
  }
`;

export const LOGOUT_USER_SESSION = gql`
  mutation LogoutUserSession($sessionId: ID!) {
    logoutUserSession(sessionId: $sessionId)
  }
`;

export const LOGOUT_ALL_USER_SESSIONS = gql`
  mutation LogoutAllUserSessions($userId: ID!) {
    logoutAllUserSessions(userId: $userId)
  }
`;

export const GET_USERS_GRAPH = gql`
  query GetUsersGraph($filter: UsersGraphFilter, $limit: Int) {
    getUsersGraph(filter: $filter, limit: $limit) {
      nodes {
        id
        firstName
        lastName
        avatar
        email
        entityId
        gamificationScore
        impactScore
        coins
      }
      edges {
        source
        target
        relationType
      }
    }
  }
`;

export const CHECK_MEMBER_SUBSCRIPTION = gql`
  query CheckMemberSubscription {
    checkMemberSubscription {
      hasReachedLimit
      maxUsersAllowed
      currentCount
      message
    }
  }
`;
