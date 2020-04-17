const express = require('express')

const app = express()

const PORT = process.env.PORT || 80

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.use(express.static(__dirname + '/static'))

app.listen(PORT)