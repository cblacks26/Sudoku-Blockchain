import React, { Component } from "react";
class Square extends Component {
    constructor(props){
      super(props);
      this.updateSquare = this.updateSquare.bind(this);
    }
    
    updateSquare(event){
      this.props.updateBoard(this.props.x,this.props.y,event.target.value);
    }

    renderSquare(){
      if(this.props.val>0){
        return <input type="text" className="square" key={this.props.x+":"+this.props.y} defaultValue={this.props.val} disabled/>
      }else{
        return <input type="text" className="square" key={this.props.x+":"+this.props.y} min="1" max="9" onChange={this.updateSquare} />
      }
    }
    
    render() {
      return this.renderSquare();
    }
}  

export default Square;