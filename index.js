const mongoose=require('mongoose')
const express = require('express')
const schedule = require('node-schedule');
const mailer = require('./mailer')
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
// const somedate=new Date('')
schedule.scheduleJob('15 20 * * *', async ()=>{
  console.log('The answer to life, the universe, and everything!');
  try {
    await mailer();
    // console.log('Email sent successfully');
  } catch (error) {
    // console.error('Failed to send email:', error);
  }
});
// Available routes

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})