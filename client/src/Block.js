import { Component } from React;

class Block extends Component{
    state = {
        positions: []
    }

    constructor(props){
        
    }

    render(){
        let output;
        for(let space in positions){
            output += <td>space</td>
        }
    }
}