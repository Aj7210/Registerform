import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
dotenv.config();


mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("connected successfully"))
.catch((error)=>{console.log(error)
    
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes

app.post("/login",async (req, res)=> {
    const { email, password} = req.body
    try{
        const user = await User.findOne({ email });
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    
}catch (err) {
    res.status(500).send(err);
    console.log(err)
}
}) ;



app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.send({ message: "User already registered" });
        }

        const newUser = new User({
            name,
            email,
            password,
        });

        await newUser.save();
        res.send({ message: "Successfully Registered, Please login now." });
    } catch (err) {
        res.status(500).send(err);
        console.log(err)
    }
});

app.listen(5000,() => {
    console.log("BE started at port 9002")
})