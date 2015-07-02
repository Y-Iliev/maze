$(document).ready(function () {

//-----------
//  Означава, че всичко, което е заредено в HTML-а е  -> rendered, CSS - loaded, JS - loaded
//-----------

    init(function(){
      //  renderSmallColumns();
    });

    setInterval(devLoop , 50);

    $(".start-game").click(function(){
        score = 0;
        collectedProverbs.length = 0;
        collectedProverbs[0] = 0;
        collectedWords = 0;
        multiplier = 1;
        currentWord = 0;
        speed = 200;
        startLevel();
        $.getJSON("webservices/words.json", function(data){
            currentProverb = Math.floor((Math.random() * data.proverbs.length));
            letters = data.proverbs[currentProverb][currentWord];
            placeLetters();
        });
        $("#menu").hide();
        $("#game").show();
    });

    $(".quit-game").click(function(){
        stopLevel();
        $("#menu").show();
        $("#game").hide();
        $("#results").hide();
        $("blue-box").hide();
        $("next-level").show();
    });

    $(".next-level").click(function(){
        startLevel();
        $.getJSON("webservices/words.json", function(data){
            //currentProverb = Math.floor((Math.random() * data.proverbs.length));
            letters = data.proverbs[currentProverb][currentWord];
            placeLetters();
        });
        $("#results").hide();
        $("#game").show();
    });

});
var rowCount = 10;
var columnCount = 10;
var boxSize  = 25;
var rowWidthPx = (columnCount * 2 + 1)* boxSize;
var rowHeight = boxSize;
var smallColumnSize = 300;

var keys = [];
var intervals = [];

var currentProverb;
var currentWord;
var letters;
var nextLetter;
var collectedLetters;
var collectedWords;
var collectedProverbs = [];
var score;
var scoreMinus;
var scorePlus;
var timer;
var multiplier;
var isWalking;
var speed;
var noclipRunning;
var showVars;




function init(callback){


    console.log('Initialized...', 'Small Column Size: ', smallColumnSize);
    if(callback){
        callback();
    }
}

function startLevel(){
    Maze.generate("maze-container",rowCount,columnCount,1);
    $('#maze-container').find('.r').css({'width': rowWidthPx, 'height': rowHeight });
    $('#maze-container').find('.b, .w').css({'width': boxSize, 'height': boxSize, 'background-size': boxSize+'px '+boxSize+'px' });
    $('#maze-container').find('.b').last().addClass('final');
    $('#maze-container').find('.final').addClass('w');
    $('#maze-container').find('.final').removeClass('b');
    $('#maze-container').find('.blockMaze').append('<div class="player stand-right"></div>');
    $('#maze-container').find('.player').css({'width': boxSize, 'height': boxSize, 'top': boxSize, 'left': '0px', 'background-size': boxSize+'px '+boxSize+'px' });
    collectedLetters = 0;
    nextLetter = 1;
    timer = 0;
    scorePlus = 0;
    scoreMinus = 0;
    $(".timer").html(timer);
    if(currentWord > 0)
        $(".collected-words").append($(".collected-letters").html()+" ");
    else
        $(".collected-words").html("");
    $(".collected-letters").html("");
    $(".collected-proverbs").html(collectedProverbs[0]);
    isWalking = false;
    intervals[0] = setInterval(mainLoop , 50);
    intervals[1] = setInterval(tickTock , 1000);
}

function stopLevel(){
    isWalking = true;
    clearInterval(intervals[0]);
    clearInterval(intervals[1]);
}

function showResults(){
    stopLevel();
    var $elementScore = $(".current-score");
    var $elementTimer = $(".timer");
    var $elementSuccess = $(".successful-pickups");
    var $elementFail = $(".failed-pickups");
    var $elementMulti = $(".level-multiplier");
    var $elementTotal = $(".total-score");
    speed = 200;
    $elementScore.html(score);
    $elementTimer.html(-timer);
    $elementSuccess.html(scorePlus);
    $elementFail.html(scoreMinus);
    $elementMulti.html(1+(multiplier/10));
    score = parseInt((score+scorePlus+scoreMinus-timer)*(1+(multiplier/10)));
    multiplier++;
    $elementTotal.html(score);
    currentWord++;
    $(".proverb-message").remove();
    $(".next-level").show();
    $(".blue-box").hide();
    $.getJSON("webservices/words.json", function(data){
        if(!data.proverbs[currentProverb][currentWord]){
            if(collectedProverbs.length > 4){
                $("#total-tag").html("Final");
                $(".next-level").hide();
                $(".blue-box").show();
            }
            else{
                $("#total-tag").html("Total");
                collectedProverbs[0]++;
                collectedProverbs.push(currentProverb);
                while(collectedProverbs.indexOf(currentProverb) != -1){
                    currentProverb = Math.floor((Math.random() * data.proverbs.length));
                }
                $("#results").append('<div class="proverb-message">Collected Proverb:<br/>'+$(".collected-words").html()+' '+$(".collected-letters").html()+'</div>');
                currentWord = 0;
                collectedWords = 0;
            }
        }
    });
    if(scoreMinus == 0){
        speed = 100;
        $elementFail.append(' - double speed activated!');

    }
    $("#results").show();
    $("#game").hide();
}

