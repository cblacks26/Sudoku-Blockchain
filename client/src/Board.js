import React, { Component } from "react";
import Square from "./Square";
class Board extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        positions: [
          [1,2,3,4,5,6,7,8,9],
          [1,2,3,4,5,6,7,8,9],
          [1,2,3,4,5,6,7,8,9],
          [1,2,3,4,5,6,7,8,9],
          [1,2,3,4,5,6,7,8,9],
          [1,2,3,4,5,6,7,8,9],
          [1,2,3,4,5,6,7,8,9],
          [1,2,3,4,5,6,7,8,9],
          [1,2,3,4,5,6,7,8,9]
        ]
      }
    }
    
    updateBoard(x,y,value){
      
    }
  
    renderBlock(x,block){
      let result = [];
      for(let i = 0; i < block.length;i++){
        result.push(this.renderSquare(x,i,block[i]));
      }
      return (
        <div className="block">
            {result}
        </div>
      );
    }
    
    renderBoard(){
      let result= [];
      for(let i = 0; i < this.state.positions.length;i++){
        result.push(this.renderBlock(i,this.state.positions[i]));
      }
      return (
        <div className="block">
            {result}
        </div>
      );
    }
    
    renderSquare(x,y,i) {
      return <Square x={x} y={y} val={i} updateBoard={this.updateBoard} />;
    }
  
    render() {
      return (
        <div className="game-board">
          {this.renderBoard()}
        </div>
      );
    }
}
export default Board;