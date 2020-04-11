import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { NgxGraphOrgTreeComponent } from "./examples/ngx-graph-org-tree/ngx-graph-org-tree.component";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <NgxGraphOrgTreeComponent></NgxGraphOrgTreeComponent>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
