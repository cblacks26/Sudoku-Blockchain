import React, { Component } from "react";
class Square extends React.Component {
    constructor(props){
      super(props);
      this.updateSquare = this.updateSquare.bind(this);
    }
    
    updateSquare(event){
      this.props.updateBoard(this.props.x,this.props.y,event.target.value);
    }
    
    render() {
      return (
          <input type="text" className="square" key={this.props.x+":"+this.props.y} value={this.props.val} onChange={this.updateSquare} />
      );
    }
}  

export default Square;