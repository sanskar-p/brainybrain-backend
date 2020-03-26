const handleRegister = (req, res, db, bcrypt) => {
	const {name, pass, email} = req.body;
	if(!name || !pass || !email){
		return res.status(400).json('incorrect form submission');
	}

	const hash = bcrypt.hashSync(pass);

		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					name: name,
					email: loginEmail[0],
					joined: new Date()
				})
				.then(user => {{
					res.json(user[0])
				}})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
}

module.exports={
	handleRegister:handleRegister
}