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
        $('#maze-container').find('.b').css({'width': boxSize, 'height': boxSize });
        $('#maze-container').find('.w').css({'width': boxSize, 'height': boxSize });
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