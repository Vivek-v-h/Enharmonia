import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            serverSelectionTimeoutMS:10000
        });
        console.log("database connected succesfuly")
        } catch (error) {
            console.log("Error connecting database",error)
            process.exit(0);
        }
}
export default connectDB
