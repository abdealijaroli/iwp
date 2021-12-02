const express = require('express');
const router = express.Router();
const Details = require('../models/details');
const Lists = require('../models/lists');
const Notes = require('../models/notes');
const async = require('async');

router.get('/',checkAuthenticated, (req,res,next)=>{
    async.series({
        deleteDetailNote: (callback)=>{
            Details.find({deleteDate:{$ne:null}, type:'note', deleteDate:{$lte: new Date(Date.now() - 1000*60*60*24*7)}, userID: req.user._id})
            .deleteMany()
            .exec(callback)
        },
        deleteNote: (callback)=>{
            Notes.find({userID:req.user._id, updatedAt:{$lte: new Date(Date.now() - 1000*60*60*24*7)}, deleted:true, userID: req.user._id})
            .deleteMany()
            .exec(callback)
        },  
        deleteDetailList: (callback)=>{
            Details.find({deleteDate:{$ne:null}, type:'list', deleteDate:{$lte: new Date(Date.now() - 1000*60*60*24*7)}, userID: req.user._id})
            .deleteMany()
            .exec(callback)
        },
        deleteList: (callback)=>{
            Lists.find({userID:req.user._id, updatedAt:{$lte: new Date(Date.now() - 1000*60*60*24*7)}, deleted:true, userID: req.user._id})
            .deleteMany()
            .exec(callback)
        },  
        displayNote: (callback)=>{
            Details.find({deleteDate:{$ne:null}, type:'note', deleteDate:{$gte: new Date(Date.now() - 1000*60*60*24*7)}, userID: req.user._id})
            .populate('noteID')
            .exec(callback)
        },
        displayList: (callback)=>{
            Details.find({deleteDate:{$ne:null}, type:'list', deleteDate:{$gte: new Date(Date.now() - 1000*60*60*24*7)}, userID: req.user._id})
            .populate('listID')
            .exec(callback)
        }
    },(err,result)=>{
        if(err){
            return next(err);
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
        }
    })
});

router.post('/:id',checkAuthenticated, (req,res,next)=>{
    Details.findByIdAndUpdate(req.params.id,{
        $set:{
            deleteDate:null
        }
    },{
        new:true
    })
    .then((detail)=>{
        if(detail.type==='note'){
            Notes.findByIdAndUpdate(detail.noteID._id,{
                $set:{
                    deleted:false
                }
            },{
                new:true
            },(err,doc)=>{
                if(err){
                    res.statusCode=403;
                    res.send(err);
                }else{
                    res.send(doc);
                }
            })
        }else if(detail.type==='list'){
            Lists.findByIdAndUpdate(detail.listID._id,{
                $set:{
                    deleted:false
                }
            },{
                new:true
            },(err,doc)=>{
                if(err){
                    res.statusCode=403;
                    res.send(err);
                }else{
                    res.send(doc);
                }
            })
        }
    })
    .catch((err)=>{
        res.statusCode=403;
        res.send(err);
    })
})

router.delete('/',checkAuthenticated, (req,res,next)=>{
    async.series({
        deleteDetailNote: (callback)=>{
            Details.find({deleteDate:{$ne:null}, type:'note', userID: req.user._id})
            .deleteMany()
            .exec(callback)
        },
        deleteNote: (callback)=>{
            Notes.find({userID:req.user._id, deleted:true})
            .deleteMany()
            .exec(callback)
        },  
        deleteDetailList: (callback)=>{
            Details.find({deleteDate:{$ne:null}, type:'list', userID: req.user._id})
            .deleteMany()
            .exec(callback)
        },
        deleteList: (callback)=>{
            Lists.find({userID:req.user._id, deleted:true})
            .deleteMany()
            .exec(callback)
        }
    },(err,result)=>{
        if(err){
            return next(err);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    })
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/user/login');
    }
}

module.exports = router;