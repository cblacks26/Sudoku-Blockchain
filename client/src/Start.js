import React, { Component } from "react";
class Start extends Component {
    constructor(props){
        super(props);
        this.state = {
            accounts: this.props.accounts,
            contract: this.props.contract,
            games: null
        };
        this.findGames = this.findGames.bind(this);
        this.renderGames = this.renderGames.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.createGame = this.createGame.bind(this);
    }

    async findGames(){
        try{
            var games = await this.props.contract.methods.getJoinableGames().call({
                from: this.props.accounts[0]
            });
            this.setState({ 
                games: games
            });
        }catch (err) {
            this.setState({ errorMessage: err.message });
        }
    }

    updateGame(event){
        this.props.updateGame(event.target.value);
    }

    createGame(){
        this.props.createGame();
    }

    renderGames(){
        let games = [];
        for(let game in this.state.games){
            games.push(<li><button onClick={this.updateGame} value={game}>{game}</button></li>)
        }
        return games;
    }

    render(){
        return(
            <div className="welcome">
                <div className="col">
                    <ul>
                        {this.renderGames()}
                    </ul>
                </div>
                <div className="col">
                    <button onClick={this.createGame}>Create Game</button>
                </div>
            </div>
        );
    }
}export default Start;