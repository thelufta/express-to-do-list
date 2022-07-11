const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const config = require("./src/configuration/config.json");


mongoose.connect(config.Database.Url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
	console.log("[ ✔ ] Database connection active");
});
mongoose.connection.on("error", () => {
	console.error("[ ✖ ] Database connection is passive");
});


app.use(express.urlencoded({extended: true}))
app.engine(".ejs", ejs.__express);
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(__dirname + "/src/public"));


const requestSchema = mongoose.Schema({
    item: String
})
const Request = mongoose.model('Request', requestSchema)


app.get('/', function(req, res) {
    Request.find(function(err, found) {
        if(err) {
            console.log(err)
        } else {
            res.render('home', { items: found })
        }
    })
})


app.post('/', function(req, res) {
    const input = req.body.input
    const newList = new Request({
        item: input
    })
    newList.save(function(err) {
        if(err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})


app.post('/delete', function(req, res) {
    const item = req.body.deleteitem
    Request.findByIdAndRemove(item, function(err) {
        if(err) {
            console.log(err) 
        } else {
            res.redirect('/')
        }
    })
})


app.listen(config.Site.Port || 3000, function() {
    console.log("[ ✔ ] The project is displayed on port 3000")
})