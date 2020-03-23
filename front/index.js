const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()

let root = path.join(__dirname, 'client')
// serve static assets normally
app.use(express.static(root))

// Handles all routes so you do not get a not found error
app.get('*', function (request, response){
    console.log(root, 'index.html')
    response.sendFile(path.resolve('./client/index.html'))
})

// let root = path.join(__dirname)
// app.use(express.static(root))
// app.use(function(req, res, next) {
//   if (req.method === 'GET' && req.accepts('html') && !req.is('json') && !req.path.includes('.')) {
//     res.sendFile(path.resolve(__dirname, 'index.html'), { root })
//   } else next()
// })

app.listen(port)
console.log("server started on port " + port)
