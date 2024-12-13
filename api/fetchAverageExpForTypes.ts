import toast from "react-hot-toast";
import client from "./ky.config";
import type { AllTypes, Pokemon, Type } from "@/types";

async function getAllTypes() {
  const res = await client.get<AllTypes>("type");
  if (!res.ok) {
    throw new Error("Failed to fetch types");
  }

  const types = await res.json();

  if (!types) throw new Error("Failed to fetch types");

  const typesArray = types.results.map((type) => type.name);
  const typePromise = typesArray.map((type) =>
    client.get<Type>(`type/${type}`).then((data) => data.json())
  );
  const typeData = await Promise.all(typePromise);
  return typeData;
}

export default async function fetchAverageExp() {
  try {
    const averageExp: Record<string, number> = {};
    const results: Record<string, number> = {};

    const typesData = await getAllTypes();
    for (const type of typesData) {
      if (type.pokemon.length === 0) continue;
      let resultOfAbilities: string[] = [];
      const pokemons = type.pokemon.map((pokemon) => pokemon.pokemon.name);
      const pokemonPromise = pokemons.map((pokemon) =>
        client.get<Pokemon>(`pokemon/${pokemon}`).json()
      );
      const pokemonData = await Promise.all(pokemonPromise);

      const pokemonExp = pokemonData.map((pokemon) => pokemon?.base_experience);
      const pokemonAverageExp = pokemonExp.reduce(
        (acc, exp) => (acc as number) + (exp as number),
        0
      );

      resultOfAbilities = pokemonData.flatMap((pokemon) => {
        return pokemon!.abilities.map((ability) => ability.ability.name);
      });
      results[type.name] = new Set(resultOfAbilities).size;
      const average = (pokemonAverageExp as number) / pokemonExp.length;
      averageExp[type.name] = average;
    }

    return { averageExp, results };
  } catch (error) {
    console.log(error);
    toast.error((error as Error).message);
  }
}
