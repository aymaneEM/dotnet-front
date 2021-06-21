import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import About from './Components/About';
import Accidents from './Components/Accidents';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Login from './Components/Login';

export default function App() {
  const [user, setUser] = useState({});
  useEffect(() => {
    async function getUser() {
      const response = await fetch('http://localhost:8000/api/user', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const content = await response.json();
      setUser(content);
    }
    getUser();
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Switch>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/login">
          <Login user={user} />
        </Route>
        <Route exact path="/accidents">
          <Accidents user={user} />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
