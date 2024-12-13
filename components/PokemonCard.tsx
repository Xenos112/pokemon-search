export const PokemonCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white shadow-md max-md:w-full shadow-black/30 rounded-xl p-5 w-full flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export const PokemonName = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-2xl font-bold">{children}</h1>;
};

export const PokemonBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2 items-center">{children}</div>;
};
