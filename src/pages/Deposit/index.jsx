import React from "react";

// === Components === //
import { Link } from "react-router-dom";
import { Button } from "antd";

const Deposit = () => {
  return (
    <React.Suspense>
      <div>
        <p>Deposit</p>
        <Button type="primary">
          <Link to="/">go to /home</Link>
        </Button>
        <Button type="primary">
          <Link to="/analysis">go to /analysis</Link>
        </Button>
      </div>
    </React.Suspense>
  );
};

export default Deposit;
