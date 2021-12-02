import React,{ Component } from 'react';
import Axios from 'axios';
import { Redirect, NavLink } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import Moment from 'react-moment';
import 'moment-timezone';

class List extends Component{
    constructor(props){
        super(props);
        this.state={
            redirectBack: false,
            list : []
        }
    }

    componentDidMount(){
        Axios.get('/list')
        .then((res)=>{
            if(!res.data['msg']){
                var list = res.data.sort((a,b)=>{
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                })
                this.setState({list})
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
                <h1 className="home-center">List Page</h1>
                <Masonry
                className={'masonry-home'} 
                elementType={'ul'}
            >{/* eslint-disable-next-line */}
                {this.state.list.map(function(element){
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

export default List;