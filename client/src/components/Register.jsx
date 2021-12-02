import React,{ Component } from 'react';
import './css/Register.css';
import axios from 'axios';
import { Redirect, NavLink } from 'react-router-dom';

class Login extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            password: '',
            password2:'',
            error:'',
            first_name: '',
            last_name: '',
            redirectLoggedIn:false,
            redirectSuccess: false,
            email:''
        }
    }    
    changeHandler = (e)=>{
        this.setState({[e.target.name]: e.target.value})
    }

    submitHandler = (e)=>{
        e.preventDefault();
        axios.post('/user/register', this.state)
            .then((response)=>{
                if(response.data.error){
                    this.setState({
                        error: response.data.error,
                        password: '',
                        password2: '',
                        username:''
                    })
                }else{
                    this.setState({
                        username:'',
                        password:'',
                        password2:'',
                        redirectSuccess:true
                    })
                }
            })
            .catch((err)=>{
                this.setState({
                    error: 'Error in saving to database'
                })
            })
    }
    componentDidMount(){
        axios.get('/user/register')
            .then((response)=>{
                if(JSON.parse(response.request.response)["msg"]!=='Registration Page'){
                    this.setState({
                        redirectLoggedIn:true
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    render(){
        const {username, password, email, first_name, last_name, error, password2} = this.state;
        return(
                <div className="form">
                <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@500&display=swap" rel="stylesheet" />
                {this.state.redirectLoggedIn && <Redirect push to='/home' />}
                {this.state.redirectSuccess && <Redirect push to='/user/logout' />}
                <br /><br /><br /><br />
                    <form action="/user/login" method="POST" onSubmit={this.submitHandler}>
                    <div className='register-input-wrapper'>
                        <label htmlFor="first_name">First Name: </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input placeholder='First Name' spellCheck={false} className="inputRegister" type="text" name="first_name" value={first_name} onChange={this.changeHandler} autoComplete="off" required/>
                        <br />
                        <label htmlFor="last_name">Last Name: </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input placeholder="Last Name" spellCheck={false} type="text" className="inputRegister" name="last_name" value={last_name} onChange={this.changeHandler} autoComplete="off" required/>
                        <br /><br />
                        <label htmlFor="email">Email: </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input placeholder='Email' spellCheck={false} type="email" className="inputRegister" name="email" value={email} onChange={this.changeHandler} autoComplete="off" required/>
                        <br />
                        <label htmlFor="username">Username: </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input placeholder='Username' spellCheck={false} type="text" className="inputRegister" name="username" value={username} onChange={this.changeHandler} autoComplete="off" required/>
                        <br />
                        <label htmlFor="password">Password: </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input placeholder='Password' spellCheck={false} type="password" className="inputRegister" name="password" value={password} onChange={this.changeHandler} autoComplete="off" required/>
                        <br />
                        <label htmlFor="password2">Confirm Password: </label>
                        <input placeholder='Confirm Password' spellCheck={false} className="inputRegister" type="password" name="password2" value={password2} onChange={this.changeHandler} autoComplete="off" required/>
                        <br /><br />
                        <button className="register" type="submit">Sign Up</button>
                        <br /><br />
                        Have an Account? <NavLink to="/user/login" className="loginRedirect">Log in</NavLink>
                        <br /><br />
                    </div>
                    </form>
                    <div className="register-alert">
                            {error}
                        </div>
                </div>
        )
    }
}

export default Login;