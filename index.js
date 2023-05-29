const mongoose=require('mongoose')
const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000
const DB="mongodb+srv://kunalagra197:Kunal123@cluster0.kwt4rv1.mongodb.net/forever-notes?retryWrites=true&w=majority"
mongoose.connect(DB).then(()=>{
  console.log('connection successful')
}).catch(()=>console.log("failed"))
app.use(cors())

 app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello!')
})

// Available routes

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})