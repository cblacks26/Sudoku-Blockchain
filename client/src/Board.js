import React, { Component } from "react";
import Square from "./Square";
class Board extends Component {
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
	
	async componentDidMount(){
		try{
			let board = await this.props.contract.methods.displayInitialPuzzle().call({from:this.props.accounts[0]});
			let pos = [];
			let index = 0;
			while(index<board.length){
				let temp = [];
				while(temp.length<9){
					temp.push(board[index]);
					index++;
				}	
				pos.push(temp);
			}
			this.setState({ positions:pos });
		}catch(err){
			console.log(err);
		}
	}
    
    updateBoard(pos,value){
      	try {
        	this.props.contract.methods.makeMove(pos,value).send({
            	from: this.props.accounts[0]
        	});
      	} catch (err) {
          	console.log("Failed to make move");
      	}
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