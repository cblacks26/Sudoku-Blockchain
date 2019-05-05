import React, { Component } from "react";
import Square from "./Square";
import { Alert } from 'reactstrap';
class Board extends Component {
    constructor(props){
      	super(props);
      	this.state = {
			positions: [],
			messages: []
		}
		this.updateBoard = this.updateBoard.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.renderMessages = this.renderMessages.bind(this);
		this.removeMessage = this.removeMessage.bind(this);
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

	removeMessage(message){
		let newMsg = [...this.state.messages];
		for(let i = 0; i < newMsg.length; i++){
			if(newMsg[i] === message){
				newMsg.splice(i,1);
				break;
			}
		}
		this.setState({messages: newMsg});
	}

	addMessage(message){
		let newMsg = [...this.state.messages];
		newMsg.push(message);
		this.setState({messages: newMsg});
	}
    
    async updateBoard(pos,value){
      	try {
			let submission = 'warning:Submitted value '+value+' at position '+pos;
			this.addMessage(submission);
        	 await this.props.contract.methods.makeMove(pos,value).send({
            	from: this.props.accounts[0]
			});
			this.removeMessage(submission);
			let board = await this.props.contract.methods.displayInitialPuzzle().call({from:this.props.accounts[0]});
			if(board[pos]===value){
				let newPos = [...this.state.positions];
				newPos[pos] = value;
				this.setState({positions: newPos});
				let msg = 'success:'+value+' at position '+pos+' is correct'
				await this.addMessage(msg);
				setTimeout(this.removeMessage,10000,msg);
				return true;
			}else{
				let msg ='danger:'+value+' at position '+pos+' is incorrect';
				await this.addMessage(msg);
				setTimeout(this.removeMessage,10000,msg);
				return false;
			}
      	} catch (err) {
			  console.log(err);
			  return false;
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
	
	renderMessages(){
		let messages = [];
		for(let i = 0; i < this.state.messages.length; i++){
			let split = this.state.messages[i].split(":");
			messages.push(<Alert color={split[0]}>{split[1]}</Alert>);
		}
		return messages;
	}
  
    render() {
      	return (
			<div className="game-container">
				<table>
					{this.renderBoard()}
				</table>
				<div className='messages'>
					{this.renderMessages()}
				</div>
			</div>
		);
    }
}
export default Board;