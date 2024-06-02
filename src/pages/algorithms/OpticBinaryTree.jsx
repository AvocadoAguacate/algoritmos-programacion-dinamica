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

function OpticBinaryTree() {
  const [nodeName, setNodeName] = useState('');
  const [nodeWeight, setNodeWeight] = useState(1);
  const [nodeList, setNodeList] = useState([]);
  const [probList, setProbList] = useState([]);
  const [tableA, setTableA] = useState([]);
  const [tableB, setTableB] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [calcs, setCalcs] = useState([])

  const fileInputRef = useRef(null);

  const handleNodeNameChange = (event) => {
    setNodeName(event.target.value);
  };
  const handleNodeWeightChange = (event) => {
    setNodeWeight(event.target.value);
  };

  const addNode = () => {
    const newNode = {
      id: `${nodeName}-${nodeList.length}`, 
      value: nodeWeight,
      name: nodeName
    };
    setNodeList([...nodeList, newNode]);
    setNodeWeight(1);
    setNodeName('');
    setShowTable(false);
  }
  const generateTableColumns = () => {
    const columns = [];
    for (let i = 0; i < tableA.length; i++) {
      columns.push(<TableColumn key={i}>{i}</TableColumn>)
    }
    return columns;
  };

  const saveData = () => {
    const data = JSON.stringify(
      { nodeList: nodeList
      },
      null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = Date.now();
    link.href = url;
    link.download = `obt-${now}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        setNodeList(data.nodeList);
      };
      reader.readAsText(file);
    }
    setShowTable(false);
  };

  const solve = () => {
    //calc total
    let total = 0;
    let newCalc = [];
    nodeList.forEach(node => {
      total = total + parseInt(node.value);
    });
    // console.log(`Total: ${total}`);
    //calc probs
    let probs = [];
    nodeList.forEach((node, index) => {
      let newProb = node.value/total
      probs.push({
        id: node.id,
        name: node.name,
        prob: newProb
      })
    });
    setProbList(probs);
    //llenado de la tabla inicial
    let objetive = probs.length + 2;
    let temptableA = Array.from({ length: objetive }, () =>
      Array(objetive).fill('')
    );
    let temptableR = Array.from({ length: objetive }, () =>
      Array(objetive).fill('')
    );
    for (let i = 1; i < objetive; i++) {
      temptableA[i][0] = i;
      temptableA[0][i] = i - 1;
      temptableR[i][0] = i;
      temptableR[0][i] = i - 1;
    }
    for (let i = 1; i < objetive; i++) {
      temptableA[i][i] = 0;
      temptableR[i][i] = 0;
    }
    for (let i = 2; i < objetive; i++) {
      temptableA[i-1][i] = probs[i-2].prob;
      temptableR[i-1][i] = i-1;
    }
    console.log(`Objetive: ${objetive}`)
    for (let k = 2; k < objetive-2; k++) {
      for (let z = 1; z < objetive -1; z++) {
        if(z + k < objetive){
          let pTotal = 0;
          let minAux = 1000000;
          let auxR = 0;
          newCalc.push(`[${z}][${z+k}]`);
          for (let i = z-1; i < z+k-1; i++) {
            pTotal = pTotal + probs[i].prob;
          }
          for (let i = z-1; i < z+k-1; i++) {
            let ka = i + 1; //k de la formula
            let aux = temptableA[z][ka-1] + temptableA[ka+1][z+k] + pTotal;
            if(minAux>aux){
              minAux = aux;
              auxR = ka;
            }
            newCalc.push(`k=${ka}`);
            newCalc.push(`${temptableA[z][ka-1]} + ${temptableA[ka+1][z+k]} + ${pTotal} = ${aux}`)
          }
          temptableA[z][z+k] = minAux.toFixed(4);
          temptableR[z][z+k] = auxR;
        }
      }
    }
    // ultima celda
    newCalc.push(`[${1}][${objetive-1}]`);
    let minFinal = 1000000000;
    let rFinal = 0;
    for (let k = 1; k < probs.length + 1; k++) {
      let aux = temptableA[1][k-1] + temptableA[k+1][objetive-1] + 1;
      if(minFinal>aux){
        minFinal = aux;
        rFinal = k;
      }
      newCalc.push(`k=${k}`);
      newCalc.push(`${temptableA[1][k-1]} + ${temptableA[k+1][objetive-1]} + ${1} = ${aux}`);
    }
    temptableA[1][objetive-1]= minFinal;
    temptableR[1][objetive-1]= rFinal;
    setTableA(temptableA);
    setTableB(temptableR);
    setCalcs(newCalc);
    setTimeout(() => {
      setShowTable(true);
    }, 500);
  }

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
            id="inp_name"
            className="w-full mx-8"
            label="Nombre de nodo"
            value={nodeName}
            onChange={handleNodeNameChange}
          />
          <Input
            id="inp_weigh"
            className="w-full mx-8"
            label="Peso del nodo"
            value={nodeWeight}
            onChange={handleNodeWeightChange}
            type="number"
          />
          <Button
            id="btn_set_values"
            radius="full"
            fullWidth
            onClick={addNode}
            isDisabled={nodeName.length === 0}
            className="bg-gradient-to-b from-red-400 to-red-900 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8"
          >
            Agregar
          </Button>
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
      {showTable && (
        <div id="tablas">
          <div className="mr-4">
            <h1
            id="titulo_inputs_iniciales"
            className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400">
            Tabla A</h1>
            <Table hideHeader aria-label="TableA" className="text-black">
              <TableHeader>
                {generateTableColumns()}
              </TableHeader>
              <TableBody>
                {tableA.map((row, index) => 
                  <TableRow key={index}>
                    {row.map((cell, index) => 
                      <TableCell key={index}>
                        {cell}
                      </TableCell>)}
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
          <div className="mr-4">
            <h1
            id="titulo_inputs_iniciales"
            className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400">
            Tabla R</h1>
            <Table hideHeader aria-label="TableR" className="text-black">
              <TableHeader>
                  {generateTableColumns()}
              </TableHeader>
              <TableBody>
                {tableB.map((row, index) => 
                  <TableRow key={index}>
                    {row.map((cell, index) => 
                      <TableCell key={index}>
                        {cell}
                      </TableCell>)}
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {/* {showTable && (
        <div>
          <h1
          id="titulo_inputs_iniciales"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
          >
          Cálculos
          </h1>
          {calcs.map((calc, index) => 
          <h2 className="mx-8 mt-4 font-mono text-xl" 
          key={index}>
            {calc}
          </h2>)}
        </div>
      )} */}
    </div>
  );
}

export default OpticBinaryTree;
