import React, { Component } from "react";
import cx from "classnames";
import style from "./style.css";

export default class Box extends Component {
  handleClick = () => {
    this.props.socketActions.syncReserve({
      boxId: this.props.id,
      userId: this.props.user.uid
    });
  }

  render() {
    const {
      reservedBox,
      selectedBox,
      user: {
        uid
      },
    } = this.props;
    const reservedAllBox = [];

    Object.keys(reservedBox).forEach(userId => {
      if (userId !== uid) {
        reservedAllBox.push(...reservedBox[userId])
      }
    });

    const isReserved = reservedAllBox.includes(this.props.id);
    const isSelected = selectedBox.includes(this.props.id);

    let parentClassName = cx({
      [style.wrap]: !isReserved && !isSelected,
      [style.isReserved]: isReserved,
      [style.isSelected]: isSelected,
    });

    return (
      <div
        className={parentClassName}
        onClick={this.handleClick}
      />
    )
  }
}
