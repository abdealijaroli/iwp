import React,{ Component } from 'react';
import Axios from 'axios';
import { Redirect, NavLink } from 'react-router-dom';
import './css/Home.css';
import Masonry from 'react-masonry-component';
import Moment from 'react-moment';
import 'moment-timezone';

class Trash extends Component{
    constructor(){
        super();
        this.state={
            redirectBack: false,
            notes : [],
            list : []
        }
    }

    componentDidMount(){
        Axios.get('/trash')
        .then((res)=>{
            if(!res.data['msg']){
                if(res.data['displayNote'] && res.data['displayList']){
                var notes = res.data['displayNote'].sort((a,b)=>{
                    return new Date(b.deleteDate)-new Date(a.deleteDate);
                })
                var list = res.data['displayList'].sort((a,b)=>{
                    return new Date(b.deleteDate) - new Date(a.deleteDate);
                })
                this.setState({notes, list})
            }
            }else if(res.data['msg']){
                this.setState({
                    redirectBack:true
                })
            }
        })
    }

    buttonRedirect = (e)=>{
        console.log(e.target.value);
    }

    render(){
        var data = []/* eslint-disable-next-line */
        this.state.notes.map((note)=>{
            data.push(note);
        })/* eslint-disable-next-line */
        this.state.list.map((list)=>{
            data.push(list);
        })/* eslint-disable-next-line */
        data = data.sort((a,b)=>{
            return new Date(b.deleteDate) - new Date(a.deleteDate);
        })
        return(
            <div className="container">
                <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
                {this.state.redirectBack && <Redirect push to='/user/login' />}
                <h1 className="home-center">Trash</h1>
                <h4 className="home-center">Deleted notes will be permanently deleted after 7 days</h4>
                <Masonry
                className={'masonry-home'} 
                elementType={'ul'}
            >{/* eslint-disable-next-line */}
                {data.map(function(element){
                if(element.type==='note'){
                    return (
                    <NavLink to={'/note/'+element.noteID._id} className="masonry-button" key={element._id} style={{'textDecoration': 'none', 'color':'white'}}>
                        <div className="masonry-note box" key={element.noteID._id}>
                            <span style={{'fontWeight':'bold'}}>{element.noteID.title}</span>
                                <br />
                                <br />
                                <p style={{'whiteSpace':'pre-line'}} >
                            {element.noteID.body}
                            </p>
                            <Moment className="time" format="D MMM YYYY HH:mm" style={{'fontSize':'10px'}}>{element.deleteDate}</Moment>
                        </div>
                    </NavLink>
                    );
                }else if(element.type==='list'){
                    return (
                        <NavLink to={'/list/'+element.listID._id} className="masonry-button" key={element._id} style={{'textDecoration': 'none', 'color':'white'}}>
                        <div className="masonry-list box" key={element.listID._id}>
                            <span style={{'fontWeight':'bold'}}>{element.listID.title}</span>
                            <br />
                            <br />
                            <ul className="incomplete">{/* eslint-disable-next-line */}
                                {element.listID.todo.map(function(todo){
                                    if(!todo.completed){
                                        return <li className="incomplete-list" key={todo._id}>{todo.item}</li>
                                    }
                                })}
                            </ul>
                            <hr style={{color:'#525355'}}/>
                            <ul className="complete">{/* eslint-disable-next-line */}
                                {element.listID.todo.map((todo)=>{
                                    if(todo.completed){
                                        return <li className="complete-list" key={todo._id}>{todo.item}</li>
                                    }
                                })}
                            </ul>
                            <br />
                            <Moment className="time" format="D MMM YYYY HH:mm" style={{'fontSize':'10px'}}>{element.deleteDate}</Moment>
                        </div>
                        </NavLink>
                    )
                }})}
            </Masonry>
            </div>
        )
    }
}

export default Trash;