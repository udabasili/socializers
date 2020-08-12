import React, { Component } from 'react'
import Feed from '../components/feed.component'
import LeftNav from '../components/left-nav.component'
import { Switch, Route, Redirect } from 'react-router-dom'
import Profile from './profile.component'
import { connect } from 'react-redux'
import Friends from './friends.component'
import News from './news.component'
import NotFoundPage from '../components/not-found'

class Home extends Component {

  render() {

	const { currentUser, isMobile } = this.props;
    return (
      <div className="home">
        <LeftNav isMobile={isMobile} />
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


export default connect(mapStateToProps, null)(Home)
