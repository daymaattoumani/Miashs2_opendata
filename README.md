# Miashs2_opendata

## Membres du groupe
- Attoumani Dayma (dayma.attoumani@gmail.com)
- Barbaza Andry (andrybarbaza@gmail.com)
- Inan Mourad (mourad.inan@hotmail.fr)
- Vernier Solal (verniersolal@gmail.com)

## Guess Who?

<b>Quel est le but de notre application?</b> <br>
L'utilisateur rentre une image d'une personne dans la barre d'insertion, notre application va deviner de qui il s'agit. Si elle a bien deviné, alors les actualités de la personne en question apparaîtront. Dans le cas contraire, l'utilisateur rentrera le nom lui-même et il aura quand même des actualités. Dans tous les cas, l'utilisateur pourra télécharger le fichier contenant les news dans le format et la langue qui lui conviennent

## API

L'API qui nous permet de faire des prédictions de nom de célebrité sur des images importées est Clarifai (https://www.clarifai.com/models/celebrity-image-recognition-model-e466caa0619f444ab97497640cefc4dc?fbclid=IwAR3QymrW3aZl7MSFJtzzgg9hvVVjDfjEu7LACxEdALKII0Wk5bBDdrXhYfk).

A partir de la prédiction effectuée par l'API précédente, nous utilisons une autre API qui trouvera une image correspondant à la célébrité. Pour celà, nous utilisons BINGAPI, l'API de Recherche d’images Bing (https://docs.microsoft.com/fr-fr/azure/cognitive-services/bing-image-search/).

Enfin, une liste d'actualité sur la célébrité sera retournée grâce à l'API News API(https://newsapi.org/).

## Déroulement

1. On commence par demander à l'utilisateur de rentrer son image dans la barre d'insertion, et en cliquant sur "Guess" on active la fonction loadFile(event) chez le client. Cette fonction permet d'une part de stocker l'image dans le serveur et de l'afficher à l'utilisateur sur le navigateur. Elle permet aussi de faire une requête POST vers le serveur grâce à un fetch sur la route "predict" et donc de récupérer le nom prédit par notre API Clarifai et l'image correspondant avec l'API BING.

2. Une fois que l'on a le nom et l'image prédit dans nos balises titi et toto,l'utilisateur a 2 choix: soit il valide la prédiction, soit il refuse le choix proposé.
    - Si il valide la prédiction, en cliquant sur le bouton de validation, l'utilisateur déclenche la fonction getNews(). Cette fonction va faire un fetch sur la route news/nom_de_la_célébrité pour récupérer les informations de l'API news. Elle va également modifier le html pour faire place à la présentation des news. 
    - Si l'utilisateur ne valide pas la prédiction, la fonction getNewPred() est lancée. Cette fonction lance un fetch sur la route 'ouput' du server. D'abord 'ouput/1' qui récupère la 2ème prédiction de l'API et, si l'utilisateur décide de ne pas valider encore une fois, 'ouput/2' qui récupère la 3ème prédiction. 
    <br>Au bout de ces 2 essais, l'application demande à l'utilisateur de rentrer le nom de la personne sur l'image insérée. Celà va ré-enclencher la fonction getNews() mais avec comme option le nom inséré par l'utilisateur avec un document.getElementById('celebrityName').value. 

3. L'utilisateur a quoi qu'il arrive une liste d'actualités sur la personne insérée en image. Soit par le biais du bouton radio, soit à la soumission du nom de la célébrité après 3 essais, avec l'accès à la fonction getNews(). La requête GET effectuée vers le serveur par le fetch sur la route /news/_nom_de_la_celebrité fera appel à l'API des actualités et créera l'espace nécessaire dans le navigateur pour afficher les news.  <br> Cette fonction permet aussi d'afficher la possibilité de téléchargement des actualités: titre, url, description et photo. L'utilisateur a loisir d'exporter ces informations en json ou csv.

## Difficultés rencontrées et perspectives

Certains membres de l'équipe avaient des lacunes sur la connaissance du logiciel de partage Github. Nous avons donc souvent eu recours au pair programming pour mutualiser les ressources et augmenter la créativité du groupe.
Aussi, certains n'étaient pas familier avec la notion de client et server par exemple et le partage du savoirà permis la montée en compétence de chaque membre du groupe. 
<br> Nous avons été efficace dans le travail et nous n'avons pas semblé manquer de temps dans ce projet.

Nous avons pensé à d'autres idées que seul le temps nous a empêché de réaliser:
- entrainer le modèle clarifai avec les images importées... En effet, ce modèle a du mal à reconnaitre les célébrités françaises
- ajouter une petite biographie de la personnalité