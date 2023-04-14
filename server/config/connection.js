const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    dbName: 'mydatabase',
    // use findOneAndUpdate and findOneAndDelete instead of findByIdAndUpdate and findByIdAndDelete
});

module.exports = mongoose.connection;
