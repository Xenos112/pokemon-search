import toast from "react-hot-toast";
import client from "./ky.config";
import type { AllTypes, Pokemon, Type } from "@/types";

async function getAllTypes() {
  // fetching all the types
  const res = await client.get<AllTypes>("type");
  if (!res.ok) {
    throw new Error("Failed to fetch types");
  }

  const types = await res.json();
  if (!types) throw new Error("Failed to fetch types");

  // map over the fetched array and get the types in a separate array
  const typesArray = types.results.map((type) => type.name);
  const typePromise = typesArray.map((type) =>
    client.get<Type>(`type/${type}`).then((data) => data.json())
  );
  // get all the data
  const typeData = await Promise.all(typePromise);
  return typeData;
}

export default async function fetchAverageExp() {
  try {
    const averageExp: Record<string, number> = {};
    const results: Record<string, number> = {};

    // get all the types as a array
    const typesData = await getAllTypes();

    // loop over each type
    for (const type of typesData) {
      let resultOfAbilities: string[] = [];
      // if there is no pokemons in the type we simply continue
      if (type.pokemon.length === 0) continue;

      // mapping over all the pokemons and get their names in a array to fetch them all
      const pokemons = type.pokemon.map((pokemon) => pokemon.pokemon.name);
      const pokemonPromise = pokemons.map((pokemon) =>
        client.get<Pokemon>(`pokemon/${pokemon}`).json()
      );
      const pokemonData = await Promise.all(pokemonPromise);

      // calculating the average exp
      const pokemonExp = pokemonData.map((pokemon) => pokemon?.base_experience);
      const pokemonAverageExp = pokemonExp.reduce(
        (acc, exp) => (acc as number) + (exp as number),
        0
      );

      // mapping over all the abilities
      resultOfAbilities = pokemonData.flatMap((pokemon) => {
        return pokemon!.abilities.map((ability) => ability.ability.name);
      });
      // remove the duplicates by using the Set method and them return the size
      results[type.name] = new Set(resultOfAbilities).size;
      const average = (pokemonAverageExp as number) / pokemonExp.length;
      // set the average experience of the type by using the type and a key for the object
      averageExp[type.name] = average;
    }

    return { averageExp, results };
  } catch (error) {
    // if error, log it and fire a toast to show the corresponding error for the user
    console.log(error);
    toast.error((error as Error).message);
  }
}
