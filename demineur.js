var scanf = require('scanf');
var colors = require('colors');

// var grid = [
// 	[0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
// 	[0, 2, 'M', 2, 0, 0, 0, 0, 0, 0],
// 	[0, 2, 'M', 2, 0, 0, 0, 0, 0, 0],
// 	[0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
// 	[0, 0, 0, 0, 0, 1, 1, 1, "M", 1],
// 	[0, 0, 0, 0, 0, 1, "M", 3, 2, 1],
// 	[0, 0, 0, 0, 0, 1, 1, 2, "M", 1],
// 	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];
var grid = [];

class Cellule{
	constructor(){
		this.isRevealed = false;
		this.isFlagged = false;
	}
}

//Classe Mine qui hérite de Cellule
class Mine extends Cellule{
	constructor(){
		super();
		this.value = "M";
	}
}
//Classe Nombre qui hérite de Cellule
class Nombre extends Cellule{
	constructor(nombre){
		super();
		this.value = nombre;
	}
}

//Classe Démineur qui contient des cellule : soit des mines soit des nombres
class Démineur{
	constructor(){
		this.win = false;
		this.loose = false;
		this.gridCreator();
	}

	//Test de création de tableau aléatoirement de taille saisi par l'utilisateur
	gridCreator(){
		console.clear();
		var xMaxValid = false;
		var yMaxValid = false;
		var xChoice;
		var yChoice;
		while (!xMaxValid) { //Vérification du X compris entre 0 et 20
			console.log("\n   Taille du tableau axe X: (entre 5 et 20)");
			xChoice = scanf('%d');
			if (xChoice <= 20 && xChoice > 4) {
				xMaxValid = true;
			}
			else {
				console.log("\n   Veuillez rentrer une taille X entre 5 et 20");
			}
		}
		while (!yMaxValid) { //Vérification du Y compris entre 0 et 20
			console.log("\n   Taille du tableau axe Y: (entre 5 et 20)");
			yChoice = scanf('%d');
			if (yChoice <= 20 && yChoice > 4) {
				yMaxValid = true;
			}
			else {
				console.log("\n   Veuillez rentrer une taille Y entre 5 et 20");
			}
		}
		//remplissage du tableau de 0
		for(var i = 0; i < yChoice; i++){
			var ligne = [];
			for (var j = 0; j < xChoice; j++) {
				ligne.push(0);
			}
			grid.push(ligne);
		}
		//Remplacement des 0 par des cellule contenant 0
		var difficultyValid = false;
		while (!difficultyValid) {
			console.log("\n   Niveau de difficulté: 1 - 2 - 3");
			var	difficulty = scanf('%d');
			if(difficulty > 0 && difficulty <=3){ // gestion du nombre de mine à mettre en fonction de la difficulté
				var numberOfMine;
				if(difficulty == 1){
					numberOfMine = Math.ceil(xChoice * yChoice / 15); // 15 fois moins de mines que de case
				}
				else if(difficulty == 2){
					numberOfMine = Math.ceil(xChoice * yChoice / 10); //arrondi à l'entier supérieur
				}
				else if(difficulty == 3){
					numberOfMine = Math.ceil(xChoice * yChoice / 5);
				}
				this.remplissageCelluleGrid(); //changement des valeur en cellule nombre ou mine
				for(var n = 0; n < numberOfMine; n++){// ajout des mines en fonction du nombre de mine calculé au dessus
					var xRandom = Math.floor(Math.random() * xChoice);
					var yRandom = Math.floor(Math.random() * yChoice);
					grid[yRandom][xRandom].value="M";
				}
				difficultyValid = true;
			}
		}
		this.ajoutPointAutourMine();
	}

	remplissageCelluleGrid(){
		//Définition des point x et y max
		this.yMax = grid.length - 1;
		var ligne = grid[0];
		this.xMax = ligne.length - 1;
		//Assignation des cellules dans le grid
		for (var i = 0; i < grid.length; i++) {
			var ligne = grid[i];
			for (var j = 0; j < ligne.length; j++) {
				var currentCel = ligne[j];
				//Test si c'est un nombre ou une mine
				if(typeof(currentCel) === 'number' ){
				 ligne[j] = new Nombre(currentCel);
				}
				else{
				 ligne[j] = new Mine();
				}
			}
		}
	}

