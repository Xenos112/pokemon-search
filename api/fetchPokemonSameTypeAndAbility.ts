import { AllPokemon } from "@/types";
import client from "./ky.config";
import fetchPokemon from "./fetchPokemon";
import toast from "react-hot-toast";

async function getPokemonTypesAndAbilities(id: number | string) {
  const { data: pokemon, error } = await fetchPokemon(id);
  if (error || !pokemon) throw new Error("Failed to Fetch Pokemon");

  const types = pokemon.types.map((type) => type.type.name);
  const abilities = pokemon.abilities.map((ability) => ability.ability.name);
  return { types, abilities };
}

async function fetchAllPokemons(names: string[]) {
  const fetchArray = names.map((name) => fetchPokemon(name));
  const results = await Promise.all(fetchArray);
  return results.map((res) => res.data);
}

export default async function fetchPokemonsSameTypeAndAbility(
  id: string | number
) {
  try {
    const machedPokemons = [];
    const { types, abilities } = await getPokemonTypesAndAbilities(id);
    const allPokemonsResponse = await client.get("pokemon?limit=2000");
    if (!allPokemonsResponse.ok) {
      throw new Error("Failed to fetch all pokemons");
    }

    const allPokemonsNames = await allPokemonsResponse.json<AllPokemon>();
    const allPokemonsData = await fetchAllPokemons(
      allPokemonsNames.results.map((p) => p.name)
    );
    if (!allPokemonsData) throw new Error("Failed to fetch the data");

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

      if (hasMatchingAbility && hasMatchingType) {
        machedPokemons.push(pokemon);
      }
    }
    const filteredPokemons = machedPokemons.filter(
      (pokemon) => pokemon.id != id
    );
    return filteredPokemons;
  } catch (error) {
    toast.error((error as Error).message);
    return [];
  }
}
