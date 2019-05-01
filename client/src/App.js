import React, { Component } from "react";
import Board from "./Board";
import Start from "./Start";
import SuGen from "./SuGen";
import SudokuContract from "./contracts/Sudoku.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  constructor(props){
    super(props);
    this.state = { 
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      game: null,
      tokens: 0
    };
    this.getTokens = this.getTokens.bind(this);
    this.renderDisplay = this.renderDisplay.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
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
      this.setState({ web3, accounts, contract: instance }, this.getTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  async getTokens() {
    const { accounts, contract } = this.state;
    let tokens = await contract.methods.checkToken().call({ from: accounts[0] });
    console.log(tokens);
    this.setState({ tokens: tokens });
  };

  renderDisplay(){
    if(this.state.game===null){
      return <Start accounts={this.state.accounts} contract={this.state.contract}
            updateGame={this.state.updateGame} createGame={this.createGame} />
    }else{
      return <Board accounts={this.state.accounts} contract={this.state.contract} />
    }
  }

  updateGame(game){
    this.setState({ game: game });
  }

  joinGame(id){
    let joinedGame = this.state.contract.method.joinGame(id,1).send({from:this.state.accounts[0]});
    if(joinedGame) this.setState({ game:id });
    else this.setState({ error: "Was unable to join game"});
    return joinedGame;
  }

  createGame(){
      try{
        let tokens = this.state.contract.methods.checkToken().call({
          from: this.state.accounts[0]
        });
        console.log("Tokens: "+tokens);
        let board = SuGen.randomPuzzle(10);
        let values = SuGen.solve(board);
	      let results = SuGen.vals(values);
        let id = SuGen.randomInt(1,10000);
        let count = 0;
        for(let char in board){
          if(char!=='.')count++;
        }
        let createdGame = this.state.contract.methods.createSudokuGame(id, board, results, count).send({from:this.state.accounts[0]});
        console.log("Created Game: "+createdGame);
        if(createdGame){
          this.state.contract.method.startGame(id).send({from:this.state.accounts[0]});
          if(tokens<2){
            this.state.contract.method.buyToken().send({from:this.state.accounts[0], value:10});
          }
          this.joinGame(id);
        }
      }catch(err){
        console.log(err);
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