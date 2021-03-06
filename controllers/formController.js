function formController($scope, $http) {
  $scope.title = "Hey!";
  // variable qui contiendra la data open weather
  var data = {};
  // variable permettant de cacher des éléments quand on arrive
  // dans l'app
  $scope.firstTime = false;
  
  // settings et permissions de la map
  var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/balthazar.nnbl166e/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmFsdGhhemFyIiwiYSI6ImNpZnNub2kxdDAxdjZ0ZG0wZm51amJhaXMifQ.Ltgv_P4UktIZJRGjurLGBg');
  
  // création de la map
  var map = L.map('map')
    // ajout des settings (jolie map cartoon) à la map
    .addLayer(mapboxTiles)
    // OK city !
    .setView([42.3610, -71.0587], 12);
  
  function updateWeather(weather) {
    // stockage du code icon envoyé par l'API
    var icon = weather.icon;
    // stockage de l'élément DOM qui représente l'icon
    var image = document.querySelector("img");
    // update l'élément img avec un nouveau chemin pour trouver
    // la bonne icon
    image.src = "http://openweathermap.org/img/w/" + icon + ".png";
    // on affiche l'image (ng-show)
    $scope.image = true;
    // affiche la température arrondie
    $scope.temperature = Math.round(data.main.temp);
    // stock l'élément DOM image marinette
    var marinette = document.querySelector('.marinette');
    // si la température est suffisamment grand affiche
    // une image ou l'autre
    if (Math.round(data.main.temp) > 15)
      marinette.src = "http://i.imgur.com/BSAdK4t.png";
    else
      marinette.src = "http://i.imgur.com/GxHvKQL.png";
  }
  
  function updateMap(coord) {
    // resize la map a chaque fois pour être sûr qu'elle se
    // charge bien
    map.resize;
    // change la lat et la lon en fonction
    map.panTo(new L.LatLng(coord.lat, coord.lon));
    // affiche tous nos bails
    $scope.firstTime = true;
  }
  
  function checkPHMA(shom) {
    // variable controlant notre boucle
    i = 0;
    // stop la boucle en fonction de la taille de l'array
    // retourné par l'api shom
    len = shom.records.length;
    // la boucle !
    while (i < len) {
      // si le nom de la localité trouvée est bien égale à notre
      // localité
      if (shom.records[i].fields.site == data.name) {
        // le phma dans notre view est updaté
        $scope.nm = shom.records[i].fields.phma;
        // on cache les mots wow et omg
        $scope.big = false;
        $scope.huge = false;
        // si le phma est d'une certaine taille
        if ($scope.nm > 300 && $scope.nm < 1000)
          // on met wow
          $scope.big = true;
        // si le phma est d'une taille certaine
        if ($scope.nm > 1000)
          // on met omg
          $scope.huge = true;
        return
      }
      // on incrémente !
      ++i;
    }
    $scope.nm = false;
  }
  
  function updatePHMA() {
    $http({
      method: "GET",
      url: " https://shom.opendatasoft.com/api/records/1.0/search?dataset=references-altimetriques-maritimes0&q=" + data.name + "&facet=zone&facet=rf&facet=organisme&facet=reference"
    }).then(function sucess(res) {
      checkPHMA(res.data);
    }, function fail(res) {
      console.log("erreur shom : " + res);
    })
  }
  
  // DOM = éléments composant la page html
  function updateDOM() {
    // change le titre de la page avec le nom de la ville
    $scope.title = data.name;
    // appelle une fonction avec le weather contenu dans la data
    updateWeather(data.weather[0]);
    // appelle une fonction avec les coordonées
    updateMap(data.coord);
    // dernière fonction
    updatePHMA();
  }
  
  // fonction principale qui récupère la data, interroge open
  // weather et appelle les autres fonctions qui updatent le
  // and shit
  $scope.sendForm = function() {
    // si le form est vide la fonction ne s'exécute pas
    if (!$scope.form || $scope.form === "") { return }
    // stock la data entrée par l'utilisateur
    var location = $scope.form;
    // vide le form
    $scope.form = "";
    // envoit la requête à open weather !
    $http({
      // type de méthode
      method: "GET",
      // url avec notre localisation entrée par l'user
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=metric&APPID=39583154fb47ae5a44360b9c46bb99d2"
      // fonction appellée après la requête
      // une fonction en cas de réussite de la requête
      // res = la réponse de la requête
    }).then(function sucess(res) {
      // stock la data dans notre variable "globale"
      // cad accessible aux autres fonctions
      data = res.data;
      // appelle la fonction qui update le dom et fait les
      // autres requêtes
      updateDOM();
      // fonction en cas d'erreur
    }, function fail(res) {
      // affiche l'erreur dans la console
      console.log("error : " + res)
    });
  }
}