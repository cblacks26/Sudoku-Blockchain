import React, { Component } from "react";
import { Button, Container, Jumbotron } from 'reactstrap';
class Start extends Component {
    constructor(props){
        super(props);
        this.state = {
            accounts: this.props.accounts,
            contract: this.props.contract
        };
        this.createGame = this.createGame.bind(this);
    }

    createGame(){
        this.props.createGame();
    }

    render(){
        return(
            <Jumbotron fluid>
                <Container fluid className="center">
                    <h1 className="display-2">Sudoku</h1>
                    <p className="lead">This is a straight forward sudoku game built using smart contracts, so expect almost everything to be a little slower</p>
                    <Button outline color="primary" onClick={this.createGame}>Create Game</Button>
                </Container>
            </Jumbotron> 
        );
    }
}export default Start;