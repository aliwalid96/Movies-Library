const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const moviesData = require('./Movie Data/data.json');

///// endpoints ///server for food recipes 

app.get('/',MovieHandler);
app.get('/favorite',favoritWelcom)
app.get('*',serverHandler)
app.get('*',notFoundsHandle)


function notFoundsHandle(res,req){
    return res.status(404).send("Sorry, something went wrong ");
}


function serverHandler(res,req){
return res.status(500).send("Sorry, something went wrong");
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
     let movies=[];
     moviesData.data.map(movie =>{
         let oneMovie=new TheMovie(movie.title,movie.poster_path,movie.overview);
         movies.push(oneMovie);

     })
     console.log(movies);
     return res.status(200).json(movies);

 }


 app.listen(3000, ()=>{

    console.log('listening to port 3000')
})

