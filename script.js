var origBoard;//Board Variable
const huPlayer='O';//human player is assigned O
const aiPlayer='X';//ai player is assigned X
const winCombos=[  //all winning combinations are put in an array
    [0,1,2],
      // 0, 1, 2 represents cell number here
    [3,4,5],
    [6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]
]
const cells=document.querySelectorAll('.cell');// cells variable stores reference to cell element
startGame(); //CREATED a start game func
function startGame(){  //operation when the game starts and also comes into picture when reset
 document.querySelector(".endgame").style.display="none" ;//query selector is used to select endgame and set its display to none
 origBoard=Array.from(Array(9).keys()); //creating an array of 9 cells and assigning it the key values from 0-8 
 for(var i=0;i<cells.length;i++) {
    cells[i].innerText='';//makes text null
    cells[i].style.removeProperty('background-color');//removes winning cell strike
    cells[i].addEventListener('click',turnClick,false);// then calls the func turnClick
 } // to reset board and remove all X and O
}
function turnClick(square){
    //to ensure the taken index cant be played again
    if(typeof origBoard[square.target.id]=='number'){ //origBoard array index will be replaced with the index once the turn on the box is taken if its a number that box is not yet taken
        //console.log(square.target.id); //displays the square id which is being clicked
    turn(square.target.id,huPlayer); //turn func gives the human player the chance to play
    //next ai has to take a turn
    if(!checkTie())//before ai takes a turn check for a tie ,if no tie ai takes a turn
    turn(bestSpot(),aiPlayer);//bestSpot() finds the best index to play for ai player
    
    }
}
function turn(squareId,player){ //define turn func by intaking square id and player
    origBoard[squareId]=player; //records the player took which spot in the board
    document.getElementById(squareId).innerText=player;
    let gameWon=checkWin(origBoard,player);//checks if the game is won by a player using checkWin func by passing origBoard array and the player who made the winning move
    if(gameWon) gameOver(gameWon) // if game has been won call the game over function by passing gamewon

}
function checkWin(board,player){
    let plays=board.reduce((a,e,i)=>(e === player) ? a.concat(i):a,[]);//used to know all the places on the board played
    //reduce func goes through every value on the board
    //return an accumulator and that is initialised with an empty array
    //e is the element in the board array
    //a is accumulator and i is index
    //if the element e = player then i is concatenated with acc empty array
    //if not equal a is returned as a empty array
    //a way to find the indexs where the player has played in
    let gameWon=null;//initialisation
    for(let [index,win] of winCombos.entries()){ //to check if the game has been won
        //format of winCombos index : first element win: second and third element
        if(win.every(elem=>plays.indexOf(elem)>-1)){ //checks if all the win indices in the win combo has been made by the player
            gameWon={index:index,player:player};//index of the win Combo and the player who has won it
            break;
        }


    }
    return gameWon;//return null if none orelse returns index,player
}
function gameOver(gameWon){
    // 2 for loops are required as it is needed to highlight the win combo squares and to avoid the player making the next move as the game has been won

    for(let index of winCombos[gameWon.index]){ //get the index of the win combo
        document.getElementById(index).style.backgroundColor= //document the index of the win combo and set their bg color
        gameWon.player==huPlayer? "rgba(187, 60, 100, 0.5)" :"rgba(199, 18, 60, 0.8)";
    }

    for(var i=0;i<cells.length;i++){// goes through every cell and making sure the further moves cant be made
        cells[i].removeEventListener('click',turnClick,false);//turned the click event listener to false for every cell to prevent further move

    }
    declareWinner(gameWon.player==huPlayer? " You Win!":"You Lost! ");
}
function declareWinner(who){
document.querySelector(".endgame").style.display="block";//endgame whose display was made none initially is now set to block once game is ended
document.querySelector(".endgame .text").innerText=who;//what to be displayed whether its a tie or ai or human

}
function emptySquare(){
return origBoard.filter(s => typeof s =='number');//the indexs in the origBoard for the ai to play based on minmax algo

}
function minmax(newBoard,player){
    var availSpots=emptySquare(newBoard);//check for avilable spots on the board
    if(checkWin(newBoard,huPlayer)){
        return{score:-10}; //if huPlayer  is about to win then return -10
    }else if(checkWin(newBoard,aiPlayer)){
        return{score:10};
    }else if(availSpots.length === 0){
        return{score:0};
    }
    var moves=[];//array  moves to move through empty spots and collect all the scores and their index here
    for(var i=0;i<availSpots.length;i++){
        var move={};//move obj
        move.index=newBoard[availSpots[i]];//move made wrt to avilSpot i wrt current player
        newBoard[availSpots[i]]=player;//move made wrt current ply
        if (player == aiPlayer){ //wrt other ply wrt the changed board
            var result=minmax(newBoard,huPlayer);
            move.score=result.score;
        }
        else{
            var result=minmax(newBoard,aiPlayer);
            move.score=result.score;
        }//recursion occurs until the terminating condition is found
        newBoard[availSpots[i]]=move.index;//that particular avail spot the move is made wrt next player
        moves.push(move);//move[index,score] is pushed to array moves
    }
    var bestMove;//now out of all the moves in the array the best move have to be computed
    if (player=== aiPlayer){//should the highest score when ai is player and lowest score when human is playing
    var bestScore= -10000;
    for(var i=0;i<moves.length;i++){
        if(moves[i].score>bestScore){
            bestScore=moves[i].score;
            bestMove=i;
        }
    }
    }else{
        var bestScore= 10000;
    for(var i=0;i<moves.length;i++){
        if(moves[i].score<bestScore){
            bestScore=moves[i].score;
            bestMove=i;
        }
    
    }
    
    } 
    return moves[bestMove];

    }

function bestSpot(){
return minmax(origBoard,aiPlayer).index;//calls an emptySquare func which lista all the empty squares and ai always plays in the first empty square
}
function checkTie(){
if(emptySquare().length==0){// if all the squares are filled and none have won then its a tie
for(var i=0;i<cells.length;i++){//once all the squares are filled
cells[i].style.backgroundColor="rgb(100, 207, 148)";//all boxes turn green
cells[i].removeEventListener('click',turnClick,false);
//no more moves can be made
}
declareWinner("Tie Game!");//declare tie
return true;//tie is true

}
return false;// else tie is false is returned
}


