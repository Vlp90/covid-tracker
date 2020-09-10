import React, { useState } from "react";
import "./App.css";

import { FormControl, Select, MenuItem } from "@material-ui/core";

function App() {
  const [coutries, setCountries] = useState(["USA", "UK", "INDIA"]);

  // the state is how to write a variable in react

  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value="abc">
            {coutries.map((country) => (
              <MenuItem value={country}>{country}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default App;
