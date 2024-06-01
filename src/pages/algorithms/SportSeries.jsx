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
  const [table, setTable] = useState([["-", 0, 1, 2],[0, "-", 1, 1],[1, 0, "-", "-"],[2, 0, "-", "-"]]);

  const fileInputRef = useRef(null);

  const solve = () => {
    const objetive = games/2 + 3 - games%2/2;
    const qrobHome = 1 - probVisit;
    const qrobVisit = 1 - probHome;
    // console.log(`objective: ${objetive}`);
    let distanceMatrix = Array.from({ length: objetive }, () =>
      Array(objetive).fill('-')
    );
    for (let index = 0; index < objetive - 1; index++) {
      distanceMatrix[0][index+1]= index;
      distanceMatrix[index+1][0]= index;
    }
    for (let index = 0; index < objetive - 2; index++) {
      distanceMatrix[1][index+2]= 1;
      distanceMatrix[index+2][1]= 0; 
    }
    for (let i = 2; i < objetive; i++) {
      for (let j = 2; j < objetive; j++) {
        const game = (objetive - 1 - i)+ (objetive - 1 - j);
        let result = 0;
        if(homeGames.includes(game)){// partido en casa
          // console.log(`distanceMatrix[${i}][${j}] = ${probHome} * ${distanceMatrix[i-1][j]} + ${qrobVisit} * ${distanceMatrix[i][j-1]}`)
          result= (probHome * distanceMatrix[i-1][j]) + (qrobVisit * distanceMatrix[i][j-1]);
        } else {
          // console.log(`distanceMatrix[${i}][${j}] = ${probVisit} * ${distanceMatrix[i-1][j]} + ${qrobHome} * ${distanceMatrix[i][j-1]}`)
          result= (probVisit * distanceMatrix[i-1][j]) + (qrobHome * distanceMatrix[i][j-1]);
        }
        distanceMatrix[i][j] = result.toFixed(5);
      }
    }
    setTable(distanceMatrix);
  }

  const handleGamesChange = (event) => {
    setHomeGames([]);
    if(event.target.value < 100 && event.target.value > 0){
      let newValue = event.target.value;
      if(newValue%2 === 0){
        newValue < games ? newValue-- : newValue++;
      }
      setGames(newValue);
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

  const saveData = () => {
    const data = JSON.stringify(
      { games: games, 
        probHome: probHome,
        probVisit:probVisit,
        homeGames: homeGames
      },
      null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = Date.now();
    link.href = url;
    link.download = `sportseries-${now}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        setGames(data.games);
        setProbHome(data.probHome);
        setprobVisit(data.probVisit);
        setHomeGames(data.homeGames);
      };
      reader.readAsText(file);
    }
    setTable([]);
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
      <div id="botones_data" className="flex mb-6">
          <Button
            id="btn_cargar"
            radius="full"
            className="bg-gradient-to-b from-yellow-600 to-amber-300 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
            onClick={() => fileInputRef.current.click()}
          >
            Cargar datos
          </Button>
          {/* Input file oculto */}
          <input
            type="file"
            style={{ display: "none" }}
            accept=".json"
            ref={fileInputRef}
            onChange={loadData}
          />
          <Button
            id="btn_calcular"
            radius="full"
            onClick={saveData}
            className="bg-gradient-to-b from-orange-600 to-orange-300 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
          >
            Guardar datos
          </Button>
          <Button
            id="btn_calcular"
            radius="full"
            onClick={solve}
            className="bg-gradient-to-b from-purple-600 to-blue-600 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
          >
            Calcular
          </Button>
      </div>
    </div>
  );
}

export default SportSeries;
