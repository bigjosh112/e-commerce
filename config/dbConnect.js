
const { default: mongoose } = require("mongoose")

mongoose.set('strictQuery', false)


const dbConnect = () => {
    try{
            const conn = mongoose.connect(process.env.MONGO_URL)
            console.log('DB connected successful')
        }
    catch(err){
        console.log('DB error')
    
}
}


module.exports = dbConnect;

