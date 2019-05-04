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
			const instance = new web3.eth.Contract(Solved.abi,deployedNetwork && deployedNetwork.address,{
				defaultGas: 300000000000
			});

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
		let difficutly = 35;
		let board = randomPuzzle(difficutly);
		let count = 81-difficutly;
        let values = solve(board);
		let results = vals(values);
		let finished = "";
        let puzzle = "";
		for(let i = 0; i < board.length; i++){
			let puz = board[i];
			if(puz==='.'){
                puz = "0";
			}
			puzzle += puz;
			finished += results[i];
		}
        try{
            let createdGame = await this.state.contract.methods.createPuzzle(finished, puzzle, count).send({from:this.state.accounts[0]});
			this.setState({ game: createdGame });
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