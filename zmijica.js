$(document).ready(function() {
    const velicinaTable = 20;
    const velicinaCelije = 20;
    const pocetnaDuzinaZmijice = 3;
    const hranaPoeni = 1;
    const superHranaPoeni = 10;
    const superHranaInterval = 10000;
    const brzineIgre = {
        lako: 300,
        srednje: 200,
        tesko: 100
    };

    let zmijica = [];
    let hrana = {};
    let superHrana = {};
    let pravac = "desno";
    let poeni = 0;
    let petljaIgre;
    let superHranaTajmer;
    let igraUToku = false;

    const tablaIgre = $("#game-board");
    tablaIgre.css({
        width: velicinaTable * velicinaCelije + "px",
        height: velicinaTable * velicinaCelije + "px"
    });

    function inicijalizujIgru() {
        napraviZmijicu();
        generisiHranu();
        zapocniPetljuIgre();
        zapocniTajmerSuperHrane();
        prikazRezultata();
        $(document).keydown(pritisniTaster);
    }

    function napraviZmijicu() {
        const startX = Math.floor(velicinaTable / 2);
        const startY = Math.floor(velicinaTable / 2);

        for (let i = 0; i < pocetnaDuzinaZmijice; i++)
            zmijica.push({x: startX - i, y: startY - i});

        tablaIgre.find(".snake-node").remove();

        for (let i = 0; i < zmijica.length; i++) {
            const snakeNode = $("<div>").addClass("snake-node");
            snakeNode.css({
                left: zmijica[i].x * velicinaCelije + "px",
                top: zmijica[i].y * velicinaCelije + "px"
            });
            tablaIgre.append(snakeNode);
        }
    }

    function generisiHranu() {
        const hranaX = Math.floor(Math.random() * velicinaTable);
        const hranaY = Math.floor(Math.random() * velicinaTable);
        hrana = {x: hranaX, y: hranaY};

        const hranaNode = $("<div>").addClass("food");
        hranaNode.css({
            left: hranaX * velicinaCelije + "px",
            top: hranaY * velicinaCelije + "px"
        });
        tablaIgre.append(hranaNode);
    }

    function generisiSuperHranu() {
        const superHranaX = Math.floor(Math.random() * velicinaTable);
        const superHranaY = Math.floor(Math.random() * velicinaTable);
        superHrana = {x: superHranaX, y: superHranaY};

        const superHranaNode = $("<div>").addClass("super-food");
        superHranaNode.css({
            left: superHranaX * velicinaCelije + "px",
            top: superHranaY * velicinaCelije + "px"
        });
        tablaIgre.append(superHranaNode);

        setTimeout(izbrisiSuperHranu, superHranaInterval);
    }

    function izbrisiSuperHranu() {
        tablaIgre.find(".super-food").remove();
        generisiSuperHranu();
    }

    function zapocniPetljuIgre() {
        petljaIgre = setInterval(pomeriZmijicu, brzineIgre.srednje);
    }

    function zaustaviPetljuIgre() {
        clearInterval(petljaIgre);
    }

    function zapocniTajmerSuperHrane() {
        superHranaTajmer = setTimeout(izbrisiSuperHranu, superHranaInterval);
    }

    function zaustaviTajmerSuperHrane() {
        clearInterval(superHranaTajmer);
    }

    function pomeriZmijicu() {
        if (!igraUToku) return;
        const glava = Object.assign({}, zmijica[0]);

        switch (pravac) {
            case "up":
                glava.y--;
                break;
            case "down":
                glava.y++;
                break;
            case "left":
                glava.x--;
                break;
            case "right":
                glava.x++;
                break;
        }

        if (glava.x < 0 || glava.x >= velicinaTable || glava.y < 0 || glava.y >= velicinaTable) {
            gotovaIgra();
            return;
        }

        for (let i = 1; i < zmijica.length; i++) {
            if (zmijica[i].x === glava.x && zmijica[i].y === glava.y) {
                gotovaIgra();
                return;
            }
        }

        if (glava.x === hrana.x && glava.y === hrana.y) {
            poeni += hranaPoeni;
            prikazRezultata();
            zmijica.unshift(glava);

            tablaIgre.find(".snake-node").remove();

            for (let i = 0; i < zmijica.length; i++) {
                const snakeNode = $("<div>").addClass("snake-node");
                snakeNode.css({
                    left: zmijica[i].x * velicinaCelije + "px",
                    top: zmijica[i].y * velicinaCelije + "px"
                });
                tablaIgre.append(snakeNode);
            }

            tablaIgre.find(".food").remove();
            generisiHranu();
        }
        else if (glava.x === superHrana.x && glava.y === superHrana.y) {
            poeni += superHranaPoeni;
            prikazRezultata();
            zmijica.unshift(glava);

            tablaIgre.find(".snake-node").remove();

            for (let i = 0; i < zmijica.length; i++) {
                const snakeNode = $("<div>").addClass("snake-node");
                snakeNode.css({
                    left: zmijica[i].x * velicinaCelije + "px",
                    top: zmijica[i].y * velicinaCelije + "px"
                });
                tablaIgre.append(snakeNode);
            }

            tablaIgre.find(".super-food").remove();
            zaustaviTajmerSuperHrane();
        }
        else {
            zmijica.unshift(glava);
            zmijica.pop();
            tablaIgre.find(".snake-node").remove();

            for (let i = 0; i < zmijica.length; i++) {
                const snakeNode = $("<div>").addClass("snake-node");
                snakeNode.css({
                    left: zmijica[i].x * velicinaCelije + "px",
                    top: zmijica[i].y * velicinaCelije + "px"
                });
                tablaIgre.append(snakeNode);
            }
        }
  
    }

    function pritisniTaster(dogadjaj) {
        const taster = dogadjaj.keyCode;

        if (taster === 38 && pravac !== "down") pravac = "up";
        else if (taster === 40 && pravac !== "up") pravac = "down";
        else if (taster == 37 && pravac !== "right") pravac = "left";
        else if (taster == 39 && pravac !== "left") pravac = "right";
    }

    function gotovaIgra() {
        zaustaviPetljuIgre();
        zaustaviTajmerSuperHrane();
        $(document).off("keydown");

        const imeIgraca = prompt("Unesi svoje ime:");
        sacuvajRezultat(imeIgraca, poeni);

        window.location.href = "zmijica-rezultati.html";
    }

    function sacuvajRezultat(imeIgraca, poeni) {
        let rezultat = {
            imeIgraca: imeIgraca,
            poeni: poeni
        };

        let stariRezultat = {
            imeIgraca: imeIgraca,
            poeni: poeni
        }

        let rezultati = JSON.parse(localStorage.getItem("zmijicaRezultati")) || [];
        rezultati.push(rezultat);
        rezultati.sort(function(a, b) {
            return b.poeni - a.poeni;
        });
        rezultati = rezultati.slice(0, 5);
        localStorage.setItem("zmijicaRezultati", JSON.stringify(rezultati));
        localStorage.setItem("stariRezultat", JSON.stringify(stariRezultat));
    }

    $(document).keydown(function(e) {
        if (!igraUToku) {
            if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
                igraUToku = true;
            }
        }
    });

    inicijalizujIgru();

    function prikazRezultata() {
        if (window.location.pathname.includes("zmijica-igra.html")) {
            const rezultatElement = document.getElementById("score");
            rezultatElement.textContent = "Poeni: " + poeni;
        }
    }

    function prikaziRezultate() {
        const rezultati = JSON.parse(localStorage.getItem("zmijicaRezultati")) || [];
        const rezultatiTabela = document.getElementById("rezultati");

        rezultatiTabela.innerHTML = "";

        rezultati.forEach((rezultat, index) => {
            const red = document.createElement("tr");
            const imeIgracaCelija = document.createElement("td");
            const rezultatCelija = document.createElement("td");

            imeIgracaCelija.textContent = rezultat.imeIgraca;
            rezultatCelija.textContent = rezultat.poeni;

            red.appendChild(imeIgracaCelija);
            red.appendChild(rezultatCelija);
            rezultatiTabela.appendChild(red);

            if (index === 0) {
                imeIgracaCelija.classList.add("gold");
                rezultatCelija.classList.add("gold");
            }
            else if (index === 1) {
                imeIgracaCelija.classList.add("silver");
                rezultatCelija.classList.add("silver");
            }

            else if (index === 2) {
                imeIgracaCelija.classList.add("bronze");
                rezultatCelija.classList.add("bronze");
            }
        });
    }

    if (window.location.pathname.includes("zmijica-rezultati.html")) prikaziRezultate();
});