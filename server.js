const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const signin = require('./controllers/signin.js');
const register = require('./controllers/register.js');
const image = require('./controllers/image.js');
const profile = require('./controllers/profile.js');

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('it is working');
})
//advice for bigger apps. put each component in different .js file. Here, I am doing
//this for the register component for future sanskar's reference.

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImageIp(req,res,db)})

app.post('/imageUrl', (req, res) => {image.handleApiCall(req,res,db)})

app.listen(process.env.PORT || 3000, ()=>{
	console.log(`app running on port ${process.env.PORT}`);
});