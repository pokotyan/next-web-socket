import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import * as socketActions from "./actions/socket";
import Home from './templates/Home';

class App extends Component {
  componentDidMount() {
    const { auth, router, socketActions } = this.props;

    if (!auth.isAutherized) {
      router.push('/login');
    } else {
      socketActions.initSocket({
        userId: auth.user.uid
      });
    }
  }

  render() {
    const { auth } = this.props;

    return (auth.isAutherized &&
      <Home 
        socket={this.props.socket}
        user={this.props.auth.user}
        socketActions={this.props.socketActions}
      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  socket: state.socket,
});

const mapDispatchToProps = dispatch => ({
  socketActions: bindActionCreators(socketActions, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));