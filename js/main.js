$(document).ready(function () {

//-----------
//  Означава, че всичко, което е заредено в HTML-а е  -> rendered, CSS - loaded, JS - loaded
//-----------

    init(function(){
      //  renderSmallColumns();
    });

    $(".start-game").click(function(){
        Maze.generate("maze-container",rowCount,columnCount,1);
        $('#maze-container').find('.r').css({'width': rowWidthPx, 'height': rowHeight });
        $('#maze-container').find('.b, .w').css({'width': boxSize, 'height': boxSize, 'background-size': boxSize+'px '+boxSize+'px' });
        $('#maze-container').find('.blockMaze').append('<div class="player"></div>');
        $('#maze-container').find('.player').css({'width': boxSize, 'height': boxSize, 'top': boxSize+20, 'margin-left': 0, 'background-size': boxSize+'px '+boxSize+'px' });
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




function init(callback){


    console.log('Initialized...', 'Small Column Size: ', smallColumnSize);
    if(callback){
        callback();
    }
}

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 37: // Left
            //$('#maze-container').find('.player').css('left', '-=1');
            break;

        case 38: // Up
            $('#maze-container').find('.player');
            break;

        case 39: // Right
            $('#maze-container').find('.player').css({'margin-left': "+=3"});
            break;

        case 40: // Down
            $('#maze-container').find('.player');
            break;
    }
}, false);


//function renderSmallColumns(){
//
//    var $container = $('.main-container')
//
//    // Underscore each -> борави с колекции и масиви
//    _.each(names, function(valueInNames, index){
//        $container.append(smallColumn);
//        console.log(valueInNames, index)
//    })
//
//    // jQuery each -> борави с преселектирани HTML елементи
//    $container.find('.small-column').each( function (index, smallColumn){
//        console.log( index, smallColumn);
//        $(smallColumn).html(names[index])
//    })
//
//    renderedSmallColumns = true;
//}