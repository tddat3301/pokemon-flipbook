const flipbookContainer = document.querySelector(".flipbook");

// Utility function to create a flipbook page
function createPokemonPage(pokemon, species) {
  const page = document.createElement("div");
  page.className = "page";

  const img = document.createElement("img");
  img.src = pokemon.sprites.other["official-artwork"].front_default;
  img.alt = pokemon.name;

  const name = document.createElement("small");
  name.textContent = capitalize(pokemon.name);

  const info = document.createElement("small");
  info.textContent = `Height: ${pokemon.height} | Weight: ${pokemon.weight}`;

  const bio = document.createElement("small");
  const flavor = species.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );
  bio.textContent = flavor
    ? flavor.flavor_text.replace(/\f/g, " ")
    : "No bio available.";

  page.appendChild(img);
  page.appendChild(name);
  page.appendChild(info);
  page.appendChild(bio);

  return page;
}

// Capitalize function
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadPokemonDemo() {
  const flipbookContainer = document.querySelector(".flipbook");

  // Save existing static pages
  const staticPages = Array.from(flipbookContainer.children);
  const introPages = staticPages.slice(0, 3); // first 3
  const outroPages = staticPages.slice(-2); // last 2

  // Clear flipbook for rebuild
  flipbookContainer.innerHTML = "";

  // Add intro pages back
  introPages.forEach((page) => flipbookContainer.appendChild(page));

  // Load Pokémon pages
  const pokemonIDs = [4, 24, 7, 25, 1]; // Charmander, Arbok, Squirtle, Pikachu, Bulbasaur

  for (const id of pokemonIDs) {
    try {
      const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemon = await pokemonRes.json();

      const speciesRes = await fetch(pokemon.species.url);
      const species = await speciesRes.json();

      const page = createPokemonPage(pokemon, species);
      flipbookContainer.appendChild(page);
    } catch (err) {
      console.error(`Error loading Pokémon ID ${id}:`, err);
    }
  }

  // Add outro pages back
  outroPages.forEach((page) => flipbookContainer.appendChild(page));

  // Re-initialize flipbook
  $(".flipbook").turn();
}

loadPokemonDemo();
