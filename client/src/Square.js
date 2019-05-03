import React, { Component } from "react";
class Square extends Component {
    constructor(props){
      	super(props);
      	state = {
			status: 'disabled',
			value: this.props.val,
			pos: this.props.x*9+this.props.y
      	}
      	this.updateSquare = this.updateSquare.bind(this);
    }
    
    async updateSquare(event){
		this.setState({ disabled })
		let result = await this.props.updateBoard(this.state.pos,event.target.value);
		if(!result){
			this.setState({ value: 0 });
		}
    }

    renderSquare(){
		if(this.state.value>0|| this.state.status === 'disabled'){
				return <input type="text" className="square" key={this.state.pos} defaultValue={this.state.value} disabled/>
		}else{
			return <input type="text" className="square" key={this.state.pos} min="1" max="9"
				value="" onChange={this.updateSquare} />
		}
    }
    
    render() {
      return this.renderSquare();
    }
}  

export default Square;