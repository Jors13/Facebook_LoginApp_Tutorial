const express = require('express');
const app = express();
const morgan = require('morgan');

//Settings
const PORT = process.env.PORT || 4000;

//Middlewares
app.use(morgan('dev')); //Request Middleware for Query's
app.use(express.json()); // Send and Receive Json //Cross Allow Origin Receive and Send Data from external server
/*app.use(cors()); */ 

app.get('/', (req, res) => {
	res.send('Hello World with Nodejs and Express ');
});

//Start Server
async function main() {
	await app.listen(PORT);
	console.log(`Server on PORT ${PORT}`);
}

main();
