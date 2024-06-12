export interface IDynamic {
  [key: string]: any;
}

export interface IWeatherGetter {
  data: IDynamic;
}

export interface IGlobalWeatherData {
  error: boolean,
  message: string,
  date: string,
  temperature: string,
  humidity: string,
  pressure: string,
  windSpeed: string,
  weatherCharacter: string,
  country: string,
  place: string
}

export async function getWeatherFor5Days(weatherAPI: string, weatherData: IWeatherGetter, lat: number, alt: number) {
  try {
    if (weatherAPI == "OpenWeatherMap") {
      const apiKey = "13689c0155d7490c5ba24d97b04241c6";
  
      // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${alt}&appid=${apiKey}`;
      // const url2 = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${alt}&appid=${apiKey}`
      const url3 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${alt}&appid=${apiKey}`
  
      let response = await fetch(url3);
      let data = await response.json();

      weatherData.data = data;
    } else {
      throw new Error(`weather API '${weatherAPI}' is not find!`);
    }
  } catch(err) {
    alert(err);
  }
}

export function getStringWeatherData(obj: IDynamic, index: number): IGlobalWeatherData | undefined {
  let res: IGlobalWeatherData = {
    error: false,
    message: "???",
    date: "???",
    temperature: "???",
    humidity: "???",
    pressure: "???",
    windSpeed: "???",
    weatherCharacter: "???",
    country: "???",
    place: "???",
  };

  if (index >= obj.list.length) {
    res.error = true;
    res.message = "undefined timestamp";
    return res;
  }

  let weatherData = obj.list[index];

  if (weatherData.dt_txt) {
    res.date = weatherData.dt_txt;
  }

  let temp: string = "???";
  let country: string = "???";
  let place: string = "???";
  let humidity: string = "???";
  let pressure: string = "???";
  let windSpeed: string = "???";
  let weatherCharacter: string = "???";

  if (obj.city) {
    if (obj.city.name) {
      place = obj.city.name;
    }

    if (obj.city.country) {
      country = obj.city.country;
    }
    
  }

  if (weatherData.main) {
    let str = weatherData.main.temp;

    if (str != "") {
      let t = Number(str);
      t -= 273.15;
      t = Math.round(t);
      temp = t.toString();
    }

    humidity = weatherData.main.humidity;
    if (weatherData.main.pressure && weatherData.main.pressure != "") {
      let press = Number(weatherData.main.pressure);
      press *= 0.75;
      pressure = press.toString();
    }
  }
  if (weatherData.sys) {

    if (weatherData.sys.sunrise) {
      let date = new Date(Number(weatherData.sys.sunrise) + Number(weatherData.sys.sunrise));
      weatherCharacter = date.getHours().toString() + ":" + ("0" + date.getMinutes().toString()).substr(-2);
    }
  }

  if (weatherData.wind) {
    windSpeed = weatherData.wind.speed;
  }



  if (weatherData.weather) {
    weatherCharacter = "";
    for (let pos of weatherData.weather)
      weatherCharacter += pos.main + " :: " + pos.description + " ";
  }

  res.temperature = temp;
  res.humidity = humidity;
  res.pressure = pressure;
  res.windSpeed = windSpeed;
  res.weatherCharacter = weatherCharacter;
  res.country = country;
  res.place = place;
  return res;
}
