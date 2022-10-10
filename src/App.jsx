import { HashRouter, Routes, Route } from "react-router-dom";

// === Styles === //
import "./App.css";

// === Components === //
import Home from "@/pages/Home";
import Add from "@/pages/Add";
import Deposit from "@/pages/Deposit";
import Analysis from "@/pages/Analysis";

function App() {
  return (
    <div className="App">
      {/* 这里到时候可以添加通用头和脚 */}
      <HashRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="add" element={<Add />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="analysis" element={<Analysis />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
