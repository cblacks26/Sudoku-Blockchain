pragma solidity ^0.4.25;

contract Solved {
    // Data Types

    // Remember: simple variables can be viewed with a CALL without having to define a getter function

    address internal creator;
    // uint256[] initialPuzzle;
    string initialPuzzle;
    string solutionPuzzle;
    // mapping (uint => uint) initialPuzzle;
    // mapping (uint => uint) solutionPuzzle;
    // uint256[] solutionPuzzle;
    uint empty;
    bool activeGame;
    //Constructor

    // Set up state variables
    constructor() public{
        creator = msg.sender;
    }

    //functions

    function createPuzzle(string solution, string initial, uint initialempty) public {
        //set puzzle
        solutionPuzzle = solution;
        initialPuzzle = initial;
        // initialPuzzle = initial;
        // solutionPuzzle = solution;
        empty = initialempty;
        activeGame = true;
    }


    function displayInitialPuzzle() public view returns(string){
        return initialPuzzle;
        // uint256[] ret;
        // for(uint i =0; i<81; i++ ){
        //     ret[i] = initialPuzzle[i];
        // }
        // return ret;
    }

    function substring(string str, uint startIndex, uint endIndex) private constant returns (string) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }

    function displaySolvedPuzzle() public view returns(string){
        return solutionPuzzle;
    }

    function makeMove(uint256 pos, string x) public returns(bool){
        string memory compare = substring(solutionPuzzle, pos, pos+1);
        if((keccak256(abi.encodePacked(compare))==keccak256(abi.encodePacked(x)))){
            empty--;
            if(empty==0){
                endGame();
                return true;
            }
            initialPuzzle = strConcat(substring(initialPuzzle, 0, pos), x, substring(initialPuzzle, pos+1, bytes(initialPuzzle).length));
            return true;
        }
        return false;
    }

    function checkActiveGame() view returns(bool){
        return activeGame;
    }

    function endGame(){
        activeGame = false;
        initialPuzzle = "";
        solutionPuzzle = "";
    }

    function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){ //https://ethereum.stackexchange.com/questions/729/how-to-concatenate-strings-in-solidity
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string _a, string _b, string _c) internal returns (string) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string _a, string _b) internal returns (string) {
        return strConcat(_a, _b, "", "", "");
    }


}
