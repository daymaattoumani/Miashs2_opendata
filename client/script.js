var loadFile = function(event) {
    event.preventDefault();
    var image = document.getElementById('img');
    var inputFile = document.getElementById('celebrity');
    image.src = URL.createObjectURL(inputFile.files[0]);
    var input = document.querySelector('input[type="file"]');

    var data = new FormData();
    data.append('celebrity', input.files[0]);

    fetch('/predict', {
        method: 'POST',
        body: data
    }).then(function (response) {
        response.json().then(function (result) {
            document.getElementById('toto').innerText = result;
        })
    })
};