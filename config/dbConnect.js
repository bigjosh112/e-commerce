
const { default: mongoose } = require("mongoose")

mongoose.set('strictQuery', false)


// const dbConnect = () => {
//     try{
//             const conn = mongoose.connect(process.env.MONGO_URL)
//             console.log('DB connected successful')
//         }
//     catch(err){
//         console.log('DB error')
    
// }
// }

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log('DB connected successful');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

module.exports = connectDB;