	ajoutPointAutourMine(){
		for (var i = 0; i < grid.length; i++) {
			var ligne = grid[i];
			for (var j = 0; j < ligne.length; j++) {
				var currentCel = ligne[j];
				if(currentCel.value == "M"){ //je cherche les mine
					if (i == 0) { //coté haut -- reprise de la fonction récursive de découverte des 0 adjacents
					  if (j == 0) { //angle haut a gauche
					    //dans toute ces fonction, je regarde si autour des mine ce sont des nombres et si oui je les incrémentent de 1
					    if (typeof(grid[i + 1][j].value) === 'number') {
					      grid[i + 1][j].value++;
					    }
					    if (typeof(grid[i + 1][j + 1].value) === 'number') {
					      grid[i + 1][j + 1].value++;
					    }
					    if (typeof(grid[i][j + 1].value) === 'number') {
					      grid[i][j + 1].value++;
					    }
					  } else if (j == this.xMax) { //angle haut a droite
					    if (typeof(grid[i + 1][j].value) === 'number') {
					      grid[i + 1][j].value++;
					    }
					    if (typeof(grid[i + 1][j - 1].value) === 'number') {
					      grid[i + 1][j - 1].value++;
					    }
					    if (typeof(grid[i][j - 1].value) === 'number') {
					      grid[i][j - 1].value++;
					    }
					  } else {
					    if (typeof(grid[i + 1][j - 1].value) === 'number') {
					      grid[i + 1][j - 1].value++;
					    }
					    if (typeof(grid[i + 1][j].value) === 'number') {
					      grid[i + 1][j].value++;
					    }
					    if (typeof(grid[i + 1][j + 1].value) === 'number') {
					      grid[i + 1][j + 1].value++;
					    }
					    if (typeof(grid[i][j + 1].value) === 'number') {
					      grid[i][j + 1].value++;
					    }
					    if (typeof(grid[i][j - 1].value) === 'number') {
					      grid[i][j - 1].value++;
					    }
					  }
					} else if (i == this.yMax) { //coté bas
					  if (j == 0) { //angle bas a gauche
					    if (typeof(grid[i][j + 1].value) === 'number') {
					      grid[i][j + 1].value++;
					    }
					    if (typeof(grid[i - 1][j + 1].value) === 'number') {
					      grid[i - 1][j + 1].value++;
					    }
					    if (typeof(grid[i - 1][j].value) === 'number') {
					      grid[i - 1][j].value++;
					    }
					  } else if (j == this.xMax) { //angle bas a droite
					    if (typeof(grid[i - 1][j].value) === 'number') {
					      grid[i - 1][j].value++;
					    }
					    if (typeof(grid[i - 1][j - 1].value) === 'number') {
					      grid[i - 1][j - 1].value++;
					    }
					    if (typeof(grid[i][j - 1].value) === 'number') {
					      grid[i][j - 1].value++;
					    }
					  } else {
					    if (typeof(grid[i][j + 1].value) === 'number') {
					      grid[i][j + 1].value++;
					    }
					    if (typeof(grid[i - 1][j + 1].value) === 'number') {
					      grid[i - 1][j + 1].value++;
					    }
					    if (typeof(grid[i - 1][j].value) === 'number') {
					      grid[i - 1][j].value++;
					    }
					    if (typeof(grid[i - 1][j - 1].value) === 'number') {
					      grid[i - 1][j - 1].value++;
					    }
					    if (typeof(grid[i][j - 1].value) === 'number') {
					      grid[i][j - 1].value++;
					    }
					  }
					} else if (j == 0) { //coté gauche
					  if (typeof(grid[i + 1][j].value) === 'number') {
					    grid[i + 1][j].value++;
					  }
					  if (typeof(grid[i + 1][j + 1].value) === 'number') {
					    grid[i + 1][j + 1].value++;
					  }
					  if (typeof(grid[i][j + 1].value) === 'number') {
					    grid[i][j + 1].value++;
					  }
					  if (typeof(grid[i - 1][j + 1].value) === 'number') {
					    grid[i - 1][j + 1].value++;
					  }
					  if (typeof(grid[i - 1][j].value) === 'number') {
					    grid[i - 1][j].value++;
					  }
					} else if (j == this.xMax) { //coté haut
					  if (typeof(grid[i + 1][j].value) === 'number') {
					    grid[i + 1][j].value++;
					  }
					  if (typeof(grid[i - 1][j].value) === 'number') {
					    grid[i - 1][j].value++;
					  }
					  if (typeof(grid[i - 1][j - 1].value) === 'number') {
					    grid[i - 1][j - 1].value++;
					  }
					  if (typeof(grid[i][j - 1].value) === 'number') {
					    grid[i][j - 1].value++;
					  }
					  if (typeof(grid[i + 1][j - 1].value) === 'number') {
					    grid[i + 1][j - 1].value++;
					  }
					} else { //milieu de la grille
					  if (typeof(grid[i + 1][j].value) === 'number') {
					    grid[i + 1][j].value++;
					  }
					  if (typeof(grid[i + 1][j + 1].value) === 'number') {
					    grid[i + 1][j + 1].value++;
					  }
					  if (typeof(grid[i][j + 1].value) === 'number') {
					    grid[i][j + 1].value++;
					  }
					  if (typeof(grid[i - 1][j + 1].value) === 'number') {
					    grid[i - 1][j + 1].value++;
					  }
					  if (typeof(grid[i - 1][j].value) === 'number') {
					    grid[i - 1][j].value++;
					  }
					  if (typeof(grid[i - 1][j - 1].value) === 'number') {
					    grid[i - 1][j - 1].value++;
					  }
					  if (typeof(grid[i][j - 1].value) === 'number') {
					    grid[i][j - 1].value++;
					  }
					  if (typeof(grid[i + 1][j - 1].value) === 'number') {
					    grid[i + 1][j - 1].value++;
					  }
					}
				}
			}
		}
	}

