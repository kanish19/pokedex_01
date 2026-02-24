import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [pokemon, setPokemon] = useState(null);//to store fetched data

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((data) => setPokemon(data));
  }, [name]);

  if (!pokemon)
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
        background: darkMode
          ? "linear-gradient(135deg, #232526, #414345)"
          : "linear-gradient(135deg, #d4fc79, #96e6a1)",
        color: darkMode ? "white" : "black",
        transition: "0.4s",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "none",
          background: darkMode ? "#111" : "black",
          color: "white",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h1 style={{ textTransform: "capitalize" }}>
        {pokemon.name}
      </h1>

      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        style={{ width: "150px" }}
      />

      <p>Height "Feet": {pokemon.height}</p>
      <p>Weight "KG": {pokemon.weight}</p>

      <h3>Types</h3>
      {pokemon.types.map((t) => (
        <span
          key={t.type.name}
          style={{
            margin: "5px",
            padding: "5px 10px",
            borderRadius: "20px",
            background: darkMode ? "#444" : "#eee",
          }}
        >
          {t.type.name}
        </span>
      ))} 
    </div>
  );
}

export default PokemonDetail;