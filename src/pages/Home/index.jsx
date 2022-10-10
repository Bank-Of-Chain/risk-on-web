import React from "react";

// === Components === //
import { Link } from "react-router-dom";
import { Button } from "antd";

const Home = () => {
  return (
    <React.Suspense>
      <div>
        <p>home</p>
        <Button type="primary">
          <Link to="/add">go to /add</Link>
        </Button>
        <Button type="primary">
          <Link to="/analysis">go to /analysis</Link>
        </Button>
      </div>
    </React.Suspense>
  );
};

export default Home;
