const express = require('express');
const router = express.Router();
const Details = require('../models/details');
const Notes = require('../models/notes');

router.get('/',checkAuthenticated,(req,res,next)=>{
    Details.find({type:'note', deleteDate:null, archived:"false", userID: req.user._id})
            .populate('noteID')
            .then((list)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(list);
            })
            .catch((err)=>{
                if(err){
                    res.statusCode=501;
                    res.setHeader('Content-Type','application/json');
                    res.json({'err':'Cannot retrieve data'});
                }
            })
})

router.post('/',checkAuthenticated, (req,res,next)=>{
    var note = new Notes({
        title: req.body.title,
        body: req.body.body,
        userID: req.user._id
    });
    note.save((err, note)=>{
        if(err){
            return next(err);
        }else{
            var detail = new Details({
                userID: req.user._id,
                type: 'note',
                noteID: note._id,
                archived: false,
                pinned: false
            });
            detail.save((err,details)=>{
                if(err){
                    return next(err);
                }else{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    var json = {
                        notes: note,
                        details: details
                    }
                    res.json(json);
                }
            })
        }
    })
});

router.get('/:noteid',checkAuthenticated, (req,res,next)=>{
    Details.findOne({noteID: req.params.noteid})
    .populate('noteID')
    .exec((err,note)=>{
        if(err){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.json({error:'Not Found'});
        }
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(note);
    });
});

router.post('/:noteid',checkAuthenticated,(req,res,next)=>{
    Notes.findByIdAndUpdate(req.params.noteid,{
        $set:{
            title: req.body.title,
            body: req.body.body
        }
    },{
        new:true
    })
    .then((note)=>{
        var archive = ((req.body.archived)?true:false);
        Details.findOneAndUpdate({noteID: req.params.noteid},{
            $set:{
                archived: archive
            }
        },{
            new:true
        })
        .then((detail)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            var json = {
                note: note,
                detail: detail
            }
            res.json(json);
        })
    })
});

router.delete('/:noteid',checkAuthenticated,(req,res,next)=>{
    Notes.findByIdAndUpdate(req.params.noteid,{
        $set:{
            deleted: true
        }
    },{
        new:true
    })
    .then((note)=>{
        Details.findOneAndUpdate({noteID: req.params.noteid},{
            $set:{
                deleteDate: Date.now()
            }
        },{
            new:true
        })
        .then((detail)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            var json = {
                note: note,
                detail: detail
            }
            res.json(json);
        })
    })
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/user/login');
    }
}

module.exports= router;