import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import '../component/css/Temp.css'

const Temp = () => {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [weatherdetails, setweatherdetails] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const apiKey = `45b07b34c2d26ac30ababeb1fcd77151`;
  const endPoint = `https://api.openweathermap.org/data/2.5/weather?`;
  const date = new Date();
  const formattedDate = `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
      const intervalId = setInterval(() => {
        const currentTime = new Date();
        setCurrentTime(`${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(intervalId);
    });
  }, []);

  useEffect(() => {
    if (lat !== null && long !== null) {
      getWeather();
    }
  }, [lat, long]);

  useEffect(() => {
    if (searchInput.trim() !== "") {
      searchWeather();
    }
  }, [searchInput]);

  const getWeather = async () => {
    try {
      let finalendpoint = `${endPoint}lat=${lat}&lon=${long}&exclude=hourly,daily&appid=${apiKey}`;
      const response = await axios.get(finalendpoint);
      console.log(response.data)
      setweatherdetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchWeather = async () => {
    try {
      const response = await axios.get(`${endPoint}q=${searchInput}&appid=${apiKey}`);
      console.log(response.data);
      setweatherdetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  if (weatherdetails !== null) {
    return (
      <div>
        <Card sx={{ minWidth: 200 }} className="background_card">
          <CardContent>
            <form >
              <input type="text" placeholder="Search city..." value={searchInput} onChange={handleSearchInputChange} className="stylish"></input>
            </form>
            <div className="mt-4">
              <div>
                <h4 className="text-white  px-5"><span className="ms-2">{formattedDate}</span></h4>
                <h2 className="text-white px-5"><span className="ms-2" >{currentTime}</span></h2>
              </div>
              <div className="text-white display-1">{Math.round(weatherdetails.main.temp / 10)}°<sup>c</sup></div>
              <h4 className="text-white" style={{ fontSize: "20px" }}>City: {weatherdetails.name}</h4>
              <div className="ms-4 px-5 text-white">
                {weatherdetails.weather[0].main === "Clouds" ? <i className="fa-solid fa-3x  fa-cloud"></i> : weatherdetails.weather[0].main === "Sunny" ? <i className="fa-solid fa-3x fa-cloud-sun "></i> : <i className="fa-solid  fa-cloud-showers-heavy"></i>}
                <p className="text-white h4">Clear</p>
              </div>
            </div>
            <div className="d-flex  justify-content-center mt-4">
              <h4 className="text-white mx-3">Max:<span>{Math.round(weatherdetails.main.temp_max / 10)}°</span></h4>
              <h4 className="text-white ms-2">Min:<span>{Math.round(weatherdetails.main.temp_min / 10)}°</span></h4>
            </div>
            <div className="wind">
              <span className="text-white h4">Wind :</span>
              <span className="text-white h4">{weatherdetails.wind.speed} km/h</span>
              <div className="d-flex justify-content-center">
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } else {
    return null; 
  }

};

export default Temp;