function placeLetters(){
    var random;
    var $blockList = $('#maze-container').find('.b');
    for(i = 0; i< letters.length; i++){
        random = Math.floor(Math.random()*$blockList.not('.letter').length);
        $blockList.not('.letter').eq(random).html(letters[i][0]);
        $blockList.not('.letter').eq(random).addClass('letter');
    }
}

function checkCollision(direction){
    var $blockList = $('#maze-container').find('.b');
    var futurePosX;
    var futurePosY;
    switch(direction){
        case 1: //Left
            futurePosX = $('#maze-container').find('.player').position().left - boxSize;
            futurePosY = $('#maze-container').find('.player').position().top;
            break;

        case 2: //Up
            futurePosX = $('#maze-container').find('.player').position().left;
            futurePosY = $('#maze-container').find('.player').position().top - boxSize;
            break;

        case 3: //Right
            futurePosX = $('#maze-container').find('.player').position().left + boxSize;
            futurePosY = $('#maze-container').find('.player').position().top;
            break;

        case 4: //Down
            futurePosX = $('#maze-container').find('.player').position().left;
            futurePosY = $('#maze-container').find('.player').position().top + boxSize;
            break;

    }
    for(i=1;i<=$blockList.length;i++){
        if(futurePosX == $blockList.eq(i-1).position().left
            && futurePosY == $blockList.eq(i-1).position().top)
                return true;
    }
    return false;
}

function checkLetter(){
    var $letterList = $('#maze-container').find('.letter');
    for(i=1;i<=$letterList.length;i++){
        if($('#maze-container').find('.player').position().left == $letterList.eq(i-1).position().left
            && $('#maze-container').find('.player').position().top == $letterList.eq(i-1).position().top) {
            for(j = 0; j< letters.length; j++){
                if($letterList.eq(i-1).html() == letters[j][0] && letters[j][1].indexOf(nextLetter) != -1) {
                    collectedLetters += 1;
                    $(".collected-letters").append(letters[j][0]);
                    $letterList.eq(i-1).removeClass('letter');
                    $letterList.eq(i-1).html('');
                    nextLetter++;
                    scorePlus += 100;
                    positiveScore(true);
                    if(collectedLetters == letters.length){
                        if($('#maze-container').find('.exit').length == 0) {
                            $('#maze-container').find('.final').addClass('b');
                            $('#maze-container').find('.final').removeClass('w');
                            $('#maze-container').find('.blockMaze').append('<div class="exit"></div>');
                            $('#maze-container').find('.exit').css({
                                'width': boxSize,
                                'height': boxSize,
                                'top': (rowCount * 2 - 1) * boxSize,
                                'left': (columnCount * 2) * boxSize,
                                'background-size': boxSize + 'px ' + boxSize + 'px'
                            });
                        }
                    }
                    return;
                }
            }
            scoreMinus -= 50;
            positiveScore();
        }
    }
}

function checkExit(){
    var $exitBox = $('#maze-container').find('.exit');
    if($('#maze-container').find('.player').position().left == $exitBox.position().left
        && $('#maze-container').find('.player').position().top == $exitBox.position().top) {
        stopLevel();
        collectedWords++;
        showResults();
    }
}

function positiveScore(positive){
    $('#maze-container').find('.blockMaze').append('<div class="score-pop-up"></div>');
    var $scorePopup = $('#maze-container').find('.score-pop-up').last();
    if(positive){
        $scorePopup.css({'top': $('#maze-container').find('.player').position().top, 'left': $('#maze-container').find('.player').position().left, 'color': '#00FF00'});
        $scorePopup.html('+100');
    }
    else{
        $scorePopup.css({'top': $('#maze-container').find('.player').position().top, 'left': $('#maze-container').find('.player').position().left, 'color': '#FF0000'});
        $scorePopup.html('-50');
    }
    $scorePopup.animate({
            top: parseFloat($scorePopup.css('top').replace('px', '')) - boxSize
        },
        200,
        "linear"
    );
    $scorePopup.animate({
            opacity: 0
        },
        200,
        "linear",
        function(){
            $scorePopup.remove();
        }
    );
}

