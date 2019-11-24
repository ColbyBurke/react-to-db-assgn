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

const Crime = new mongoose.Schema({
    incident:{
        required: true,
        type: String
    },
    categories:{
        type: Array,
        required: true
    },
    zip:{
        type: String,
        required: true
    },
    image:{
        type: Array,
        required: false
    }
})

const CrimeModel = mongoose.model("crimes", Crime)

const postCrime = async (request, response) => {
    try{
        var CrimeInstance = new CrimeModel(request.body)
        const created = await CrimeModel.create(CrimeInstance)
        response.send(created)
    }catch(error){
        response.status(500).send(error)
    }
}

const getCrimes = async (request, response) => {
    try{
        var CrimeInstance = await CrimeModel.find({})
        response.send({CrimeInstance})
    }catch(error){
        response.status(500).send(error)
    }
}



app.route('/crimes')
.post(postCrime)
.get(getCrimes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})