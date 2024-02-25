const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://nesreengdb:macula2024@macula.svwywkc.mongodb.net/macula')

        //'mongodb+srv://nesreengdb:macula2024@macula.svwywkc.mongodb.net/?retryWrites=true&w=majority&appName=Macula')
        console.log('MongoDB connected')
    } catch (error) {
        console.log('failed !!')
        process.exit(1)
    }
}

module.exports = connectDB