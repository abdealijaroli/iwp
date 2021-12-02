import React,{ Component } from 'react';
import './css/Login.css';
import axios from 'axios';
import { Redirect, NavLink } from 'react-router-dom';

class Login extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            password: '',
            error:'',
            redirect:false
        }
    }    
    changeHandler = (e)=>{
        this.setState({[e.target.name]: e.target.value})
    }

    submitHandler = (e)=>{
        e.preventDefault();
        axios.post('/user/login', this.state)
            .then((response)=>{
                if(response.data.error){
                    this.setState({
                        error: response.data.error,
                        password: '',
                        username:''
                    })
                }else{
                    this.setState({
                        username:'',
                        password:'',
                        redirect:true
                    })
                }
            })
            .catch((err)=>{
                this.setState({
                    password:'',
                    error: 'Please try again.'
                })
            })
    }
    componentDidMount(){
        axios.get('/user/logout')
            .then((response)=>{
                this.setState({
                    error: 'Please sign in to continue.'
                })
            })
    }
    render(){
        const {username, password, error} = this.state;
        return(
                <div className="form">
                <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@500&display=swap" rel="stylesheet" />
                {this.state.redirect && <Redirect push to='/home' />}
                <br /><br /><br /><br />
                    <form action="/user/login" method="POST" onSubmit={this.submitHandler}>
                    <div className='input-wrapper'>
                        <label htmlFor="username">Username: </label>
                        <input placeholder='Username' spellCheck={false} type="text" name="username" className="inputUsername" value={username} onChange={this.changeHandler} autoComplete="off" required/>
                        <br />
                        <label htmlFor="password">Password: </label>&nbsp;
                        <input placeholder="Password" spellCheck={false} type="password" name="password" className="inputPassword" value={password} onChange={this.changeHandler} autoComplete="off" required/>
                        <br /><br />
                        <button type="submit" className="buttonSubmit">Log in</button>
                        <br /><br />
                        Don't have an account? <NavLink to="/user/register" className="signUpRedirect">Sign up</NavLink>
                        <br /><br />
                    </div>
                    </form>
                    <div className="alert">
                            {error}
                        </div>
                </div>
        )
    }
}

export default Login;