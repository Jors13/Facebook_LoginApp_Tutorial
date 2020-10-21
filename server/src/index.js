const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');

//Settings
const PORT = process.env.PORT || 4000;
require('dotenv').config(); //KEYS

//Middlewares
app.use(morgan('dev')); //Request Middleware for Query's
app.use(express.json()); // Send and Receive Json
app.use(cors()); //Cross Allow Origin Receive and Send Data from external server

app.get('/', (req, res) => {
	res.send('Hello World with Nodejs and Express ');
});

app.get('/facebook', (req, res) => {
	const URL = res.redirect(
		`https://www.facebook.com/v6.0/dialog/oauth?` +
			`client_id=${process.env.CLIENT_ID_FACEBOOK}` +
			`&redirect_uri=${process.env.REDIRECT_URI_FACEBOOK}` +
			`&response_type=code&scope=email`
	);
});

app.get('/facebook/authorize', async (req, res) => {
	try {
		const URL =
			`https://graph.facebook.com/v6.0/oauth/access_token?` +
			`client_id=${process.env.CLIENT_ID_FACEBOOK}` +
			`&redirect_uri=${process.env.REDIRECT_URI_FACEBOOK}` +
			`&client_secret=${process.env.CLIENT_SECRET_FACEBOOK}` +
			`&code=${req.query.code}`;

		const tokenResponse = await axios.get(URL); //Get Token
		const { access_token } = tokenResponse.data;

		const DATA_URL =
			`https://graph.facebook.com/me?` +
			`access_token=${access_token}&fields=email,first_name,name,picture`;

		const dataResponse = await axios.get(DATA_URL);

		const { email, first_name, name } = dataResponse.data;
		const avatar = dataResponse.data.picture.data.url;

		const user = {
			avatar,
			first_name,
			name,
			email,
		};

		jwt.sign(
			{ user },
			process.env.SECRET_KEY,
			{ expiresIn: '20s' },
			(err, token) => {
				res.redirect(`http://localhost:3000/?token=${token}`);
			}
		);
	} catch (error) {
		console.log(error);
		res.redirect('http://localhost:3000/?error=failed-query');
	}
});

const verifyToken = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];
	//Check if bearer is undefined
	if (typeof bearerHeader !== 'undefined') {
		//Split at the space
		const bearer = bearerHeader.split(' ');
		//Get token from array
		const bearerToken = bearer[1];
		//Set Token
		req.token = bearerToken;
		next();
	} else {
		//Forbidden
		res.sendStatus(403);
	}
};

app.post('/user', verifyToken, (req, res) => {
	jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
		if (err) {
			res.redirect('http://localhost:3000/?error=failed-query');
		} else {
			res.json(authData);
		}
	});
});

//Start Server
async function main() {
	await app.listen(PORT);
	console.log(`Server on PORT ${PORT}`);
}

main();
