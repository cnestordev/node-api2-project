const express = require('express')

const app = express()
app.use(express.json()) //body parser

const db = require('./data/db')

//------------------END POINTS -------------------------------------------------------------

app.post('/api/posts', (req, res) => {
    if (req.body.title === '' || req.body.contents === '') {
        res.status(400).json({ errorMessage: 'Pleave provide ttile and contents for the post' })
    } else {
        db.insert(req.body)
            .then(response => {
                //return newly created post.  response returns object with id property
                res.status(201).json(response)
            })
            .catch(err => {
                res.status(500).json({ error: 'There was an error while saving your post' })
            })
    }
})

app.post('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id
    if (req.body.text === '') {
        res.status(400).json({ errorMessage: 'Please provide text for the comment' })
    } else {
        db.findById(id)
            .then(response => {
                if (response.length === 0) {
                    res.status(404).json({ message: 'The post with the specified ID does not exist' })
                } else {
                    console.log(req.body)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
})




app.listen(8000, () => {
    console.log('server running on port 8000')
})