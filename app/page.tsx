"use client";

import fetchPokemon from "@/api/fetchPokemon";
import {
  PokemonBody,
  PokemonCard,
  PokemonName,
} from "@/components/PokemonCard";
import type { Pokemon } from "@/types";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function page() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPokemon(null);
    const formattedSearch = search.trim().toLowerCase();
    if (!formattedSearch) {
      setLoading(false);
      toast.error("Please enter a pokemon name");
      return;
    }
    const { data, error } = await fetchPokemon(formattedSearch);
    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }
    setPokemon(data);
    setLoading(false);
  };

  return (
    <main className="bg-gradient-to-br from-cyan-500 to-purple-500">
      <div className="min-h-screen flex flex-col mx-auto max-w-md items-center justify-center gap-4 ">
        <form
          onSubmit={handleSubmit}
          className="bg-white flex w-full p-5 flex-col gap-3 shadow-black/30 shadow-2xl rounded-xl"
        >
          <label htmlFor="search" className="font-semibold text-xl">
            Search Up A Pokemon
          </label>
          <input
            type="text"
            id="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search..."
            className="border-2 border-black/50 rounded-xl py-2 px-5"
          />
          <button className="font-semibold text-lg text-white bg-blue-600 rounded-xl py-2 px-5 transition hover:bg-blue-800">
            Search
          </button>
        </form>
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
          </Link>
        )}
      </div>
    </main>
  );
}
