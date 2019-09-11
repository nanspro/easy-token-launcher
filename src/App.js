import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./components/Home";
import TokenLaunchForm from "./components/TokenLaunchForm";

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/launch" component={TokenLaunchForm} />
      </div>
    </Router>
  );
}

export default App;
