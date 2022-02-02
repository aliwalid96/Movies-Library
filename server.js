const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());

let parser = require('body-parser');
let jasonParser = parser.json();
let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;

const moviesData = require('./MovieData/data.json');
//app.delete('/deleteMovie/:id',deleteMovi);
app.get('/', MovieHandler);
app.get('/favorite', favoritWelcom)
app.get('/trending', tredinFunction)
app.get('/search', searchingFunction)
app.get(serverHandler)
app.post('/addMovie', jasonParser, addMovieFun)
//app.put('/updatmovie/:id', updateMovie);
//app.get('/getMovies',getMoveFun)





app.get('*', notFoundsHandle);

function deleteMovi(req,res){
  const id = req.params.id;
  const sql = `DELETE FROM moviesTable WHERE id=${id};` 
  

  client.query(sql).then(()=>{
      res.status(200).send("The Movie has been deleted");
  }).catch(error=>{
    serverHandler(error,req,res)
  });

function updateMovie(req, res) {
  const id = req.params.id;
  // console.log(req.params.name);
  const movie = req.body;

  const sql = `UPDATE moviesTable SET title =$1, release_date = $2, poster_path = $3 ,overview=$4 WHERE id=$5 RETURNING *;`;
  let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, id];
  client.query(sql, values).then(data => {
    res.status(200).json(data.rows);

  }).catch(error => {
    serverHandler(error, req, res);

  });




}

function addMovieFun(req, res) {
  console.log(req.body);
  let mv = req.body;
  let sql = `insert into moviedata(title,release_date,poster_path,overview) values($1,$2,$3,$4) RETURNING * `;
  let values = [ mv.title, mv.release_date, mv.poster_path, mv.overview];
  client.query(sql, values).then(movie => {
    console.log(movie);
    res.status(200).json(movie);
  }).catch(error => {
    serverHandler(error, res, req);
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
  //console.log(url);
  axios.get(url)
    .then(result => {
      // console.log(result.data.results);
      let movies = result.data.results.map(movie => {
        return new ApiMovie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)

      })
      res.status(200).json(movies);

    }).catch(err => {
      serverHandler(err, res, req);
    })
}




function searchingFunction(req, res) {
  let theSearch = req.query.theSearch;
  let newUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${theSearch}`

  axios.get(newUrl)

    .then(result => {
      // console.log(result.data.results);
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

client.connect().then(() => {
  app.listen(3003, () => {

    console.log('listening to port 3001')
  })
})

