var SudokuMain = artifacts.require("Sudoku");

module.exports = function(deployer) {
  deployer.deploy(SudokuMain);
};