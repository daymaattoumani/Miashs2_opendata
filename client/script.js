var loadFile = function(event) {
    var image = document.getElementById('img');
    var inputFile = document.getElementById('celebrity');
    image.src = URL.createObjectURL(inputFile.files[0]);
};