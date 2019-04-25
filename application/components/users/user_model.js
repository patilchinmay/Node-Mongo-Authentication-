const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    fName:{
        type: String,
        // required: true,
        default: null
    },
    lName:{
        type: String,
        // required: true,
        default: null
    },
    email:{
        type: String,
        required: true,
        unique: true,
        default: null,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    countryCode:{
        type: String,
        default: "+91"
    },
    mobile:{
        type: String,
        // unique: true,
        // required: true
    },
    password:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date
    }
},
{
    collection: 'users'
});

module.exports = mongoose.model('Users', userSchema);
// module.exports = mongoose.model('TransactionEntry', TransactionEntrySchema);