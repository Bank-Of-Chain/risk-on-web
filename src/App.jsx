import React, { useEffect, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

// === Components === //
import Header from "@/components/Header";

// === Hooks === //
import useWallet from "@/hooks/useWallet";

// === Utils === //
import { isInMobileWalletApp, isInMobileH5 } from "@/helpers/plugin-util";

// === Styles === //
import "./App.css";

// === Pages === //
const Home = lazy(() => import("./pages/Home"));
const Add = lazy(() => import("./pages/Add"));
const Deposit = lazy(() => import("./pages/Deposit"));
const Analysis = lazy(() => import("./pages/Analysis"));

function App() {
  const { web3Modal, connect, getWalletName } = useWallet();

  const walletName = getWalletName();

  useEffect(() => {
    if (web3Modal.cachedProvider && !isInMobileWalletApp() && !isInMobileH5()) {
      connect();
    }
  }, [connect, web3Modal.cachedProvider, walletName]);

  return (
    <div className="App">
      <Header />
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
