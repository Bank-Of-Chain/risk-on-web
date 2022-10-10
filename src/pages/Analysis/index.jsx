import React from "react";

// === Components === //
import { Link } from "react-router-dom";
import { Button } from "antd";

const Analysis = () => {
  return (
    <React.Suspense>
      <div>
        <p>Analysis</p>
        <Button type="primary">
          <Link to="/">go to home page</Link>
        </Button>
      </div>
    </React.Suspense>
  );
};

export default Analysis;
