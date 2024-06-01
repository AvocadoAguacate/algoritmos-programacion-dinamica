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
  SelectItem
} from "@nextui-org/react";
import Graph from "react-graph-vis";

function Floyd() {

  //states
  const [nodeName, setNodeName] = useState("");
  const [nodeA, setNodeA] = useState("");
  const [nodeB, setNodeB] = useState("");
  const [nodeList, setNodeList] = useState([]);
  const [edges, setEdges] = useState([]);
  const [weight, setWeight] = useState(1)
  const [nodeNumber, setNodeNumber] = useState(3);
  const [showGraph, setShowGraph] = useState(false);
  const [resultsD, setResultsD] = useState([]);
  const [resultsP, setResultsP] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const fileInputRef = useRef(null);

  const options = {
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
    },
    height: "500px"
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };

  const handleNodeNameChange = (event) => {
    setNodeName(event.target.value);
  };
  const handleNodeAChange = (event) => {
    setNodeA(event.target.value);
  };
  const handleNodeBChange = (event) => {
    setNodeB(event.target.value);
  };
  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };
  const handleNodeNumberChange = (event) => {
    setNodeNumber(event.target.value);
  };

  const addNode = () => {
    setShowGraph(false);
    if (nodeName.trim() !== "") {
      const newNode = { label: nodeName, id: `${nodeName}-${nodeList.length}` };
      setNodeList([...nodeList, newNode]);
      setNodeName("");
    } else {
      const newNode = { label: `node${nodeList.length}`, id: `node${nodeList.length}-${nodeList.length}` };
      setNodeList([...nodeList, newNode]);
      setNodeName("");
    }
    setResultsD([]);
    setResultsP([]);
    setTimeout(() => {
      setShowGraph(true);
    }, 250);
  };

  const addNodes = (count) => {
    setShowGraph(false);
    setNodeList(prevNodeList => {
      const len = prevNodeList.length;
      const newNodes = Array.from({ length: count }, (_, i) => ({
        label: `node${len + i}`,
        id: `node${len + i}-${len + i}`
      }));
      return [...prevNodeList, ...newNodes];
    });
    setResultsD([]);
    setResultsP([]);
    setTimeout(() => {
      setShowGraph(true);
    }, 250);
  };

  const addEdge = () => {
    setShowGraph(false);
    const newEdge = { from: nodeA, to: nodeB, label: weight.toString(), title: `De ${nodeA} a ${nodeB} son ${weight}`};
    console.log(newEdge);
    const existingEdgeIndex = edges.findIndex(edge => edge.from === nodeA && edge.to === nodeB);
    console.log(existingEdgeIndex);
    if (existingEdgeIndex !== -1) {
      // Si el borde ya existe, actualiza su peso
      setEdges(edges.map(edge => 
        edge.to === newEdge.to && edge.from === newEdge.from ? newEdge : edge
      ))
    } else {
      // Si no existe, agrega el nuevo borde
      setEdges([...edges, newEdge]);
    }
    setWeight(1);
    setResultsD([]);
    setResultsP([]);
    setTimeout(() => {
      setShowGraph(true);
    }, 250);
  };

  const generateTableColumns = () => {
    return <TableHeader>
    <TableColumn> - </TableColumn>
    {nodeList.map(node => (
      <TableColumn key={node.id}>{node.label}</TableColumn>
    ))}
    </TableHeader>
  };
  const generateRealColumns = () => {
    return <TableRow>
      <TableCell> - </TableCell>
      {nodeList.map(node => (
        <TableCell key={node.id}>{node.label}</TableCell>
      ))}
    </TableRow>;
  };

  const saveData = () => {
    const data = JSON.stringify({ nodes: nodeList, edges: edges }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = Date.now();
    link.href = url;
    link.download = `floyd-${now}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadData = (event) => {
    setShowGraph(false);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        setNodeList(data.nodes);
        setEdges(data.edges);
      };
      reader.readAsText(file);
    }
    setTimeout(() => {
      setShowGraph(true);
    }, 250);
  };

  const resolve = () => {
    const size = nodeList.length;
    let distanceMatrix = Array.from({ length: size }, () =>
      Array(size).fill({value:Infinity})
    );
    let pathMatrix = Array.from({ length: size }, () =>
      Array(size).fill(0)
    );
    for (let index = 0; index < size; index++) {
      distanceMatrix[index][index] = {value: 0};
    }
    edges.forEach(edge => {
      const to = nodeList.findIndex(node => node.id === edge.to);
      const from = nodeList.findIndex(node => node.id === edge.from);
      distanceMatrix[from][to] = {value:parseInt(edge.label)};
    })
    const deepCopyMatrix = (matrix) => {
      return matrix.map(row => row.map(cell => ({ ...cell })));
    };
    const deepCopyPathMatrix = (matrix) => {
      return matrix.map(row => [...row]);
    };
    setResultsD([deepCopyMatrix(distanceMatrix)]);
    setResultsP([deepCopyPathMatrix(pathMatrix)]);
    for (let k = 0; k < size; k++) {
      let newDistanceMatrix = deepCopyMatrix(distanceMatrix);
      let newPathMatrix = deepCopyPathMatrix(pathMatrix);
  
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (newDistanceMatrix[i][k].value + newDistanceMatrix[k][j].value < newDistanceMatrix[i][j].value) {
            const newValue = newDistanceMatrix[i][k].value + newDistanceMatrix[k][j].value;
            newDistanceMatrix[i][j] = {
              value: newValue,
              // exp: `${newDistanceMatrix[i][k].value} + ${newDistanceMatrix[k][j].value} < ${newDistanceMatrix[i][j].value}`
            };
            newPathMatrix[i][j] = k + 1; // Solo almacenar el índice del nodo intermedio
          }
        }
      }
      // Agregar las nuevas matrices a los resultados
      setResultsD(prevResults => [...prevResults, newDistanceMatrix]);
      setResultsP(prevResults => [...prevResults, newPathMatrix]);
      distanceMatrix = newDistanceMatrix; // Actualizar la matriz para la siguiente iteración
      pathMatrix = newPathMatrix; 
    }
  }

  return (
    <div id="contenedor"
    className="min-h-screen w-full flex flex-col bg-black text-white">
      <div id="seccion_inputs_iniciales">
        <h1
          id="titulo_inputs_iniciales"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Ingrese sus nodos
        </h1>
        <div id="seccion_inputs_iniciales">
        <div
          id="inputs_iniciales"
          className="mt-6 flex w-full flex-wrap md:flex-nowrap  items-center"
        >
          <Input
            id="inp_nodeName"
            className="w-full mx-8"
            label="Nombre del nodo"
            value={nodeName}
            onChange={handleNodeNameChange}
          />
          <Button
            id="btn_set_values"
            radius="full"
            fullWidth
            onClick={addNode}
            className="bg-gradient-to-b from-red-400 to-red-900 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8"
          >
            Agregar
          </Button>
          <Input
            id="inp_nodeName"
            className="w-full mx-8"
            label="Número de nodos"
            type="number"
            value={nodeNumber}
            min={nodeList.length > 1 ? 1 : 3}
            max={100 - nodeList.length}
            onChange={handleNodeNumberChange}
          />
          <Button
            id="btn_set_values"
            radius="full"
            fullWidth
            onClick={() => addNodes(nodeNumber)}
            className="bg-gradient-to-b from-red-400 to-red-900 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8"
          >
            Agregar
          </Button>
        </div>  
      </div>
      </div>
      {nodeList.length > 2 && (
        <div id="seccion_inputs_iniciales">
        <h1
          id="titulo_inputs_iniciales"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Ingrese sus conexiones
        </h1>
        <div id="seccion_inputs_iniciales">
        <div
          id="inputs_iniciales"
          className="mt-6 flex w-full flex-wrap md:flex-nowrap  items-center"
        >
          <Select
            id="sel_nodeA"
            className="w-full mx-8"
            label="Selecione un nodo de inicio"
            value={nodeA}
            onChange={handleNodeAChange}
          >
          {
            nodeList.map((node) => (
              <SelectItem key={node.id}>
                {node.label}
              </SelectItem>
            ))
          }
          </Select>
          <Input
            id="inp_weight"
            className="w-full mx-8"
            label="Peso / Distancia / Costo"
            value={weight}
            onChange={handleWeightChange}
          />
          <Select
            id="sel_nodeB"
            className="w-full mx-8"
            label="Seleccione un nodo de llegada"
            value={nodeB}
            onChange={handleNodeBChange}
          >
          {
            nodeList.map((node) => (
              <SelectItem key={node.id}>
                {node.label}
              </SelectItem>
            ))
          }
          </Select>
          <Button
            id="btn_set_values"
            radius="full"
            fullWidth
            onClick={addEdge}
            isDisabled={nodeA === '' || nodeB === ''}
            className="bg-gradient-to-b from-red-400 to-red-900 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8"
          >
            Agregar
          </Button>
        </div>  
      </div>
      </div>
      )}
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
            isDisabled={nodeList.length < 3 || edges.length < nodeList.length + 1}
            onClick={saveData}
            className="bg-gradient-to-b from-orange-600 to-orange-300 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
          >
            Guardar datos
          </Button>
          <Button
            id="btn_calcular"
            radius="full"
            onClick={resolve}
            isDisabled={nodeList.length < 3 || edges.length < nodeList.length + 1}
            className="bg-gradient-to-b from-purple-600 to-blue-600 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
          >
            Calcular
          </Button>
      </div>
      {showGraph && (
        <div id="graph" className="flex mb-6">
        <Graph
        graph={{nodes: nodeList, edges: edges}}
        options={options}
        events={events}
        style={{ height: "640px" }}
        />
      </div>
      )}
      <Button
      onClick={() => setShowTable(true)}>
        Mostrar
      </Button>
      {showTable && (
        resultsD.map((matrix, index) => 
        <div>
          <Table hideHeader aria-label="Table" className="text-black" key={index}>
            {generateTableColumns()}
            <TableBody>
            {generateRealColumns()}
            {matrix.map((row, index) => 
            <TableRow key={index}>
              <TableCell>{nodeList[index].label}</TableCell>
              {row.map((cell, index) => 
              <TableCell key={index}>
                {cell.value === Infinity ? '∞' : cell.value} {cell.exp ? `(${cell.exp})` : ''}
              </TableCell>)}
            </TableRow>)}
            </TableBody>
          </Table>
        </div>)
      )}
      {showTable && (
        resultsP.map((matrix, index) => 
        <div>
          <Table hideHeader aria-label="Table" className="text-black" key={index}>
            {generateTableColumns()}
            <TableBody>
            {generateRealColumns()}
            {matrix.map((row, index) => 
            <TableRow key={index}>
              <TableCell>{nodeList[index].label}</TableCell>
              {row.map((cell, index) => 
              <TableCell key={index}>
                {cell}
              </TableCell>)}
            </TableRow>)}
            </TableBody>
          </Table>
        </div>)
      )}
    </div>
  );
}

export default Floyd;
