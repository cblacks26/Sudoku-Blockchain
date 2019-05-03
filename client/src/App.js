import React, { Component } from "react";
import Board from "./Board";
import Start from "./Start";
import { randomPuzzle, randomInt, vals, solve } from "./SuGen";
import SudokuContract from "./contracts/Sudoku.json";
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
            const deployedNetwork = SudokuContract.networks[networkId];
            const instance = new web3.eth.Contract(SudokuContract.abi,deployedNetwork && deployedNetwork.address,);

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance }, this.getGame());
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
        let puzzle = [];
		let finished = [];
		for(let i = 0; i  < results.length; i++){
			let puzzleChar = board[i];
			let answerChar = results[i];
			if(puzzleChar!=='.'){
                puzzle.push(0);
            }else{
                puzzle.push(parseInt(puzzleChar));
			}
			finished.push(parseInt(answerChar));
		}
        try{
            let createdGame = await this.state.contract.methods.createGame(puzzle, finished, 20).send({from:this.state.accounts[0]});
            console.log("Created Game: "+createdGame);
            if(createdGame){
                this.joinGame(id);
            }
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