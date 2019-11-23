const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = 2500
const app = express()

mongoose.connect('mongodb://localhost:27017/todos', { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const Joke = new mongoose.Schema({
    joke:{
        required: true,
        type: String
    },
    categories:{
        type: Array,
        required: true
    }
})

const JokeModel = mongoose.model("jokes", Joke)

const postJoke = async (request, response) => {
    try{
        var JokeInstance = new JokeModel(request.body)
        const created = await JokeModel.create(JokeInstance)
        response.send(created)
    }catch(error){
        response.status(500).send(error)
    }
}

const getJokes = async (request, response) => {
    try{
        var JokeInstance = await JokeModel.find({})
        response.send({'type': 'success', 'value':JokeInstance})
    }catch(error){
        response.status(500).send(error)
    }
}



app.route('/jokes')
.post(postJoke)
.get(getJokes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})