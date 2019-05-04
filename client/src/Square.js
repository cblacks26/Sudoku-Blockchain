import React, { Component } from "react";
class Square extends Component {
    constructor(props){
      	super(props);
      	this.updateSquare = this.updateSquare.bind(this);
    }
    
    async updateSquare(event){
		let result = await this.props.updateBoard(this.props.pos,event.target.value);
		if(!result){
			this.setState({ value: 0 });
		}
    }

    renderSquare(){
		let id = "cell-"+this.props.pos;
		let val = this.props.val;
		if(val==0) val="";
		if(this.props.value>0){
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