function walking(direction){
    isWalking = true;
    var $player = $('#maze-container').find('.player');
    $player.removeClass('stand-left stand-up stand-right stand-down');
    switch(direction){
        case 1: //Left
            $player.addClass('walk-left');
            $player.animate({
                    left: parseFloat($player.css('left').replace('px','')) - boxSize
                },
                speed,            // number of milliseconds animation should last
                "linear",       // easing property (see the docs)
                function() {    // callback that will run when animate completes
                    isWalking = false;
                    $player.removeClass('walk-left');
                    $player.addClass('stand-left');
                    if(collectedLetters == letters.length)
                        checkExit();
                });
            break;
        case 2: //Up
            $player.addClass('walk-up');
            $player.animate({
                    top: parseFloat($player.css('top').replace('px','')) - boxSize
                },
                speed,
                "linear",
                function() {
                    isWalking = false;
                    $player.removeClass('walk-up');
                    $player.addClass('stand-up');
                    if(collectedLetters == letters.length)
                        checkExit();
                });
            break;
        case 3: //Right
            $player.addClass('walk-right');
            $player.animate({
                    left: parseFloat($player.css('left').replace('px','')) + boxSize
                },
                speed,
                "linear",
                function() {
                    isWalking = false;
                    $player.removeClass('walk-right');
                    $player.addClass('stand-right');
                    if(collectedLetters == letters.length)
                        checkExit();
                });
            break;
        case 4: //Down
            $player.addClass('walk-down');
            $player.animate({
                    top: parseFloat($player.css('top').replace('px','')) + boxSize
                },
                speed,
                "linear",
                function() {
                    isWalking = false;
                    $player.removeClass('walk-down');
                    $player.addClass('stand-down');
                    if(collectedLetters == letters.length)
                        checkExit();
                });
            break;
    }
}

$(document).keydown(function (e) {
    keys[e.keyCode] = true;
});

$(document).keyup(function (e) {
    delete keys[e.keyCode];
});

window.addEventListener('keydown', function(e) {
    if(keys[32]) {  // Space
        checkLetter();
    }
    if(keys[192] && keys[49]) {  // `+1
        if(!showVars){
            $('#maze-vars').show();
            showVars = true;
        }
        else{
            $('#maze-vars').hide();
            showVars = false;
        }
    }
    if(keys[192] && keys[50]) {  // `+2
        if(!noclipRunning){
            clearInterval(intervals[0]);
            intervals[0] = setInterval(noClipLoop , 50);
            noclipRunning = true;
        }
        else{
            clearInterval(intervals[0]);
            intervals[0] = setInterval(mainLoop , 50);
            noclipRunning = false;
        }
    }
}, false);

function mainLoop() {
    noclipRunning = false;
    if(keys[37]){
        if(checkCollision(1) && !isWalking)
            walking(1);
    }

    if(keys[38]){
        if(checkCollision(2) && !isWalking)
            walking(2);
    }

    if(keys[39]){
        if(checkCollision(3) && !isWalking)
            walking(3);
    }

    if(keys[40]){
        if(checkCollision(4) && !isWalking)
            walking(4);
    }
}

function noClipLoop() {
    noclipRunning = true;
    if(keys[37]){
        if(!isWalking)
            walking(1);
    }

    if(keys[38]){
        if(!isWalking)
            walking(2);
    }

    if(keys[39]){
        if(!isWalking)
            walking(3);
    }

    if(keys[40]){
        if(!isWalking)
            walking(4);
    }

    if($('#maze-container').find('.player').position().top == $('#maze-container').find('.final').position().top
    && $('#maze-container').find('.player').position().left == $('#maze-container').find('.final').position().left+boxSize*2
    && collectedProverbs[99] != 99){
        collectedProverbs[0] = 1;
        collectedProverbs[1] = 2;
        collectedProverbs[2] = 3;
        collectedProverbs[3] = 4;
        collectedProverbs[4] = 5;
        collectedProverbs[99] = 99;
        currentWord = 99;
        console.log('hi');
    }
}

function tickTock(){
    timer += 1;
    $(".timer").html(timer);
}

function devLoop(){
    if(noclipRunning){
        $('#noclip-yes').show();
    }
    else{
        $('#noclip-yes').hide();
    }
    $('#maze-vars').html(
        'currentProverb: '+currentProverb+'<br/>' +
        'currentWord: '+currentWord+'<br/>' +
        'letters: '+letters+'<br/>' +
        'nextLetter: '+nextLetter+'<br/>' +
        'collectedLetters: '+collectedLetters+'<br/>' +
        'collectedWords: '+collectedWords+'<br/>' +
        'collectedProverbs: '+collectedProverbs+'<br/>' +
        'score: '+score+'<br/>' +
        'scoreMinus: '+scoreMinus+'<br/>' +
        'scorePlus: '+scorePlus+'<br/>' +
        'multiplier: '+multiplier+'<br/>'
    );
}