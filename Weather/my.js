const api_key = "53ed89f4a5b01248f1c088f1813cc01a";
var btn = document.getElementById("search_btn");
var inputText = document.getElementById("countryInput");
var cName = document.getElementById("countryTextTag");
var degreeText = document.getElementById("degreeTextTag");
var mainImg = document.getElementById("currentImg");
var realTag = document.getElementById("realFeel");
var windTag = document.getElementById("wind");
var rainTag = document.getElementById("rainy");
var cloudTag = document.getElementById("cloud");
var Date9Tag = document.getElementById("Date9");
var Date15Tag = document.getElementById("Date15");
var Date21Tag = document.getElementById("Date21");
var DateImg9 = document.getElementById("Date9Img");
var DateImg15 = document.getElementById("Date15Img");
var DateImg21 = document.getElementById("Date21Img");

var w1Img = document.getElementById("week1Img");
var w1Text = document.getElementById("week1Text");
var w1Max = document.getElementById("week1Max");
var w1Min = document.getElementById("week1Min");

var w2 = document.getElementById("week2");
var w2Img = document.getElementById("week2Img");
var w2Text = document.getElementById("week2Text");
var w2Max = document.getElementById("week2Max");
var w2Min = document.getElementById("week2Min");

var w3 = document.getElementById("week3");
var w3Img = document.getElementById("week3Img");
var w3Text = document.getElementById("week3Text");
var w3Max = document.getElementById("week3Max");
var w3Min = document.getElementById("week3Min");

var errorPage = document.getElementById("err");
var h1Tag = document.getElementById("h1");
var h2Tag = document.getElementById("h2");
var h3Tag = document.getElementById("h3");
var h4Tag = document.getElementById("h4");


const weekNames = ["Sunday", "Monday", "Tuesday","Wednesday","Thursday","Friday","Saturday"];

inputText.addEventListener('keypress',function (event){
    if (event.key === "Enter") {
        btn.click();
    }
});


btn.addEventListener("click", ApiInfo);
function getCoordintes() {


    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        getCity(coordinates);
        CurrentWeatherInfo(lat,lng);
        return;

    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error);
}
function getCity(coordinates) {
    var xhr = new XMLHttpRequest();
    let lat = coordinates[0];
    let lng = coordinates[1];

    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.b19aeef4bdae2db0cde647ae054eb7fb&lat=" +
        lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            var city = response.address.city;
            cName.innerHTML = city;
            return;
        }
    }
}
function myFunction(){
    getCoordintes();
}

function AddCss(temp){
    var element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("href", "style1.css");
    if(temp == true)
        document.getElementsByTagName("head")[0].appendChild(element);
    else
        document.getElementsByTagName("head")[0].removeChild(element);
}

function ApiInfo() {
    if (window.XMLHttpRequest)
        request = new XMLHttpRequest();
    else
        request = new ActiveXObject("Microsoft.XMLHTTP");
    request.open("GET", `http://api.openweathermap.org/geo/1.0/direct?q=${inputText.value}&appid=${api_key}`);
    request.responseType = "json";
    request.onload = function () {
        if (request.status == 200) {
            const response = request.response[0];
            if(response != null){
                cName.innerHTML = response.state;
                CurrentWeatherInfo(response.lat,response.lon);
                h4Tag.classList.remove('hidden');
                h1Tag.classList.remove('hidden');
                h2Tag.classList.remove('hidden');
                h3Tag.classList.remove('hidden');
                errorPage.style.display = 'none';
                errorPage.style.visibility = 'hidden';
                AddCss(false);

            }
            else{
                h1Tag.classList.add('hidden');
                h2Tag.classList.add('hidden');
                h3Tag.classList.add('hidden');
                h4Tag.classList.add('hidden');
                errorPage.style.visibility = 'visible';
                errorPage.style.display = 'flex';
                AddCss(true);
            }

        }
    }
    request.send();
}

