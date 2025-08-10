// src/setupProxy.js
module.exports = function (app) {
  // Block any websocket upgrade requests so the browser won't even try
  app.use((req, res, next) => {
    if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
      res.status(400).send('WebSockets disabled');
    } else {
      next();
    }
  });
};
