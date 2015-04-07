function color(color){
     $("#color-menu").css("color", color);
     $("#color").val(color);
}
function difficulty(difficulty,text){
    $("#difficulty").val(difficulty);
    $("#difficulty-display").html(text);
    startNewGame();
}
