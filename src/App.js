import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData} from "./util.js"
import LineGraph from "./LineGraph.js"

import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

function App() {
  const [coutries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide-tag-value");
  const [countryInfo, setCountryInfo] = useState({}); // empty objects
  const [tableData, setTableData] = useState([]);

  // to make sure it will work with worldwide data at launch
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all?yesterday=true")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // the state is how to write a variable in react

  // Countries api
  // https://disease.sh/v3/covid-19/countries
  // https://disease.sh/v3/covid-19/all?yesterday=true
  // https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true&strict=true

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

          const sortedData = sortData(data)
          // setTableData(data);
          setTableData(sortedData);
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

    const url =
      countryCode === "worldwide-tag-value"
        ? "https://disease.sh/v3/covid-19/all?yesterday=true"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true&strict=true`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide-tag-value">Worldwide</MenuItem>
              {coutries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <div className="app__map">
          <Map />
        </div>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Last 24h Cases by Country</h3>
          {/* Table */}
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
