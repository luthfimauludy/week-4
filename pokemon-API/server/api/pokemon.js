const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const dataPath = path.resolve(__dirname, "../../assets/db.json");

const errorHandler = require("../helpers/errorHandler");
const validation = require("../helpers/validationHandler");

const baseURL = "https://pokeapi.co/api/v2/pokemon";

const saveData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(dataPath, stringifyData);
};

const getAllPokemon = async (req, res) => {
  try {
    const pokeAPI = await fetch(baseURL);
    if (pokeAPI.ok) {
      const data = await pokeAPI.json();
      return res.json({
        success: true,
        message: "List of all pokemon",
        result: data,
      });
    }
  } catch (error) {
    return errorHandler(res, error);
  }
};

const getAllMyPokemon = async (req, res) => {
  try {
    fs.readFile(dataPath, (error, data) => {
      if (error) {
        console.log(error);
        throw error;
      }
      const users = JSON.parse(data);
      return res.json({
        success: true,
        message: "List of all pokemon in JSON",
        result: users,
      });
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

const catchPokemon = async (req, res) => {
  try {
    validation.pokeDetailValidation(req.params);

    const { pokemonName } = req.params;
    const pokeAPI = await fetch(`${baseURL}/${pokemonName}`);
    if (!pokeAPI) {
      return errorHandler(res, undefined);
    }
    let pokemonList = JSON.parse(fs.readFileSync(dataPath));
    const lastIndex = pokemonList?.[pokemonList.length - 1]?.id || 0;
    const randomChance = Math.random();

    if (randomChance < 0.5) {
      const newPokemon = {
        id: lastIndex + 1,
        pokemonName: pokemonName,
        nickname: pokemonName,
      };

      let pokemonIsExist = false;
      pokemonList.map((item) => {
        if (item.pokemonName === pokemonName) {
          pokemonIsExist = true;
        }
      });

      if (pokemonIsExist === false) {
        pokemonList.push(newPokemon);
        saveData(pokemonList);
        return res.json({
          success: true,
          message: `Catch ${newPokemon.pokemonName} successfully`,
          result: pokemonList,
        });
      } else {
        pokemonList.push(newPokemon);
        saveData(pokemonList);
        return res.json({
          success: true,
          message: `Catch ${newPokemon.pokemonName} successfully and already exist!`,
          result: pokemonList,
        });
      }
    }
  } catch (error) {
    return errorHandler(res, error);
  }
};

const getDetailPokemon = async (req, res) => {
  try {
    const { name } = req.query;
    const pokeAPI = await fetch(`${baseURL}/${name}`);
    if (!pokeAPI) {
      return errorHandler(res, undefined);
    }

    const data = await pokeAPI.json();
    return res.json({
      success: true,
      message: "Detail pokemon",
      result: data,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

const getFibonacci = (nickname) => {
  let pokemonList = JSON.parse(fs.readFileSync(dataPath));
  let firstCalc;
  let secondCalc;
  let nextNumber;

  const splitNickname = nickname.split("-")[0];
  const allNickname = pokemonList.filter((child) =>
    child.nickname.includes(splitNickname)
  );
  const fibonacci = [];
  allNickname.map((item) => {
    let itemSequence = item.nickname.split("-")[1];
    if (itemSequence === undefined) {
      itemSequence = "0";
    }
    fibonacci.push(parseInt(itemSequence));
  });
  if (fibonacci.length === 1) {
    nextNumber = 0;
    return nextNumber;
  } else if (fibonacci.length === 2) {
    nextNumber = 1;
    return nextNumber;
  } else if (fibonacci.length > 2) {
    fibonacci.sort((a, b) => a - b);
    firstCalc = fibonacci[fibonacci.length - 2];
    secondCalc = fibonacci[fibonacci.length - 1];
    nextNumber = firstCalc + secondCalc;
    return nextNumber;
  }
};

const renameMyPokemon = async (req, res) => {
  try {
    const getId = parseInt(req.params.id);
    const getData = fs.readFileSync(dataPath);
    const data = JSON.parse(getData);

    const pokemon = data.find((item) => item.id === getId);
    if (!pokemon) {
      return errorHandler(res, undefined);
    }

    pokemon["pokemonName"] = req.body.pokemonName;
    pokemon["nickname"] = req.body.nickname;

    saveData(data);
    return res.json({
      success: true,
      message: "My pokemon renamed",
      result: pokemon,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

const releaseMyPokemon = async (req, res) => {
  try {
    const getId = parseInt(req.params.id);
    const getData = fs.readFileSync(dataPath);
    const data = JSON.parse(getData);

    const pokemon = data.find((item) => item.id === getId);
    if (!pokemon) {
      return errorHandler(res, undefined);
    }

    for (let [i, user] of data.entries()) {
      if (user.id === getId) {
        data.splice(i, 1);
      }
    }

    saveData(data);
    return res.json({
      success: true,
      message: "My pokemon has been released",
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

router.get("/", getAllPokemon);
router.get("/myPokemon", getAllMyPokemon);
router.get("/detail", getDetailPokemon);
router.post("/catch/:pokemonName", catchPokemon);
router.patch("/rename/:id", renameMyPokemon);
router.delete("/release/:id", releaseMyPokemon);

module.exports = router;
