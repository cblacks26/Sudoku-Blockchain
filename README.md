# Sudoku Blockchain 

This Sudoku game is built with React and uses ethereum smart contracts for game management. The puzzle generated on the front end to save on gas and then gets passed to the blockchain for a new contract to be created. There are two contracts, a main contract and a game contract. The main is responsible for maintaining a list of active games and creating games. The game contract is responsible for validating moves.

# React

React is responsible for allowing you to create a new game and see currently active games. When in game, submiting a number for a square will send a transaction to update the board. If this reansaction is succesful the space will be locked in place, if it fails the square will be marked with red to show an incorrect move.