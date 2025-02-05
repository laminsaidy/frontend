import React, { useState, useEffect } from "react";
import useCustomAxios from "../utils/useAxios"; // Custom hook for Axios with interceptors
import { jwtDecode } from "jwt-decode"; // Library to decode JWT tokens

const Dashboard = () => {
  // State to store the API response
  const [apiResponse, setApiResponse] = useState("");

  // Custom Axios instance with authentication headers
  const axiosInstance = useCustomAxios();

  // Retrieve the authentication token from localStorage
  const authToken = localStorage.getItem("authTokens");

  // Variables to store user details decoded from the token
  let userId, userName, fullName, userImage;

  // Decode the token and extract user details if the token exists
  if (authToken) {
    const decodedToken = jwtDecode(authToken);
    userId = decodedToken.user_id;
    userName = decodedToken.username;
    fullName = decodedToken.full_name;
    userImage = decodedToken.image;
  }

  // Function to fetch data using a GET request
  const fetchGetData = async () => {
    try {
      const result = await axiosInstance.get("/test/");
      setApiResponse(result.data.response); // Update state with the response
    } catch (err) {
      console.error(err); // Log errors to the console
      setApiResponse("An error occurred while fetching data."); // Set error message
    }
  };

  // Function to fetch data using a POST request
  const fetchPostData = async () => {
    try {
      const result = await axiosInstance.post("/test/");
      setApiResponse(result.data.response); // Update state with the response
    } catch (err) {
      console.error(err); // Log errors to the console
      setApiResponse("An error occurred while posting data."); // Set error message
    }
  };

  // useEffect to call fetchGetData when the component mounts
  useEffect(() => {
    fetchGetData();
  }, []);

  // useEffect to call fetchPostData when the component mounts
  useEffect(() => {
    fetchPostData();
  }, []);

  return (
    <div>
      {/* Main container with padding to avoid overlap with the Navbar */}
      <div className="container-fluid" style={{ paddingTop: "140px" }}>
        <div className="row">
          {/* Sidebar navigation */}
          <aside className="col-md-2 d-none d-md-block bg-light sidebar mt-4">
            <div className="sidebar-sticky">
              {/* Navigation links */}
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    <span data-feather="home" />
                    Dashboard <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file" />
                    Orders
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="shopping-cart" />
                    Products
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="users" />
                    Customers
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="bar-chart-2" />
                    Reports
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="layers" />
                    Integrations
                  </a>
                </li>
              </ul>

              {/* Saved reports section */}
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span>Saved reports</span>
                <a className="d-flex align-items-center text-muted" href="#">
                  <span data-feather="plus-circle" />
                </a>
              </h6>
              <ul className="nav flex-column mb-2">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file-text" />
                    Current month
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file-text" />
                    Last quarter
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file-text" />
                    Social engagement
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <span data-feather="file-text" />
                    Year-end sale
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main content area */}
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            {/* Dashboard header */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
              <h1 className="h2">My Dashboard</h1>
              <span>Hello {userName}!</span> {/* Display the username */}
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                  <button className="btn btn-sm btn-outline-secondary">
                    Share
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    Export
                  </button>
                </div>
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
                  <span data-feather="calendar" />
                  This week
                </button>
              </div>
            </div>

            {/* Alert to display API response */}
            <div className="alert alert-success">
              <strong>{apiResponse}</strong>
            </div>

            {/* Section title */}
            <h2>Section title</h2>

            {/* Responsive table */}
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Dynamically generate table rows */}
                  {Array.from({ length: 15 }).map((_, index) => (
                    <tr key={index}>
                      <td>1,{String(index + 1).padStart(3, "0")}</td>
                      <td>Lorem</td>
                      <td>ipsum</td>
                      <td>dolor</td>
                      <td>sit</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;