const express = require("express")
const path = require('path')
const bodyParser = require('body-parser')
const Companys = require("./model/companys")
const Contractors = require("./model/contractors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET= "awiufhveqru89490&*(&VGFRDE5ds^kfdvjhvs"

const mongoose = require("mongoose")
// var Binary = require('mongodb').Binary;
// var fs  = require('fs');//for file
mongoose.connect("mongodb://localhost:27017/contLogin", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex : true
})

var engines = require('consolidate');

web.set('views', __dirname + '/views');
web.engine('html', engines.mustache);
web.set('view engine', 'html');

const web = express()
web.use('/', express.static(path.join(__dirname, 'static')))
web.use(bodyParser.json())//parse req to body parser

/*
	//Client has to prove to server who they are
	//1.client prove themselve/ data is unchangeable(JWT)
	//jwt 1st point is header 2nd(atob) is payload and 3rd is
	// 3rd is signature/hash(for verification to know if it has been tampered with)
	//2.Client-Server share secret (Cookie)
*/

web.post('/api/loginContractor', async(req, res) => {
	const {username, password} = req.body
	const contractor = await Contractors.findOne( {username}).lean()

	if (!contractor) {
		return res.json({ status:'error', error:'Invalid Username password'})
	}

	if (await bcrypt.compare(password, contractor.password)) {
		//
		const token = jwt.sign({ 
			id: contractor._id, 
			username: contractor.username 
		}, JWT_SECRET)
		return res.json({ status:'ok', data:token})
	}

	return res.json({ status:'error', error:'Invalid Username password'})
})

web.get("/api/contractor_main.html", function(req, res) {
  res.render('/api/contractor_main.html');
});

web.post('/api/registerContractor', async(req,res) => {
	// console.log(req.body)
	// res.json({status: 'ok' })

	//for checking email format
	/*
		// var x=document.regContractor.email.value;  
		// var atposition=x.indexOf("@");  
		// var dotposition=x.lastIndexOf(".");  
		// if (atposition<1 || dotposition<atposition+2 || dotposition+2>=x.length){  
		// 	alert("Please enter a valid e-mail address \n atpostion:"+atposition+"\n dotposition:"+dotposition);  
		// return false;}
	*/
	
	const {username, mobileNo, email, 
		// appliedTender, 
		password: plainTextPassword } = req.body
	// res.end(JSON.stringify(req.body))

	//file converting to binary
        // var data = fs.readFileSync(appliedTender);
        // var insert_data = {};
        // insert_data.file_data= Binary(data);
        // fileDataInBinary = insert_data.file_data;

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)
	
	try{
		const response = await Contractors.create({
			username,
			mobileNo,
            email,
            // appliedTender,
			password
		})
		console.log("Contractor registered!: ", response)
	}catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
});

web.post('/api/registerCompany', async(req,res) => {
	// console.log(req.body)
	// res.json({status: 'ok' })

	const {username, mobileNo, email, password: plainTextPassword } = req.body
	// res.end(JSON.stringify(req.body))

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)
	
	try{
		const response = await Companys.create({
			username,
			mobileNo,
            email,
			password
		})
		console.log("Company registered!: ", response)
	}catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
});

////////////////////
// const morgan = require("morgan")
// web.use(morgan('tiny'))
// web.set("view engine", "ejs")
// // web.set("views.path")

// //load assests
// web.use('/', express.static(path.resolve(__dirname, 'static')))

// web.get('/', (req, res) => {
// 	res.send("App")
// })

web.listen(9999, () => {
	console.log('Server up at 9999')
})
