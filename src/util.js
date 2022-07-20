import React from "react";
import numeral from "numeral"
import { Circle,Popup } from "react-leaflet"

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      rgb: "rgb(204, 16, 52)",
      half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 60,
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 70,
    },
    deaths: {
      hex: "#fb4443",
      rgb: "rgb(251, 68, 67)",
      half_op: "rgba(251, 68, 67, 0.5)",
      multiplier: 500,
    },
  };

export const sortData = (data) =>{

    const sortedData = [...data];
     return sortedData.sort((a,b) => (a.cases > b.cases ? -1:1));   // if -1 is returned, then a will be sorted first, if 1 is returned then b will be sorted first
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// Draw circles on the map with interactive tooltip

export const showDataOnMap = (data, caseType = 'cases') =>
    data.map((country) =>(
      <Circle
      center = {[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity = {0.4}
      color = {casesTypeColors[caseType].hex}
      fillColor = {casesTypeColors[caseType].hex}
      radius={
         Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier
       }
     >
     <Popup>
     <div className="info-container">
       <div
         className="info-flag"
         style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
       ></div>
       <div className="info-name">{country.country}</div>
       <div className="info-confirmed">
         Cases: {numeral(country.cases).format("0,0")}
       </div>
       <div className="info-recovered">
         Recovered: {numeral(country.recovered).format("0,0")}
       </div>
       <div className="info-deaths">
         Deaths: {numeral(country.deaths).format("0,0")}
       </div>
     </div>
     </Popup>
     </Circle>
    ));


