var answerList = document.getElementsByName("answerid")
var rightAnswer = getRightAnswer()

var rightPercent = 80
var numberOfProcessingAnswer = 10
var answerRoadMap = generateAnswerQueueRoad()

var oneAnswerCheced = false

function getIdFromElementAnswer(answer) { 
    return Number(answer.id.replace("answerid_", ""))
}

function getRightAnswer() {
    let rightAnswerRet = answerList[0];
    for (let index = 0; index < answerList.length; index++) {
        const id = getIdFromElementAnswer(answerList[index]);
        const rightAnswerId = getIdFromElementAnswer(rightAnswerRet);
        if (id != 0 && (rightAnswerId == 0 || rightAnswerId > id)) rightAnswerRet = answerList[index];
    }
    return rightAnswerRet
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAnswerQueueRoad() {
    if(answerRoadMap == undefined || answerRoadMap == null) answerRoadMap = JSON.parse(localStorage.getItem("answerMap"));
    if(answerRoadMap != undefined && answerRoadMap != null) {
        if(answerRoadMap.length != 0) {
            localStorage.setItem("answerMap", JSON.stringify(answerRoadMap))
            return answerRoadMap
        }
    }

    let answerQueue = []
    for (let index = 0; index < numberOfProcessingAnswer; index++) {
        answerQueue.push(true)
    }
    for (let index = 0; index < (100 - rightPercent)/numberOfProcessingAnswer; index++) {
        answerQueue[getRandomInt(0, numberOfProcessingAnswer-1)] = false
    }
    localStorage.setItem("answerMap", JSON.stringify(answerQueue))
    return answerQueue
}

var keyMap = {}
onkeydown = onkeyup = function(e){
    e = e || event;
    keyMap[e.keyCode] = e.type == 'keydown';
    if(keyMap[16] && keyMap[90]) markAnswer()                       // SHIFT + Z
    if(!keyMap[90]) unmarkAnswer()
    if(keyMap[16] && keyMap[88]) checkRightAnswer()                 // SHIFT + X
    if(keyMap[16] && keyMap[67]) checkRandomNotRightAnswer()        // SHIFT + C
    if(!keyMap[16] && keyMap[67]) skipAnswer()                        // C

    if(keyMap[13]) next()                                           // ENTER
}

function markAnswer() {
    const rightMark = '<p style="display:inline" name="answerit">   </p>'
    if(document.getElementsByName("answerit").length < 1) {
        rightAnswer.insertAdjacentHTML('afterend', rightMark);
    }
}

function unmarkAnswer() {
    while(document.getElementsByName("answerit").length > 0) {
        document.getElementsByName("answerit").forEach(element => element.remove());
    }
}

function checkRightAnswer() {
    rightAnswer.click();
}

function answerRand() {return answerList[answerList.length * Math.random() | 0]} 

function checkRandomNotRightAnswer() {
    let randomAnswer = answerRand()
    while(randomAnswer == rightAnswer) randomAnswer = answerRand()
    randomAnswer.click()
}

function skipAnswer() {
    if(!oneAnswerCheced) {
        oneAnswerCheced = true
        if(answerRoadMap.shift()) checkRightAnswer()
        else checkRandomNotRightAnswer()
        console.log(answerRoadMap)
        localStorage.setItem("answerMap", JSON.stringify(answerRoadMap))
    }
}

function next() {
    let buttonConfirm = document.getElementsByName("confirmanswer")
    let buttonNext = document.getElementsByName("nextquestion")
    let maxLength = buttonConfirm.length > buttonNext.length ? buttonConfirm.length : buttonNext.length
    for (let index = 0; index < maxLength; index++) {
        if(index < buttonConfirm.length+1) buttonConfirm[index].click();
        if(index < buttonNext.length+1) buttonNext[index].click();
    }
}
