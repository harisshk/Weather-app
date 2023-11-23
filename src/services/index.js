import axios from 'axios';
import {API_KEY, LOCATION_API_URL, WEATHER_API_URL} from '../constants';

export const weatherCall = async city => {
  try{
    const response = await axios.get(
      `${WEATHER_API_URL}?access_key=${API_KEY}&query=${city}`,
    );
    return response.data;
  }catch(error){
    return {location:{name: "Error"}}
  }
};

export const locationCall = async city => {
  const response = await axios.get(
    `${LOCATION_API_URL}?access_key=${API_KEY}&query=${city}`,
  );
  return response.data;
};
