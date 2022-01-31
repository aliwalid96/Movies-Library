const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
require('dotenv').config;
app.use(cors());
let url=`https://api.themoviedb.org/3/movie/76341?api_key=${process.env.APIKEY}`;


const moviesData = require('./Movie Data/data.json');

///// endpoints ///server for food recipes 



function ApiMovie(id,title,release_date,poster_path,overview){
  this.id=id;
  this.title=title;
  this.release_date=release_date;
  this.poster_path=poster_path;
  this.overview=overview;

}


function tredinFunction(req,res){
axios.get(url)
.then(data =>{

  let movies=data.map(movie=>{
    return new ApiMovie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)

  })
  res.status(200).json(movies);

}).catch(err=>{
  serverHandler(err,res,req);


})

}


//function notFoundsHandle(req,res){
  //  return res.status(404).send("Sorry, something went wrong ");
//}


function serverHandler(eror,res,req){
const err={
status :500,
nessage:"Sorry, something went wrong"
}

return res.status(500).send(err);
}

function favoritWelcom(req,res){
    return res.status(200).send("Welcome to Favorite Page")
}



//constructor
function TheMovie(title,poster_path,overview){
  this.title=title;
  this.poster_path=poster_path;
  this.overview=overview;
}

 function MovieHandler(req,res){
     
     
   let oneMovie=new TheMovie(moviesData.title,moviesData.poster_path,moviesData.overview);
    
     return res.status(200).json(oneMovie);

 }


 app.listen(3000, ()=>{

    console.log('listening to port 3000')
})

app.get('/',MovieHandler);
app.get('/favorite',favoritWelcom)
app.get(serverHandler)
//app.get('*',notFoundsHandle)
app.get('/trending', tredinFunction)