const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
});
var nbpred = 0;
function loadFile (event) {

    document.getElementById("guessRow").innerHTML =
        " <div id=\"imgSent\"class=\"col m4 l4 s12\">\n" +
        "            <img id=\"img\">\n" +
        "        </div>\n" +
        "\n" +
        "        <div id=\"guessingPart\">\n" +
        "            <div class=\"col m4 l4 s12\">\n" +
        "                <div id=\"typewriter\"></div>\n" +
        "            </div>\n" +
        "            <div id=\"resultPart\" class=\"col m4 l4 s12\">\n" +
        "                <div class=\"preloader-wrapper big active\" id=\"preloader\">\n" +
        "                    <div class=\"spinner-layer spinner-blue-only\">\n" +
        "                        <div class=\"circle-clipper left\">\n" +
        "                            <div class=\"circle\"></div>\n" +
        "                        </div><div class=\"gap-patch\">\n" +
        "                        <div class=\"circle\"></div>\n" +
        "                    </div><div class=\"circle-clipper right\">\n" +
        "                        <div class=\"circle\"></div>\n" +
        "                    </div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <h4 id=\"toto\"></h4>\n" +
        "                <img id=\"titi\">\n" +
        "                <div id=\"yesnoBtn\">\n" +
        "                    <a class=\"btn-floating btn-large waves-effect waves-light green pulse\" onclick=\"getNews()\"><i class=\"material-icons\">check</i></a>\n" +
        "                    <a class=\"btn-floating btn-large waves-effect waves-light red pulse\" id=\"no\" onclick=\"getNewPred()\"><i class=\"material-icons\">close</i></a>\n" +
        "                </div>\n" +
        "            </div>";
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
        sleep(500).then((step2) => {
            document.getElementById("typewriter").innerHTML +=
                "<h3  style=\"  overflow: hidden; /* Ensures the content is not revealed until the animation */\n" +
                "    border-right: .10em solid black; /* The typwriter cursor */\n" +
                "    margin-top: 50%;\n" +
                "    white-space: nowrap; /* Keeps the content on a single line */\n" +
                "    letter-spacing: 0.12em; /* Adjust as needed */\n" +
                "    animation:\n" +
                "            typing 2s steps(14, end),\n" +
                "            blink-caret .75s step-start infinite;\" id=\"isit\">I think of...</h3>";
            sleep(2200).then((step3) => {
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
        })
    });

};

function enableButton() {
    var submitBtn = document.getElementById("submitBtn");
    submitBtn.classList.replace("disabled","enabled");
}

function getNews(predSentFromInput=null) {
    document.getElementById("yesnoBtn").remove();
    var prediction = "";
    if (predSentFromInput === null) {
        prediction = document.getElementById("toto").innerText;
    } else {
        console.log("TRUE"),
        prediction = predSentFromInput
        console.log(prediction);
    }
    document.getElementById("guessingPart").remove();
    document.getElementById("guessRow").innerHTML+=  "<div id='news' class='col m8 l8 s8 left'></div>";
    document.getElementById("news").innerHTML=
        "  <h4>Waiting for "+prediction+" news...</h4> <div class=\"preloader-wrapper big active\" style='margin-top: 10vh'>\n" +
        "                    <div class=\"spinner-layer spinner-blue-only\">\n" +
        "                        <div class=\"circle-clipper left\">\n" +
        "                            <div class=\"circle\"></div>\n" +
        "                        </div><div class=\"gap-patch\">\n" +
        "                        <div class=\"circle\"></div>\n" +
        "                    </div><div class=\"circle-clipper right\">\n" +
        "                        <div class=\"circle\"></div>\n" +
        "                    </div>\n" +
        "                    </div>\n" +
        "                </div>";
    var image = document.getElementById('img');
    image.style.setProperty("-webkit-transition", "max-height 2s");
    image.style.setProperty("transition", "max-height 2s");


    fetch('/news/'+prediction, {
        method: 'GET'
    }).then(function (response) {
        response.json().then(function (news) {
            var html = "";
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
            sleep(2200).then((step1) => {
                document.getElementById("news").innerHTML = html;
                image.style.setProperty("max-height", "25vh");
                sleep(2000).then((step2) => {
                    document.getElementById('imgSent').innerHTML +=
                        "  <div class=\"row center\">\n" +
                        "<div class='col m6 l6 s12'>"+
                        "\n" +
                        "        <p>\n" +
                        "            <label>\n" +
                        "                <input class=\"with-gap\" id=\"csv\" value=\"csv\" name=\"download\" type=\"radio\" checked />\n" +
                        "                <span>CSV</span>\n" +
                        "            </label>\n" +
                        "        </p>\n" +
                        "</div>" +
                        "<div class='col m6 l6 s12'>"+
                        "        <p>\n" +
                        "            <label>\n" +
                        "                <input class=\"with-gap\" id=\"json\" value=\"json\" name=\"download\" type=\"radio\" />\n" +
                        "                <span>JSON</span>\n" +
                        "            </label>\n" +
                        "        </p>\n" +
                        "\n" +
                        "</div>" +
                        "<a id='dl' class=\"waves-effect waves-light btn green\"><i class=\"material-icons right\">file_download</i>Download news</a>\n" +
                        "</div>"
                    "    </div>";
                    document.getElementById("dl").addEventListener('click',download);
                });
            });
        })
    })
}

