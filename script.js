const templateElem = document.querySelector("#template");
const gameElem = document.querySelector("#game");
const paraElem = document.querySelector("#para");
const minLettersElem = document.querySelector("#minletters");
const maxLettersElem = document.querySelector("#maxletters");
const lettersElem = document.querySelector("#letters");
const errorsElem = document.querySelector("#errors");
const fullAlphaElem = document.querySelector('#FullAlpha');
const fullNumElem = document.querySelector('#fullNum');
const fullAlphPunElem = document.querySelector('#fullAlphPun');
const timerElem = document.querySelector("#timer");
const resetElem = document.querySelector("#reset");

const fullLettersSet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const fullNumbersSet = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const fullAlphPunSet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    ',','.','?','!',';',':']

let minLetters = 3;
let maxLetters = 3;
let letters = lettersElem.value;
let letterPool = templateElem.value;
let errors = 0;
let lastErrors = 0;
let timer = 0;
let lastTime = 0;
let isStarted = false;


//change the different letters composing a word
templateElem.addEventListener("input", function (e) {
    letterPool = templateElem.value;
    paraElem.textContent = generatePhrase();
    updatePara();
});
// Change the number of letter in a single word
minLettersElem.addEventListener("change", function (e) {
    minLetters = e.target.value;
    if(minLetters >= maxLetters){
        maxLetters = minLetters;
        maxLettersElem.value = maxLetters;
    }
    paraElem.textContent = generatePhrase();
    updatePara();
});
maxLettersElem.addEventListener("change", function (e) {
    maxLetters = e.target.value;
    if(maxLetters <= minLetters){
        minLetters = maxLetters;
        minLettersElem.value = minLetters;
    }
    paraElem.textContent = generatePhrase();
    updatePara();
});
// Change the number of words
lettersElem.addEventListener("change", function (e) {
    letters = e.target.value;
    paraElem.textContent = generatePhrase();
    updatePara();
});

fullAlphaElem.addEventListener("click", function (e){
    populateWith(fullLettersSet, e.target);
});
fullNumElem.addEventListener("click", function (e){
    populateWith(fullNumbersSet, e.target);
});
fullAlphPunElem.addEventListener("click", function (e){
    populateWith(fullAlphPunSet, e.target);
});
resetElem.addEventListener("click", function (e){
    reset();
});

function populateWith(array, target){
    console.log(array.join(''));
    letterPool = array.join('');
    templateElem.value = letterPool;
    paraElem.textContent = generatePhrase();
    updatePara();
    target.blur();
    reset();
}

function generateWord(){
    let r = "";
    let size = random(parseInt(minLetters), parseInt(maxLetters));
    for (let i = 0; i < size ; i++) {
        r += letterPool[random(0, letterPool.length-1)];
    }
    return r;
}
function generatePhrase(){
    let r = "";
    for (let i = 0; i < letters; i++) {
        r +=  " " + generateWord();
    }
    return ( r.trim() );
}
function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

paraElem.textContent = generatePhrase();

let index = 0;
let past, futur, current = ""
function updatePara(){
    past = paraElem.textContent.slice(0, index);
    current = paraElem.textContent.slice(index, index + 1);
    futur = paraElem.textContent.slice(index + 1, paraElem.textContent.length);

    document.querySelector(".past").textContent = past;
    if(current === " ") current = "_";
    document.querySelector(".current").textContent = current;
    document.querySelector(".futur").textContent = futur;
}

updatePara();
document.addEventListener("keydown", (e) => {
    let wantedKey = current;
    if( current === "_") wantedKey = " "
    console.log(e.key);

    if(templateElem === document.activeElement){
        if(e.key === "Tab"){
            console.log("oui");
            e.preventDefault();
            templateElem.blur();
        }
        return;
    }

    if(!isStarted && templateElem !== document.activeElement){
        startTimer();
    }

    if(e.key === wantedKey){
        index++;
        updatePara();
    }else{
        errors++;
    }
    if(index >= paraElem.textContent.length){
        lastErrors = errors;
        reset();
    }
    errorsElem.textContent = "errors: " + errors + " (last round : " + lastErrors +")";
});
function reset(){
    index = 0;
    errors = 0;
    isStarted = false;

    clearInterval(interval);
    interval = null;
    lastTime = Number(timer/100).toFixed(2);
    timer = 0;
    paraElem.textContent = generatePhrase();
    updatePara();
}

let interval = null;
function startTimer(){
    isStarted = true;
    interval = setInterval(tick, 10);
}
function tick(){
    // console.log("tick");
    timer++;
    let secondes = timer / 100;
    secondes = Number(secondes);
    secondes = secondes.toFixed(2);
    timerElem.textContent = secondes + "s" + " (last time : " + lastTime + "s)" ;
}