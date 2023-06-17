const mongoose= require('mongoose')

const connectToDb = () => {
    return mongoose.connect(`${process.env.MONGO_URI}`)
}

module.exports= connectToDb