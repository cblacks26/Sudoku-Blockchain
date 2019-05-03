import React, { Component } from "react";
import Board from "./Board";
import Start from "./Start";
import { randomPuzzle, randomInt, vals, solve } from "./SuGen";
import Solved from "./contracts/Solved.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
    constructor(props){
        super(props);
        this.state = { 
          web3: null,
          accounts: null,
          contract: null,
          game: null,
        };
        this.renderDisplay = this.renderDisplay.bind(this);
        this.createGame = this.createGame.bind(this);
    }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Solved.networks[networkId];
            const instance = new web3.eth.Contract(Solved.abi,deployedNetwork && deployedNetwork.address,);

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance });
			this.getGame();
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    async getGame() {
        const { accounts, contract } = this.state;
		let active = await contract.methods.checkActiveGame().call({ from: accounts[0] });
		this.setState({ game: active });
    };

    renderDisplay(){
        if(this.state.game===false){
            return <Start accounts={this.state.accounts} contract={this.state.contract}
                updateGame={this.state.updateGame} createGame={this.createGame} />
        }else{
            return <Board accounts={this.state.accounts} contract={this.state.contract} />
        }
    }

    async createGame(){
        let board = randomPuzzle(20);
        let values = solve(board);
        let results = vals(values);
        let puzzle = "";
		for(let char in board){
			let res = char;
			if(char==='.'){
                res = "0";
			}
			puzzle += res;
		}
        try{
            let createdGame = await this.state.contract.methods.createPuzzle(results, puzzle, 20).send({from:this.state.accounts[0]});
        }catch(err){
            console.log('Error: '+err);
        }
    }

    render() {
        if (!this.state.web3) {
            return <div className="container">Loading Web3, accounts, and contract...</div>;
        }else{
            return <div className="container">{this.renderDisplay()}</div>;
        }
    }
}

export default App;