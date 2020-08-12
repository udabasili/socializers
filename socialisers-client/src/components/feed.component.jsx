import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addPost, getPosts,loadPosts } from '../redux/post/post.actions'
import ReactLoading from 'react-loading';
import Post from './post.component'
import Modal from './modal.component';
import Snackbar from "@material-ui/core/Snackbar";
import openSocket from 'socket.io-client';
import PostForm from './post-form.component';
import { addNotification, getNews, setUsers, notificationButton } from '../redux/user/user.actions';

class Feed extends Component {
  state = {
    showModal: false,
    editMode: false,
    vertical: 0,
    horizontal: 0,
    posts: null,
    open: false,
    successMessage: null
  };

  componentDidMount() {
    let url;
    if (process.env.NODE_ENV === "production") {
      url = "https://socializers-app.herokuapp.com/";
    } else {
      url = "http://localhost:8081";
    }

    this.socket = openSocket(url);
    this.socket.on("posts", (data) => {
      if (data.action === "updatedPosts") {
        this.props.loadPosts(data.updatedPost);
      }
    });
    this.socket.on("users", (data) => {
      if (data.action === "updatedUsers") {
        this.props.setUsers(data.updatedUsers);
      }
    });
    this.socket.on("notification", (data) => {
      this.props.addNotification(data.notification);
    });
    this.props.getPosts();
    this.props.getNews();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.posts !== this.props.posts) {
      this.setState((prevState, props) => ({
        ...prevState,
        posts: props.posts,
      }));
    }
  }

  componentWillUnmount() {
    this.socket.off("posts");
  }

  onChangeText = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      post: e.target.value,
    }));
  };

  editPostHandler = (value) => {
    this.setState((prevState) => ({
      ...prevState,
      showModal: true,
      editMode: true,
      currentPost: value,
    }));
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  showSnackHandler = (
    vertical = null,
    horizontal = null,
    successMessage = null,
    open
  ) => {
    this.setState((prevState) => ({
      ...prevState,
      vertical,
      horizontal,
      open,
      successMessage,
    }));
  };

  modalShowHandler = (
    value,
    vertical = null,
    horizontal = null,
    successMessage = null,
    open
  ) => {
    this.setState((prevState) => ({
      ...prevState,
      showModal: value,
      vertical,
      horizontal,
      open,
      successMessage,
    }));
  };

  render() {
    const {
      showModal,
      editMode,
      currentPost,
      posts,
      successMessage,
      vertical,
      horizontal,
      open,
	} = this.state;
	
	const { currentUser, notificationDropdown } = this.props
	
    return (
      <section className="feed-section">
        {open && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            autoHideDuration={6000}
            open={open}
            onClose={this.handleClose}
            message={successMessage}
            key={vertical + horizontal}
          />
        )}
        {showModal && (
          <Modal>
            <PostForm
              editMode={editMode}
              currentPost={currentPost}
              showModalHandler={this.modalShowHandler}
            />
          </Modal>
        )}
        <div
          className="post-box"
          onClick={() => notificationDropdown(true)}
        >
          <textarea
            placeholder="Add Post"
            onClick={() => this.modalShowHandler(true)}
            className="post-box__input"
            required
          />
        </div>
        {posts ? (
          posts.map((p, index) => {
            return (
              <Post
                key={index}
                post={p}
                showSnack={this.showSnackHandler}
                editPostHandler={this.editPostHandler}
                currentUser={currentUser}
              />
            );
          })
        ) : (
          <ReactLoading type="bars" color="#75a1f3" height={100} width={80} />
        )}
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
    posts: state.posts
})

const mapDispatchToProps = (dispatch) => ({
    addPost: (text) => dispatch(addPost(text)),
    getPosts : () => dispatch(getPosts()),
    getNews: () => dispatch(getNews()),
    loadPosts: (posts) => dispatch(loadPosts(posts)),
    setUsers: (users) => dispatch(setUsers(users)),
    addNotification: (notification) => dispatch(addNotification(notification)),
    notificationDropdown: (hideWindow) => dispatch(notificationButton(hideWindow)),
})
 
export default connect(mapStateToProps, mapDispatchToProps)(Feed)