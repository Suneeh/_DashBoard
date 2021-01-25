let url1 = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19_Landkreise_Table_Demo_18b5f806160a4aa686ca65819fbe4462/FeatureServer/0/query?f=json&where=county%3D%27SK%20Amberg%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=RS%20asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true"
let url2 = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19_Landkreise_Table_Demo_18b5f806160a4aa686ca65819fbe4462/FeatureServer/0/query?f=json&where=county%3D%27SK%20Regensburg%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=RS%20asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true"
let url3 = "https://interaktiv.tagesspiegel.de/coronadaten/auto/2PACX-1vRyUgB0oKav_G45ekvLdljpF5Rt3nQVynKcvCN45CiT5ecKEz37NjKzO3w6AYhMWZV54kH_MC7G5wUj.csv?v=kk74npum";

/* Possible sources
Might be interesting ? : https://www.worldometers.info/coronavirus/country/germany/

Source: https://interaktiv.tagesspiegel.de/lab/karte-sars-cov-2-in-deutschland-landkreise/

all the numbers from march 3rd to jan 21st grouped by Bundesland
https://interaktiv.tagesspiegel.de/coronadaten/auto/2PACX-1vRyUgB0oKav_G45ekvLdljpF5Rt3nQVynKcvCN45CiT5ecKEz37NjKzO3w6AYhMWZV54kH_MC7G5wUj.csv?v=kk74npum

Bavaria Numbers: 
https://interaktiv.tagesspiegel.de/coronadaten/api/bundeslaender/09/all.json?v=kk754r7n

Germany Numbers:
https://interaktiv.tagesspiegel.de/coronadaten/api/countries/DEU/all.json?v=kk75c9e2
*/


export function getCovid(){
    let req1 = new XMLHttpRequest();
    req1.open("GET", url1);
    req1.send();
    let ans;
    req1.onload = () => {
        ans = JSON.parse(req1.response);
        document.querySelector('#loc1 h2').textContent = ans.features[0].attributes['cases7_per_100k_txt'];
        document.querySelector('#loc1 h4').textContent = ans.features[0].attributes['GEN'];
    }
    let req2 = new XMLHttpRequest();
    req2.open("GET", url2);
    req2.send();
    req2.onload = () => {
        ans = JSON.parse(req2.response);
        document.querySelector('#loc2 h2').textContent = ans.features[0].attributes['cases7_per_100k_txt'];
        document.querySelector('#loc2 h4').textContent = ans.features[0].attributes['GEN'];
    }

    let req3 = new XMLHttpRequest();
    req3.open("GET", url3);
    req3.send();
    req3.onload = () =>{
        ans = req3.response;
        let arr = [];
        let days = 30;
        let ID_BY = 9;
        let daily = [];
        let daily_DE = Array(days+1).fill(0);
        ans.split("\n").forEach((line, i) => {
            //converts arr from string to int if possible (names are not convertable)
            arr[i] = line.split(",").map((x)=>isNaN(+x)?x:+x); 
            //calc the actual "new" per day values
            daily[i] = [];
            arr[i].forEach((x, y)=> {
                if(y>2)daily[i][y] = arr[i][y]-arr[i][y-1];
            });
        });
        //get the maximum
        let max_BY = 0;
        daily[ID_BY].forEach(i => {
            max_BY = i>max_BY?i:max_BY;
        });
        let max_DE = 0;
        let sum = 0;
        for(let i=3; i < daily[1].length; i++){
            for(let j=1; j < daily.length-1; j++){
                sum += daily[j][i];
            }
            max_DE = sum>max_DE?sum:max_DE;
            sum = 0;
        }
        document.querySelector('#max-bav').textContent = `${max_BY} / Tag`;
        document.querySelector('#max-de').textContent = `${max_DE} / Tag`;

        //shortens the array (+1 because we calc the current day - the day before)
        daily.forEach((x, y)=>{
            daily[y] = daily[y].slice(daily[y].length-(days+1)); 
        });
        daily = daily.slice(0,17);

        daily.forEach((i, j) =>{
            daily[1].forEach((x, y)=>{
                if (daily[j][y] > 0 && !isNaN(daily[j][y])){
                    daily_DE[y] += daily[j][y];
                }
            });
        });

        let lookup = arr[0].slice(arr[0].length-(days+1)); 
        
        //daily = Array for each Bundesland[]= new cases per day
        //max_BY is the max value of the daily[ID_BY] array and will be used in the scale later on
        //max_DE is the max value of the daily[_ALL_] array and will be used in the scale later on
        //lookup is an array of the same lenght as daily[i] and has the corresponding dates as a lookup


    // Let the drawing begin (bavaria)
        var canvas1 = document.getElementById("bav");
        let c1height = canvas1.clientHeight;
        let c1width = canvas1.clientWidth;

        //for some reason this is mathing the interal height with the pixels of the canvas
        canvas1.width = c1width;
        canvas1.height = c1height;

        let ctx = canvas1.getContext("2d");

        ctx.beginPath();
        ctx.strokeStyle = "#f4f4f4";
        //drawing vertical grid
        for(let i = 1; i < days; i++){
            ctx.moveTo(Math.round(i/days*c1width), 0);
            ctx.lineTo(Math.round(i/days*c1width), c1height);
            ctx.stroke();
        }
        
        //drawing horizontal grid
        for(let i = 1; i <= 10; i++){
            ctx.moveTo(0, 0.1*i*c1height);
            ctx.lineTo(c1width, 0.1*i*c1height);
            ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        //drawing the actual graph
        for(let i = 0; i < days; i++){
            ctx.moveTo(c1width * i/days,        c1height-((daily[ID_BY][i]/max_BY)*c1height));
            ctx.lineTo(c1width * (i+1)/days,    c1height-((daily[ID_BY][i+1]/max_BY)*c1height));
        }
        ctx.stroke(); 
    //end bavaria

    // Let the drawing begin (germany)
        let canvas2 = document.getElementById("ger");
        let c2height = canvas2.clientHeight;
        let c2width = canvas2.clientWidth;

        //for some reason this is mathing the interal height with the pixels of the canvas
        canvas2.width = c2width;
        canvas2.height = c2height;

        let cty = canvas2.getContext("2d");
        cty.beginPath();
        cty.strokeStyle = "#f4f4f4";
        //drawing vertical grid
        for(let i = 1; i < days; i++){
            cty.moveTo(Math.round(i/days*c2width), 0);
            cty.lineTo(Math.round(i/days*c2width), c2height);
        }
        cty.stroke();

        //drawing horizontal grid
        for(let i = 1; i <= 10; i++){
            cty.moveTo(0, 0.1*i*c2height);
            cty.lineTo(c2width, 0.1*i*c2height);
        }
        cty.stroke();
        

        cty.beginPath();
        cty.strokeStyle = "#000000";
        cty.lineWidth = 2;
        //drawing the actual graph

        for(let i = 0; i < days; i++){
            cty.moveTo(c2width * i/days,        c2height-((daily_DE[i]/max_DE)*c2height));
            cty.lineTo(c2width * (i+1)/days,    c2height-((daily_DE[i+1]/max_DE)*c2height));
        }
        cty.stroke(); 
    //end Germany
    }      
}