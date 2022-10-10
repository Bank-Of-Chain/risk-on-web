import React, { Component } from "react";

// === Components === //
import { Link } from "react-router-dom";
import { Button } from "antd";

const Home = () => {
  return (
    <div>
      <p>home</p>
      <Button type="primary">
        <Link to="/add">go to /add</Link>
      </Button>
      <Button type="primary">
        <Link to="/analysis">go to /analysis</Link>
      </Button>
    </div>
  );
};

export default Home;
