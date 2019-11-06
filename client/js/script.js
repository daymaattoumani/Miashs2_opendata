const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

var loadFile = function(event) {

    console.log("coucou");
    event.preventDefault();
    var image = document.getElementById('img');
    var inputFile = document.getElementById('celebrity');
    image.src = URL.createObjectURL(inputFile.files[0]);
    var input = document.querySelector('input[type="file"]');

    document.getElementById("guessContainer").style.visibility = "visible";

    image.style.setProperty("-webkit-transition", "opacity 0.5s linear");
    image.style.setProperty("opacity", "1.0");
    image.style.setProperty("transition", "opacity 0.5s linear");

    var data = new FormData();
    data.append('celebrity', input.files[0]);


    fetch('/home', {
        method: 'POST',
        body: data
    }).then(function (response) {
        response.json().then(function (result) {
            document.getElementById("preloader").remove();
            document.getElementById('toto').innerText = result;
            document.getElementById("yesnoBtn").style.visibility = "visible";
        })
    })
};

function enableButton() {
    var submitBtn = document.getElementById("submitBtn");
    submitBtn.classList.replace("disabled","enabled");
}