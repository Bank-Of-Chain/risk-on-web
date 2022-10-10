import React, { Component } from "react";

// === Components === //
import { Link } from "react-router-dom";
import { Button } from "antd";

const Deposit = () => {
  return (
    <div>
      <p>Deposit</p>
      <Button type="primary">
        <Link to="/">go to /home</Link>
      </Button>
      <Button type="primary">
        <Link to="/analysis">go to /analysis</Link>
      </Button>
    </div>
  );
};

export default Deposit;
