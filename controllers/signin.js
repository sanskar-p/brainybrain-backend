const handleSignin = (req, res, db, bcrypt) => {
	const {pass, email} = req.body;
	if(!pass || !email){
		return res.status(400).json('incorrect form submission');
	}

	db.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data =>{
		const isValid = bcrypt.compareSync(pass, data[0].hash);
		if(isValid){
			return db.select('*').from('users')
			.where('email', '=', email)
			.then(user => res.json(user[0]))
			.catch(err => res.status(400).json('user not found'))
		} else{
			res.status(400).json('wrong credentials')
		}
	})
	.catch(err => res.status(400).json('wrong credentials'))

}

module.exports={
	handleSignin:handleSignin
}