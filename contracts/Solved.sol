pragma solidity ^0.4.25;

contract Solved {
    // Data Types

    // Remember: simple variables can be viewed with a CALL without having to define a getter function

    address internal creator;
    string public initialPuzzle;
    string public solvedPuzzle;
    //Constructor

    // Set up state variables
    constructor() public{
        creator = msg.sender;
    }

    //functions

    function createPuzzle(string solution, string initial) public {
        address _addr = msg.sender;
        //set puzzle
        initialPuzzle = initial; //eg. ........7......12.................4..9..3....617...95....3........7.........5..6
        solvedPuzzle = solution; //eg. 916342758734856912528917643257189364489563271361724895695231487142678539873495126
    }


    function displayInitialPuzzle() public view returns(string){
        return initialPuzzle;
    }

    function displaySolvedPuzzle() public view returns(string){
        return solvedPuzzle;
    }


}
