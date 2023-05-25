document.addEventListener('DOMContentLoaded', async function () {

    const listePokemon = document.getElementById('listePokemon');
    const url = "https://pokeapi.co/api/v2/pokemon";
    const pokemons = [];
    const searchInput = document.getElementById('searchInput');
    const limit = 20; // Nombre d'éléments à afficher par page
    let offset = 0;
    fetch(url, "GET", printPoke)
    function fetch(url, method, fun) {
        //Initialisation de XHR
        const request = new XMLHttpRequest();
        request.addEventListener("load", fun)
        //Spécifier le type d'appelle [ GET, POST, PUT, PATCH, DELETE ] et l'URL
        request.open(method, url);
        //Spécification que je veux du JSON en type de retour
        request.setRequestHeader('Accept', "application/json")
        //Permet d'envoyer la requêtes
        request.send()
    }


    function printPoke() {
        //Je parse/converti mon objet en JSON pour appeler les attributs de l'objet
        let result = JSON.parse(this.response);
        // Je boucle sur le tableau de résultat
        for (let i = 0; i < result.results.length; i++) {
            //Je push/pousser mon li dans mon Ul qui a pour id 'jokes'
            let li = creationLI(result.results[i])
            pokemons.push(result.results[i])
            listePokemon.append(li);
        }
    }

    function getIdFromUrl(url) {
        const urlParts = url.split("/");
        return urlParts[urlParts.length - 2];
    }

    function creationLI(pokemon) {
        //Je crée mon <li></li>
        const pokemonId = getIdFromUrl(pokemon.url);
        let li = document.createElement('li');
        // Je met la valeur de mon pokemon dans mon li
        li.innerHTML = "#" + pokemonId + " - " + pokemon.name;
        li.setAttribute('data-id', pokemonId);
        li.setAttribute('data-name', pokemon.name);
        li.addEventListener('click', (event) => {
            fetch(pokemon.url, 'GET', (e) => {
                let data = JSON.parse(e.target.response);

                const blocDroit = document.getElementById('blocc');
                blocDroit.style.display = "flex";
                const imgPoke = document.getElementById('imgPokemon');
                imgPoke.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemonId + ".png";
                imgPoke.append(imgPoke.src);

                const idNomPoke = document.getElementById('idNomPokemon');
                idNomPoke.textContent = li.innerHTML;

                const typePoke = document.getElementById('typePokemon');
                typePoke.textContent = "Type : " + data.types[0].type.name;

                const heightPoke = document.getElementById('heightPokemon');
                heightPoke.textContent = "Taille : " + data.height;

                const weightPoke = document.getElementById('weightPokemon');
                weightPoke.textContent = "Poids : " + data.weight;


            })

        })
        return li;
    }


    // pagination precedent
    document.getElementById('pagePrecedent').addEventListener('click', function () {
        if (offset >= limit) {
            listePokemon.innerHTML = "";
            offset -= limit;
            const urlWithOffset = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
            fetch(urlWithOffset, 'GET', printPoke)
        }
    });
    // pagination suivant
    document.getElementById('pageSuivante').addEventListener('click', function () {
        listePokemon.innerHTML = "";
        offset += limit;
        const urlWithOffset = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
        fetch(urlWithOffset, 'GET', printPoke)
    });


    searchInput.addEventListener('input', handleSearchInput);

    // // ...

    function handleSearchInput() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        console.log(searchTerm);
        // Réinitialiser la liste de Pokémon
        listePokemon.innerHTML = '';

        // Vérifier si le terme de recherche n'est pas vide
        let pokemonFiltered = pokemons.filter(pok => pok.name.includes(searchTerm))

        for (let index = 0; index < pokemonFiltered.length; index++) {
            const element = pokemonFiltered[index];
            let li = creationLI(element)
            listePokemon.append(li)
        }

        //Equivalent du for avec un tableau d'objet
        // pokemonFiltered.map((toto) => {
        //     console.log(toto);
        // })
    }

    function printPokeWithType() {
        let result = JSON.parse(this.response);
        result = result.pokemon;

        for (let i = 0; i < result.length; i++) {
            let li = creationLI(result[i].pokemon)
            listePokemon.append(li);
        }

    }


    const selectTypes = document.getElementById('selectTypes');
    const selectTypeee = selectTypes.value;
    selectTypes.addEventListener('change', handleTypeSelection);

    function handleTypeSelection() {
        const selectedType = selectTypes.value;

        // Réinitialiser la liste de Pokémon

        listePokemon.innerHTML = '';

        // Construire l'URL avec le type sélectionné
        const urlWithType = `https://pokeapi.co/api/v2/type/${selectedType}`;

        // Effectuer la requête pour récupérer les Pokémon du type sélectionné
        fetch(urlWithType, "GET", printPokeWithType)
    }

});