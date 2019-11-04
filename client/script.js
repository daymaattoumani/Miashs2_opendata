fetch('http://localhost:3000/home').then(function(response){
    response.json().then(function(json){
        console.log(json);
    });
    }
);