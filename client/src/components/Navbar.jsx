import React, { Component } from "react";
import './css/Navbar.css';
import { NavLink } from 'react-router-dom';

class Navbar extends Component {
    render() {
        return (
            <div>
                <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@500&display=swap" rel="stylesheet" />
                <div className="topnavbar">
                    <div className="topnavbar-right">
                        <NavLink to='/user/logout' className="logout">
                            Logout
                        </NavLink>
                    </div>
                </div>
                <div className="sidehoverbar"> 
                    <NavLink to="/home" className="home">
                        Home
                        <i className="material-icons-outlined md-42">emoji_objects</i> 
                    </NavLink> 
                    
                    <NavLink to="/note" className="note"> 
                        Notes
                        <i className="material-icons-outlined md-42">note</i> 
                    </NavLink> 
                    
                    <NavLink to="/list" className="list"> 
                        Lists 
                        <i className="material-icons-outlined md-42">playlist_add_check</i> 
                    </NavLink>
                    
                    <NavLink to="/archive" className="archive"> 
                        Archive
                        <i className="material-icons-outlined md-42">archive</i> 
                    </NavLink>
                    
                    <NavLink to="/trash" className="trash"> 
                        Trash
                        <i className="material-icons-outlined md-42">delete</i> 
                    </NavLink>
                </div> 
            </div>
        );
    }
}

export default Navbar;