	display(){
		console.clear();
		var print = "\n\n\n";
		for (var i = 0; i < grid.length; i++) { // fonction de décomposition grid en lignes
			var ligne = grid[i];
			for (var j = 0; j < ligne.length; j++) { //fonction de décomposition lignes en cellules
				var currentCel = ligne[j];
				if (currentCel.isFlagged){
					print = print + "  [ƒ]".cyan;
				}
				else if (currentCel.isRevealed) {
					if(currentCel.value == 0){
						print = print + "  [ ]".white
					}
					else if(currentCel.value == 1){
						print = print + "  [1]".grey
					}
					else if(currentCel.value == 2){
						print = print + "  [2]".green
					}
					else if(currentCel.value == 3){
						print = print + "  [3]".red
					}
					else {
						print = print + "  [".black+ currentCel.value +"]".black
					}
				}
				else {
					print = print + "  ███";
				}
			}
			print = print + "   " + i;
			print = print + "\n\n\n";
		}
		for (var j = 0; j < ligne.length; j++) {
			print = print + "  " + j + "  ";
		}
		this.testWin();
		return console.log(print);
	}

	displayGrid(){
		return console.log(grid);
	}

	flag(x, y){
		if(grid[y][x].isFlagged){
			//Si on flag une case déjà flaggée, alors on déflag
			grid[y][x].isFlagged=false;
		}
		else {
			//Sinon on flag si la case est pas révélée
			if(!grid[y][x].isRevealed){
				grid[y][x].isFlagged=true;
			}
		}
		this.display();
	}

	click(x, y){
		if(grid[y][x].value==0 && !grid[y][x].isRevealed && !grid[y][x].isFlagged){ // Si case 0 et pas révélée et pas flaggée
			grid[y][x].isRevealed=true;
			this.test0(x, y);
		}
		else if(grid[y][x].value!=0 && !grid[y][x].isRevealed && !grid[y][x].isFlagged){ // Si case autre que 0 et pas révélée et pas flaggée
			grid[y][x].isRevealed=true;
		}
	}

