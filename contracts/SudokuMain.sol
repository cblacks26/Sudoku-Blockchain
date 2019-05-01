pragma solidity ^0.4.25;


/*
 * Basic Workflow:
 * pre. buy tokens (minimum purchase amount = 10 finneys)
 * 1. Create Game
 * 2. Join game (with at least 1 finney), you can join the game until starttime+2mins
 * 3. Owner of the game starts the game, a game can be started after 2 mins of the creation and a player can submit an answer until starttime+15mins
 * 4. After 15 mins of the starting time of a game, an owner or the owner of the contract can close the game
 * 5. closing the game will redistribute the tokens
 * token is distributed to each spot in a sudoku board in a way that
 * each spot -> totalToken / 100 (let's 81*totaltoken/100 is assigned to the board)
 * remaining 19*totaltoken/100 will be rewareded to the winner or the owner of the contract after closing the game
 * if the puzzle is completely solved, remaning tokens will goes to the player with the highest score.
 * if the puzzle is not completely solved, remaining tokens will goes to the owner of the contract.
 * 
 * 1 token should be 1 finney, conversion should be done in the client side
 * when joining the game or purchasing some tokens, the number should be a positive integer greater than equal to 1
 * the gameID should be a positive integer greater than equal to 1
 * 
 * due to the lack of supports in solidity, we only tracks which spot is solved, and no intermediate puzzle status is maintained (eg. 1,0,0,1,0,0,0, ... ,1,0, 1 is already solved by players while 0 is not)
 * When creating a game, number of empty spots in initial puzzle status should be passed as well so we can figure out if the puzzle is completely solved or not
 *
 * might need to increase the gas limit before you run it on remix
 */
