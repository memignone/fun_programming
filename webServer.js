var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/L-System/index.html'));
});

app.use(express.static('L-System'));

app.listen(8080, function () {
  console.log('Listening on port 8080!')
})