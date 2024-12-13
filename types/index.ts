export type Pokemon = {
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  base_experience: number;
  height: number;
  id: number;
  sprites: {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
  };
  types: Array<{
    slot: 1;
    type: {
      name: string;
      url: string;
    };
  }>;
  weight: number;
  name: string;
};

export type AllPokemon = {
  count: number;
  next: string;
  previous: string;
  results: Array<{ name: string; url: string }>;
};

export type Ability = {
  pokemon: {
    slot: number;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
};

export type Type = Ability & { name: string };
export type AllTypes = AllPokemon;
