const express = require('express')
require('./config/database')
//const userRouter = require('./routes/userRouter')

const port = process.env.port || 2000


const app = express()
app.use(express.json())
//app.use(userRouter)

app.listen(port, ()=>{
  console.log(`server listening to port: ${port}`);
  
})


