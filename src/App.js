import './App.css';
import React,{useEffect, useState} from "react";
import {FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
import InfoBox from './infoBox';
import Map from './Map';
import Table  from './Table';
import {sortData} from './util'
import LineGraph from './LineGraph';
import numeral from 'numeral';
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from './util';

function App() {
  const[countries,setCountries] = useState([]);
  const[country,setCountry] = useState("Worldwide");
  const[countryInfo,setCountryInfo] = useState({});
  const[tableData,setTableData] =  useState([]);
  const[caseType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const[mapCountries,setMapCountries] = useState([]);

  useEffect(() =>{
    fetch ("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json() )
    .then(data => {
     setCountryInfo(data);
    }
    )
    }, []
    );

  useEffect(() =>{  
    const getCountriesData = async () => {
    await fetch ("https://disease.sh/v3/covid-19/countries")
    .then((response) => response.json())
    .then((data) => {
     const countries = data.map((country) => (
     {
           name : country.country,
           value : country.countryInfo.iso2
     } ));
     let sortedData = sortData(data);
     setMapCountries(data);
     setTableData(sortedData);
     setCountries(countries);
    })
    }
    getCountriesData();
    },[countries]);

    const onCountryChange = async(e) => {
      let countryCode = e.target.value;
      setCountry(countryCode);
      let url = countryCode === "Worldwide" ? "https://disease.sh/v3/covid-19/all" : 
      `https://disease.sh/v3/covid-19/countries/${countryCode}` ; 
    
      await fetch (url)
      .then((response) => response.json()
      )
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        (countryCode === "Worldwide") && setMapCenter({lat: 34.80746, lng: -40.4796 });
        (countryCode === "Worldwide") && setMapZoom(3);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4); 
      } );
      };
  

  return (
    <div className="app">
       <div className='app_left'>
         <div className='app_header'>
            <h1>COVID-19 TRACKER</h1>
            <FormControl className='app_dropdown'>
            <Select variant="outlined" onChange={onCountryChange} value = {country}>
            <MenuItem value = "Worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
            <MenuItem value = {country.value}>{country.name}</MenuItem>
               ))}
            </Select>
            </FormControl>
          </div>
          <div className='app_stats'>

            <InfoBox 
              isRed
              onClick = {e =>setCasesType('cases')} 
              title="Coronavirus Cases" 
              active={caseType === "cases"}
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)}>
            </InfoBox>

            <InfoBox
              
              onClick = {e =>setCasesType('recovered')}
              title="Recovered"
              active={caseType === "recovered"}
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={prettyPrintStat(countryInfo.recovered)}>
            </InfoBox>

            <InfoBox 
              isRed
              onClick = {e =>setCasesType('deaths')}
              title= "Deaths" 
              active={caseType === "deaths"}
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)}>
            </InfoBox>
 
          </div>
          <div>
            <Map caseType={caseType} countries={mapCountries} center={mapCenter} zoom= {mapZoom} />
          </div>
        </div>
        
        <div>
        <Card className='app_right'>
          <CardContent>
          <div className='app_information'>
          <h3> Live Cases by Country</h3>
          <Table countries = {tableData} />
          <h3> Worldwide new {caseType}</h3>
          <LineGraph className = "app_graph" caseType={caseType} />
          </div>
          </CardContent>

        </Card>
        </div>
       
  </div>
  );
}

export default App;
