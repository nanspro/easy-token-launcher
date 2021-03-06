import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./components/Home";
import TokenLaunchForm from "./components/TokenLaunchForm";
import TokenBuyForm from "./components/TokenBuyForm";

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/launch" component={TokenLaunchForm} />
        <Route exact path="/buy/:takerToken/:makerToken" component={TokenBuyForm} />
      </div>
    </Router>
  );
}

export default App;
