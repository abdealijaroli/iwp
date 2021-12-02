import React,{Component} from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import './css/NoteDetail.css';
import TextareaAutosize from 'react-autosize-textarea';

class NoteDetail extends Component{
    constructor(){
        super();
        this.state={
            id:'',
            redirectBack:false,
            redirectHome:false,
            data:[],
            title:'',
            body:'',
            deleted: false,
            archived: false
        }
    }

    handleChange = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleUpdate = (e)=>{
        e.preventDefault();
        Axios.post('/note/'+this.state.id, this.state)
        .then((res)=>{
            console.log(res);
            this.setState({
                redirectHome:true
            });
        })
        .catch((err)=>{
            e.preventDefault();
            console.log(err);
        })
    }

    handleDelete = (e)=>{
        e.preventDefault();
        this.setState({
            deleted:!(this.state.deleted)
        },()=>{
            if((this.state.deleted)){
                Axios.delete('/note/'+this.state.id, this.state)
                .then((res)=>{
                    this.setState({
                        redirectHome:true
                    });
                })
                .catch((err)=>{
                    e.preventDefault();
                    console.log(err);
                })
            }else{
                Axios.post('/trash/'+this.state.data._id, this.state)
                .then((res)=>{
                    this.setState({
                        redirectHome:true
                    })
                })
                .catch((err)=>{
                    e.preventDefault();
                    console.log(err);
                })
            }
        });
    }

    handleArchive = (e)=>{
        e.preventDefault();
        this.setState({
            archived:!(this.state.archived)
        },()=>{
            Axios.post('/note/'+this.state.id, this.state)
            .then((res)=>{
                console.log(res);
                this.setState({
                    redirectHome:true
                });
            })
            .catch((err)=>{
                e.preventDefault();
                console.log(err);
            })
        });
    }
    
    componentDidMount(){
        let id=this.props.match.params.noteid
        this.setState({id})
        Axios.get('/note/'+id)
        .then((res)=>{
            if(res.data['msg']){
                this.setState({
                    redirectBack:true
                })
            }else{
                this.setState({
                    data: res.data,
                    title:res.data.noteID.title,
                    body: res.data.noteID.body,
                    deleted: res.data.noteID.deleted,
                    archived: res.data.archived
                })
            }
        })
        .catch((err)=>{
            console.log(err);
            this.setState({
               redirectHome:true 
            })
        })
    }
    render(){
        return(
            <div className="noteDetailContainer">
                <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet" />
                {this.state.redirectBack && <Redirect push to='/user/login' />}
                {this.state.redirectHome && <Redirect push to='/home' />}
                    <form action="/home" method="POST" className="noteDetailForm" onSubmit={this.handleSubmit}>
                        <input placeholder="Title" type="text" value={this.state.title} name="title" className="noteDetailTitle" onChange={this.handleChange} autoComplete="off"/>
                        <br />
                        <br />

                        <TextareaAutosize placeholder="Content" value={this.state.body} name="body" className="noteDetailBody" onChange={this.handleChange} autoComplete="off">
                        <p style={{'white-space':'pre-line'}} />
                        </TextareaAutosize>
                        
                        <button type="submit" className="buttonUpdate" onClick={this.handleUpdate}>
                            <i className="material-icons-outlined">done</i>
                        </button>
                        <button type="submit" className="buttonDelete" onClick={this.handleDelete}>
                            {this.state.deleted?<i className="material-icons-outlined">restore_from_trash</i>:<i className="material-icons-outlined">delete</i>}
                        </button>
                        <button type="submit" className="buttonArchive" onClick={this.handleArchive}>
                            {this.state.archived?<i className="material-icons-outlined">unarchive</i>:<i className="material-icons-outlined">archive</i>}
                        </button>
                    </form>
            </div>
        )
    }
}

export default NoteDetail;