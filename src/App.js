import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map"

import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";

function App() {
  const [coutries, setCountries] = useState([""]);
  const [country, setCountry] = useState("worldwide-tag-value");

  // the state is how to write a variable in react

  // Countries api
  // https://disease.sh/v3/covid-19/countries

  // to call API we use USEEFFECT --- run piece of code on a given condition

  useEffect(() => {
    // the code inside will run once when the component loads and not again
    // async -> send a request, wait for it, do something with info

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  // and if there is someting in the [], the code will load every time there is a modification on the variable

  // change value of the country selected in the dropdown list
  const onCountryChange = async (event) => {
    // console.log(event)
    const countryCode = event.target.value;
    // console.log(countryCode)
    setCountry(countryCode);
  };

  return (
    <div className="app">
    <div className="app__left">

      <div className="app__header">
        <h1>COVID-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            <MenuItem value="worldwide-tag-value">Worldwide</MenuItem>
            {coutries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
        <InfoBox title="Coronavirus Cases" cases={7000} total={10000}/>
        <InfoBox title="Recovered" cases={7000} total={10000}/>
        <InfoBox title="Deaths" cases={7000} total={10000}/>
      </div>

      <div className="app__map">
        <Map />
      </div>
    </div>

    <Card className="app__right">
      <CardContent>
      <h3>Live Cases by Country</h3>
      {/* Table */}
      <h3>Worldwide new cases</h3>
      {/* Graph */}
      </CardContent>
    </Card>
    </div>
  );
}

export default App;
