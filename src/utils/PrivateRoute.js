import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom"; // Correct imports for v5
import AuthContext from "../context/AuthContext"; // Ensure correct import

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext); // Get the current user from context

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} /> // If user is authenticated, render the component
        ) : (
          <Redirect to="/login" /> // Otherwise, redirect to login page
        )
      }
    />
  );
};

export default PrivateRoute;
