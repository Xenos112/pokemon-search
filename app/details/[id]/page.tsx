"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Pokemon } from "@/types";
import fetchPokemon from "@/api/fetchPokemon";
import toast from "react-hot-toast";
import {
  PokemonCard,
  PokemonName,
  PokemonBody,
} from "@/components/PokemonCard";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import fetchPokemonsSameTypeAndAbility from "@/api/fetchPokemonSameTypeAndAbility";

export default function Page() {
  const { id }: { id: string } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [matchedPokemons, setMatchedPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function fetchData() {
      setLoading(true);
      const { data, error } = await fetchPokemon(id);
      const matchedPokemons = await fetchPokemonsSameTypeAndAbility(
        id as string
      );
      if (error || !data) {
        setLoading(false);
        toast.error(error);
        return;
      }
      setMatchedPokemons(matchedPokemons);
      setPokemon(data);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="bg-gradient-to-br from-cyan-500 to-purple-500">
      <div className="min-h-screen flex flex-col mx-auto max-w-5xl px-10 py-[100px] items-center justify-center gap-4 ">
        {loading && (
          <div className="animate-spin duration-500">
            <Loader2 color="white" size={50} />
          </div>
        )}
        {pokemon && (
          <Link href={`/details/${pokemon.id}`} className="w-full">
            <PokemonCard>
              <PokemonName>{pokemon?.name}</PokemonName>
              <PokemonBody>
                <div className="flex gap-2 max-md:flex-col">
                  <img
                    className="size-32"
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                  />
                  <img
                    className="size-32"
                    src={pokemon.sprites.back_default}
                    alt={pokemon.name}
                  />
                </div>
                <p className="text-lg">
                  <span className="font-semibold text-md">
                    Base Experience:
                  </span>
                  <span>{pokemon.base_experience}</span>
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-md">Height:</span>
                  <span>{pokemon.height}</span>
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-md">Types:</span>
                  <span>
                    {pokemon.types.map((type) => type.type.name).join(", ")}
                  </span>
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-md">Abilities:</span>
                  <span>
                    {pokemon.abilities
                      .map((ability) => ability.ability.name)
                      .join(", ")}
                  </span>
                </p>
              </PokemonBody>
            </PokemonCard>
          </Link>
        )}
        <div className="grid grid-cols-3 gap-4 w-full max-lg:grid-cols-2 max-md:grid-cols-1">
          {matchedPokemons.length > 0 &&
            matchedPokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id}>
                <PokemonName>{pokemon?.name}</PokemonName>
                <PokemonBody>
                  <img
                    className="size-32"
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                  />

                  <p className="text-lg">
                    <span className="font-semibold text-md">
                      Base Experience:
                    </span>
                    <span>{pokemon.base_experience}</span>
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold text-md">Height:</span>
                    <span>{pokemon.height}</span>
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold text-md">Types:</span>
                    <span>
                      {pokemon.types.map((type) => type.type.name).join(", ")}
                    </span>
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold text-md">Abilities:</span>
                    <span>
                      {pokemon.abilities
                        .map((ability) => ability.ability.name)
                        .join(", ")}
                    </span>
                  </p>
                </PokemonBody>
              </PokemonCard>
            ))}
        </div>
      </div>
    </main>
  );
}
