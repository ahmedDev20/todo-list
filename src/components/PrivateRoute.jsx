import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { getCurrentUser } from '../store/auth';

function PrivateRoute({ children, ...rest }) {
  const { loggedIn } = useSelector(getCurrentUser);

  return (
    <Route
      {...rest}
      path="/todos"
      render={({ location }) => (loggedIn ? children : <Redirect to="/login" />)}
    />
  );
}

export default PrivateRoute;
