const express = require('express')

const app = express()
app.use(express.json()) //body parser

const db = require('./data/db')

//------------------END POINTS -------------------------------------------------------------

app.post('/api/posts', (req, res) => {
    if (req.body.title === '' || req.body.contents === '') {
        res.status(400).json({ errorMessage: 'Pleave provide title and contents for the post' })
    } else {
        db.insert(req.body)
            .then(response => {
                //return newly created post.  response returns object with id property
                res.status(201).json(req.body)
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
                    const newComment = {
                        text: req.body.text,
                        post_id: id
                    }
                    db.insertComment(newComment)
                        .then(resp => {
                            res.status(201).json(newComment)
                        })
                        .catch(error => {
                            res.status(500).json({ error: 'There was an error while saving the comment to the database' })
                        })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
})

app.get('/api/posts', (req, res) => {
    db.find()
        .then(response => {
            res.status(200).json({ data: response })
        })
        .catch(error => {
            res.status(500).json({ error: 'The post information could not be retrieved' })
        })
})

app.get('/api/posts/:id', (req, res) => {
    const id = req.params.id
    db.findById(id)
        .then(response => {
            if (response.length === 0) {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            } else {
                res.status(200).json(response)
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'The post information could not be retrieved' })
        })
})

app.get('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id
    db.findPostComments(id)
        .then(response => {
            if (response.length === 0) {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            } else {
                res.status(200).json(response)
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'The comments information could not be retrieved' })
        })
})

app.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id
    db.findById(id)
        .then(resp => {
            if (resp.length === 0) {
                res.status(404).json({ message: 'The post by the specified ID does not exist' })
            } else {
                db.remove(id)
                    .then(response => {
                        res.status(204).end()
                    })
                    .catch(error => {
                        res.status(500).json({ error: 'The post could not be removed' })
                    })
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'The post could not be removed' })
        })
})

app.put('/api/posts/:id', (req, res) => {
    const id = req.params.id
    if (req.body.title === '' || req.body.contents === '') {
        res.status(400).json({ errorMessage: 'Please provide a title ande contents for the post' })
    } else {
        db.findById(id)
            .then(response => {
                if (response.length === 0) {
                    res.status(404).json({ message: 'The post with the specified ID does not exist' })
                } else {
                    db.update(id, req.body)
                        .then(resp => {
                            if (resp === 1) {
                                res.status(200).json(req.body)
                            } else {
                                res.status(404).json({ message: 'The post with the specified ID does not exist' })
                            }
                        })
                        .catch(error => {
                            res.status(500).json({ error: 'The post information coudl not be modified' })
                        })
                }
            })
            .catch(error => {
                res.status(500).json({ error: 'The post information coudl not be modified' })
            })
    }
})




app.listen(8000, () => {
    console.log('server running on port 8000')
})