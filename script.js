// URL til OMDBs api, med API key og parameter for at søge efter JSON data ud fra titel
let url = "http://www.omdbapi.com/?apikey=86a2a604&t=";

// Egen JSON data for film titler og youtube video IDer
let moviesJson = {
    "movies": [
        {"title": "21 Jump Street", "youtubeID": "RLoKtb4c4W0"},
        {"title": "22 Jump Street", "youtubeID": "qP755JkDxyM"},
        {"title": "Popstar: Never Stop Never Stopping", "youtubeID": "SBzSsr3Co3w"},
        {"title": "Hot Rod", "youtubeID": "DhdrA9qz79o"},
        {"title": "The Unauthorized Bash Brothers Experience", "youtubeID": "VfKJxowxBb4"},
        {"title": "The Watch", "youtubeID": "PhN1xnCyqR8"}
    ]
};

// Youtube API kode indlæses asynkront, ved at indsætte script tagget i HTML'en
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Element oprettes til at indeholde samtlige film bokse
let container = document.getElementById("movieContainer");

// For loop til at loope igennem alle video titles, og oprette elementer for hvert movie objekt
for (let i = 0; i < moviesJson.movies.length; i++) {
    // Sammensætning af OMDB API URL og titlen fra eget JSON,
    // mellemrum erstattes med %20 for at sikre korrekt data sendes tilbage
    let fetchUrl = url + moviesJson.movies[i].title.replace(/( )/g, "%20");
    fetch(fetchUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // Samtlige elementer der skal benyttes til at indeholde informationer for hvert film
            // oprettes herunder, classes og IDer ligeledes.
            const box = document.createElement("li");
            const section = document.createElement("section");
            section.setAttribute("class", "movie");

            const poster = document.createElement("img");
            poster.setAttribute("src", data.Poster);

            const h2 = document.createElement("h2");
            h2.setAttribute("class", "movieTitle");

            const p = document.createElement("p");
            p.setAttribute("class", "description");

            const video = document.createElement("div");
            video.setAttribute("id", "player" + i);
            video.setAttribute("class", "show");

            const media = document.createElement("div");
            media.setAttribute("class", "media");

            const age = document.createElement("p");
            const imdbRating = document.createElement("p");
            const genres = document.createElement("p");


            // Informationer fra JSON indsættes og nødvendige udregniner foretages herunder
            // og indsættes efterfølgende i de oprette elementer
            h2.innerText = data.Title;
            p.innerText = data.Plot;
            imdbRating.innerText = "IMDB rating: " + data.imdbRating;
            let date = new Date();
            let year = date.getFullYear();
            let ageInYears = year - data.Year;
            // IF statement for at udregne hvor mange år siden det var, før filmen udkom
            // hvis filmen udkom i det nuværende år, indsættes en anden værdi.
            if (year !== data.Year) {
                age.innerHTML = "Released in " + data.Year + " (" + ageInYears + " years ago)";
            } else {
                age.innerHTML = data.Year + " (Released this year)";
            }
            genres.innerText = "Genre: " + data.Genre;

            // Samtlige elementer indsættes i HTMLen. Først og fremmest indsættes "box", som
            // indeholder resten af film elementerne.
            box.appendChild(section);
            section.appendChild(media);
            media.appendChild(poster);
            media.appendChild(video);

            section.appendChild(h2);
            section.appendChild(p);
            section.appendChild(imdbRating);
            section.appendChild(age);
            section.appendChild(genres);

            // Til sidst tilføjes "box" elementet, med samtlige af dens under elementer,
            // som et child til movieContaineren, som defineres i starten.
            container.appendChild(box);
        })
}

// Tilrettede youtube functioner, til at indsætte den korrekte video ud for hver film.
// her benyttes youtubeID'et fra JSON data, til at vælge filmen.
var player;
function onYouTubeIframeAPIReady() {
    for (let i = 0; i < moviesJson.movies.length; i++) {
        player = new YT.Player('player' + i, {
            height: '390',
            videoId: moviesJson.movies[i].youtubeID,
            playerVars: {'autoplay': 0},
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

//    The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}