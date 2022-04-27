const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
		username: { type: String, required: true, unique:true },
		mobileNo :{ type: Number, required: true},
		email :{ type: String, required: true},
		password :{ type: String, required: true}
	}, {collection : 'companys'}
)

const model = mongoose.model('CompanySchema', CompanySchema)

module.exports = model