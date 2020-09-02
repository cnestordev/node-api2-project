const express = require('express')
const router = express.Router()

const db = require('../data/db')


// route fully functional
router.post('/', (req, res) => {
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

//the promise only resolves if post_id matches to an id.  If not, it calls .catch().  Therefore, cannot use both error 500 and error 404.
//otherwise, it is functional
router.post('/:id/comments', (req, res) => {
    const id = req.params.id
    if (req.body.text === '') {
        res.status(400).json({ errorMessage: 'Please provide text for the comment' })
    } else {
        const newComment = {
            text: req.body.text,
            post_id: id
        }
        db.insertComment(newComment)
            .then(response => {
                //response is an object with one property - an id with a new ID number (useless)
                res.status(201).json(newComment)
            })
            .catch(error => {
                res.status(500).json({ error: 'There was an error while saving the comment to the database' })
            })
    }
})

// route fully functional but too much unneccesary code
// router.post('/:id/comments', (req, res) => {
//     const id = req.params.id
//     if (req.body.text === '') {
//         res.status(400).json({ errorMessage: 'Please provide text for the comment' })
//     } else {
//         db.findById(id)
//             .then(response => {
//                 if (response.length === 0) {
//                     res.status(404).json({ message: 'The post with the specified ID does not exist' })
//                 } else {
//                     const newComment = {
//                         text: req.body.text,
//                         post_id: id
//                     }
//                     db.insertComment(newComment)
//                         .then(resp => {
//                             res.status(201).json(newComment)
//                         })
//                         .catch(error => {
//                             console.log(error)
//                             res.status(500).json({ error: 'There was an error while saving the comment to the database' })
//                         })
//                 }
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }
// })

//route fully functional
router.get('/', (req, res) => {
    db.find()
        .then(response => {
            res.status(200).json({ data: response })
        })
        .catch(error => {
            res.status(500).json({ error: 'The post information could not be retrieved' })
        })
})


//route fully functional
router.get('/:id', (req, res) => {
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

//route keeps returning empty array, regardless of ID being number or string. 404
router.get('/:id/comments', (req, res) => {
    // tried changing id to a number, outcome does not change, keep getting 404
    const id = req.params.id
    console.log(id)
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


//route fully functional
router.delete('/:id', (req, res) => {
    const id = req.params.id
    db.remove(id)
        .then(response => {
            console.log(response)
            if (!response) {
                res.status(404).json({ message: 'The post by the specified ID does not exist' })
            } else {
                res.status(200).json({ message: 'The post was successfully deleted' })
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'The post could not be removed' })
        })
})


//route fully functional
router.put('/:id', (req, res) => {
    const id = req.params.id
    if (req.body.title === '' || req.body.contents === '') {
        res.status(400).json({ errorMessage: 'Please provide a title ande contents for the post' })
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

module.exports = router


//1. (SOLVED) The /api/posts/17/comments endpoints returns 404, even with ID being in DB.  Number() does not change outcome. (SOLVED)

//2. /:id/comments -- cannot use both error 404 and 500 because the promise only resolves if it finds a matching ID.  If it cannot find a matching ID,
//it will run the catch method, which is the 500.  Cannot include 404 on the .catch() because of this.
