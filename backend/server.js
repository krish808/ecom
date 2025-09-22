const express = require('express')
const cors = require('cors')
const dotenv = require("dotenv")
const connectDB = require('./config/db')


dotenv.config()
connectDB()


const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', require('./routes/authRoutes'))
app.use("/user", require("./routes/protected"))
app.use("/products", require("./routes/productRoutes"))

app.listen(process.env.PORT,() => console.log('🚀 Server running on port')
)