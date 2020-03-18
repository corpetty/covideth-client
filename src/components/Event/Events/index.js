import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import EventDelete from '../EventDelete';
import Loading from '../../Loading';
import withSession from '../../Session/withSession';

const EVENT_CREATED = gql`
  subscription {
    eventCreated {
      event {
        id
        name
        createdAt
        user {
          id
          username
        }
      }
    }
  }
`;

const GET_PAGINATED_EVENTS_WITH_USERS = gql`
  query($cursor: String, $limit: Int!) {
    events(cursor: $cursor, limit: $limit)
      @connection(key: "EventsConnection") {
      edges {
        id
        name
        date
        numAttendees
        list
        address
        foodAndDrinks
        user {
          id
          username
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const Events = ({ limit }) => (
  <Query
    query={GET_PAGINATED_EVENTS_WITH_USERS}
    variables={{ limit }}
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            There are no events yet ... Try to create one by
            yourself.
          </div>
        );
      }

      const { events } = data;

      if (loading || !events) {
        return <Loading />;
      }

      const { edges, pageInfo } = events;

      return (
        <Fragment>
          <EventList
            events={edges}
            subscribeToMore={subscribeToMore}
          />

          {pageInfo.hasNextPage && (
            <MoreEventsButton
              limit={limit}
              pageInfo={pageInfo}
              fetchMore={fetchMore}
            >
              More
            </MoreEventsButton>
          )}
        </Fragment>
      );
    }}
  </Query>
);

const MoreEventsButton = ({
  limit,
  pageInfo,
  fetchMore,
  children,
}) => (
  <button
    type="button"
    onClick={() =>
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
          limit,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          return {
            events: {
              ...fetchMoreResult.events,
              edges: [
                ...previousResult.events.edges,
                ...fetchMoreResult.events.edges,
              ],
            },
          };
        },
      })
    }
  >
    {children}
  </button>
);

class EventList extends Component {
  subscribeToMoreEvent = () => {
    this.props.subscribeToMore({
      document: EVENT_CREATED,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { eventCreated } = subscriptionData.data;

        return {
          ...previousResult,
          events: {
            ...previousResult.events,
            edges: [
              eventCreated.event,
              ...previousResult.events.edges,
            ],
          },
        };
      },
    });
  };

  processEvent = (event) => {
    let newEvent = {
      ...event,
      date: Date(event.date),
    }
    return <EventItem key={event.id} event={newEvent} />
  }

  componentDidMount() {
    this.subscribeToMoreEvent();
  }

  render() {
    const { events } = this.props;

    return events.map(event => (
      this.processEvent(event)
    ));
  }
}

const EventItemBase = ({ event, session }) => (
  <div>
    <hr />
    <table>
      <tbody>
        <tr>
          <td>Event</td>
          <td>{event.name}</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>{event.date}</td>
        </tr>
        <tr>
          <td>Approx. Attendees</td>
          <td>{event.numAttendees}</td>
        </tr>
        <tr>
          <td>Info</td>
          <td>{event.list}</td>
        </tr>
        <tr>
          <td>Address</td>
          <td>{event.address}</td>
        </tr>
        <tr>
          <td>Food and Drinks</td>
          <td>{event.foodAndDrinks}</td>
        </tr>
        </tbody>
    </table>
    <br />

    {session &&
      session.me &&
      event.user.id === session.me.id && (
        <EventDelete event={event} />
      )}
    <hr />
  </div>
);

const EventItem = withSession(EventItemBase);

export default Events;
