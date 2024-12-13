import type { Pokemon } from "@/types";
import client from "./ky.config";
import { TimeoutError } from "ky";

export default async function fetchPokemon(name: number | string) {
  try {
    let data: Pokemon;
    const res = await client.get<Pokemon>(`pokemon/${name}`, {
      throwHttpErrors: false,
    });

    if (res.status === 404) {
      throw new Error(`Pokemon ${name} not found`);
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch pokemon ${name}`);
    }

    data = await res.json<Pokemon>();
    return { data, error: null };
  } catch (error) {
    if (error instanceof TimeoutError)
      return { data: null, error: "Please Check your Network Connection" };
    return { data: null, error: (error as Error).message };
  }
}
