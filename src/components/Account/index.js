import React from 'react';

import withAuthorization from '../Session/withAuthorization';
import withSession from '../Session/withSession'

import EditProfile from '../Profile';
import ShowProfile from '../Profile/ShowProfile';

const AccountPage = ({ session }) => (
  <div>
    <h1>Account Page</h1>
    
    <h3>Current Account Profile</h3>
    <ShowProfile id={session.me.id} />
    
    <h3>Make Changes</h3>
    < EditProfile user={session.me} />

  </div>
);

export default withAuthorization(session => session && session.me)(
  withSession(AccountPage),
);
