import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util.js";
import LineGraph from "./LineGraph.js";

import "leaflet/dist/leaflet.css";

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
  const [mapCenter, setMapCenter] = useState({
    lat: 47.1817585,
    lng: 19.5060937,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

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

          const sortedData = sortData(data);
          // setTableData(data);
          setTableData(sortedData);
          setMapCountries(data);
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
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
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
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <div className="app__map">
          <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
        </div>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Last 24h Cases by Country</h3>
          {/* Table */}
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
