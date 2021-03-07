var  headNStartDiv = document.querySelector("#headNStart");
var catchDiv = document.querySelector("#catchDiv");
var gameScreenDiv = document.querySelector("#gameScreen");
var scoreInfoDiv = document.querySelector("#scoreInfo");
var pntToNxtInfoDiv = document.querySelector("#pntToNxtInfo");
var levelInfoDiv = document.querySelector("#levelInfo");
var missInfoDiv = document.querySelector("#missInfo");
var timerInfoDiv = document.querySelector("#timerInfo");
var highScoresUl = document.querySelector("#highScoresUl");

var confirmVar = false; var timer = null ; var sec = 60; var score = 0;                                                                             
var hitCount = 0; var missCount = 0; var pntToNxt = 10;                                                           
//level change vars
var levelVar = 1; var rotateTimeVar = 2; var dilayVar = 300;
var dilayVar = 300; var endGameVar = 1
//add new bestPlayer and date vars
var newBestPlayer = ""; var date = new Date(); var d = "";
//the array in the code                                                            
var bestPlayers = [{name:"shalom gross",score:5,date:"16/2/2021"},
                {name:"dan fridman",score:4,date:"16/2/2021"},
                {name:"gadi mizrahi",score:3,date:"16/2/2021"},
                {name:"aharon col",score:2,date:"16/2/2021"},
                {name:"david hen",score:1,date:"16/2/2021"}]
//brings the array from localStorage                                                
var bestPlayersJSON = localStorage.getItem("allBestPlayers");
if (bestPlayersJSON != null) {
    var bestPlayersArray = JSON.parse(bestPlayersJSON);
    if (bestPlayersArray.length > 0){
        bestPlayers = bestPlayersArray;
    };
};
createHTML()                
setGame();

function innerHTMLchange() {
    headNStartDiv.innerHTML = "Click here to Start!!!"; 
}
function innerHTMLchangeBack() {
    headNStartDiv.innerHTML = "--CATCH ME WITH NEON--"; 
}
function gameStart() {                                                //srart game function
    headNStartDiv.removeEventListener("click",gameStart);
    headNStartDiv.removeEventListener("mouseenter",innerHTMLchange);
    confirmVar = confirm("Are you ready to start?");
    if (confirmVar == true) {
        catchDiv.style = `color:red ;animation-duration: 2s;`; 
        catchDiv.innerHTML = " GET AWAY ; ("
        secCount();         
        catchDiv.addEventListener("click",scoreCount);
        catchDiv.addEventListener("mouseenter",divEscapeDilay); 
        gameScreenDiv.addEventListener("click",scoreMinosCount);
    }else{
        setGame();
    };           
};    
function scoreCount(e) {
    score += 10 * levelVar; 
    scoreInfoDiv.innerHTML = score;
    if (pntToNxt > 1) {
        pntToNxt--;                               
        pntToNxtInfoDiv.innerHTML = pntToNxt;
    }else{
        pntToNxt = 10;                           //next level point
        pntToNxtInfoDiv.innerHTML = "10";
        levelVar += 1;
        levelInfoDiv.innerHTML = levelVar; 
        rotateTimeVar -= 0.25;
        dilayVar -= 50;
        sec += 10;
        endGameVar++
        if (endGameVar == 6) {//the real number is >= 6
            pntToNxtInfoDiv.innerHTML = "0";
            endGame();
        };                                               
    };
    e.stopPropagation();     
};
function scoreMinosCount() {
    if (score > 1) {
        score -= levelVar;
        scoreInfoDiv.innerHTML = score; 
    } else {
        score = 0;
        scoreInfoDiv.innerHTML = "0";
    };
    missCount++;
    missInfoDiv.innerHTML = missCount;
};
function secCount() {
    timer = setInterval(function () {                             //time count function
        sec--;
        if (sec >= 0) {
            if (sec < 10) {
                timerInfoDiv.innerHTML = "0" + sec;
            }else{
                timerInfoDiv.innerHTML =  sec;
            };
        }else{
            endGame()
        };
    },1000);  //don`t forget to change it back to 1000    
};
function divEscapeNRotateTime(rotateTime) {                   //div escpe &rotate time function
    catchDiv.style = `top: ${Math.floor(Math.random() * 480) + 10}px ;  
                    right: ${Math.floor(Math.random() * 780) + 10}px ;  
                    color:red ; animation-duration: ${rotateTime}s;`;                  
};
function divEscapeDilay() {
    setTimeout(divEscapeNRotateTime,dilayVar,rotateTimeVar);     
};                                                           
function setGame() {
    headNStartDiv.addEventListener("mouseenter",innerHTMLchange);
    headNStartDiv.addEventListener("mouseleave",innerHTMLchangeBack);
    headNStartDiv.addEventListener("click",gameStart);
}
function endGame() { 
    catchDiv.removeEventListener("mouseenter",divEscapeDilay);   
    clearInterval(timer);
    headNStartDiv.removeEventListener("mouseleave",innerHTMLchangeBack);
    catchDiv.removeEventListener("click",scoreCount);
    gameScreenDiv.removeEventListener("click",scoreMinosCount);
    setTimeout(() => {
        catchDiv.style =  `color:black ;top: 5px;right: 5px;animation-duration: 0s;`;                  
    catchDiv.innerHTML = " HERE I AM ; )";
    headNStartDiv.innerHTML = "refresh page to start a new game!";
    headNStartDiv.style.color = "rgb(253, 17, 127)"
    }, 500);
    setTimeout(function (){alert("GAME OVER \n Your score is: " + score );
//checking if got in to bestScore and entering the "best five" html  and localStorage                               
    if (score > bestPlayers[4].score) {
        newBestPlayer = prompt("you made it to the best five!!! \n your name is:").toLowerCase()
        d = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()   //date criation
        for (let index = 0; index < 5; index++) {  
            if (score > bestPlayers[index].score) {
                bestPlayers.splice(index,0,{name : newBestPlayer,score : score ,date : d})
                bestPlayers.pop() 
                break
            }
        }
        createHTML()
        bestPlayersJSON = JSON.stringify(bestPlayers);
        localStorage.setItem("allBestPlayers",bestPlayersJSON);
    }},1000)
} 
function createHTML() {
    var toAppend = "";
    bestPlayers.forEach(function (player, i) {
    toAppend += `
        <li id="li${i+1}" class="info highScoresLi" onmouseover="document.getElementById('popup${i+1}')
        .style.display='inline-block'" onmouseout="document.getElementById('popup${i+1}').style.display='none'">
        <span  class="amountHS">${player.score}</span> - <span  class="namestHS">${player.name}</span>
        <span id="popup${i+1}" class="popGrup" style="display:none">${player.date}</span></li>`;
    });
    highScoresUl.innerHTML = toAppend;
};
