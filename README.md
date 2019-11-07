# Miashs2_opendata

## Membres du groupe
- Attoumani Dayma (dayma.attoumani@gmail.com)
- Barbaza Andry (andrybarbaza@gmail.com)
- Inan Mourad (mourad.inan@hotmail.fr)
- Vernier Solal (verniersolal@gmail.com)

## Guess Who?

Quel est le but de notre application? L'utilisateur rentre l'image d'une personne dans la barre d'insersion, notre application va deviner de qui il s'agit. Si elle a bien deviné alors les actualités de la personne en question apparaîtront. Dans le cas contraire, l'utilisateur rentrera le nom lui-même et il aura quand même les actualités. Dans tous les cas, l'utilisateur pourra télécharger le fichier dans le format et la langue qui lui conviennent

## API

Clarifai (https://www.clarifai.com/models/celebrity-image-recognition-model-e466caa0619f444ab97497640cefc4dc?fbclid=IwAR3QymrW3aZl7MSFJtzzgg9hvVVjDfjEu7LACxEdALKII0Wk5bBDdrXhYfk): Pour les prédiction de nom de célébrité à partir de l'insertion d'image

API Recherche d’images Bing (https://docs.microsoft.com/fr-fr/azure/cognitive-services/bing-image-search/): A partir d'un mot faire un recherche d'image sur BING

News API(https://newsapi.org/): A partir d'un nom fournit, sortie d'une liste d'actualité

## Acheminement

1. On commence l'acheminement par demander à l'utilisateur de rentrer son image dans la barre d'insertion, et en cliquant sur "Guess" on active la fonction loadFile(event). Cette fonction permet d'une part de stocker l'image est de l'afficher à l'utilisateur sur la page. Elle permet aussi de faire un fetch sur la route "predict" du server et donc de récupérer le nom et l'image prédit par notre API Clarifai.

2. Une fois que l'on a le nom et l'image prédits dans nos balises titi et toto,lutilisateur a 2 choix. Soit il valide la prédiction, soit il refuse le choix proposé.

Si il valide la prédiction, en cliquant sur le bouton de validation l'utilisateur déclenche la fonction getNews(). Cette fonction va faire un fetch sur la route news/nom_de_la_célébrité pour récupérer les informations de l'API news. Elle va également modifier le html pour faire place à la présentation des news. 

Si l'utilisateur ne valide pas la prédiction, la fonction getNewPred() est lancée. Cette fonction lance un fetch sur la route 'ouput' du server. D'abord 'ouput/1' qui récupère la 2ème prédiction de l'API et, si l'utilisateur décide de ne pas valider encore une fois, 'ouput/2' qui récupère la 3ème prédiction. 

Au bout de ces 2 essais l'application demande à l'utilisateur de rentrer le nom de la personne sur l'image insérée. Ce qui va renclencher la fonction getNews() mais avec comme option le nom insérer par l'utilisateur avec un document.getElementById('celebrityName').value. L'utilisateur a donc quoi qu'il arrive une liste d'actualités sur la personne insérée en image.