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
                    document.getElementById('toto').innerText = result;
                    document.getElementById("yesnoBtn").style.visibility = "visible";
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
    var html = "<div id='news' class='col m8 l8 s8'>";

    var prediction =document.getElementById("toto").innerText;
    console.log("prediction",prediction);
    document.getElementById("guessingPart").remove();
    fetch('/news/'+prediction, {
        method: 'GET',
    }).then(function (response) {
        response.json().then(function (news) {
            news.forEach(function(n) {
                console.log(n);
                console.log(n.title);
                html +=
                    "    <div class=\"card horizontal\">\n" +
                    "<div class='row'>" +
                    "<div class='col m3 s3 l3'>" +
                    "      <div class=\"card-image\">\n" +
                    "        <img src=\""+n.image+"\">\n" +
                    "      </div>\n" +
                    "</div>" +
                    "<div class='col m9 s9 l9'>" +
                    "      <div class=\"card-stacked\">\n" +
                    "        <div class=\"card-content\">\n" +
                    "<a target='_blank' href=\""+n.url+"\"><span class=\"card-title\">"+n.title.substring(0,40) + "..."+"</span></a>\n" +
                    "          <p>I am a very simple card. I am good at containing small bits of information.</p>\n" +
                    "        </div>\n" +
                    "      </div>\n" +
                    "</div>" +
                    "</div>" +
                    "    </div>";
            });
            html +="</div>";
            document.getElementById("guessRow").innerHTML += html;
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