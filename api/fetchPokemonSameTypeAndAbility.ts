import { AllPokemon, Pokemon } from "@/types";
import client from "./ky.config";
import fetchPokemon from "./fetchPokemon";
import toast from "react-hot-toast";

async function getPokemonTypesAndAbilities(id: number | string) {
  // fetch the pokemon data using the id
  const { data: pokemon, error } = await fetchPokemon(id);
  if (error || !pokemon) throw new Error("Failed to Fetch Pokemon");

  // get all the types and abilities in a array
  const types = pokemon.types.map((type) => type.type.name);
  const abilities = pokemon.abilities.map((ability) => ability.ability.name);
  return { types, abilities };
}

async function fetchAllPokemons(names: string[]) {
  // map over the array of names and fetch each pokemon
  const fetchArray = names.map((name) =>
    client.get<Pokemon>(`pokemon/${name}`).json()
  );
  const results = await Promise.all(fetchArray);
  return results.map((res) => res);
}

export default async function fetchPokemonsSameTypeAndAbility(
  id: string | number
) {
  try {
    const machedPokemons = [];

    // get the selected pokemon types and abilities
    const { types, abilities } = await getPokemonTypesAndAbilities(id);
    // fetcher over a 2000 pokemons
    const allPokemonsResponse = await client.get("pokemon?limit=2000");
    if (!allPokemonsResponse.ok) {
      throw new Error("Failed to fetch all pokemons");
    }

    // get all the data for the pokemons to compare
    const allPokemonsNames = await allPokemonsResponse.json<AllPokemon>();
    const allPokemonsData = await fetchAllPokemons(
      allPokemonsNames.results.map((p) => p.name)
    );
    if (!allPokemonsData) throw new Error("Failed to fetch the data");

    // check if the pokemon has the same type and ability
    for (const pokemon of allPokemonsData) {
      if (!pokemon || !("types" in pokemon) || !("abilities" in pokemon!))
        continue;
      const otherTypes = pokemon!.types.map((type) => type.type.name);
      const otherAbilities = pokemon!.abilities.map(
        (ability) => ability.ability.name
      );

      const hasMatchingAbility = otherAbilities.every((ability) =>
        abilities.includes(ability)
      );
      const hasMatchingType = otherTypes.every((type) => types.includes(type));

      // if yes we add it to array if not we continue
      if (hasMatchingAbility && hasMatchingType) {
        machedPokemons.push(pokemon);
      }
    }
    // remove the selected pokemon
    const filteredPokemons = machedPokemons.filter(
      (pokemon) => pokemon.id != id
    );
    return filteredPokemons;
  } catch (error) {
    toast.error((error as Error).message);
    return [];
  }
}
