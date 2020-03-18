import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';

const UPDATE_USER = gql`
  mutation(
    $username: String!
    $twitter: String
    $verified: Boolean
    $recovered: Boolean
    $testStatus: String
    $symptomsOnset: Date
    $symptoms: String
    $country: String
    $isolated: Boolean
    $source: String
    $eventsAttended: [ID]
    $anonymized: Boolean!
  ) {
    updateUser(
      username: $username
      twitter: $twitter
      verified: $verified
      recovered: $recovered
      testStatus: $testStatus
      symptomsOnset: $symptomsOnset
      symptoms: $symptoms
      country: $country
      isolated: $isolated
      source: $source
      eventsAttended: $eventsAttended
      anonymized: $anonymized
    ) {
      username
      twitter
      verified
      recovered
      testStatus
      symptomsOnset
      symptoms
      country
      isolated
      source
      eventsAttended
      anonymized
    }
  }
`;

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props.user
    }
  }

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSelect = event => {
    const { name, value } = event.target;
    this.setState({[name]: value})
    console.log(name, value)
  }

  onSubmit = (event, updateUser) => {
    if (typeof this.props.state.symptomsOnset == 'number') {
      this.setState({symptomsOnset: Date(this.props.state.symptomsOnset)})
    }
    updateUser().then(async ({ data }) => {
      this.setState({ 
        ...data
       });
      

      await this.props.refetch();
    });

    event.preventDefault();
  };



  render() {
    const { 
        username,
        email,
        twitter,
        verified,
        login,
        password,
        recovered,
        testStatus,
        symptomsOnset,
        symptoms,
        country,
        isolated,
        source,
        eventsAttended,
        anonymized,
        role
     } = this.state;

    const isInvalid = password === '' || login === '';

    return (
      <Mutation mutation={UPDATE_USER} variables={{ 
        username,
        email,
        twitter,
        verified,
        recovered,
        testStatus,
        symptomsOnset,
        symptoms,
        country,
        isolated,
        source,
        eventsAttended,
        anonymized,
        role
        }}>
        {(updateUser, { data, loading, error }) => (
          <div>
            <label name="isolated">Are you isolated?</label>
          <select id="isolated" name="isolated" form="profileform" onChange={this.onSelect} value={this.state.isolated} >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
          <label name="recovered">Have you recovered?</label>
          <select id="recovered" name="recovered" form="profileform" onChange={this.onSelect} value={this.state.recovered}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select> 
          <label name="anonymized">Do you wish to remain anonymous?</label>
          <select id="anonymized" name="anonymized" form="profileform" onChange={this.onSelect} value={this.state.anonymized}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select> 
          <form onSubmit={event => this.onSubmit(event, updateUser) } id="profileform">
            <label>Username: <input
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder={this.state.username}
            /></label>
            <br /><label>Twitter: <input
              name="twitter"
              value={twitter}
              onChange={this.onChange}
              type="text"
              placeholder={this.state.twitter}
            /></label>
            <br/><label>Test Status:<input
              name="testStatus"
              value={testStatus}
              onChange={this.onChange}
              type="text"
              placeholder={this.state.testStatus}
            /></label>
            <br/><label>Symptoms Started: <input
              name="symptomsOnset"
              onChange={this.onChange}
              type="text"
              placeholder="Jan 01, 2020"
            /></label>
            <br/><label>Symptoms: <textarea rows="4" cols="40"
              name="symptoms"
              value={symptoms}
              onChange={this.onChange}
              type="textbox"
            /></label>
            
            <br/><button disabled={isInvalid || loading} type="submit">
              Update Profile
            </button>

            {error && <ErrorMessage error={error} />}
          </form>
          
          </div>
        )}
      </Mutation>
    );
  }
}

export default EditProfile;