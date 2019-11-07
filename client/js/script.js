const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

function loadFile (event) {

    event.preventDefault();
    var image = document.getElementById('img');
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
            document.getElementById("typewriter").innerHTML +=
        "<h2 style=\"  overflow: hidden; /* Ensures the content is not revealed until the animation */\n" +
                "    border-right: .10em solid black; /* The typwriter cursor */\n" +
                "    margin-top: 50%;\n" +
                "    white-space: nowrap; /* Keeps the content on a single line */\n" +
                "    letter-spacing: .20em; /* Adjust as needed */\n" +
                "    animation:\n" +
                "            typing 2s steps(13, end),\n" +
                "            blink-caret .75s step-start infinite;\" id=\"isit\"><i>I think of...</i></h2>";
            preloader.style.visibility = "visible";
            var data = new FormData();
            data.append('celebrity', input.files[0]);

            fetch('/predict', {
                method: 'POST',
                body: data
            }).then(function (response) {
                response.json().then(function (result) {
                    preloader.remove();
                    var toto = document.getElementById('toto');
                    toto.style.setProperty("-webkit-transition", "opacity 2s linear");
                    toto.style.setProperty("opacity", "1.0");
                    toto.style.setProperty("transition", "opacity 2s linear");
                    toto.innerText = result.name;
                    document.getElementById("yesnoBtn").style.visibility = "visible";
                    var titi = document.getElementById('titi');
                    titi.style.setProperty("-webkit-transition", "opacity 2s linear");
                    titi.style.setProperty("opacity", "1.0");
                    titi.style.setProperty("transition", "opacity 2s linear");
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
    var html = "<div id='news' class='col m8 l8 s8 left'>";

    var prediction =document.getElementById("toto").innerText;
    document.getElementById('toto').innerText = "";

    document.getElementById("guessingPart").remove();
    fetch('/news/'+prediction, {
        method: 'GET'
    }).then(function (response) {
        response.json().then(function (news) {
            news.forEach(function(n) {
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
                    "<a target='_blank' href=\""+n.url+"\"><span class=\"card-title\">"+n.title.substring(0,50) + "..."+"</span></a>\n" +
                    "          <p>"+n.description.substring(0,50)+"..."+"</p>\n" +
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

function getNewPred() {
    var nb_pred=1;
    fetch('/output/'+nb_pred).then(response =>{
        response.json().then(output =>{
            console.log(output.name);
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