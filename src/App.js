import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Accidents from './Components/Accidents';
import Login from './Components/Login';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Footer from "./Components/Footer/Footer"
import { Link } from "react-router-dom"
import Ongoing from "./Components/Ongoing"
import Pending from "./Components/Pending"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Avatar, Text } from "@chakra-ui/react"
import ListIcon from '@material-ui/icons/List';
import TimerIcon from '@material-ui/icons/Timer';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Generate from "./Components/Generate"
import BallotIcon from '@material-ui/icons/Ballot';
const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: "linear-gradient(0deg, #e0b3ff 20%, #e0b3ff 100%)"
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  logout: {
    position: "fixed",
    bottom: "0",

  },
  profile: {
    margin: "0 auto",
    padding: "10px",
  }
}));

export default function App() {
  const classes = useStyles();
  const [passedDown, setPassedDown] = useState(false);

  const [user, setUser] = useState({});
  useEffect(() => {
    async function getUser() {
      const response = await fetch('http://localhost:8000/api/user', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const content = await response.json();
      if (content?.id) {
        setPassedDown(true);
        setUser(content)
      }
    }
    getUser();
  }, []);

  const logout = async () => {
    await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(res => {
      if (res?.status === 200) {
        setTimeout(() => { window.location.reload() }, 1000)
      }
    });
  };

  return (
    <BrowserRouter>
      <Route exact path="/">
        <Login passedDown={passedDown} />
      </Route>
      <div className={classes.root}>
        <CssBaseline />
        {passedDown && <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <div className={classes.profile}>
            <Avatar size="2xl" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" style={{ "marginBottom": "20px" }} />

            <Text fontSize="lg" fontWeight="bold">{user?.name}</Text>
            <Text fontSize="lg" fontWeight="bold" style={{ "marginBottom": "50px" }}>{user?.email}</Text>
          </div>
          <List>
            <Divider />
            <Link to="/pending">
              <ListItem button>
                <TimerIcon style={{ "marginRight": "20px" }} />
                <ListItemText primary="Pending Alerts" />
              </ListItem>
            </Link>
            <Divider />
            <Link to="/ongoing">
              <ListItem button>
                <ErrorOutlineIcon style={{ "marginRight": "20px" }} />
                <ListItemText primary="Ongoing Alerts" />
              </ListItem></Link>
            <Divider />
            <Link to="/accidents">
              <ListItem button>
                <ListIcon style={{ "marginRight": "20px" }} />
                <ListItemText primary="Alerts Log" />
              </ListItem>
            </Link>
            <Divider />
            <Link to="/generate">
              <ListItem button>
                <BallotIcon style={{ "marginRight": "20px" }} />
                <ListItemText primary="Generate csv" />
              </ListItem>
            </Link>
            <Divider />
            <div className={classes.logout}>
              <Divider />
              <ListItem button onClick={logout}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Logout" /></ListItem></div>
          </List>


        </Drawer>}

        <main className={classes.content}>

          {/* <Navbar user={user} /> */}
          <Switch>
            <Route exact path="/accidents">
              <Accidents passedDown={passedDown} />
            </Route>
            <Route exact path="/pending">
              <Pending passedDown={passedDown} />
            </Route>
            <Route exact path="/ongoing">
              <Ongoing passedDown={passedDown} />
            </Route>
            <Route exact path="/generate">
              <Generate passedDown={passedDown} />
            </Route>
          </Switch>
        </main>
      </div>
      {!passedDown && <Footer />}

    </BrowserRouter >
  );
}
