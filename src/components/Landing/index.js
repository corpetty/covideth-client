import React from 'react';

import withSession from '../Session/withSession';

import { EventCreate, Events } from '../Event';

const Landing = ({ session }) => (
  <div>
    <h2>Landing Page</h2>

    <h3>Create an Event</h3>
    {session && session.me && <EventCreate />}

    <h3>Available Events</h3>
    <Events limit={8} />
  </div>
);

export default withSession(Landing);
