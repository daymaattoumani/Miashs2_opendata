var loadFile = function(event) {
    event.preventDefault();
    var image = document.getElementById('img');
    var inputFile = document.getElementById('celebrity');
    image.src = URL.createObjectURL(inputFile.files[0]);
    var input = document.querySelector('input[type="file"]');

    var data = new FormData();
    data.append('celebrity', input.files[0]);

    fetch('/home', {
        method: 'POST',
        body: data
    }).then(function (response) {
        response.json().then(function (result) {
            document.getElementById('toto').innerText = result;
        })
    })
};

function download() {
    var input = document.querySelector('input[type="radio"]:checked').value;
    console.log(input);

    fetch('/download', {
        method: 'GET',
        headers: { 'accept' : 'application/'+ input}
    }).then(function (response) {
        response.blob().then(function(datablob)
        {
            datablob.name = 'newfile.'+ input
            anchor = document.createElement('a')
            anchor.download = datablob.name
            anchor.href = window.URL.createObjectURL(datablob)
            anchor.dataset.downloadurl = ['application/'+ input, anchor.download, anchor.href].join(':')
            anchor.click()
        })
    })
}