import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import {theme} from '../theme';
import {EyeIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import {weatherCall} from '../services';
import places from '../constants/in.json';
import {weatherImages} from '../constants';
import {getData, storeData} from '../utils/asyncStorage';
import {getIpAddress, getIpAddressSync} from 'react-native-device-info';

function HomeScreen(props) {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [currentData, setCurrentData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationClick = async location => {
    setIsLoading(true);
    const data = await weatherCall(location?.name);
    storeData('city', location?.name);
    setCurrentData(data);
    toggleSearch(false);
    setLocations([]);
    setIsLoading(false);
  };
  const handleSearch = async value => {
    if (value.length > 1) {
      const query = value.toLowerCase();
      const data = places.filter(place => {
        const name = place.name.toLowerCase();
        return name.includes(query);
      });
      setLocations(data);
    } else {
      setLocations([]);
    }
  };
  const handleFirstFetch = async () => {
    let myCity = await getData('city');
    let city = 'New Delhi';
    if (myCity) {
      city = myCity;
    }
    handleLocationClick({name:city});
  };
  useEffect(() => {
    handleFirstFetch();
  }, []);
  return (
    <View className="flex-1  relative">
      <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <Image
          blurRadius={70}
          source={require('../assets/images/bg.jpg')}
          className="absolute h-full w-full"
        />
        {isLoading ? (
          <View className="flex-1 flex-row justify-center items-center">
            <ActivityIndicator color={'white'} size={50} />
          </View>
        ) : (
          <SafeAreaView className="flex flex-1 mt-2">
            <View style={{height: '7%'}} className="mx-4 relative z-50">
              <View
                className="flex-row justify-end items-center rounded-full"
                style={{
                  backgroundColor: showSearch
                    ? theme.bgWhite(0.2)
                    : 'transparent',
                }}>
                {showSearch ? (
                  <TextInput
                    onChangeText={handleSearch}
                    placeholder="Search City"
                    placeholderTextColor={'lightgrey'}
                    className="pl-6 h-10 flex-1 text-base text-white"
                  />
                ) : null}
                <TouchableOpacity
                  onPress={() => toggleSearch(!showSearch)}
                  style={{backgroundColor: theme.bgWhite(0.3)}}
                  className="rounded-full p-3 m-1">
                  <MagnifyingGlassIcon size={25} color={'white'} />
                </TouchableOpacity>
              </View>
              {locations.length > 0 && showSearch ? (
                <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                  {locations.map((loc, index) => {
                    let showBorder = index + 1 != locations.length;
                    let borderClass = showBorder
                      ? 'border-b-2 border-b-gray-400'
                      : null;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleLocationClick(loc)}
                        className={
                          ' flex-row items-center border-0 p-3 px-4 mb-1 ' +
                          borderClass
                        }>
                        <MapPinIcon size={20} color={'gray'} />
                        <Text className="text-black text-lg ml-2">
                          {loc.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
            {/* Forecast */}
            <View className="mx-4 flex justify-around flex-1 mb-2">
              {/* Location */}
              <Text className="text-white text-center text-2xl font-bold">
                {currentData?.location?.name}, {" "}
                <Text className="text-lg font-semibold text-gray-300">
                  {currentData?.location?.region}
                </Text>
              </Text>
              {/* Image */}
              <View className="flex-row justify-center">
                {currentData?.current && (
                  <Image
                    source={
                      weatherImages[
                        currentData?.current?.weather_descriptions[0]
                      ]
                    }
                    className="w-52 h-52"
                  />
                )}
              </View>
              {/* Degree celcius */}
              <View className="space-y-2">
                <Text className="text-center font-bold text-white text-6xl ml-5">
                  {currentData?.current?.temperature}&#176;
                </Text>
                <Text className="text-center text-white text-xl tracking-widest">
                  {currentData?.current?.weather_descriptions[0]}
                </Text>
              </View>
              {/* Other stats */}
              <View className="flex-row justify-between mx-4">
                <View className="flex-col ">
                  <View className="flex-row space-x-2 items-center">
                    <Image
                      source={require('../assets/icons/wind.png')}
                      className="h-6  w-6"
                    />
                    <Text className="text-white font-semibold text-base">
                      {currentData?.current?.wind_speed}km
                    </Text>
                  </View>
                  <Text className="mt-2 text-white text-xs text-center w-full">
                    Wind Speed
                  </Text>
                </View>
                <View className="flex-col ">
                  <View className="flex-row space-x-2 items-center">
                    {/* <Image source={require("../assets/icons/drop.png")}
              className="h-6  w-6" /> */}
                    <EyeIcon size={25} color={'white'} />
                    <Text className="text-white font-semibold text-base">
                      {currentData?.current?.visibility} KMs
                    </Text>
                  </View>
                  <Text className="mt-2 text-white text-xs text-center w-full">
                    Visibility
                  </Text>
                </View>
                <View className="flex-col ">
                  <View className="flex-row space-x-2 items-center">
                    <Image
                      source={require('../assets/icons/sun.png')}
                      className="h-6  w-6"
                    />
                    <Text className="text-white font-semibold text-base">
                      {currentData?.current?.uv_index}
                    </Text>
                  </View>
                  <Text className="mt-2 text-white text-xs text-center w-full">
                    UV Index
                  </Text>
                </View>
              </View>
            </View>
            {/* next 4 days */}
            {/* <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
                <CalendarDaysIcon size={"22"} color={"white"} />
                <Text className="text-white text-base">Daily Forecast</Text>
            </View>
            <ScrollView horizontal
            contentContainerStyle={{paddingHorizontal:15}}
            showsHorizontalScrollIndicator>
                <View 
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{backgroundColor: theme.bgWhite(0.15)}}
                >
                    <Image 
                    source={require("../assets/images/heavyrain.png")} 
                    className="h-11 w-11"
                    />
                    <Text className="text-white">Monday</Text>
                    <Text className="text-white text-xl font-semibold">13&#176;</Text>
                </View>
                <View 
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{backgroundColor: theme.bgWhite(0.15)}}
                >
                    <Image 
                    source={require("../assets/images/heavyrain.png")} 
                    className="h-11 w-11"
                    />
                    <Text className="text-white">Monday</Text>
                    <Text className="text-white text-xl font-semibold">13&#176;</Text>
                </View>
                <View 
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{backgroundColor: theme.bgWhite(0.15)}}
                >
                    <Image 
                    source={require("../assets/images/heavyrain.png")} 
                    className="h-11 w-11"
                    />
                    <Text className="text-white">Monday</Text>
                    <Text className="text-white text-xl font-semibold">13&#176;</Text>
                </View>
                <View 
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{backgroundColor: theme.bgWhite(0.15)}}
                >
                    <Image 
                    source={require("../assets/images/heavyrain.png")} 
                    className="h-11 w-11"
                    />
                    <Text className="text-white">Monday</Text>
                    <Text className="text-white text-xl font-semibold">13&#176;</Text>
                </View>
            </ScrollView>
        </View> */}
          </SafeAreaView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

export default HomeScreen;
