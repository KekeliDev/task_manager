// handles connection to monogo db

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/taskmanager', {useNewUrlParser: true}).then(()=>{
    console.log("connected to MongoDB :)");
}).catch((e)=>{
    console.log("error has occurred whilst coneecting to MongoDB");
    console.log(e);
});

// Preventing depreication warnings
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports =[
    mongoose
];
