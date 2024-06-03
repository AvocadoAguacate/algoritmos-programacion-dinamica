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
import Graph from "react-graph-vis";

function OpticBinaryTree() {
  const [nodeName, setNodeName] = useState('');
  const [nodeWeight, setNodeWeight] = useState(1);
  const [nodeList, setNodeList] = useState([]);
  const [probList, setProbList] = useState([]);
  const [tableA, setTableA] = useState([]);
  const [tableB, setTableB] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [calcs, setCalcs] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodes, setNodes] = useState([]);

  const options = {
    layout: {
      hierarchical: {
        direction: 'UD',  // Dirección de la jerarquía: de arriba a abajo (Up-Down)
        sortMethod: 'directed'  // Método de ordenación de la jerarquía
      }
    },
    edges: {
      color: "white",
      smooth: {
        type: 'dynamic',
      },
      font: {
        color: "blue" // Cambia el color del label a blanco
      }
    },
    physics: {
      hierarchicalRepulsion: {
        nodeDistance: 200, // Ajusta esta distancia según sea necesario
      },
      minVelocity: 0.75,
    }
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };

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
    const updatedNodeList = [...nodeList, newNode].sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    setNodeList(updatedNodeList);
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
        prob: parseFloat(newProb.toFixed(3))
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
            let aux = temptableA[z][ka-1] + temptableA[ka+1][z+k] + parseFloat(pTotal.toFixed(3));
            if(minAux>aux){
              minAux = parseFloat(aux.toFixed(3));
              auxR = ka;
            }
            newCalc.push(`k=${ka}`);
            newCalc.push(`${temptableA[z][ka-1]} + ${temptableA[ka+1][z+k]} + ${pTotal} = ${aux}`)
          }
          temptableA[z][z+k] = minAux;
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
        minFinal = parseFloat(aux.toFixed(3));
        rFinal = k;
      }
      newCalc.push(`k=${k}`);
      newCalc.push(`${temptableA[1][k-1].toFixed(3)} + ${temptableA[k+1][objetive-1].toFixed(3)} + ${1} = ${aux.toFixed(3)}`);
    }
    temptableA[1][objetive-1]= parseFloat(minFinal.toFixed(3));
    temptableR[1][objetive-1]= rFinal;
    setTableA(temptableA);
    setTableB(temptableR);
    setCalcs(newCalc);
    //calcular el grafo
    let todoList = [{from:1, to: nodeList.length}];
    let tempNodes = [];
    let tempEdges = [];
    while(todoList.length > 0){
      let todo = todoList.pop();
      let root = temptableR[todo.from][todo.to + 1];
      let nodeData = nodeList[root - 1]; 
      // let newNode = {label: `${nodeData.name}(${root - 1})`, id: nodeData.id};
      let newNode = {label: nodeData.name, id: nodeData.id};
      tempNodes.push(newNode);
      //agregar todo izq
      if(root -1 >= todo.from){
        todoList.push({from: todo.from, to: root - 1, parent: newNode});
      }
      //agregar todo der
      if(root + 1 <=todo.to){
        todoList.push({from: root + 1, to: todo.to, parent: newNode});
      }
      //agregar edges en caso de no ser el root inicial
      if(todo.parent){
        let newEdge = {from: todo.parent.id, to: newNode.id};
        tempEdges.push(newEdge);
      }
    }
    setEdges(tempEdges);
    setNodes(tempNodes);
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
      <div>
        <Table className="text-black" isStriped>
          <TableHeader>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Peso</TableColumn>
            <TableColumn>Llave</TableColumn>
          </TableHeader>
          <TableBody>
            {nodeList.map((node, index) => 
            <TableRow key={index}>
              <TableCell>{node.name}</TableCell>
              <TableCell>{node.value}</TableCell>
              <TableCell>{index + 1}</TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </div>
      {showTable && (
        <div id="tablas">
          <div className="mr-4">
            <h1
            id="titulo_inputs_iniciales"
            className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400">
            Tabla A</h1>
            <Table hideHeader aria-label="TableA" className="text-black" isStriped>
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
            <Table hideHeader aria-label="TableR" className="text-black" isStriped>
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
      { showTable && (
        <div>
        <Graph
          graph={{nodes: nodes, edges: edges}}
          options={options}
          events={events}
          style={{ height: "500px" }}
          />
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