function getNewPred() {
    nbpred++;
    if (nbpred < 3) {
        console.log("nbpred",nbpred);
        var toto = document.getElementById('toto');
        var titi = document.getElementById('titi');
        titi.style.opacity = 0;
        toto.style.opacity =0;
        var typewriter = "";
        if(nbpred === 1) {
            typewriter = "or maybe...";
            document.getElementById("typewriter").style.width = "69%";
        }
        if(nbpred === 2) {
            typewriter = "last try...";
            document.getElementById("typewriter").style.width = "63%";
        }
        document.getElementById("typewriter").innerHTML =
            "<h3  style=\"  overflow: hidden; /* Ensures the content is not revealed until the animation */\n" +
            "    border-right: .10em solid black; /* The typwriter cursor */\n" +
            "    margin-top: 50%;\n" +
            "    white-space: nowrap; /* Keeps the content on a single line */\n" +
            "    letter-spacing: 0.12em; /* Adjust as needed */\n" +
            "    animation:\n" +
            "            typing 2s steps(12, end),\n" +
            "            blink-caret .75s step-start infinite;\" id=\"isit\">"+typewriter+"</h3>";
        fetch('/output/' + nbpred).then(response => {
            response.json().then(output => {
                var prediction = output.name;
                console.log(nbpred,prediction);
                fetch('/image/' + prediction, {
                    method: 'GET'
                }).then(function (res) {
                    res.json().then(function (result) {
                        sleep(2000).then( (step) => {
                            toto.innerHTML = result.name;
                            titi.src = result.url;
                            console.log(result.name,result.url);
                            //document.getElementById("preloaderNewPred").remove();
                            titi.style.opacity = 1;
                            toto.style.opacity =1;
                            document.getElementById("yesnoBtn").style.visibility = "visible";
                        })
                    })
                })
            })
        })
    }else {
        var noBtn = document.getElementById("no");
        noBtn.classList.add("modal-trigger");
        noBtn.setAttribute("data-target","modal1");
    }
}

function download() {
    console.log("download");
    var input = document.querySelector('input[type="radio"]:checked').value;
    console.log(input);

    fetch('/download', {
        method: 'GET',
        headers: { 'accept' : 'application/'+ input}
    }).then(function (response) {
        response.blob().then(function(datablob)
        {
            datablob.name = 'newfile.'+ input;
            anchor = document.createElement('a');
            anchor.download = datablob.name;
            anchor.href = window.URL.createObjectURL(datablob);
            anchor.dataset.downloadurl = ['application/'+ input, anchor.download, anchor.href].join(':');
            anchor.click();
        })
    })
}

function enableSubmitCeleb() {
    var submitBtn = document.getElementById("submitCeleb");
    submitBtn.classList.replace("disabled","enabled");

}