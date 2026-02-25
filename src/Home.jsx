import { useState, useEffect } from 'react';
import { Sun, Moon, X, Search, AlertCircle } from 'lucide-react'
import Background from "./Background"
import { cn } from  './lib/utils';

 
 

const API_KEY = '71c7d884a20e47c28bd203109251809';
const DAYS = 7;
function Home() {

const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState([]);
const [coords, setCoords] = useState({ lat: null, lon: null });
const [weatherData, setWeatherData] = useState([]);
const [dark, setDark] = useState(false);
const [location, setLocation] = useState('');
const [showError, setShowError] = useState(false);

useEffect(() =>{
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        setErrors([error.message]);
        console.log("Error getting location:", error);
      }
    );
  } else {
    setErrors(["Geolocation is not supported by this browser."]);
    console.log("Geolocation is not supported by this browser.");
  }
}, []);
 

function fetchWeather(place) {
  
     
    if (!place) return;
       setLoading(true);
       setErrors([]);
     

      fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${place}&days=${DAYS}&aqi=no&alerts=no`)
      .then(response =>  {
      if (!response.ok) {
        return response.json().then(errorData => {
          setErrors([errorData? errorData.error.message: "unknown error occurred "]);
          setLoading(false);
          setShowError(true);
           throw new Error(errorData? errorData.error.message : "Unknown error occurred");
        })
      }
      return response.json();
    })
      .then(data => {
        if(data.error){
          setErrors([data.error.message]);
          setLoading(false);
          console.log('API Error:', data.error.message);
          return;
        }
        console.log('Fetched weather data:', data);
        setWeatherData(data);
        setLoading(false);
      })
      .catch(error => {
        setErrors([error.message]);
        console.error('Error fetching weather data:', error);
        setLoading(false);
        setShowError(true);
      })
  
};





useEffect(() =>{
  if(coords.lat !== null && coords.lon !== null){
     fetchWeather (`${coords.lat},${coords.lon}`);
  }
 
}, [coords.lat, coords.lon]);

 


useEffect(() => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    setDark(true);
  } else {
    
   document.documentElement.classList.remove('dark');
   setDark(false);
  }
}, []);


function toggleDark() {
  setDark(prevDark => {
   const newDark = !prevDark;
   if (newDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
   } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
   }
   return newDark;
  })
}

function handleLocationChange(event) {
  setLocation(event.target.value);
}
/*

function getLocation() {
  return location ? location : `${coords.lat},${coords.lon}`;
}
  */
//console.log(location)

  return (
    <div className='min-h-screen overflow-x-hidden'>

      <Background />
      

       {/**Error message */}
       
       {/* search bar */}
       <div className="absolute flex  gap-4 top-10 right-15  w-60 md:w-full max-w-md z-150">
        <input 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (!location.trim()) return;
            fetchWeather(location.trim());
            setLocation('');
          }
        }}
          onChange={handleLocationChange}
          value={location}
          type="text" 
          placeholder="Search for a city..." 
          className="w-full p-3 rounded-lg border border-border bg-card text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
        </input>
        <button   type='search'onClick={() => {
          if (!location.trim()) return;
           fetchWeather(location.trim());
           setLocation('');
        }} className='border-1 border-border beautiful-button w-full max-w-20 rounded-full  text-center flex items-center justify-center  cursor-pointer '> <span className='absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'> <Search size={24} className="text-primary text-center" /> </span></button>
      </div>

        {/** Heading  */}
       <div className='fixed flex w-full justify-between items-center top-0  p-6 text-2xl font-bold z-50'>
       
         <p>
          <span className='text-primary '>HAY </span> 
          
          <span className='text-foreground'>JAY</span>
          </p>
          <button className='z-50 transition-all duration-300 cursor-pointer' onClick={toggleDark}>{dark ? <Sun size={24}  className="w-6 h-6 text-yellow-500 m-1 cursor-pointer" /> : <Moon size={24} className="w-6 h-6 text-gray-500 m-1 cursor-pointer"/>}</button>
       </div>
      
      {/**Welcome content */}


      <div className='container flex flex-col justify-center items-center text-center px-4  z-10 relative min-h-screen'>
        <div className='  max-w-4xl mx-auto text-center z-10'>
          
             <div className='space-y-6'>
              <h1 className='text-3xl md:text-4xl lg:text-5xl tracking-tight  font-extrabold'>
                <span className='text-foreground animate-jump-in '>Welcome To My</span>
                <span className='text-primary  animate-jump-in-delay-1'> Weather Site</span>
              </h1>
            </div>
         


          <p className='text-foreground mt-4 text-lg md:text-xl lg:text-2xl animate-jump-in-delay-2'>Get accurate weather forecasts and stay prepared for any weather conditions.</p>
           
         
        </div>


        {/**loading animations  */}
        {loading && <div className='flex justify-center items-center text-center  w-full flex-col gap-10 z-10 relative'>
          <div className='animation'/>
          <div className='z-100'> <p className='text-primary'>Loading...</p></div>
          </div> }


          {/**SHOWS AN ERROR IMAGE */}
          {showError && errors.length > 0 && (
        <div className={cn('z-100 relative  w-full flex justify-center items-center transition-all duration-300 z-100 gap-10 flex-col ')}>

          < AlertCircle className=' '  size={60} color='red' />
          {errors && errors.map((error, index) => (
          <div key={index} className='flex flex-col gap-12 items-center justify-center absolute top-1/2 left-1/2 right-1/2 bottom-1/2'>
            <span key={index} className='text-red-500 text-foreground text-sm'>{error}</span>
            <button onClick={() => {
              setShowError(false);
               {location.trim() ?  fetchWeather(location.trim()) : fetchWeather(`${coords.lat},${coords.lon}`)}
            }} className='bg-primary text-primary-foreground  rounded-full h-10 w-50  cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2'>Press to refresh</button>
          </div>
         )
        )}
        
       </div>)}

        
    


         {weatherData && weatherData.location && (
            <h1 className='mt-20 text-2xl font-bold animate-jump-in-delay-3'>
              <span className='text-primary'>
                Currently In: <span className='text-foreground' >{weatherData.location.country}, {weatherData.location.region}</span>
              </span>
                <br />
              <span className='text-primary'>
                Time at Location: <span className='text-foreground'>{weatherData.location.localtime}</span>
              </span>
            </h1>
          )}
        <div className='flex flex-wrap   justify-center items-center gap-6 mt-10 animate-jump-in-delay-4 z-10 relative'>
         
          {weatherData && weatherData.forecast && weatherData.forecast.forecastday.map((day, index) => (
            <div key={index} className='bg-card card-hover rounded-lg p-6 w-64  border-2 border-border  z-10 relative h-40 flex flex-col justify-between'>
              <div className='flex items-center gap-4'>
                <img src={day.day.condition.icon} alt={day.day.condition.text} className='w-12 h-12' />
                <div>
                  <p className='text-lg font-semibold'>{day.date}</p>
                  <p className='text-sm text-foreground'>{day.day.condition.text}</p>
                </div>
              </div>
              <div className='flex justify-between items-center mt-4'>
                <p className='text-2xl font-bold'>{day.day.avgtemp_c}°C</p>
                <p className='text-sm text-foreground'>Humidity: {day.day.avghumidity}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
     
          {/**Footer */}
      <footer className='h-24 absolute bottom-0 left-0 w-full flex justify-start items-center text-sm text-foreground z-10 relative bg-card border-t-1 border-border p-4 mt-10'>
          <p>&copy; {new Date().getFullYear()} Weather App. All rights reserved.</p>
      </footer>
    </div>
  )
}
export default Home;
