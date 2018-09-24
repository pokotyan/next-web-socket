import React, { Component } from "react";
import Home from '../Home';
import css from "./style.css";

export default class Login extends Component {
  state = {
    signupEmail: '',
    signupPassword: '',
    signinEmail: '',
    signinPassword: ''
  }

  handleChange = (stateKey) => (event) => {
    this.setState({ [stateKey]: event.target.value })
  }

  signup = () => {
    const { signupEmail, signupPassword } = this.state;
    const { router, authActions } = this.props;

    authActions.signUp({
      email: signupEmail,
      password: signupPassword,
      router
    })
  }

  signin = () => {
    const { signinEmail, signinPassword } = this.state;
    const { router, authActions } = this.props;

    authActions.signIn({
      email: signinEmail,
      password: signinPassword,
      router
    })
  }

  signout = () => {
    this.props.authActions.signOut();
  }

  render() {
    const { email, password } = this.state;

    return (
      <div>
        <div className={css.center}>
          <input
            type={'text'}
            onChange={this.handleChange('signupEmail')}
            placeholder={'emal'}
            value={email}
          />
          <input
            type={'password'}
            onChange={this.handleChange('signupPassword')}
            placeholder={'password'}
            value={password}
          />
          <button
            onClick={this.signup}
          >サインアップ</button>
        </div>
        <div className={css.center}>
          <input
            type={'text'}
            onChange={this.handleChange('signinEmail')}
            placeholder={'emal'}
            value={email}
          />
          <input
            type={'password'}
            onChange={this.handleChange('signinPassword')}
            placeholder={'password'}
            value={password}
          />
          <button
            onClick={this.signin}
          >サインイン</button>
        </div>
        <button
          className={css.center}
          onClick={this.signout}
        >サインアウト</button>
      </div>
    )
  }
}
