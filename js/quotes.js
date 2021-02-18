 function getJoke(quote){
    let api_url = "https://icanhazdadjoke.com/";
    let req = new XMLHttpRequest();
    let res;
    req.open("GET", api_url);
    req.setRequestHeader('accept', 'text/plain');
    req.send();
    req.onload = () => {
        quote.textContent = req.response;
    }
}

export function getJokes(){
    let quotes = document.getElementsByClassName('quote');
    for (let quote of quotes){
        getJoke(quote);
    }
}