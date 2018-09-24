import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import * as authActions from "./actions/auth";
import Login from './templates/Login';

class App extends Component {
  render() {
    const {
      router,
      authActions
    } = this.props;

    return (
      <Login 
        router={router}
        authActions={authActions}
      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));