	test0(x, y){ 	//Révèle les case adjacentes quand '0'
		if(y == 0) {  //coté haut
      if (x == 0) {  //angle haut a gauche
          this.click(x, y+1);
          this.click(x+1, y+1);
          this.click(x+1, y);
      } else if (x == this.xMax) {  //angle haut a droite
          this.click(x, y+1);
          this.click(x-1, y+1);
          this.click(x-1, y);
      }
      else{
          this.click(x-1, y+1);
          this.click(x, y+1);
          this.click(x+1, y+1);
          this.click(x+1, y);
          this.click(x-1, y);
      }
  	}
	  else if(y == this.yMax) {  //coté bas
      if (x == 0) {  //angle bas a gauche
          this.click(x+1, y);
          this.click(x+1, y-1);
          this.click(x, y-1);
      } else if (x == this.xMax) {  //angle bas a droite
          this.click(x, y-1);
          this.click(x-1, y-1);
          this.click(x-1, y);
      }
      else{
          this.click(x+1, y);
          this.click(x+1, y-1);
          this.click(x, y-1);
          this.click(x-1, y-1);
          this.click(x-1, y);
      }
	  }
	  else if(x == 0) {  //coté gauche
	      this.click(x, y+1);
	      this.click(x+1, y+1);
	      this.click(x+1, y);
	      this.click(x+1, y-1);
	      this.click(x, y-1);
	  }
	  else if(x == this.xMax) {  //coté haut
	      this.click(x, y+1);
	      this.click(x, y-1);
	      this.click(x-1, y-1);
	      this.click(x-1, y);
	      this.click(x-1, y+1);
	  }
		else {  //milieu de la grille
      this.click(x, y+1);
      this.click(x+1, y+1);
      this.click(x+1, y);
      this.click(x+1, y-1);
      this.click(x, y-1);
      this.click(x-1, y-1);
      this.click(x-1, y);
      this.click(x-1, y+1);
    }
	}

	testWin(){
		//Fonction de test si le jeu est gangné ou perdu
		var validCel = true;
		var mineRevealed = false;
		for (var i = 0; i < grid.length; i++) { // fonction de décomposition grid en lignes
			var ligne = grid[i];
			for (var j = 0; j < ligne.length; j++) { //fonction de décomposition lignes en cellules
				var currentCel = ligne[j];
				if (!currentCel.isRevealed && currentCel.value!="M"){
					validCel=false;
				}
				if (currentCel.isRevealed && currentCel.value=="M"){
					mineRevealed = true;
				}
			}
		}
		if(validCel){
			//Si validCel n'est pas passé à false alors c'est gagné
			this.win = true;
			console.log("\n\n             Gagné\n\n");
		}
		if(mineRevealed){
			//Si une mine a été révélée alors c'est perdu
			this.loose = true;
			console.log("\n\n             Perdu\n\n");
		}
	}

	askCoordCel(){
		//Vérification de X rentré par l'utilisateur
		var coordValid = false;
		var xInput;
		var yInput;
		while(!coordValid){
			console.log("\n   X:");
			xInput = scanf('%d');
			if(xInput <= this.xMax && xInput >= 0){
				coordValid = true;
			}
			else{
				console.log("Coordonnée X Invalide");
			}
		}
		//Vérification de Y rentré par l'utilisateur
		var coordValid = false;
		while(!coordValid){
			console.log("\n   Y:");
			yInput = scanf('%d');
			if(yInput <= this.yMax && yInput >=0){
				coordValid = true;
			}
			else{
				console.log("Coordonnée Y Invalide");
			}
		}
		return([xInput, yInput]);
	}

	choice(){
		console.log("\n\n      Choix :\n\n   [1] Flagger \n   [2] Cliquer");
		var choix = scanf('%d');  //On demande à l'utilisateur de rentrer un entier
		return choix;
	}

	play(){
		while(!this.win && !this.loose){
			this.display();
			var choixValide = false;
			while(!choixValide){ //Vérification de la validité du choix -> 1 ou 2 sinon on boucle
				var choixAction = this.choice();
				if(choixAction == 1 || choixAction == 2){
					choixValide = true;
				}
				else {
					console.log("Choix invalide !");
				}
			}
			if(choixAction == 1){
				var values = this.askCoordCel(); //askCoordCel retourne un tableau avec X à l'index 0 et Y à l'index 1 -> saisi par l'utlisateur
				var xInput = values[0];			//On décompose le tableau récupéré
				var yInput = values[1];			//en 2 variables
				this.flag(xInput, yInput);
			}
			else if(choixAction == 2){
				var values = this.askCoordCel();
				var xInput = values[0];
				var yInput = values[1];
				this.click(xInput, yInput);
			}
			this.display();
		}
	}
}

var jeu = new Démineur(); //On créer un démineur
jeu.play();               //Et on joue
