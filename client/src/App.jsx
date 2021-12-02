import React,{ Component } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Note from './components/Note';
import List from './components/List';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import NoteDetail from './components/NoteDetail';
import ListDetail from './components/ListDetail';
import NewNote from './components/NewNote';
import NewList from './components/NewList';
import Archive from './components/Archive';
import Trash from './components/Trash';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
  <Route
    path={['/home', '/archive', '/note', '/list', '/trash']}
    component={Navbar}
  />
  <Switch>
    <Route path='/user/register' component={Register} />
    <Route path='/user/login' component={Login} />
    <Route path='/user/logout' component={Logout} />
    <Route path='/note/new' component={NewNote} />
    <Route path='/list/new' component={NewList} />
    <Route path='/note/:noteid' component={NoteDetail} />
    <Route path='/list/:listid' component={ListDetail} />
    <Route path='/home' component={Home} />
    <Route path='/archive' component={Archive} />
    <Route path='/note' component={Note} />
    <Route path='/list' component={List} />
    <Route path='/trash' component={Trash} />
    <Route component={Login} />
  </Switch>
</BrowserRouter>
    )
  }
}

export default App;