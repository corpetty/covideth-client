import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const GET_ALL_EVENTS_WITH_USERS = gql`
  query {
    events(order: "DESC") @connection(key: "EventsConnection") {
      edges {
        id
        name
        createdAt
        user {
          id
          username
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const DELETE_EVENT = gql`
  mutation($id: ID!) {
    deleteEvent(id: $id)
  }
`;

const EventDelete = ({ event }) => (
  <Mutation
    mutation={DELETE_EVENT}
    variables={{ id: event.id }}
    update={cache => {
      const data = cache.readQuery({
        query: GET_ALL_EVENTS_WITH_USERS,
      });

      cache.writeQuery({
        query: GET_ALL_EVENTS_WITH_USERS,
        data: {
          ...data,
          events: {
            ...data.events,
            edges: data.events.edges.filter(
              node => node.id !== event.id,
            ),
            pageInfo: data.events.pageInfo,
          },
        },
      });
    }}
  >
    {(deleteEvent, { data, loading, error }) => (
      <button type="button" onClick={deleteEvent}>
        Delete
      </button>
    )}
  </Mutation>
);

export default EventDelete;
