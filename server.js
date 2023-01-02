// DEPENDENCIES

// get .env variables
require("dotenv").config()
// pull PORT from .env, give default value of 3001
const { PORT, DATABASE_URL } = process.env
// import express
const express = require("express")
// create application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")


// DATABASE CONNECTION

// Establish Connection
mongoose.connect(DATABASE_URL)
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error))

// MODELS

const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
  })
  
  const People = mongoose.model("People", PeopleSchema)
  
  
  // MiddleWare
  
  app.use(cors()) // prevents cross origin resource sharing errors, allows access to server from all origins i.e. react frontend
  app.use(morgan("dev")) // loggs details of all server hits to terminal 
  app.use(express.json()) // parse json bodies from request
  app.use(express.urlencoded({extended: false})); // to use URL encoded

// ROUTES -- IDUC

// create a test route
app.get("/", (req, res) => {
    res.send("hello world")
  })

//  INDEX ROUTE
app.get('/people', async (req,res) => {
    try {
        // send all people
        res.status(200).json(await People.find({}))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// CREATE
app.post('/people' , async (req,res) => {
    try {
        // send all people
        res.status(200).json(await People.create(req.body))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})


// DELETE
app.delete('/people:id', async (req,res) => {
    try {
        res.status(200).json(await People.findByIdAndDelete(req.params.id))
    } catch (error){
        res.status(400).json(error)
    }
})

//UPDATE 
app.put('/people/:id', async (req, res) => {
    try {
        res.status(200).json(await People.findByIdAndUpdate(req.params.id, req.body, { new: true }))
    } catch(error) {
        res.status(400).json(error)
    }

})
// LISTENER

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))


