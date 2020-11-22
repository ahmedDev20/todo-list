import React, { useEffect } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, authRequested, userLoggedIn, userLoggedOut } from './store/auth';
import { auth } from './firebase';
import Todos from './components/Todos';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';

import './App.css';

function App() {
  const { loggedIn } = useSelector(getCurrentUser);
  const dispatch = useDispatch();

  // Listener for user state
  useEffect(() => {
    const checkAuthState = async () => {
      await auth.onAuthStateChanged(user => {
        dispatch(authRequested());
        if (user) {
          const { uid, displayName, email, photoURL } = user;
          const currentUser = {
            uid,
            displayName,
            email,
            photoURL,
            lastSignIn: user.metadata.lastSignInTime,
          };
          dispatch(userLoggedIn(currentUser));
        } else {
          dispatch(userLoggedOut());
        }
      });
    };
    checkAuthState();
  }, [dispatch]);

  return (
    <div className="App">
      <Switch>
        <PrivateRoute path="/todos">
          <Todos />
        </PrivateRoute>

        <Route path="/">
          {loggedIn && <Redirect to="/todos" />}
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default withRouter(App);
