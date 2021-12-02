import React,{ Component } from 'react';
import Axios from 'axios';
import { Redirect, NavLink } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import Moment from 'react-moment';
import 'moment-timezone';

class Note extends Component{
    constructor(props){
        super(props);
        this.state={
            redirectBack: false,
            notes : []
        }
    }

    componentDidMount(){
        Axios.get('/note')
        .then((res)=>{
            if(!res.data['msg']){
                var notes = res.data.sort((a,b)=>{
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                })
                this.setState({notes})
            }else if(res.data['msg']){
                this.setState({
                    redirectBack:true
                })
            }
        })
    }

    render(){
        return(
            <div className="container">
                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
                {this.state.redirectBack && <Redirect push to='/user/login' />}
                <h1 className="home-center">Notes Page</h1>
                <Masonry
                className={'masonry-home'} 
                elementType={'ul'}
            >{/* eslint-disable-next-line */}
                {this.state.notes.map(function(element){
                        return (
                            <NavLink to={'/note/'+element.noteID._id} className="masonry-button" key={element._id} style={{'textDecoration': 'none', 'color':'white'}}>
                                <div className="masonry-note box" key={element.noteID._id}>
                                    <span style={{'fontWeight':'bold'}}>{element.noteID.title}</span>
                                        <br />
                                        <br />
                                        <p style={{'whiteSpace':'pre-line'}} >
                                    {element.noteID.body}
                                    </p>
                                    <Moment className="time" format="D MMM YYYY HH:mm" style={{'fontSize':'10px'}}>{element.updatedAt}</Moment>
                                </div>
                            </NavLink>
                        )
                })}
            </Masonry>
            </div>
        )
    }
}

export default Note;