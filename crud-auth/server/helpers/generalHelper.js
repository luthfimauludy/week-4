const express = require("express");
const Boom = require("boom");

const app = express();

// * PUBLIC FUNCTION
const createTestServer = (path, plugin) => {
  // Middleware
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use((req, res, next) => {
    const oldSend = res.send;
    res.send = async (data) => {
      res.send = oldSend; // set function back to avoid the 'double-send'
      const statusCode =
        (data.output && data.output.statusCode) || res.statusCode;
      let bodyResponse = data;

      if (statusCode !== 200 && data.isBoom) {
        bodyResponse = data.output.payload;
      }

      return res.status(statusCode).send(bodyResponse);
    };

    next();
  });

  app.use(path, plugin);

  return app.listen(null, () => {});
};

const errorResponse = (err) => {
  if (
    err &&
    err.output &&
    err.output.payload &&
    err.output.payload.statusCode
  ) {
    const data = err.data && typeof err.data === "string" ? err.data : null;

    if (err.data && typeof err.data === "object") {
      switch (err.output.payload.statusCode) {
        case 400:
          return err;
        default:
          return Boom.badImplementation();
      }
    }

    switch (err.output.payload.statusCode) {
      case 422:
        return Boom.badData(err.output.payload.message, data);
      case 404:
        return Boom.notFound(err.output.payload.message, data);
      case 400:
        return Boom.badRequest(err.output.payload.message, data);
      case 401:
        return Boom.unauthorized(err.output.payload.message, data);
      default:
        return Boom.badImplementation();
    }
  }

  return Boom.badImplementation();
};

const commonHttpRequest = async (options) => {
  /*
  Pass options object from function argument as requestConfig for axios api-call.
  See documentation at https://axios-http.com/docs/req_config
  */
  const timeStart = process.hrtime();
  try {
    const requestConfig = {};
    Object.entries(options).forEach(([key, value]) => {
      requestConfig[key] = value;
    });

    const response = await Request.request(requestConfig);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    const logData = {
      timeTaken,
      status: response && response.status,
      uri: `${options.baseURL}${options.url}`,
    };

    console.log(["commonHttpRequest", "Response", "INFO"], logData);

    return Promise.resolve(response.data);
  } catch (err) {
    if (err.response) {
      const timeDiff = process.hrtime(timeStart);
      const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

      const logData = {
        timeTaken,
        uri: `${options.baseURL}${options.url}`,
        status: err.response.status,
        error: `${err.response.data}`,
      };

      console.log(["commonHttpRequest", "Response", "ERROR"], logData);
    }

    return Promise.reject(Boom.badImplementation(err));
  }
};

module.exports = {
  createTestServer,
  errorResponse,
  commonHttpRequest,
};
