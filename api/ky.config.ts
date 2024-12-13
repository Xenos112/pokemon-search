import ky from "ky";

const API_URL = "https://pokeapi.co/api/v2";
const signal = new AbortController().signal;

const client = ky.create({
  prefixUrl: API_URL,
  signal,
});

export default client;
