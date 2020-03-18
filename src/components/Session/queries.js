import gql from 'graphql-tag';

export const GET_ME = gql`
  {
    me {
      id
      username
      email
      twitter
      verified
      recovered
      testStatus
      symptomsOnset
      symptoms
      country
      isolated
      source
      anonymized
      eventsAttended
      role
    }
  }
`;
