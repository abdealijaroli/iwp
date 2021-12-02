import React,{Component} from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import './css/NoteDetail.css';
import TextareaAutosize from 'react-autosize-textarea';

class NoteDetail extends Component{
    constructor(){
        super();
        this.state={
            redirect:false,
            title:'',
            body:'',
            redirectHome: false
        }
    }

    handleChange = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleUpdate = (e)=>{
        e.preventDefault();
        Axios.post('/note', this.state)
        .then((res)=>{
            this.setState({
                redirectHome:true
            });
        })
        .catch((err)=>{
            e.preventDefault();
            console.log(err);
        })
    }
    
    componentDidMount(){
        Axios.get('/user/login')
            .then((response)=>{
                console.log(response);
                if(response.data['msg']){
                    this.setState({
                        redirect:true
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    render(){
        return(
            <div className="noteDetailContainer">
                <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet" />
                {this.state.redirect && <Redirect push to='/user/login' />}
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
                    </form>

                   
            </div>
        )
    }
}

export default NoteDetail;