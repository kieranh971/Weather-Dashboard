// console.log("Connected")
const searchEl = document.getElementById("searchBtn");
const clearEl = document.getElementById("clearBtn");
const inputEl = document.getElementById("cityInput");
const historyEl = document.getElementById("history")
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
console.log(searchHistory)

function GetWeather() {
    var newCity = document.getElementById("cityInput");
    var cityName = document.getElementById("cityName");
    cityName.innerHTML = "--"+newCity.value+"--"

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=` + newCity.value + `&appid=b3b0555434c7311da020e0bb1ca35763`)
    .then(response => response.json())
    .then(data => {

        // Min/max values for each day
        for(i=0; i<5; i++) {
            document.getElementById("Day" + (i+1) + "Min").innerHTML = "Min: " + Number((data.list[i].main.temp_min - 273.15)*1.8 + 32).toFixed(1) + "°F";
        }

        for(i=0; i<5; i++) {
            document.getElementById("Day" + (i+1) + "Max").innerHTML = "Max: " + Number((data.list[i].main.temp_max - 273.15)*1.8 + 32).toFixed(2) + "°F";
        }
        // Get weather icons        
        for(i=0; i<5; i++) {
            document.getElementById("img" + (i+1)).src = "http://openweathermap.org/img/wn/"+
            data.list[i].weather[0].icon
            +".png";
        }
        // Humidity
        for(i=0; i<5; i++) {
            document.getElementById("Humidity" + (i+1)).innerHTML = "Humidity: " + Number(data.list[i].main.humidity).toFixed(2) + "°F";
        }
        // Wind Speed
        for(i=0; i<5; i++) {
            document.getElementById("WindSpeed" + (i+1)).innerHTML = "Wind Speed: " + Number(data.list[i].wind.speed).toFixed(2) + " mph";
        }
        console.log(data)
    })

    .catch(err => alert("Something Went Wrong"))
}
// Default screen that displays
function DefaultApp(){
    document.getElementById("cityInput").defaultValue = "Philadelphia";
    GetWeather();
}

// Displaying text for 5 day forecast
var d = new Date();
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Function to grab correct integer for the index of the days array
function CheckDay(day){
    if(day+d.getDay() > 6) {
        return day + d.getDay() - 7;
    } else {
        return day + d.getDay();
    }
}

for(i = 0; i<5; i++) {
    document.getElementById("Day" + (i+1)).innerHTML = weekday[CheckDay(i)];
}

searchEl.addEventListener("click", function(){
    const searchTerm = inputEl.value;
    GetWeather(searchTerm)
    searchHistory.push(searchTerm)
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory()
})
clearEl.addEventListener("click", function(){
    searchHistory = [];
    window.localStorage.clear()
    renderSearchHistory();
})

function renderSearchHistory() {
    historyEl.innerHTML = "";
    for(let i=0; i<searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type","text");
        historyItem.setAttribute("readonly",true);
        // historyItem.setAttribute("class","text");
        historyItem.setAttribute("value",searchHistory[i]);
        historyItem.addEventListener("click", function(){
            GetWeather(historyItem.value);
        })
        historyEl.append(historyItem)
    }
}

renderSearchHistory();
if (searchHistory.length > 0){
    GetWeather(searchHistory[searchHistory.length - 1]);
}