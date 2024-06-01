import React, { useRef, useState } from "react";
import {
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select, 
  SelectItem,
  CheckboxGroup, 
  Checkbox
} from "@nextui-org/react";

function SportSeries() {
  const [probHome, setProbHome] = useState(0.5);
  const [probVisit, setprobVisit] = useState(0.5);
  const [homeGames, setHomeGames] = useState([]);
  const [games, setGames] = useState(3);

  const handleGamesChange = (event) => {
    setHomeGames([]);
    if(event.target.value < 100 && event.target.value > 0){
      setGames(event.target.value);
    } else {
      setGames(3);
    }
  };
  const handleProbHomeChange = (event) => {
    setProbHome(event.target.value);
  };
  const handleProbVisitChange = (event) => {
    setprobVisit(event.target.value);
  };

  const generateCheckboxes = () => {
    const checkboxes = [];
    for (let i = 0; i < games; i++) {
      checkboxes.push(
        <Checkbox key={i} value={i}
        color="white">
          {i + 1}
        </Checkbox>
      );
    }
    return checkboxes;
  };

  return (
    <div id="contenedor"
    className="min-h-screen w-full flex flex-col bg-black text-white">
            <div id="seccion_inputs_iniciales">
        <h1
          id="titulo_inputs_iniciales"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Ingrese los datos iniciales
        </h1>
        <div id="seccion_inputs_iniciales">
        <div
          id="inputs_iniciales"
          className="mt-6 flex w-full flex-wrap md:flex-nowrap  items-center"
        >
          <Input
            id="inp_games"
            className="w-full mx-8"
            label="Numero de partidos"
            value={games}
            onChange={handleGamesChange}
            type="number"
            min={3}
            max={100}
          />
          <Input
            id="inp_probH"
            className="w-full mx-8"
            label="Probabilidad de ganar en casa"
            value={probHome}
            onChange={handleProbHomeChange}
            type="number"
            min={0}
            max={1}
          />
          <Input
            id="inp_probV"
            className="w-full mx-8"
            label="Probabilidad de ganar de visita"
            value={probVisit}
            onChange={handleProbVisitChange}
            type="number"
            min={0}
            max={1}
          />
        </div>
        <div>
        <h1
          id="titulo_checkbox_games"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Seleccione los partidos en casa
        </h1>
        <div className="inline-block bg-white p-4 my-4 mx-8 mt-4 rounded-lg">
        <CheckboxGroup 
          value={homeGames}
          onValueChange={setHomeGames}
          orientation="horizontal">
            {generateCheckboxes()}
        </CheckboxGroup>
        </div>
        </div>  
      </div>
      </div>
    </div>
  );
}

export default SportSeries;
