import React, { Component } from "react";
class Square extends Component {
    constructor(props){
		  super(props);
		  this.state ={
			  disabled: false
		  }
      	this.updateSquare = this.updateSquare.bind(this);
    }
    
    async updateSquare(event){
		event.target.blur();
		this.setState({ disabled:true });
		await this.props.updateBoard(this.props.pos,event.target.value);
		this.setState({ disabled:false });
    }

    renderSquare(){
		let id = "cell-"+this.props.pos;
		let val = this.props.val;
		if(val==0) val="";
		if(this.props.value>0||this.state.disabled){
				return <input type="text" id={id} key={this.props.pos} defaultValue={val} disabled/>
		}else{
			return <input type="text" id={id} pattern="[1-9]{1}" min="1" max="9"
				value={val} onChange={this.updateSquare} />
		}
    }
    
    render() {
      	return (<td>{this.renderSquare()}</td>);
    }
}  

export default Square;