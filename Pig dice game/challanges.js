/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/

var scores, roundScores, activePlayer, gamePlaying, previousDice, winnerScore;

init();

document.querySelector('.btn-roll').addEventListener('click', function(){
    if(gamePlaying){ 
        
    // random number selecting
        var dice1 = Math.floor(Math.random() * 6) + 1; 
        var dice2 = Math.floor(Math.random() * 6) + 1; 
        
    //display result for two dices   
        var dice1Dom = document.querySelector('#dice1');
        var dice2Dom = document.querySelector('#dice2');
        
        dice1Dom.style.display = 'block';
        dice1Dom.src = 'dice-' + dice1 + '.png';
        
        dice2Dom.style.display = 'block';
        dice2Dom.src = 'dice-' + dice2 + '.png';
        
        
     //Update the round score IF the rolled number was NOT a 1
        if (dice1 === 1 || dice2 === 1 ) {
            //next player
            nextPlayer();
            
        } else {
           //Add score
            roundScore += dice1 + dice2;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        }
    
    //set next player if dice shows one, six in a row.
      /*  if( dice === 6 && previousDice === 6 ){
                scores[activePlayer] = 0;
                document.querySelector('#score-' + activePlayer).textContent = '0';
                nextPlayer();
            
        }else if(dice !== 1) {
            //add current score
            roundScore += dice;
            document.querySelector("#current-" + activePlayer).textContent = roundScore;
            
        }else {
            //next player
            nextPlayer();  
    }
        previousDice = dice;*/
    }
});

document.querySelector('.btn-hold').addEventListener('click', function(){
    if(gamePlaying){
        //add current score to golbal score    
        scores[activePlayer] += roundScore;
    
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        
        var input = document.querySelector('.final-score').value;
        
        // undifined, 0, null or "" are coerced to false
        // anything else coerced to true
        if(input){
            winnerScore = input;
        }else{
            winnerScore = 100;
        }
    
        //check the winner
        if(scores[activePlayer] >= winnerScore){
            document.getElementById('name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('#dice1').style.display = 'none';
            document.querySelector('#dice2').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
        }else {
            nextPlayer();
        } 
    }   
});

function nextPlayer(){
    
        activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
        roundScore = 0;
        document.getElementById('current-0').textContent = '0';
        document.getElementById('current-1').textContent = '0';
        
        //document.querySelector('.player-0-panel').classList.add('active');
        //document.querySelector('.player-1-panel').classList.remove('active');
        
        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');
        
        document.querySelector('#dice1').style.display = 'none'; 
        document.querySelector('#dice2').style.display = 'none';  
}

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
    
scores = [0, 0];
roundScore = 0;
activePlayer = 0;
previousDice = 0;
gamePlaying =  true;

document.querySelector('#dice1').style.display = 'none';
document.querySelector('#dice2').style.display = 'none';

/*document.querySelector('#winner-score-input').style.display = 'block';
document.getElementById('btn-scoreinput').addEventListener('click', winnerScoreinput);*/

document.getElementById('score-0').textContent = '0';
document.getElementById('current-0').textContent = '0';
document.getElementById('score-1').textContent = '0';
document.getElementById('current-1').textContent = '0';
document.getElementById('name-0').textContent = 'Player 1';
document.getElementById('name-1').textContent = 'Player 2';
document.querySelector('.player-0-panel').classList.remove('winner');
document.querySelector('.player-1-panel').classList.remove('winner');
document.querySelector('.player-0-panel').classList.remove('active');
document.querySelector('.player-1-panel').classList.remove('active');
document.querySelector('.player-0-panel').classList.add('active');
  
}

function winnerScoreinput() {
    
    winnerScore = document.getElementById('scoreinput').value;
    document.querySelector('#winner-score-input').style.display = 'none';
    gamePlaying = true;
}

