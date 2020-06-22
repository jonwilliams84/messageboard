import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./icons.js";
import Display from "./screens/Display";
import "./style.css";
import Admin from './screens/Admin'

function App() {
  return (
    <Router>
      <Route path="/" exact component={Display} />
      <Route path="/Display/" exact component={Display} />
      <Route path="/admin/" exact component={Admin} />
    </Router>
  );
}

export default App;
