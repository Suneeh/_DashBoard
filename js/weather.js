//Amberg,de = lat=48.0667&lon=10.6833
//Api_key = appid=093ca1c5c3e24a2c22dc2e09902af385
//lang = de
//units=metric
let api_url = "https://api.openweathermap.org/data/2.5/onecall?lat=48.0667&lon=10.6833&units=metric&lang=de&exclude=minutely&appid=093ca1c5c3e24a2c22dc2e09902af385";

let req = new XMLHttpRequest();
req.open("GET", api_url);
req.send();
req.onload = () => {
    let weather = JSON.parse(req.response);
    console.log(weather);
}