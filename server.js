const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg=require('pg');
const client=new pg.Client(process.env.DATABASE_URL);
const app = express();
require('dotenv').config();
app.use(cors());

app.use(express.json());
let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;


const moviesData = require('./Movie Data/data.json');

///// endpoints ///server for food recipes 



app.get('/', MovieHandler);
app.get('/favorite', favoritWelcom)

app.get('/trending', tredinFunction)
app.get('/search', searchingFunction)
app.get(serverHandler)
app.post('/addMovie',addMovieFun)
//app.get('/getMovies',getMoveFun)

app.get('*', notFoundsHandle);

function addMovieFun(req,res){
console.log(req.body);
let sql=`insert into moviedata(title,release_date,poster_path,overview) values($1,$2,$3,$4) `;
let values=[data.results.title,data.results.release_date,data.results.poster_path,data.results.overview];
client.query(sql,values).then(movie=>{
res.status(200).json(movie);
}).catch(error=>{
  serverHandler(err, res, req);
})

}






function ApiMovie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;



}


function tredinFunction(req, res) {
  console.log(url);
  axios.get(url)
    .then(result => {
      console.log(result.data.results);
      let movies = result.data.results.map(movie => {
        return new ApiMovie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)

      })
      res.status(200).json(movies);

    }).catch(err => {
      serverHandler(err, res, req);
    })
}



function searchingFunction(req, res){
let theSearch=req.query.theSearch;
  let newUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${process.env.theSearch}`

  axios.get(newUrl)
  axios.get(url)
    .then(result => {
      console.log(result.data.results);
      let movies = result.data.results.map(movie => {
        return new ApiMovie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)

      })
      res.status(200).json(movies);

    }).catch(err => {
      serverHandler(err, res, req);


    })


}






function notFoundsHandle(req, res) {
  return res.status(404).send("Sorry, something went wrong ");
}


function serverHandler(eror, res, req) {
  const err = {
    status: 500,
    nessage: "Sorry, something went wrong"
  }

  return res.status(500).send(err);
}

function favoritWelcom(req, res) {
  return res.status(200).send("Welcome to Favorite Page")
}



//constructor
function TheMovie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

function MovieHandler(req, res) {


  let oneMovie = new TheMovie(moviesData.title, moviesData.poster_path, moviesData.overview);

  return res.status(200).json(oneMovie);

}

client.connect().then(()=>{
  app.listen(3003, () => {

    console.log('listening to port 3001')
  })
})

