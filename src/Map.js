import React from 'react'
import {Map as LeafletMap, TileLayer} from "react-leaflet"
import './Map.css'
import { showDataOnMap } from './util'

function Map({countries,caseType,center,zoom}) {
  return ( 
    <div className='map' >
    <LeafletMap center={center} zoom = {zoom}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://carto.com/">carto.com</a> contributors'
      />
      {showDataOnMap(countries,caseType)}
    </LeafletMap>
    </div>
  );
}

export default  Map