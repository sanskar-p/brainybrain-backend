const clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: process.env.API_CLARIFAI
});

const handleApiCall = (req, res) => {
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {res.json(data)})
	.catch(err => res.status(400).json('unable to work with api'))
}


const handleImageIp = (req, res, db) => {
	const {id} = req.body;

	db('users')
	.where('id','=',id)
	.increment('score',1)
	.returning('score')
	.then(score => res.json(score[0]))
	.catch(err => res.status(400).json('blah blah'))
}

module.exports = {
	handleImageIp:handleImageIp,
	handleApiCall:handleApiCall
}