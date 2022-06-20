const express = require('express')
const app = express()
const Joi = require('joi')
const authMiddleware = require('./middleware/auth')
const morgan = require('morgan')
const helmet = require('helmet')
const categories = [
    { name: 'BMW', id: 1 },
    { name: 'Porshe', id: 2 },
    { name: 'Chevrolet', id: 3 },
]
// Middleware functions
app.use(express.json())
// Module middleware
app.use(morgan('tiny'))
app.use(helmet())
// custom middleware
app.use((req, res, next) => {
    console.log('Logger');
    next()
})
// Get home page
app.get('/', (req, res) => {
    res.send('Welcome to car shop ')
})
// Get categories
app.get('/api/categories', (req, res) => {
    res.status(200).send(categories)
})
// Get single Categoriy with car name 
app.get('/api/categories/сategoriy', (req, res) => {
    const сategoriy = categories.find( сat => сat.name === req.query.name)
    res.status(200).send(сategoriy)
})
// Get categoriy with id
app.get('/api/categories/:id', (req, res) => {
    const сategoriy = categories.find(cat => cat.id === +req.params.id)
    if (!сategoriy) {
        return res.status(404).send('404 not found')
    }
    res.status(200).send(сategoriy)
})
// // Delete categoriy with id
app.delete('/api/categories/delete/:id', authMiddleware, (req, res) => {
    const idx = categories.findIndex(cat => cat.id === +req.params.id)
    // Validator
    if (idx === -1) {
        return res.status(404).send('404 not found. It is not exist')
    }
    categories.splice(idx, 1)
    res.status(200).send('Car categoriy successfully deleted')
})
// Post add ctegoriy
app.post('/api/categoriy/add', authMiddleware, (req, res) => {
    const schema = Joi.object({
        name: Joi.string().
            min(3).
            required()
    })
    const value = schema.validate(req.body)
    if (value.error) {
        res.status(404).send(value.error.message)
        return
    }

    const categoriy = {
        name: req.body.name,
        id: categories.length + 1 // 
    }

    categories.push(categoriy)
    res.status(201).send('Categoriy created successfull')
})
// Put lesson with id
app.put('/api/categoriy/update/:id', authMiddleware, (req, res) => {
    const idx = categories.findIndex(cat => cat.id === +req.params.id)
    // Validator
    if (idx === -1) {
        return res.status(404).send('404 not found. It is not exist')
    }
    let categoriy = {
        name: req.body.name,
        id: +req.params.id
    }
    categories[idx] = categoriy
    res.status(200).send('Categoriy updated successfull')
})

const port = normalizePort(process.env.port || 3000) 

app.listen(port , ()=>{
    console.log(`App listening on port `+ port);
})
function normalizePort(val){
    const num = parseInt(val)
    if(isNaN(num)){
        return val
    }
    if(num){
        return num
    }
    return false
}