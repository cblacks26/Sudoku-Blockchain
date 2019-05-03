import React, { Component } from "react";
import Square from "./Square";
class Board extends Component {
    constructor(props){
      	super(props);
      	this.state = {
        	positions: []
      	}
	}
	
	async componentDidMount(){
		try{
			let board = await this.props.contract.methods.displayInitialPuzzle().call({from:this.props.accounts[0]});
			let pos = [];
			let index = 0;
			for(let char in board){
				let val = parseInt(char);
				pos.push(val);
			}
			this.setState({ positions:pos });
		}catch(err){
			console.log(err);
		}
	}
    
    async updateBoard(pos,value){
      	try {
        	let result = await this.props.contract.methods.makeMove(pos,value).send({
            	from: this.props.accounts[0]
			});
			if(result){
				this.setState(prevState => ({
					positions: {
						...prevState.positions,
						[prevState.positions[pos]]: value,
					},
				}));
			}
      	} catch (err) {
          	console.log("Failed to make move");
      	}
    }
  
    renderBlock(block){
		let result = [];
		let offset = block*9;
		for(let i = offset; i < offset+9;i++){
			result.push(this.renderSquare(i));
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
			result.push(this.renderBlock(i));
		}
		return (
			<tr>
				{result}
			</tr>
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