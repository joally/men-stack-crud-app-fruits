
//dependencies
const dotenv = require("dotenv"); // require package
const express = require("express");
const mongoose = require("mongoose"); // require package
const Fruit = require('./models/fruit');
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new
const path = require('path');
// initialize the express app
const app = express();
//congfig. code
//loads the enviroment variables from .env
dotenv.config();
//init connection to mongo
mongoose.connect(process.env.MONGODB_URI);
//Mongoose/MongoDB event listeners
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
  });
  mongoose.connection.on('error', (error) => {
console.log(`An error connecting to MongoDB has occurred:${error} `);
  });
  //mount middleware func. here
  //mongoose.connection.on('error', (error) => {
    //console.log(`An error connecting to MongoDB has occurred: ${error}`)
    //}) is better to use try and catch

  //body parser middleware : this func.reads the request body
  //and decodes it into req.body so we can access form data
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method")); // new
//method overrides reads the method query param
//DELETE or PUT requests
app.use(morgan("dev")); //new
//static assets middleware- used to sen
app.use(express.static(path.join(__dirname,'public')));

//Root path /route  "Home page"
  app.get('/', async (req, res) => {
    res.render('index.ejs');
  });
  //Path to the page with a form we can fill out
  //and submit to add a new fruit to the database
  app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs');// <-- relative to file path
  });//never add a trailing slash with render

  //path used to receive form submissions
   app.post('/fruits', async (req, res) =>{
    //conditional logic to handle the default behavior of HTML
    //form checkbox fields
    //we do this whwn we need a boolean insted of a string
   if(req.body.isReadyToEat === 'on'){
    req.body.isReadyToEat = true;
   }else{
    req.body.isReadyToEat = false;
   }
   //req.body.isReadyToEat = !!req.body.isReadyToEat;(alternative way to express the above)
   //create the data in our database
   await Fruit.create(req.body);
    //redirect tells the client to navigate to
    //a new URL path/another page
    res.redirect('/fruits');// <--URL path
  })

//index route for fruits- sends page that lists
//all fruits from the database
  app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find({});
   res.render('fruits/index.ejs', {fruits:allFruits});
  });

  //show route - for sending a page with the details for one particular fruit 
  app.get('/fruits/:fruitId', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render('fruits/show.ejs', { fruit: foundFruit });
  });
    //edit route - used to send a page to the client with
    //an edit form pre0-filled out with fruit details
    //so the user can edit the fruit and submit the form

    app.delete('/fruits/:fruitId', async(req, res) => {
      await Fruit.findByIdAndDelete(req.params.fruitId);
      res.redirect('/fruits');
    });

    // edit route- used to send a page to the client with
    //an edit form pre-filled out with fruit details
    //so the user can edit the fruit and submit the form
    app.get("/fruits/:fruitId/edit", async (req, res) => {
      //1-look up the fruit by it's id
      const foundFruit = await Fruit.findById(req.params.fruitId);
      //2 respond with 'edit' template with an edit form
         res.render('fruits/edit.ejs', {fruit:foundFruit});
    });
  

    //update route - used to capture edit form submissions
    // from the client and send   updates to mongooseDB
      app.put("/fruits/:fruitId", async (req, res) => {
        if (req.body.isReadyToEat === "on") {
          req.body.isReadyToEat = true;
        } else {
          req.body.isReadyToEat = false;
        }
      
// Update the fruit in the database
await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

// Redirect to the fruit's show page to see the updates
res.redirect(`/fruits/${req.params.fruitId}`);
}); 
        
app.listen(3001, () => {
  console.log("Listening on port 3001")
});