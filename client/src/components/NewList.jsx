import React,{Component} from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import './css/ListDetail.css';

class NoteDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            redirectBack:false,
            redirectHome:false,
            title:'',
            complete:[],
            incomplete:[],
            newTodo: ''
        };
    }

    handleChange = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleUpdate = (e)=>{
        e.preventDefault();
        Axios.post('/list', this.state)
        .then((res)=>{
            this.setState({
                redirectHome:true
            });
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    handleIncomplete = (e)=>{
        const { name, value } = e.target
        var newIncomplete = Array.from(this.state.incomplete)
        newIncomplete[name] = value
        this.setState({
            incomplete: newIncomplete
        })
    }

    handleComplete = (e)=>{
        const { name, value } = e.target
        var newComplete = Array.from(this.state.complete)
        newComplete[name] = value
        this.setState({
            complete: newComplete
        })
    }

    handleCompletion = (e)=>{
        e.preventDefault();
        const { name } = e.target
        var newIncomplete = Array.from(this.state.incomplete);
        var newComplete = Array.from(this.state.complete);
        newIncomplete.splice(name,1);
        newComplete.push(this.state.incomplete[name]);
        this.setState({
            incomplete: newIncomplete,
            complete: newComplete
        })
    }

    handleIncompletion = (e)=>{
        e.preventDefault();
        const { name } = e.target
        var newIncomplete = Array.from(this.state.incomplete);
        var newComplete = Array.from(this.state.complete);
        newIncomplete.push(this.state.complete[name]);
        newComplete.splice(name,1);
        this.setState({
            incomplete: newIncomplete,
            complete: newComplete
        })
    }

    newTodo = (e)=>{
        e.preventDefault();
        var newIncomplete = Array.from(this.state.incomplete);
        newIncomplete.push(this.state.newTodo);
        this.setState({
            incomplete: newIncomplete,
            newTodo:''
        });
    }    

    handleDeleteNote =(e)=>{
        e.preventDefault();
        var newIncomplete = Array.from(this.state.incomplete);
        newIncomplete.splice(e.target.name,1);
        this.setState({
            incomplete:newIncomplete
        })
    }

    handleDeleteNoteComplete =(e)=>{
        e.preventDefault();
        var newComplete = Array.from(this.state.complete);
        newComplete.splice(e.target.name,1);
        this.setState({
            complete:newComplete
        })
    }
    
    handleEnter = (e)=>{
        if(e.key==="Enter"){
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);
            if(e.target.name==='newTodo'){
                form.elements[index-1].click();
            }else{
                form.elements[index + 3].focus();
            }
            e.preventDefault();
        }
    }

    componentDidMount(){
        Axios.get('/user/login')
            .then((response)=>{
                console.log(response);
                if(response.data['msg']){
                    this.setState({
                        redirectBack:true
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    }

    render(){
        return(
            <div className="listDetailContainer">
                <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet" />
                {this.state.redirectBack && <Redirect push to='/user/login' />}
                {this.state.redirectHome && <Redirect push to='/home' />}
                    <form className="noteDetailForm">
                        <input placeholder="Title" type="text" value={this.state.title} name="title" className="noteDetailTitle" onChange={this.handleChange} autoComplete="off"/>
                        <br />
                        <br />  
                        <ul className="incompleteTodo">
                            {this.state.incomplete.map((todo, index)=>{
                                return <li key={index}><button className="incompleteButton" onClick={this.handleCompletion} name={index}></button><input type="text" value={todo} name={index} className="todoInput" onChange={this.handleIncomplete} onKeyDown={this.handleEnter} autoComplete="off" /><button className="cancelButton" onClick={this.handleDeleteNote} name={index}></button></li>
                            })}
                            <li><button className="addTodo" onClick={this.newTodo}></button><input type="text" placeholder="List item" className="newTodo" name="newTodo" value={this.state.newTodo} onChange={this.handleChange} onKeyDown={this.handleEnter} autoComplete="off" /></li>
                        </ul>
                        <br />
                        <br />
                        <ul className="completeTodo">
                            {this.state.complete.map((todo,index)=>{
                                return <li key={index}><button className="completeButton" onClick={this.handleIncompletion} name={index}></button><input type="text" value={todo} name={index} onChange={this.handleComplete} onKeyDown={this.handleEnter} className="todoInput completeTodoInput" autoComplete="off" /><button className="cancelButton" onClick={this.handleDeleteNoteComplete} name={index}></button></li>
                            })}
                        </ul>
                        <button type="submit" className="buttonUpdate" onClick={this.handleUpdate}>
                            <i className="material-icons-outlined">done</i>
                        </button>                        
                    </form>
            </div>
        )
    }
}

export default NoteDetail;