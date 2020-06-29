import React, { Component } from 'react'
import Feed from '../components/feed.component'
import LeftNav from '../components/left-nav.component'
import { Switch, Route, Redirect } from 'react-router-dom'
import Profile from './profile.component'
import { connect } from 'react-redux'
import Friends from './friends.component'
import News from './news.component'
import Chat from '../components/chat.component'
import NotFoundPage from '../components/not-found'

class Home extends Component {
  constructor() {
    super();
    this.state = {
      isMobile: window.innerWidth <= 600,
    };
  }

	handleWindowSizeChange = () => {
		if (window.innerWidth <= 600) {
		this.setState({ isMobile: true });
		} else {
		this.setState({ isMobile: false });
		}
	};

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }
  render() {
	const { currentUser } = this.props;
	const {isMobile} = this.state;
    return (
      <div className="home">
        <LeftNav isMobile={isMobile} />
        <Chat currentUser={currentUser} isMobile={isMobile} />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Feed currentUser={currentUser} {...props} />}
          />
          <Route
            exact
            path="/profile/:userId"
            render={(props) => <Profile currentUser={currentUser} />}
          />
          <Route
            path="/friends"
            render={(props) => <Friends currentUser={currentUser} {...props} />}
          />
          <Route
            path="/world-news"
            render={(props) => <News currentUser={currentUser} {...props} />}
          />
          <Route path="/404" component={NotFoundPage} />
          <Redirect to="/404" />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
	currentUser:  state.user.currentUser
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
