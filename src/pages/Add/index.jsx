import React, { Component } from "react";

// === Components === //
import { Link } from "react-router-dom";
import { Button } from "antd";

const Add = () => {
  return (
    <div>
      <p>Add</p>
      <Button type="primary">
        <Link to="/deposit">go to /deposit</Link>
      </Button>
    </div>
  );
};

export default Add;
