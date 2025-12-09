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
          pronouns
          headline
          currentPosition
          about
        }
        profile {
          country
          language
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
export const GET_USER_DETIALS = gql`
  query GetUserDetailsById($input: inputId) {
    getUserDetailsById(input: $input) {
      isApproved
      isRequested
      status
      userKyc {
        referralSource
        comment
        affliction
      }
      user {
        id
        firstName
        lastName
        email
        avatar
        location
        profile {
          country
          language
          phone {
            areaCode
            countryCode
            isoCode
            phoneNumber
          }
          timeZone

          gender
          pronouns
          headline
          currentPosition
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
  query GetUserAnalytics {
    getUserAnalytics {
      totalMembers
      verifiedMembers
      verifiedPercent
      activeMembers
      activePercent
      newMembersThisMonth
    }
  }
`;