contract Sudoku {
    
    address internal contract_owner;

    uint private numGames = 0;
    uint private maxNumGames = 10;
    uint256 internal minimumPurchase = 10 finney; //minimum amount of token to buy token
    uint256 internal minimumGameToken = 1 finney; // minimum amount of token to join the game
    uint256 internal timeLimit = 15 minutes;
    uint256 internal contract_token = 0;

    SudokuGame[] private openGames;
    mapping(address => uint) private playerToGame;
    mapping(address => uint256) private playerToToken;
    
    event TokenPurchaseEvent(address, uint256);
    event TokenWithdrawalEvent(address, uint256);
    event ServiceEndEvent(address, uint256);
    
    enum GameState{
        CREATED,STARTED,CLOSED
    }
    
    struct SudokuGame{
        address owner; //owner
        uint gameID; // must be greater than 0
        string currentPuzzle; // initial status of puzzle;
        string solvedPuzzle; // solution of puzzle
        uint256 startTime; // start time (after startSudokuGame)
        uint256 joinableTime; // up to 2 minutes after start
        uint256 endTime; // 15 minutes after start
        uint256 totalToken; // total amount of token in a game
        uint256 remainingToken; // remaining token after assign tokens to each spot in sudoku grid
        uint256 tokenPerSpot;
        GameState state;
        address[] players;
        mapping(address => uint) playersCorrect;
        uint[81] isSpotSolved; // tracking if the spot is solved or not
        uint numEmptySpot; // number of empty spots in initial puzzle
    }
    
    /*
        need to buy in game token first
        Token needs to be in finney and should be integers (need to be forced and conversion should be done in client side)
    */
    function buyToken() payable public returns(bool) {
        require(msg.value >= 10 finney);
        if(playerToToken[msg.sender] > 0){
            playerToToken[msg.sender] += msg.value;   
        }else{
            playerToToken[msg.sender] = msg.value;
        }
        emit TokenPurchaseEvent(msg.sender,  msg.value);
        return true;
    }
    
    function checkToken() public view returns(uint256) {
        return playerToToken[msg.sender];
    }
    
    function withdrawToken() public returns(bool) {
        require(playerToToken[msg.sender] > 0);
        uint256 amount;
        amount = playerToToken[msg.sender];
        playerToToken[msg.sender] = 0;
        msg.sender.transfer(amount);
        emit TokenWithdrawalEvent(msg.sender, amount);
        return true;
    }
    
    function destructContract() public returns(bool) {
        require(msg.sender == contract_owner);
        uint amount;
        amount = contract_token;
        contract_owner.transfer(amount);
        emit ServiceEndEvent(contract_owner, now);
        selfdestruct(contract_owner);
        return true;
    }
    
    /*
        Token needs to be in finney and should be integers (need to be forced and conversion should be done in client side)
    */
    function createSudokuGame(uint _gameID, string _initialPuzzle, string _solvedPuzzle, uint _numEmptySpot) public returns(bool) {
        require(openGames.length<maxNumGames);
        SudokuGame storage game;
        game.owner = msg.sender;
        game.gameID = _gameID;
        game.currentPuzzle = _initialPuzzle;
        game.solvedPuzzle = _solvedPuzzle;
        game.startTime = now;
        game.joinableTime = game.startTime + 2 minutes;
        game.endTime = game.startTime + 15 minutes;
        game.totalToken = 0;
        game.remainingToken = 0;
        game.tokenPerSpot = 0;
        game.state = GameState.CREATED;
        game.tokenPerSpot = 0;
        game.numEmptySpot = _numEmptySpot;
        
        for (uint i=0; i<81; i++){
            game.isSpotSolved[i] = 0; // 0 => not solved, 1 => sovled, if number of 1s in this array is equal to numEmptySpot, the puzzle is solved
        }
        openGames.push(game);
        return true;
    }
    
    // after creating the game, you need to start a game after 2 mins
    function startSudokuGame(uint _gameID) public returns(bool){
        for (uint i = 0; i < openGames.length; i++){
            if((openGames[i].owner == msg.sender) && (openGames[i].gameID == _gameID) && openGames[i].joinableTime < now){
                openGames[i].state = GameState.STARTED;
                openGames[i].startTime = now;
                openGames[i].endTime = openGames[i].startTime + 15 minutes;
                return true;
            }
        }
        return false;
    }
    
    // joining an exisiting game with 
    function joinSudokuGame(uint _gameID, uint256 _token) public returns(bool) {
        require((_token > minimumGameToken) && (playerToToken[msg.sender]>_token));
        for (uint i = 0; i < openGames.length; i++){
            if((playerToGame[msg.sender] == 0) && (openGames[i].gameID == _gameID) && (openGames[i].joinableTime > now)){
                playerToGame[msg.sender] = _gameID;
                playerToToken[msg.sender] -= _token;
                openGames[i].players.push(msg.sender);
                openGames[i].playersCorrect[msg.sender] = 0;
                openGames[i].totalToken += _token;
                openGames[i].tokenPerSpot = openGames[i].totalToken/100; // need to perform safe math in the future
                openGames[i].remainingToken = openGames[i].totalToken - openGames[i].tokenPerSpot*81;
                return true;
            }
        }
        return false;
    }
    
    // retrieve all the tokens and assign them to the appropriate owner
    function closeSudokuGame(uint _gameID) public returns(bool) {
        uint256 tmpindex = maxNumGames+1;
        for (uint i = 0; i < openGames.length; i++){
            if((openGames[i].gameID == _gameID) && (openGames[i].endTime < now) && ((openGames[i].owner == msg.sender) || (msg.sender == contract_owner))){
                address winner;
                uint256 winningscore = 0;
                uint256 numSolved = 0;
                // give players tokens that are assinged to the spot where they correctly guessed
                for (uint j = 0; j < openGames[i].players.length; j++){
                    uint256 sumToken = 0;
                    sumToken+=openGames[i].playersCorrect[openGames[i].players[j]] * openGames[i].tokenPerSpot;
                    numSolved += openGames[i].playersCorrect[openGames[i].players[j]];
                    openGames[i].playersCorrect[openGames[i].players[j]] = 0;
                    playerToToken[openGames[i].players[j]] += sumToken;
                    if(sumToken >= winningscore){
                        winner = openGames[i].players[j]; // try to find a player with max score
                    }
                    playerToGame[openGames[i].players[j]] = 0;
                }
                uint256 tmpamount = openGames[i].remainingToken;
                for (uint k = 0; k <81; k++) {
                    tmpamount += (81-numSolved) * openGames[i].tokenPerSpot; // retrieve tokens assigned to already filled spots
                }
                if (numSolved == openGames[i].numEmptySpot) {
                    // if the game is comepletely solved -> a player with max score takes remainingtoken
                    openGames[i].remainingToken = 0;
                    playerToToken[winner] += tmpamount;
                }else{
                    // if a puzzle is not solved, contract owner takes the remaining token
                    openGames[i].remainingToken = 0;
                    contract_token += tmpamount;
                }
                tmpindex = i;
            }
        }
        if (tmpindex > maxNumGames){
            return false;
        }else{
            for (uint n = tmpindex; n < openGames.length-1; n++){
                openGames[n] = openGames[n+1];
            }
            delete openGames[openGames.length-1];
            openGames.length--;
            return true;
        }
    }
    
    function submitAnswer(uint _pos, string _answer) public returns(bool){
        for (uint i = 0; i < openGames.length; i++){
            if((openGames[i].gameID == playerToGame[msg.sender]) && (openGames[i].endTime > now)){
                string memory a = substring(openGames[i].solvedPuzzle, _pos, _pos+1);
                string memory b = _answer;
                if (keccak256(abi.encodePacked(a))==keccak256(abi.encodePacked(b)) && (openGames[i].isSpotSolved[_pos] == 0)){
                    openGames[i].isSpotSolved[_pos] = 1;
                    openGames[i].playersCorrect[msg.sender] += 1;
                    return true;
                }
            }
        }
        
        return false;
    }
    
    function getCurrentPuzzleStatus() public view returns(uint[81]) {
        for (uint i = 0; i < openGames.length; i++){
            if(openGames[i].gameID == playerToGame[msg.sender]){
                return openGames[i].isSpotSolved;
            }
        }
    }
    
    function isGameOpen(uint _gameID) public view returns(bool) {
        for (uint i = 0; i < openGames.length; i++){
            if(openGames[i].gameID == playerToGame[msg.sender]){
                return true;
            }
        }
        return false;
    }
    
    function getTokenPerSpot(uint _gameID) public view returns(uint256) {
        for (uint i = 0; i < openGames.length; i++){
            if(openGames[i].gameID == _gameID){
                return openGames[i].tokenPerSpot;
            }
        }
        return 0;
    }
    
    function getGameReward(uint _gameID) public view returns(uint256) {
        for (uint i = 0; i < openGames.length; i++){
            if(openGames[i].gameID == _gameID){
                return openGames[i].remainingToken;
            }
        }
        return 0;
    }
    
    function getJoinableGames() public returns(uint[]) {
        uint[] tmplist;
        for (uint i = 0; i < openGames.length; i++){
            if((openGames[i].state == GameState.CREATED) && (openGames[i].joinableTime > now)){
                tmplist.push(openGames[i].gameID);
            }
        }
        return tmplist;
    }
    
    function getClosedGames() public returns(uint[]) {
        uint[] tmplist;
        for (uint i = 0; i < openGames.length; i++){
            if(openGames[i].endTime < now){
                tmplist.push(openGames[i].gameID);
            }
        }
        return tmplist;
    }
    
    function substring(string str, uint startIndex, uint endIndex) private constant returns (string) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }
}