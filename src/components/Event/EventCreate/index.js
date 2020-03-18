import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';

const CREATE_EVENT = gql`
  mutation(
      $name: String!
      $date: String!
      $list: String
      $address: String
      $foodAndDrinks: String
      $numAttendees: Int
    ) {
    createEvent(
      name: $name,
      date: $date,
      numAttendees: $numAttendees,
      list: $list,
      address: $address,
      foodAndDrinks: $foodAndDrinks,
    ) {
      id
      name
      createdAt
      user {
        id
        username
      }
    }
  }
`;

class EventCreate extends Component {
  state = {
    name: '',
    date: '',
    numAttendees: 0,
    list: '',
    address: '',
    foodAndDrinks: '',
  };

  onChange = event => {
    const { name, value } = event.target;
    if (name === 'numAttendees') {
      this.setState({ [name]: parseInt(value) });
    } else {
      this.setState({ [name]: value });
    }
  };

  onSubmit = async (event, createEvent) => {
    event.preventDefault();

    try {
      await createEvent();
      this.setState({ 
        name: '',
        date: '',
        numAttendees: 0,
        list: '',
        address: '',
        foodAndDrinks: '',
       });
    } catch (error) {}
  };

  render() {
    const { 
      name,
      date,
      numAttendees,
      list,
      address,
      foodAndDrinks,
    } = this.state;  

    return (
      <Mutation
        mutation={CREATE_EVENT}
        variables={{ 
          name,
          date,
          numAttendees,
          list,
          address,
          foodAndDrinks 
        }}
      >
        {(createEvent, { data, loading, error }) => (
          <form
            onSubmit={event => this.onSubmit(event, createEvent)}
          >
            <label>Event<input
              name="name"
              value={name}
              onChange={this.onChange}
              type="text"
              placeholder="Event name"
            /></label>
            <br/><label>Date<input
              name="date"
              value={date}
              onChange={this.onChange}
              type="text"
              placeholder="Date attended (ex: Jan 01, 2020)"
            /></label>
            <br/><label>Aprox. Attendees<input
              name="numAttendees"
              value={numAttendees}
              onChange={this.onChange}
              type="number"
              placeholder="approximate number of attendees"
            /></label>
            <br/><label>Address<input
              name="address"
              value={address}
              onChange={this.onChange}
              type="text"
              placeholder="100 Rue French St., Paris, France"
            /></label>
            <br/><label>Food and Drinks<input
              name="foodAndDrinks"
              value={foodAndDrinks}
              onChange={this.onChange}
              type="text"
              placeholder="Finger Foods, alcohol"
            /></label>
            <br/><label>Info<input
              name="list"
              value={list}
              onChange={this.onChange}
              type="text"
              placeholder="https://eventsite.com"
            /></label>
            <br/><button type="submit">Create Event</button>

            {error && <ErrorMessage error={error} />}
          </form>
        )}
      </Mutation>
    );
  }
}

export default EventCreate;
