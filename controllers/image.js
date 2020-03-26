const clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'be8f713f69a64582a6ac55127b2082a4'
});

const handleApiCall = (req, res) => {
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {res.json(data)})
	.catch(err => res.status(400).json('unable to work with api'))
}


const handleImageIp = (req, res, db) => {
	const {id} = req.body;
	// let found = false;
	// database.users.forEach(user => {
	// 	if(user.id === id){
	// 		found = true;
	// 		user.score++
	// 		return res.json(user.score);
	// 	}
	// })
	// if(!found){
	// 	res.status(404).json('not found');
	// }
	console.log('check');
	db('users')
	.where('id','=',id)
	.increment('score',1)
	.returning('score')
	.then(score => res.json(score[0]))
	.catch(err => res.status(400).json('cannot find user'))
}

module.exports = {
	handleImageIp:handleImageIp,
	handleApiCall:handleApiCall
}