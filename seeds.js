const 	mongoose 	= require("mongoose"),
		Painting 	= require("./models/painting")


const paintings = [
	{
		title: "Elephant dreams",
		image: "https://res.cloudinary.com/dmvu4maqq/image/upload/v1605476779/elephantflowers_gsvtwi.jpg",
		id: 1,
		description: "A painting that shows the dreams and desires of an elephant.",
		date: "01/04/1980",
		themes: ["Photography"]
	},
	{
		title: "Wandjina",
		image: "https://res.cloudinary.com/dmvu4maqq/image/upload/v1605476779/ks-larinyuwar-large_dt2ga5.jpg",
		id: 2,
		description: "The colours of a rainbow.",
		date: "01/04/1980",
		themes: ["Portrait", "Dreams"]

	},
	{
		title: "Benin skull",
		image: "https://res.cloudinary.com/dmvu4maqq/image/upload/v1605476780/benin_dalcb6.jpg",
		id: 3,
		date: "01/04/1980",
		description: "A skull amde from ivory",
		themes: ["Skull", "Portrait"]

	},
		{
		title: "Tortoise dreams",
		image: "https://res.cloudinary.com/dmvu4maqq/image/upload/v1605476793/bolivia_oo2imp.jpg",
		id: 4,
		date: "01/04/1980",
		description: "Chasing big cats on horses.",
		themes: ["Portrait", "Landscape"]

	},{
		title: "Wandjina 2",
		image: "https://res.cloudinary.com/dmvu4maqq/image/upload/v1605476782/Wandjina_q0isfc.jpg",
		id: 5,
		date: "01/04/1980",
		description: "The colours of a rainbow.",
		themes: ["Portrait", "Dreams", "Abstract"]

	},
	{
		title: "Eukaryotic dreams",
		image: "https://res.cloudinary.com/dmvu4maqq/image/upload/v1605476782/main_portait_hrqkrx.jpg",
		id: 6,
		date: "01/04/1980",
		description: "An indian wedding.",
		themes: ["Portrait", "Dreams"]
	},
	{
		title: "Pregnant huntress",
		image: "https://res.cloudinary.com/dmvu4maqq/image/upload/v1605476782/namib_ogc673.jpg",
		id: 7,
		date: "01/04/1980",
		description: "The pregnant huntress of the Namib",
		themes: ["Portrait", "Dreams"]

	}
	
]

function seedDB(){
	console.log("seeding db");
	Painting.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed paintings");
		paintings.forEach(function(seed){
			if(err){
				console.log(err)
			} else {
				Painting.create(seed, function(err, painting){
					if(err){
						console.log(err)
					}
				})
			}
		})
		console.log("Added seeds")
	})
}



module.exports = seedDB;