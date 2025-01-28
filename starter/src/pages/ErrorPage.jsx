import React from "react";
import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error); // Log the error for debugging

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Oops! Something went wrong</h1>
      {error?.status === 404 ? (
        <p>The page you are looking for was not found.</p>
      ) : (
        <p>An unexpected error occurred. Please try again later.</p>
      )}
      <Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
        Go back to the homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
