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
  const [showTableCounter, setshowTableCounter] = useState(0);
  const [shortRoutes, setShortRoutes] = useState([]);
  const [showShortRoutes, setShowShortRoutes] = useState(false);
  const [addRandom, setAddRandom] = useState(true);

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
    }
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

  const indexToLetters = (index) => {
    let letters = '';
    while (index >= 0) {
      letters = String.fromCharCode(index % 26 + 65) + letters;
      index = Math.floor(index / 26) - 1;
    }
    return letters;
  }

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
    setShowTable(false);
    setTimeout(() => {
      setShowGraph(true);
    }, 250);
  };

  const addNodes = (count) => {
    setShowGraph(false);
    setNodeList(prevNodeList => {
      const len = prevNodeList.length;
      const newNodes = Array.from({ length: count }, (_, i) => ({
        label: indexToLetters(i),
        id: `${indexToLetters(i)}-${len + i}`
      }));
      return [...prevNodeList, ...newNodes];
    });
    setResultsD([]);
    setResultsP([]);
    setShowTable(false);
    setTimeout(() => {
      setShowGraph(true);
    }, 250);
  };

  const addRandomNodes = () => {
    setShowGraph(false);
    let newEdges = [];
    let m = nodeList.length > 20 ? nodeList.length/4 : nodeList.length; //30...
    nodeList.forEach((node, index) => {
      let n = Math.floor(Math.random() * m); //cantidad de posibles conexiones
      let usedTo = [];
      for (let i = 0; i < n; i++) {
        let to = Math.floor(Math.random() * nodeList.length);
        let weight = Math.floor(Math.random() * 100);
        let newEdge = { from: node.id, to: nodeList[to].id, label: weight.toString()};
        if(to !== index && usedTo.findIndex(element => element === to) === -1){
          newEdges.push(newEdge);
          usedTo.push(to);
        }
      }
    });
    setEdges([...edges, ...newEdges]);
    setShowTable(false);
    setAddRandom(false);
    setTimeout(() => {
      setShowGraph(true);
    }, 250);
  }

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
    setShowTable(false);
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
    setShowTable(false);
    setShowShortRoutes(false);
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

  const shortRouter = (objective) => {
    let isDirect = objective.pathMatrix[objective.from][objective.to];
    if(isDirect === 0){
      return '';
    } else {
      let leftTodo = {from: objective.from, to: isDirect-1, pathMatrix:objective.pathMatrix};
      let rightTodo = {from: isDirect-1, to: objective.to, pathMatrix:objective.pathMatrix};
      return `${shortRouter(leftTodo)}(${nodeList[isDirect-1].label})${shortRouter(rightTodo)}`;
    }
  }

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
    //short routes
    let todoList = [];
    nodeList.forEach((from, fromIndex) => {
      nodeList.forEach((to, toIndex) => {
        if(to.id !== from.id){
          let todo = {from: {name: from.label, index: fromIndex},
            to: {name: to.label, index: toIndex}};
            todoList.push(todo);
        }
      });
    });
    let routes = [];
    todoList.forEach((todo, index) => {
      let isDirect = pathMatrix[todo.from.index][todo.to.index];
      let shortRoute = '';
      if(isDirect === 0){
        shortRoute = `${todo.from.name} > ${todo.to.name} (Ruta directa)`;
      } else{
        let leftTodo = {from: todo.from.index, to: isDirect-1, pathMatrix:pathMatrix};//node index !== iteration 
        let rightTodo = {from: isDirect-1, to: todo.to.index, pathMatrix:pathMatrix};
        shortRoute = `${todo.from.name} > ${todo.to.name} =  (${todo.from.name})${shortRouter(leftTodo)}(${nodeList[isDirect-1].label})${shortRouter(rightTodo)}(${todo.to.name})`;
        shortRoute = shortRoute.replace(/\)\(/g, '>');
      }
      routes.push(shortRoute);
    });
    setShortRoutes(routes);
    setTimeout(() => {
      setShowTable(true);
    }, 1000);
  }

  const showBestRoutes = () => {
    setShowShortRoutes(true);
  };

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
            Agregar Nodo
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
            Agregar Nodos
          </Button>
          <Button
            id="btn_set_values"
            radius="full"
            fullWidth
            onClick={addRandomNodes}
            isDisabled={nodeList.length < 3 || !addRandom}
            className="bg-gradient-to-b from-red-400 to-red-900 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8"
          >
            Agregar Conexiones 
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
        <div id="graph">
        <Graph
        graph={{nodes: nodeList, edges: edges}}
        options={options}
        events={events}
        style={{ height: "500px" }}
        />
      </div>
      )}
      <div id="tablas" className="grid grid-cols-2 gap-4">
      <div id="tablasD">
      {showTable && (
        resultsD.map((matrix, index) => 
        <div className="mr-4">
          
          <h1
          id="titulo_inputs_iniciales"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400">
          D({index})</h1>
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
        </div>
        )
      )}
      </div>
      <div id="tablasP">
      {showTable && (
        resultsP.map((matrix, index) => 
        <div className="ml-4">
        <h1
          id="titulo_inputs_iniciales"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400">
          P({index})</h1>
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
      </div>
      {showTable && !showShortRoutes && (
        <div className="mt-6 flex w-full flex-wrap md:flex-nowrap  items-center">
        <Button
        className="bg-gradient-to-b from-purple-600 to-blue-600 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
        onClick={showBestRoutes}>
          Mostrar mejores rutas
        </Button>
        </div>
      )}
      {showShortRoutes && (
          <div>
            <h1
            id="titulo_inputs_iniciales"
            className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400">
            Mejores rutas</h1>
            {shortRoutes.map((calc, index) => 
              <h2 className="mx-8 mt-4 font-mono text-xl" 
              key={index}>
                {calc}
              </h2>
            )}
          </div>
        )}
    </div>
  );
}

export default Floyd;
