const mongoose = require("mongoose");

const ContractorSchema = new mongoose.Schema({
		username: { type: String, required: true, unique:true },
		mobileNo :{ type: Number, required: true},
		email :{ type: String, required: true},
		password :{ type: String, required: true}
	}, {collection : 'contractors'}
)

const model = mongoose.model('ContractorSchema', ContractorSchema)

module.exports = model