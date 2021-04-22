// dev config variables name
const dev = {
  hostName: "http://localhost:4000",
  cookie_expiration: 7200,
};

// production variables name
const prod = {
  hostName: "http://620ada40d19d.ngrok.io",
  cookie_expiration: 7200,
};
const jwtSecret =
  "48a3aff9c14f355484dc33086e1598d596632f457770eeffc26ec08c0179798cee9532561452ae7eef261aeb76195848256909e97423d661e3499130da55a502";

const config = process.env.REACT_APP_STAGE === "production" ? prod : dev;

// export the default configuration
export default {
  ...config,
  jwtSecret,
};
