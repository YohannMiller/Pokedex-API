// Lien pour l'API monstre de poche
let apiLink = "https://pokebuildapi.fr/api/v1/pokemon"

const pokedex = document.getElementById("pokedex")
const searchInput = document.getElementById("search")
const typeFilter = document.getElementById("type-filter")

let allPokemons = []
let allTypes = new Set()

fetch(apiLink)
    .then(res => res.json())
    .then(data => {
        allPokemons = data
        // Récupérer tous les types uniques
        data.forEach(pokemon => {
            pokemon.apiTypes.forEach(typeInfo => allTypes.add(typeInfo.name))
        })
        // Remplir le select des types
        allTypes.forEach(type => {
            const option = document.createElement("option")
            option.value = type
            option.textContent = type
            typeFilter.appendChild(option)
        })
        renderPokemons(data)
    })
    .catch(error => console.log('Erreur:', error))

function renderPokemons(pokemons) {
    pokedex.innerHTML = ""
    pokemons.forEach((pokemon, index) => {
        let name = pokemon.name
        let id = pokemon.id
        let image = pokemon.image
        let type = pokemon.apiTypes.map(typeInfo => typeInfo.name).join(", ")
        let stats = pokemon.stats

        let wrapper = document.createElement("div")
        let h2 = document.createElement("h2")
        let p = document.createElement("p")
        let img = document.createElement("img")
        let statsDiv = document.createElement("div")

        wrapper.classList.add("pokemon-wrapper")
        img.classList.add("pokemon-img")
        statsDiv.classList.add("pokemon-stats")

        wrapper.style.opacity = 0;
        wrapper.style.transform = `translateX(${index % 2 === 0 ? '-' : ''}100vw)`;

        h2.textContent = `${name} (#${id})`
        p.textContent = `Type: ${type}`
        img.src = image

        statsDiv.innerHTML = `
            <p>HP: ${stats.HP}</p>
            <p>Attack: ${stats.attack}</p>
            <p>Defense: ${stats.defense}</p>
            <p>Special Attack: ${stats.special_attack}</p>
            <p>Special Defense: ${stats.special_defense}</p>
            <p>Speed: ${stats.speed}</p>
        `

        // Affichage des détails au clic sur la carte (hors point bleu)
        wrapper.addEventListener('click', function(event) {
            // Si on clique sur le point bleu, on ne fait rien ici
            if (event.target.classList.contains('poke-blue-dot')) return;

            document.querySelectorAll('.pokemon-wrapper').forEach(el => {
                el.style.display = 'none';
            });
            wrapper.style.display = 'block';
            wrapper.classList.add('pokemon-detail');
            if (!wrapper.querySelector('.pokemon-stats')) wrapper.appendChild(statsDiv);
        });

        // Ajout du point bleu interactif
        let blueDot = document.createElement('div');
        blueDot.className = 'poke-blue-dot';
        wrapper.appendChild(blueDot);

        // Gestion du retour en arrière via le point bleu
        blueDot.addEventListener('click', function(event) {
            event.stopPropagation();
            // On revient à la liste
            document.querySelectorAll('.pokemon-wrapper').forEach(el => {
                el.style.display = 'block';
                el.classList.remove('pokemon-detail');
            });
            // On retire les stats détaillées si besoin
            if (wrapper.querySelector('.pokemon-stats')) {
                statsDiv.remove();
            }
        });

        wrapper.append(h2, img, p)
        pokedex.appendChild(wrapper)

        setTimeout(() => {
            wrapper.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
            wrapper.style.transform = 'translateX(0)';
            wrapper.style.opacity = 1;
        }, 100 * index);
    })
}

// Recherche et filtre
function filterPokemons() {
    const searchValue = searchInput.value.toLowerCase()
    const typeValue = typeFilter.value
    let filtered = allPokemons.filter(pokemon => {
        const matchName = pokemon.name.toLowerCase().includes(searchValue)
        const matchType = typeValue === "" || pokemon.apiTypes.some(t => t.name === typeValue)
        return matchName && matchType
    })
    renderPokemons(filtered)
}

searchInput.addEventListener("input", filterPokemons)
typeFilter.addEventListener("change", filterPokemons)