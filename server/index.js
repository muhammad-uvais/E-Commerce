const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require ("./config/db")

process.on('uncaughtException',(err)=>{
    console.log(`error:${err.message}`)
    console.log('server has shut down due to server error')
    process.exit(1)
})

// configration 
dotenv.config()

// database connectivity check
connectDatabase()


const shutDown = app.listen(process.env.PORT,()=>{
console.log(`server is working on http://localhost:${process.env.PORT}`)
})

process.on('unhandledRejection',(err)=>{
    console.log(`error:${err.message}`)
    console.log('server has shut down due to unhandle prompts')
    shutDown.close(()=>{process.exit(1)})
})