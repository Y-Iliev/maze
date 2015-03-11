$(document).ready(function () {

//-----------
//  Означава, че всичко, което е заредено в HTML-а е  -> rendered, CSS - loaded, JS - loaded
//-----------

    init(function(){
      //  renderSmallColumns();
    });

    $(".start-game").click(function(){
        collectedLetters = 0;
        Maze.generate("maze-container",rowCount,columnCount,1);
        $('#maze-container').find('.r').css({'width': rowWidthPx, 'height': rowHeight });
        $('#maze-container').find('.b, .w').css({'width': boxSize, 'height': boxSize, 'background-size': boxSize+'px '+boxSize+'px' });
        $('#maze-container').find('.b').last().addClass('final');
        $('#maze-container').find('.final').addClass('w');
        $('#maze-container').find('.final').removeClass('b');
        $('#maze-container').find('.blockMaze').append('<div class="player"></div>');
        $('#maze-container').find('.player').css({'width': boxSize, 'height': boxSize, 'top': boxSize, 'left': '0px', 'background-size': boxSize+'px '+boxSize+'px' });
        $.getJSON("webservices/words.json", function(data){
            letters = data.data[Math.floor((Math.random() * data.data.length))].split("");
            placeLetters();
        });
        $("#menu").hide();
        $("#game").show();
    });

    $(".quit-game").click(function(){
        $("#menu").show();
        $("#game").hide();
    });

});
var rowCount = 10;
var columnCount = 10;

var boxSize  = 25;

var rowWidthPx = (columnCount * 2 + 1)* boxSize;
var rowHeight = boxSize;

var smallColumn = "<div class='red-column small-column'></div>";
var renderedSmallColumns = false;
var smallColumnSize = 300;
var names = ["Първа колонка", "Втора колонка", "Трета колонка", "Четвърта колонка"];

var letters;
var collectedLetters;




function init(callback){


    console.log('Initialized...', 'Small Column Size: ', smallColumnSize);
    if(callback){
        callback();
    }
}

/*var moving_x = 0;
var moving_y = 0;
$(document).keydown(function(e){

    moving_x = 1;
});
$(document).keyup(function(e){
    moving_x = 0;
});


window.setInterval(function () {
    if (moving_x != 0) {
        $('#maze-container').find('.player').css({'margin-left': "+=3"});
    }
}, 50);*/


function placeLetters(){
    var random;
    var $blockList = $('#maze-container').find('.b');
    for(i = 0; i< letters.length; i++){
        random = Math.floor(Math.random()*$blockList.not('.letter').length);
        $blockList.not('.letter').eq(random).html(letters[i]);
        $blockList.not('.letter').eq(random).addClass('letter');
    }
}

function checkCollision(){
    var $blockList = $('#maze-container').find('.b');
    for(i=1;i<=$blockList.length;i++){
        if($('#maze-container').find('.player').position().left == $blockList.eq(i-1).position().left
            && $('#maze-container').find('.player').position().top == $blockList.eq(i-1).position().top)
                return true;
    }
    return false;
}

function checkLetter(){
    var $letterList = $('#maze-container').find('.letter');
    for(i=1;i<=$letterList.length;i++){
        if($('#maze-container').find('.player').position().left == $letterList.eq(i-1).position().left
            && $('#maze-container').find('.player').position().top == $letterList.eq(i-1).position().top) {
            collectedLetters += 1;
            $letterList.eq(i-1).removeClass('letter');
            $letterList.eq(i-1).html('');
        }
    }
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
}

function checkExit(){
    var $exitBox = $('#maze-container').find('.exit');
    if($('#maze-container').find('.player').position().left == $exitBox.position().left
        && $('#maze-container').find('.player').position().top == $exitBox.position().top) {
        $(".quit-game").click();
    }
}


window.addEventListener('keydown', function(e) {
    var $player = $('#maze-container').find('.player');

    switch (e.keyCode) {
        case 37: // Left
            $player.css({'left': "-="+boxSize});
            if(!checkCollision()) $player.css({'left': "+="+boxSize});
            break;

        case 38: // Up
            $player.css({'top': "-="+boxSize});
            if(!checkCollision()) $player.css({'top': "+="+boxSize});
            break;

        case 39: // Right
            $player.css({'left': "+="+boxSize});
            if(!checkCollision()) $player.css({'left': "-="+boxSize});
            break;

        case 40: // Down
            $player.css({'top': "+="+boxSize});
            if(!checkCollision()) $player.css({'top': "-="+boxSize});
            break;
    }
    if(collectedLetters == letters.length){
        checkExit();
    } else
        checkLetter();
}, false);

