// src/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const [user] = useAuthState(auth);

  return (
    <Route
      {...rest}
      element={user ? <Component /> : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
