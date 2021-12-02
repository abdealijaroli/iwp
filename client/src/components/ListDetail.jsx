import React,{Component} from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import './css/ListDetail.css';

class NoteDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            id:'',
            redirectBack:false,
            redirectHome:false,
            data:[],
            title:'',
            todo:[],
            deleted: false,
            archived: false,
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
        Axios.post('/list/'+this.state.id, this.state)
        .then((res)=>{
            this.setState({
                redirectHome:true
            });
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    handleDelete = (e)=>{
        e.preventDefault();
        this.setState({
            deleted:!(this.state.deleted)
        },()=>{
            if((this.state.deleted)){
                Axios.delete('/list/'+this.state.id, this.state)
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
            Axios.post('/list/'+this.state.id, this.state)
            .then((res)=>{
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
        let id=this.props.match.params.listid
        this.setState({id})
        Axios.get('/list/'+id)
        .then((res)=>{
            if(res.data['msg']){
                this.setState({
                    redirectBack:true
                })
            }else{
                this.setState({
                    data: res.data,
                    title:res.data.listID.title,
                    todo: res.data.listID.todo,
                    deleted: res.data.listID.deleted,
                    archived: res.data.archived
                },()=>{
                    this.setState({
                        complete:(this.state.todo.filter(todo=>todo.completed)).map((todo)=>{
                            return todo.item;
                        }),
                        incomplete:(this.state.todo.filter(todo=>!todo.completed)).map((todo)=>{
                            return todo.item;
                        })
                    })
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