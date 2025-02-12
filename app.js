// Lien pour l'API monstre de poche
let apiLink = "https://pokebuildapi.fr/api/v1/pokemon"

// Sélectionner l'élément où les Pokémon seront affichés
const pokedex = document.getElementById("pokedex")

// Utiliser Fetch pour faire la requête GET
fetch(apiLink)
    .then(res => res.json()) // Traduire la réponse depuis JSON
    .then(data => {
        console.log('Données récupérées:', data); // Log des données récupérées
        // Boucler dans le tableau de Pokémon "data"
        data.forEach((pokemon, index) => {
            // Récupérer les détails de chaque Pokémon
            let name = pokemon.name
            let id = pokemon.id
            let image = pokemon.image
            let type = pokemon.apiTypes.map(typeInfo => typeInfo.name).join(", ")
            let stats = pokemon.stats

            // Créer les éléments HTML pour afficher les détails du Pokémon
            let wrapper = document.createElement("div")
            let h2 = document.createElement("h2")
            let p = document.createElement("p")
            let img = document.createElement("img")
            let statsDiv = document.createElement("div")
            let backArrow = document.createElement("div")

            // Ajouter des classes CSS aux éléments HTML créés
            wrapper.classList.add("pokemon-wrapper")
            img.classList.add("pokemon-img")
            statsDiv.classList.add("pokemon-stats")
            backArrow.classList.add("back-arrow")
            backArrow.innerHTML = "&#8592;" // Flèche gauche

            // Ajouter des animations de chargement
            wrapper.style.opacity = 0;
            wrapper.style.transform = `translateX(${index % 2 === 0 ? '-' : ''}100vw)`;

            // Donner du contenu aux éléments HTML
            h2.textContent = `${name} (#${id})`
            p.textContent = `Type: ${type}`
            img.src = image

            // Ajouter les statistiques du Pokémon
            statsDiv.innerHTML = `
                <p>HP: ${stats.HP}</p>
                <p>Attack: ${stats.attack}</p>
                <p>Defense: ${stats.defense}</p>
                <p>Special Attack: ${stats.special_attack}</p>
                <p>Special Defense: ${stats.special_defense}</p>
                <p>Speed: ${stats.speed}</p>
            `

            // Ajouter un écouteur d'événement pour afficher uniquement le Pokémon cliqué
            wrapper.addEventListener('click', (event) => {
                // Vérifier si le clic est sur la flèche de retour
                if (event.target.classList.contains('back-arrow')) {
                    return;
                }

                // Masquer tous les autres Pokémon
                document.querySelectorAll('.pokemon-wrapper').forEach(el => {
                    el.style.display = 'none';
                });
                // Afficher uniquement le Pokémon cliqué avec des animations supplémentaires
                wrapper.style.display = 'block';
                wrapper.classList.add('pokemon-detail');

                // Ajouter la flèche de retour
                backArrow.addEventListener('click', (event) => {
                    event.stopPropagation(); // Empêcher la propagation du clic au wrapper
                    // Ajouter l'animation de retour
                    wrapper.style.animation = 'slideOut 0.5s ease-in-out';
                    setTimeout(() => {
                        // Changer la couleur de fond de la page
                        document.body.style.background = 'linear-gradient(135deg, #ffeb3b, #ff9800)';
                        // Afficher tous les Pokémon
                        document.querySelectorAll('.pokemon-wrapper').forEach(el => {
                            el.style.display = 'block';
                            el.classList.remove('pokemon-detail');
                            el.style.animation = 'slideIn 0.5s ease-in-out';
                        });
                        // Supprimer les statistiques du Pokémon
                        document.querySelectorAll('.pokemon-stats').forEach(el => {
                            el.remove();
                        });
                        // Supprimer la flèche de retour
                        backArrow.remove();
                    }, 500); // Durée de l'animation
                });
                // Ajouter la flèche de retour uniquement s'il n'existe pas déjà
                if (!wrapper.querySelector('.back-arrow')) {
                    wrapper.appendChild(backArrow);
                }
                // Ajouter les statistiques du Pokémon
                if (!wrapper.querySelector('.pokemon-stats')) {
                    wrapper.appendChild(statsDiv);
                }
            });

            // Insérer les éléments sur la page HTML
            wrapper.append(h2, img, p)
            pokedex.appendChild(wrapper)

            // Ajouter l'animation de glissement vers le milieu
            setTimeout(() => {
                wrapper.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
                wrapper.style.transform = 'translateX(0)';
                wrapper.style.opacity = 1;
            }, 100 * index);
        })
    })
    .catch(error => console.log('Erreur:', error)) // Log des erreurs