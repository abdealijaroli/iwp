const express = require('express');
const router = express.Router();

router.get('/',checkAuthenticated,(req,res,next)=>{
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/login');
}

module.exports = router;