let url1 = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19_Landkreise_Table_Demo_18b5f806160a4aa686ca65819fbe4462/FeatureServer/0/query?f=json&where=county%3D%27SK%20Amberg%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=RS%20asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true"
let url2 = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19_Landkreise_Table_Demo_18b5f806160a4aa686ca65819fbe4462/FeatureServer/0/query?f=json&where=county%3D%27SK%20Regensburg%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=RS%20asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true"
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
}