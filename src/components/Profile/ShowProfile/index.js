import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../../Loading';
import withSession from '../../Session/withSession';

const USER = gql`
query($id: ID!) {
   user(id: $id) {
    username
    twitter
    email
    verified
    recovered
    testStatus
    isolated
    symptomsOnset
    symptoms
    country
    source
    eventsAttended
    anonymized
  }
}
`;

const ShowProfile = ({ id }) => (
  <Query
    query={USER}
    variables={{ id }}
  >
    {({ data, loading, error}) => {
      if (error) {
        console.log(error)
      }
      if (!data) {
        return (
          <div>
            You are not logged in ... 
          </div>
        );
      }

      const { user } = data;

      if (loading || !user) {
        return <Loading />;
      }

      return (
        < Profile user={user} />
      );
    }}
  </Query>
);


class Profile extends Component {

  processMe = (user) => {
    let newUser = {
      ...user,
      symptomsOnset: Date(user.symptomsOnset),
    };
    return <UserProfile key={user.id} user={newUser} />
  }

  render() {
    const { user } = this.props;

    return this.processMe(user);
  }
}

const ProfileBase = ({ user }) => (
  <div>
    <hr />
    <table>
      <tbody>
        <tr>
          <td>Username</td>
          <td>{user.username}</td>
        </tr>
        <tr>
          <td>Symptoms Onset</td>
          <td>{user.symptomsOnset}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>{user.email}</td>
        </tr>
        <tr>
          <td>Twitter</td>
          <td>{user.twitter}</td>
        </tr>
        <tr>
          <td>Recovered</td>
          <td>{user.recovered ? `Yes` : `No`}</td>
        </tr>
        <tr>
          <td>Verified</td>
          <td>{user.verified ? `Yes` : `No`}</td>
        </tr>
        <tr>
          <td>Isolated</td>
          <td>{user.isolated ? `Yes` : `No`}</td>
        </tr>
        <tr>
          <td>Test Status</td>
          <td>{user.testStatus}</td>
        </tr>
        <tr>
          <td>Symptoms</td>
          <td>{user.symptoms}</td>
        </tr>
        <tr>
          <td>Country</td>
          <td>{user.country}</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>{!user.anonymous ? `No` : `Yes`}</td>
        </tr>
        <tr>
          <td>Events Attended</td>
          <td>{user.eventsAttended ? user.eventsAttended : 'None Checked'}</td>
        </tr>
        </tbody>
    </table>
    <br />

  </div>
);

const UserProfile = withSession(ProfileBase);

export default ShowProfile;