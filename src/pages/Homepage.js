import React from "react";

function Homepage() {
  return (
    <div>
      <>
        <main role="madin" style={{ marginTop: 50 }}>
          {/* Main jumbotron for a primary marketing message or call to action */}
          <div className="jumbotron">
            <div className="container" style={{ marginTop: "80px", paddingBottom: "20px" }}>
              
              <h1 className="display-3">Hello!</h1>
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.

              </p>
              <p>
                <a className="btn btn-primary btn-lg" href="#" role="button">
                  Learn more »
                </a>
              </p>
            </div>
          </div>
          <div className="container">
            {/* Example row of columns */}
            <div className="row">
              <div className="col-md-4">
                <h2>Heading</h2>
                <p>
                  Donec id elit non mi porta gravida at eget metus. Fusce
                  dapibus, tellus ac cursus commodo, tortor mauris condimentum
                  nibh, ut fermentum massa justo sit amet risus. Etiam porta sem
                  malesuada magna mollis euismod. Donec sed odio dui.{" "}
                </p>
                <p>
                  <a className="btn btn-secondary" href="#" role="button">
                    View details »
                  </a>
                </p>
              </div>
              <div className="col-md-4">
                <h2>Heading</h2>
                <p>
                  Donec id elit non mi porta gravida at eget metus. Fusce
                  dapibus, tellus ac cursus commodo, tortor mauris condimentum
                  nibh, ut fermentum massa justo sit amet risus. Etiam porta sem
                  malesuada magna mollis euismod. Donec sed odio dui.{" "}
                </p>
                <p>
                  <a className="btn btn-secondary" href="#" role="button">
                    View details »
                  </a>
                </p>
              </div>
              <div className="col-md-4">
                <h2>Heading</h2>
                <p>
                  Donec sed odio dui. Cras justo odio, dapibus ac facilisis in,
                  egestas eget quam. Vestibulum id ligula porta felis euismod
                  semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris
                  condimentum nibh, ut fermentum massa justo sit amet risus.
                </p>
                <p>
                  <a className="btn btn-secondary" href="#" role="button">
                    View details »
                  </a>
                </p>
              </div>
            </div>
            <hr />
          </div>{" "}
          {/* /container */}
        </main>
        <footer className="bg-light text-center text-lg-start">
          <div className="footer">
            <p>
              Copy right &copy;2025; Designed by{" "}
              <span className="creator">
                <a href="https://github.com/laminsaidy" target="_blank">
                  Lamin Saidy
                </a>
              </span>
            </p>
          </div>
        </footer>
      </>
    </div>
  );
}

export default Homepage;
