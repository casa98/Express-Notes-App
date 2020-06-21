const express = require('express');
const router = express.Router();

router.get('/notes', (req, res)=>{
    res.send('Notes of a user from database');
});


module.exports = router;