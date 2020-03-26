const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register.js');
const image = require('./controllers/image.js');

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl:true
  }
});

// db.select('name', 'email', 'joined').from('users').then(data => console.log(data)); 


const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('it is working');
})

app.post('/signin', (req, res) => {
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
})

//advice for bigger apps. put each component in different .js file. Here, I am doing
//this for the register component for future sanskar's reference.
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	db.select('*')
		.from('users')
		.where({id: id})
		.then(user => { 
			if(user.length){
				res.json(user[0])
			}else{
				res.status(400).json('not found');
			}
		})
		.catch(err => res.status(400).json('error gettign user'));
})

app.put('/image', (req, res) => {image.handleImageIp(req,res,db)})
app.post('/imageUrl', (req, res) => {image.handleApiCall(req,res,db)})

app.listen(process.env.PORT || 3000, ()=>{
	console.log(`app running on port ${process.env.PORT}`);
});