import React, {Component} from "react";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as socketActions from "../../actions/socket";
import css from "./style.css";
import Box from './box';

export default class Home extends Component {
  render() {
    return (
      <div className={css.container}>
        {_.range(15).map(id => (
          <Box
            id={id}
            key={id}
            user={this.props.user}
            reservedBox={this.props.socket.reservedBox}
            selectedBox={this.props.socket.selectedBox}
            socketActions={this.props.socketActions}
          />
        ))}
      </div>
    )
  }
}
