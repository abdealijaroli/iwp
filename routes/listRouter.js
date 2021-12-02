const express = require('express');
const router = express.Router();
const Details = require('../models/details');
const List = require('../models/lists');

router.get('/',checkAuthenticated, (req,res,next)=>{
    Details.find({type:'list', deleteDate:null, archived:"false", userID: req.user._id})
            .populate('listID')
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
    var incomplete = req.body.incomplete;
    var complete = req.body.complete;
    var title = req.body.title;
    var item1 = [];
    for(const item of incomplete){
        item1.push({
            item: item, 
            completed: false
        });
    };
    for(const item of complete){
        item1.push({
            item: item,
            completed: true
        });
    };
    var list = new List({
        userID: req.user._id,
        title: title,
        todo: item1
    });
    list.save((err,list)=>{
        if(err){
            return next(err);
        }else{
            var detail = new Details({
                userID: req.user._id,
                type: 'list',
                listID: list._id,
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
                        lists: list,
                        details: details
                    }
                    res.json(json);
                }
            })
        }
    })
})

router.get('/:listid',checkAuthenticated, (req,res,next)=>{
    Details.findOne({listID: req.params.listid})
    .populate('listID')
    .exec((err,list)=>{
        if(err){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.json({error:'Not Found'});
        }
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(list);
    });
});

router.post('/:listid',checkAuthenticated,(req,res,next)=>{
    var incomplete = req.body.incomplete;
    var complete = req.body.complete;
    var item1 = [];
    for(const item of incomplete){
        item1.push({
            item: item, 
            completed: false
        });
    };
    for(const item of complete){
        item1.push({
            item: item,
            completed: true
        });
    };
    List.findByIdAndUpdate(req.params.listid,{
        $set:{
            title: req.body.title,
            todo: item1
        }
    },{
        new:true
    })
    .then((list)=>{
        var archive = ((req.body.archived)?true:false);
        Details.findOneAndUpdate({listID: req.params.listid},{
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
                list: list,
                detail: detail
            }
            res.json(json);
        })
    })
});

router.delete('/:listid',checkAuthenticated,(req,res,next)=>{
    List.findByIdAndUpdate(req.params.listid,{
        $set:{
            deleted: true
        }
    },{
        new:true
    })
    .then((list)=>{
        Details.findOneAndUpdate({listID: req.params.listid},{
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
                list: list,
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

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/home');
    }else{
        next();
    }
}

module.exports = router;