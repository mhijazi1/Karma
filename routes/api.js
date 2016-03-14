var express = require('express');
var router = express.Router();
var clarifai = require('../clarifai.js')
var clar = clarifai();

router.post('/predict', function(req, res, next) {
	var data = {
		url: req.body.url,
		damaged: false,
		undamaged: false
	};

	console.log(data.url);
	clar.predict(data.url, 'perfect', function(obj) {
		console.log("obj: " + obj);
		//get score
		var perfect = obj.score * 100;

		console.log("perfect " + perfect);
		//run prediction for dent
		clar.predict(data.url, 'dent', function(obj) {
			//get score
			var dent = obj.score * 100;

			console.log("dent " + dent);
			if (dent >= perfect) {
				data.damaged = true;
			} else {
				data.undamaged = true;
			}
			console.log("Damaged: " + data.damaged);
			console.log("Undamaged: " + data.undamaged);
			res.send(200);

		});
	})
});

module.exports = router;