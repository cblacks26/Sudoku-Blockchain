pragma solidity ^0.4.25;

contract Solved {
    // Data Types

    // Remember: simple variables can be viewed with a CALL without having to define a getter function

    address internal creator;
    uint256[] initialPuzzle;
    uint256[] solutionPuzzle;
    uint empty;
    bool activeGame;
    //Constructor

    // Set up state variables
    constructor() public{
        creator = msg.sender;
    }

    //functions

    function createPuzzle(uint256[] solution, uint256[] initial, uint initialempty) public {
        //set puzzle
        initialPuzzle = initial;
        solutionPuzzle = solution;
        empty = initialempty;
        activeGame = true;
    }


    function displayInitialPuzzle() public view returns(uint256[]){
        return initialPuzzle;
    }

    function displaySolvedPuzzle() public view returns(uint256[]){
        return solutionPuzzle;
    }

    function makeMove(uint pos, uint256 x) public returns(bool){
        if(solutionPuzzle[pos-1] == x){
            empty--;
            if(empty==0){
                endGame();
                return true;
            }
            return true;
        }
        return false;
    }

    function checkActiveGame() view returns(bool){
        return activeGame;
    }

    function endGame(){
        activeGame = false;
        initialPuzzle = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        solutionPuzzle = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }




}
