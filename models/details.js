var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var detailsSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    type:{
        type: String,
        required: true,
        enum:['note','list','draw','photo'],
        default:'note'
    },
    noteID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notes'
    },
    listID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lists'
    },
    drawID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'draws'
    },
    photoID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'photos'
    },
    deleteDate:{
        type: Date
    },
    archived:{
        type: Boolean,
        required: true,
        default: false
    },
    labels:[{
        type: Schema.Types.ObjectId,
        ref: 'labels'
    }],
    pinned:{
        type: Boolean,
        required: true,
        default: false
    }
},{
    timestamps:true
});

var Details = mongoose.model('details', detailsSchema);

module.exports = Details;