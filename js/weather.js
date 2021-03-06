//Amberg,de = lat=48.0667&lon=10.6833
//Api_key = appid=093ca1c5c3e24a2c22dc2e09902af385
//lang = de
//units=metric
let today = new Date().toLocaleDateString().replaceAll('/','.');
let headline = `Amberg, DE ${today}`;
/*happens without using the api*/
document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelector('#headline').textContent = headline;
});

export function setValues(){
    let api_url = "https://api.openweathermap.org/data/2.5/onecall?lat=48.0667&lon=10.6833&units=metric&exclude=minutely&appid=093ca1c5c3e24a2c22dc2e09902af385";
    let req = new XMLHttpRequest();
    req.open("GET", api_url);
    req.send();
    let w;
    req.onload = () => {
        w = JSON.parse(req.response);
        getDirection(w.hourly[0].wind_deg)
        document.querySelector('#now .details .temp').textContent = `${Math.round(w.current.temp)}°C`;
        document.querySelector('#now .details .hum').textContent = `${w.current.humidity}%`;
        document.querySelector('#now .details .sunrise').textContent = new Date(w.current.sunrise*1000).toLocaleTimeString([], {timeStyle: 'short'});
        document.querySelector('#now .details .sunset').textContent = new Date(w.current.sunset*1000).toLocaleTimeString([], {timeStyle: 'short'});
        document.querySelector('#now .details .wind').textContent = `${getDirection(w.hourly[0].wind_deg)}   ${Math.round(w.current.wind_speed*3.6)}km/h`;
        document.querySelector('#now .img-wrapper img').setAttribute('src', `https://openweathermap.org/img/wn/${w.current.weather[0].icon}@2x.png`);
        document.querySelector('#later .h3 .weather').textContent = `${w.hourly[3].weather[0].description}`;
        document.querySelector('#later .h3 .temp').textContent = `Temp: ${w.hourly[3].temp}°C`;
        document.querySelector('#later .h3 .feel').textContent = `Feels like ${w.hourly[3].feels_like}°C`;
        document.querySelector('#later .h3 .hum').textContent = `Humidity ${w.hourly[3].humidity}%`;
        document.querySelectorAll('#later > *').forEach(function(i){
            let cnt = i.className.slice(1,3);
            document.querySelector(`#later .h${cnt} h3`).textContent = new Date(w.hourly[cnt].dt*1000).toLocaleTimeString([], {timeStyle: 'short'});
            document.querySelector(`#later .h${cnt} img`).setAttribute('src', `https://openweathermap.org/img/wn/${w.hourly[cnt].weather[0].icon}@2x.png`);
            document.querySelector(`#later .h${cnt} .weather`).textContent = `${w.hourly[cnt].weather[0].description}`;
            document.querySelector(`#later .h${cnt} .temp`).textContent = `Temp: ${Math.round(w.hourly[cnt].temp)}°C`;
            document.querySelector(`#later .h${cnt} .feel`).textContent = `Feels like ${Math.round(w.hourly[cnt].feels_like)}°C`;
            document.querySelector(`#later .h${cnt} .hum`).textContent = `Humidity ${w.hourly[cnt].humidity}%`;
        });
        document.querySelectorAll('#forecast .day').forEach(function(i, j){
            j += 1;
            let day = new Date(w.daily[j].dt*1000);
            day = day.toLocaleDateString('en-US',{weekday: 'long'});
            i.querySelector('.img-wrapper .name').textContent = `${day}`;
            i.querySelector(`img`).setAttribute('src', `https://openweathermap.org/img/wn/${w.daily[j].weather[0].icon}@2x.png`);
            i.querySelector(`.weather`).textContent = w.daily[j].weather[0].description;
            i.querySelector(`.max`).textContent = `Max: ${Math.round(w.daily[j].temp['max'])}°C`;
            i.querySelector(`.min`).textContent = `Min: ${Math.round(w.daily[j].temp['min'])}°C`;
            i.querySelector(`.hum`).textContent = `Humidity: ${w.daily[j].humidity}%`;
        });
    }
}

function getDirection(deg){
    console.log(deg);
    deg -= 11.25;
    switch(true){
        case deg<= 1/16*360: return 'N';
        case deg<= 2/16*360: return 'NNO';
        case deg<= 3/16*360: return 'NO';
        case deg<= 4/16*360: return 'ONO';
        case deg<= 5/16*360: return 'O';
        case deg<= 6/16*360: return 'OSO';
        case deg<= 7/16*360: return 'SO';
        case deg<= 8/16*360: return 'SSO';
        case deg<= 9/16*360: return 'S';
        case deg<=10/16*360: return 'SSW';
        case deg<=11/16*360: return 'SW';
        case deg<=12/16*360: return 'WSW';
        case deg<=13/16*360: return 'W';
        case deg<=14/16*360: return 'WNW';
        case deg<=15/16*360: return 'NW';
        case deg<=16/16*360: return 'NNW';
        default: return '';
    }
    
}