import React from "react";
import { updateTable } from "./map";

export let globalIndex: number = 0;

export function MyWidget() {
  let buttonPrev = document.querySelector("#buttonPrev") as HTMLButtonElement | null;
  let text = document.querySelector("#globalIndex") as HTMLElement | null;

  if (buttonPrev) {
    buttonPrev.onclick = () => {
      if (globalIndex > 0) {
        globalIndex--;
        if (text) {
          text.textContent = globalIndex.toString();
        }
        updateTable(globalIndex);
      }
    }
  }

  let buttonNext = document.querySelector("#buttonNext") as HTMLButtonElement | null;

  if (buttonNext) {
    buttonNext.onclick = () => {
      globalIndex++;
      if (text) {
        text.textContent = globalIndex.toString();
      }
      updateTable(globalIndex);
    }
  }

  return (
    <div>
      <p className="textDefault" id="myWidget">Click to the map to get weather data!</p>
    </div>
  )
}

export function MyTable() {
  return (
    <div className="popUp">
      <table id="myTable">
        <tr>
          <th>Temperature, °C</th>
          <th>Humidity, %</th>
          <th>Pressure, mmHg</th>
          <th>WindSpeed, m/s</th>
          <th>WeatherCharacter</th>
          <th>Country</th>
          <th>Place</th>
        </tr>
        <tr>
          <td id="temperature"     ></td>
          <td id="humidity"        ></td>
          <td id="pressure"        ></td>
          <td id="windSpeed"       ></td>
          <td id="WeatherCharacter"></td>
          <td id="country"         ></td>
          <td id="place"           ></td>
        </tr>
      </table>
    </div>
  )
}