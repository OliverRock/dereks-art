const mongoose = require("mongoose");

var paintingSchema = new mongoose.Schema({
	title: String,
	date: String,
	description: String,
	themes: [ String ],
	image: String
})

var Painting = mongoose.model("Painting", paintingSchema);


module.exports = Painting;