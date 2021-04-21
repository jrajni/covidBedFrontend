import React from "react";

const footer = (props) => (
  <footer className="footer">
    © {new Date().getFullYear() - 1} - {new Date().getFullYear()}
    <span className="text-muted d-none d-sm-inline-block float-right">
      Created with <i className="mdi mdi-heart text-danger" />{" "}
    </span>
  </footer>
);

export default footer;