function CurrentWeatherInfo(myLat,myLon){
    myrequest = new XMLHttpRequest();
    myrequest.open("GET",`https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLon}&appid=${api_key}`);
    myrequest.responseType = "json";
    myrequest.onload = function (){
        if(myrequest.status === 200){
            const myResponce = myrequest.response;
            temperatureConverterCelc(myResponce.main.temp,degreeText);
            mainImg.src = `Images/Weathers/${myResponce.weather[0].icon}.png`;
            writeAirCond(myResponce.main.feels_like,myResponce.wind.speed,myResponce.clouds.all);
            HourlyForecast(myLat,myLon);
        }

    }


    myrequest.send();
}
function writeAirCond(feelT,windT,cloudT){
    temperatureConverterCelc(feelT,realTag);
    windTag.innerHTML = windT + " km/h";
    cloudTag.innerHTML = cloudT + " %";
}


function temperatureConverterCelc(valNum,tag) {
    valNum = parseFloat(valNum);
    var str = parseInt(valNum - 273.15);
    tag.innerHTML = `${str}<sup>&#9900;</sup>C`;
}

function tempWeeks(val,tag,temp){
    val = parseFloat(val);
    var strNew = parseInt(val - 273.15);
    if(temp == false)
        tag.innerHTML = `${strNew}`;
    else
        tag.innerHTML = `/${strNew}`;
}

function HourlyForecast(myLat,myLon){
    myrequest = new XMLHttpRequest();
    myrequest.open("GET",`https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLon}&appid=${api_key}`);
    myrequest.responseType = "json";
    myrequest.onload = function (){
        if(myrequest.status === 200){
            const myResponse = myrequest.response;
            HourlyItem3(myResponse);
            WeeksForecast(myResponse);
        }

    }

    myrequest.send();
}

function HourlyItem3(response){
    let currentDate = new Date().getDate();
    for (let i = 0; i < response.list.length; i++){
        var myDate = new Date(response.list[i]["dt_txt"]);
        if(myDate.getDate() == currentDate){
            if(myDate.getHours() == 12 || myDate.getHours() == 15 || myDate.getHours() == 21){
                var item = response.list[i];
                switch(myDate.getHours()) {
                    case 12:
                        if(item.weather[0].icon == '01n')
                            DateImg9.src = `Images/Weathers/01d.png`
                        else
                            DateImg9.src = `Images/Weathers/${item.weather[0].icon}.png`;
                        temperatureConverterCelc(item.main["temp"],Date9Tag);
                        break;
                    case 15:
                        if(item.weather[0].icon == '01n')
                            DateImg15.src = `Images/Weathers/02d.png`;
                        else
                            DateImg15.src = `Images/Weathers/${item.weather[0].icon}.png`;
                        temperatureConverterCelc(item.main["temp"],Date15Tag);
                        break;
                    case 21:
                        DateImg21.src = `Images/Weathers/${item.weather[0].icon}.png`;
                        temperatureConverterCelc(item.main["temp"],Date21Tag);
                        break;
                    default:
                }
            }
        }
    }

}

function WeeksForecast(response){
    let my = new Date().getDate();
    let currentDate = new Date().getDate();

    for (let i = 0; i < response.list.length; i++){
        let myNewDate = new Date(response.list[i]["dt_txt"]);
        if(myNewDate.getDate() == currentDate){
            let item = response.list[i];
           switch (currentDate - my){
               case 0:
                   w1Img.src = `Images/Weathers/${item.weather[0].icon}.png`;
                   w1Text.innerHTML = `${item.weather[0].main}`;
                   tempWeeks(item.main['temp_max'],w1Max,false);
                   tempWeeks(item.main['temp_min'],w1Min,true);
                   break;
               case 1:
                   w2.innerHTML = weekNames[myNewDate.getDay()];
                   w2Img.src = `Images/Weathers/${item.weather[0].icon}.png`;
                   w2Text.innerHTML = `${item.weather[0].main}`;
                   tempWeeks(item.main['temp_max'],w2Max,false);
                   tempWeeks(item.main['temp_min'],w2Min,true);
                   break;
               case 2:
                   w3.innerHTML = weekNames[myNewDate.getDay()];
                   w3Img.src = `Images/Weathers/${item.weather[0].icon}.png`;
                   w3Text.innerHTML = `${item.weather[0].main}`;
                   tempWeeks(item.main['temp_max'],w3Max,false);
                   tempWeeks(item.main['temp_min'],w3Min,true);
                   break;
               default:
           }
            currentDate++;
        }

    }

}