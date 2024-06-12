import React, { useState } from "react";
import { useRef } from "react";

import Map from "./node_modules/react-map-gl/dist/es5/exports-maplibre";
import { GeolocateControl, FullscreenControl } from "./node_modules/react-map-gl/dist/es5/exports-maplibre";

import * as mlbr from "./node_modules/maplibre-gl/dist/maplibre-gl";
import type { MapRef } from "./node_modules/react-map-gl/dist/es5/exports-maplibre";

import {getWeatherFor5Days, getStringWeatherData, IDynamic, IWeatherGetter, IGlobalWeatherData} from "./weather";
import { globalIndex } from "./widget";

export let globalWeatherData: IDynamic;

export const updateTable = (index: number) => {
  let widget = document.querySelector("#myWidget") as HTMLParagraphElement | null;
  if (!widget) {
    return;
  }

  let table = document.querySelector("#myTable") as HTMLTableElement | null;
  if (!table) {
    return;
  }

  let data = getStringWeatherData(globalWeatherData, globalIndex);

  if (!data) {
    return;
  }

  table.rows[1].cells[0].textContent = data.temperature;
  table.rows[1].cells[1].textContent = data.humidity;
  table.rows[1].cells[2].textContent = data.pressure;
  table.rows[1].cells[3].textContent = data.windSpeed;
  table.rows[1].cells[4].textContent = data.weatherCharacter;
  table.rows[1].cells[5].textContent = data.country;
  table.rows[1].cells[6].textContent = data.place;

  if (data.error) {
    widget.textContent = `Error: ${data.message}`;
  } else {
    widget.textContent = `Date: ${data.date}`;
  }
}

export function MyMap() {
  const mapRef = useRef<MapRef>(null);
  const geoRef = useRef<mlbr.GeolocateControl>(null);
  const [latitude, setLatitude] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [weatherData, setWeatherData]:
  [IDynamic, React.Dispatch<React.SetStateAction<IDynamic>>] = useState({});

  const onClickHandle = (event: mlbr.MapLayerMouseEvent) => {
    if (!mapRef.current) {
      return;
    }

    let map = mapRef.current.getMap();

    console.log("Map clicked!");

    let clamped = event.lngLat.lng; 
    while (Math.abs(clamped) > 180)
      clamped += 360 * Math.sign(-event.lngLat.lng);

    setLatitude(event.lngLat.lat);
    setAltitude(clamped);

    let receive: IWeatherGetter = {
      data: {},
    };

    getWeatherFor5Days("OpenWeatherMap", receive, event.lngLat.lat, clamped)
      .then(()=>{
        if (!receive.data) {
          return;
        }

        globalWeatherData = receive.data;

        updateTable(globalIndex);
      });
  }

  return (
    <div>
      <Map
        ref={mapRef}
        onClick={onClickHandle}
        id="map"
        initialViewState={{longitude: 0.0, latitude: 0.0, zoom: 4.67}} 
        style={{//{margin: `0px 0px ${window.innerWidth * 5 / 16}px ${window.innerWidth * 5 / 16}px`,
                width:  window.innerWidth,//window.innerWidth * 3 / 8,
                height: 400/*</div>window.innerHeight / 2*/}}
        //mapStyle="https://demotiles.maplibre.org/style.json"
        // mapStyle="https://api.maptiler.com/maps/satellite/style.json?key=PJQMm1QMNMIArTURauzn"//"https://api.maptiler.com/maps/streets/style.json?OpIi9ZULNHzrESv6T2vL"
        mapStyle="https://api.maptiler.com/maps/outdoor-v2/style.json?key=PJQMm1QMNMIArTURauzn"
      >
      </Map>
      <br></br><br></br><br></br><br></br><br></br>
      <p className="textDefault">CGSG NK1, coordinates: &lt;{latitude},{altitude}&gt;</p>
    </div>
  );
}

//    <!--<p>Mouse coordinates: &lt;{latitude},{altitude}&gt;</p>-->
//         <GeolocateControl ref={geoRef} options={{showUserLocation: true}}></GeolocateControl>
//         <FullscreenControl></FullscreenControl>
