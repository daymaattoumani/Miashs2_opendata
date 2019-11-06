const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

 function loadFile (event) {

    event.preventDefault();
    var image = document.getElementById('img');
    var text = document.getElementById('isit');
    var inputFile = document.getElementById('celebrity');
    image.src = URL.createObjectURL(inputFile.files[0]);
    var input = document.querySelector('input[type="file"]');
    var preloader = document.getElementById("preloader");
    document.getElementById("guessContainer").style.visibility = "visible";
    sleep(200).then((step1) => {
        image.style.setProperty("-webkit-transition", "opacity 0.5s linear");
        image.style.setProperty("opacity", "1.0");
        image.style.setProperty("transition", "opacity 0.5s linear");
        sleep(1000).then((step2) => {
            text.style.setProperty("-webkit-transition", "opacity 0.5s linear");
            text.style.setProperty("opacity", "1.0");
            text.style.setProperty("transition", "opacity 0.5s linear");
            preloader.style.visibility = "visible";
            var data = new FormData();
            data.append('celebrity', input.files[0]);

            fetch('/predict', {
                method: 'POST',
                body: data
            }).then(function (response) {
                response.json().then(function (result) {
                    preloader.remove();
                    document.getElementById('toto').innerText = result.name;
                    document.getElementById("yesnoBtn").style.visibility = "visible";
                    var titi = document.getElementById('titi');
                    titi.src = result.url;


                })
            })
        })
    });

};

function enableButton() {
    var submitBtn = document.getElementById("submitBtn");
    submitBtn.classList.replace("disabled","enabled");
}

function getNews() {
    document.getElementById("yesnoBtn").remove();
    document.getElementById('toto').innerText = "";
    var lang = document.getElementById('lang').value;
    var prediction =document.getElementById("toto").innerText;
    fetch('/news/'+prediction, {
        method: 'GET',
        headers: {'Accept-Language': lang}
    }).then(function (response) {
        response.json().then(function (news) {
            news.forEach(function(n) {
                console.log(n.title);
                document.getElementById('toto').innerText += n.title;
            });
        })
    })
}

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