require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var moment = require("moment"); 

var input = process.argv[2];

var parameters = process.argv.slice(3).join(" ");

function liriRun(input, parameters) {
    switch (input) {
        case "spotify-this-song":
            getSpotify(parameters);
            break;

        case "concert-this":
            getBandsInTown(parameters);
            break;
        
        case "movie-this":
            getOMDB(parameters);
            break;

        case "do-what-it-says":
            getRandom();
            break;

        default:
            console.log("Enter one of the following: spotify-this-song, concert-this, movie-this, or do-what-it-says")
    }
}

function getSpotify(songName) {
    var spotify = new Spotify(keys.spotify);

    if(!songName) {
        songName = "The Sign";
    }

    spotify.search({ type: 'track', query: songName }, function (err, data ) {
        if (err) {
            return console.log("error" + err)
        }

        console.log(data.tracks.items[0].album.artists[0].name)
        console.log(data.tracks.items[0].name)
        console.log(data.tracks.items[0].href)
        console.log(data.tracks.items[0].album.name)
    });
};

function getBandsInTown(artist) {
    var artist = parameters;
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(queryURL).
    then(function(response) {
        console.log(response.data[0].venue.name);
        console.log(response.data[0].venue.city);
        console.log(moment(response.data[0].datetime).format("MM-DD-YYYY"));
    });
};

function getOMDB(movie) {
    if(!movie) {
        movie = "Mr. Nobody";
    }

    var movieQueryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"

    axios.request(movieQueryURL)
    .then(function (response) {
        console.log(response.data.Title);
        console.log(response.data.Year);
        console.log(response.data.imdbRating);
        console.log(response.data.Ratings[1].Value);
        console.log(response.data.Country);
        console.log(response.data.Language);
        console.log(response.data.Plot);
        console.log(response.data.Actors);
    })
};

function getRandom() {
    false.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        } 
        else {
            console.log(data);
            var randomData = data.split(",");
            liriRun(randomData[0], randomData[1]);
        }
    });
};

liriRun(input, parameters);