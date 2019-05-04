import React, { Component } from "react";
import Square from "./Square";
class Board extends Component {
    constructor(props){
      	super(props);
      	this.state = {
        	positions: []
		}
		this.updateBoard = this.updateBoard.bind(this);
	}
	
	async componentDidMount(){
		try{
			let board = await this.props.contract.methods.displayInitialPuzzle().call({from:this.props.accounts[0]});
			let pos = [];
			for(let i = 0; i < board.length;i++){
				let val = parseInt(board[i]);
				pos.push(val);
			}
			this.setState({ positions:pos });
		}catch(err){
			console.log(err);
		}
	}
    
    async updateBoard(pos,value){
      	try {
			console.log(typeof pos)
			console.log(typeof value)
			console.log("Move at "+pos+" Value: "+value)
        	let result = await this.props.contract.methods.makeMove(pos,value).send({
            	from: this.props.accounts[0]
			});
			console.log(result);
			if(result){
				let newPos = [...this.state.positions];
				newPos[pos] = value;
				this.setState({positions: newPos});
			}
      	} catch (err) {
          	console.log(err);
      	}
    }
  
    renderBlock(block){
		let result = [];
		let offset = block*9;
		for(let i = offset; i < offset+9;i++){
			result.push(this.renderSquare(i));
		}
		return (
			<tr>
				{result}
			</tr>
		);
    }
    
    renderBoard(){
		let result= [];
		for(let i = 0; i < 9;i++){
			result.push(this.renderBlock(i));
		}
		return (
			<table>
				{result}
			</table>
		);
    }
    
    renderSquare(i) {
      	return <Square pos={i} val={this.state.positions[i]} updateBoard={this.updateBoard} />;
    }
  
    render() {
      	return (
			<table>
				{this.renderBoard()}
			</table>
		);
    }
}
export default Board;