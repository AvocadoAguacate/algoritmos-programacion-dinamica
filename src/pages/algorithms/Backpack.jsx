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
} from "@nextui-org/react";

function Backpack() {
  const [tableRows, setTableRows] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [counter, setCounter] = useState(1);
  const [object, setObject] = useState("Objeto #" + counter);
  const [cost, setCost] = useState("");
  const [value, setValue] = useState("");
  const [check, setCheck] = useState("");
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [errorFile, setErrorFile] = useState("");
  const [result, setResult] = useState(false);
  const [mode, setMode] = useState(false);
  const [modeMessage, setModeMessage] = useState("");
  const [resultado_optimo, setResultado_Optimo] = useState(
    "No hay un resultado aún..."
  );
  const [matriz, setMatriz] = useState([]); // Estado para almacenar la matriz

  // ================= CARGA DE ARCHIVOS =================    //

  const [fileContent, setFileContent] = useState("Hola");
  // Crear una referencia para el input file
  const fileInputRef = useRef(null);

  // Función para manejar el clic del botón
  const handleButtonClick = () => {
    // Simular el clic en el input file oculto
    fileInputRef.current.click();
  };

  // Función para manejar el cambio del input file
  const handleFileChange = (event) => {
    setResult(false);
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (jsonData.capacidad_mochila && Array.isArray(jsonData.objetos)) {
            // Actualizar el estado con los datos del JSON
            setCapacity(jsonData.capacidad_mochila.toString());
            setTableRows(jsonData.objetos);
            // Limpiar errores
            setErrorFile("");
          } else {
            throw new Error("Formato de JSON inválido.");
          }
        } catch (error) {
          setErrorFile(
            "Error al leer el archivo. Asegúrese de que el archivo esté en formato JSON válido y contenga los campos necesarios."
          );
        }
      };
      reader.readAsText(file);
    } else {
      setErrorFile("Por favor, seleccione un archivo JSON.");
    }
  };

  const columnsObj = [
    { key: "nombre", label: "Objeto" },
    { key: "valor", label: "Valor" },
    { key: "costo", label: "Costo" },
  ];

  const handleSetValues = () => {
    // Verificación de campos vacíos.

    setCapacity(capacity);

    if (capacity === "") {
      setCheck("");
      setError("Todos los campos deben estar completos antes de continuar.");
      return;
    }

    setError("");
    setCheck("Capacidad máxima establecida.");
  };

  const handleAddRow = () => {
    // Verificación de campos vacíos.

    if (capacity === "") {
      setError("Todos los campos deben estar completos antes de continuar.");
      return;
    }

    if (cost === "" || value === "") {
      setError2("Todos los campos deben estar completos antes de continuar.");
      return;
    }

    // Creación de una nueva fila con los valores de los inputs.

    const newRow = {
      nombre: object,
      valor: value,
      costo: cost,
    };

    // Agregación de la nueva fila al estado de filas de la tabla principal.

    setTableRows([...tableRows, newRow]);

    // Limpieza de los valores de los inputs.

    setObject("Objeto #" + (counter + 1));
    setCost("");
    setValue("");
    setCounter(counter + 1);
    setError2("");
  };

  function generateMatrix(N, M) {
    // Crear una matriz de NxN con todas las celdas inicializadas al valor dado (por defecto 0)
    const matrix = Array.from({ length: N }, () => Array(M).fill(0));

    let currentValue = 0; // Iniciar con el valor 0

    // Rellenar la matriz con valores secuenciales
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        matrix[i][j] = currentValue;
        currentValue++;
      }
    }
    return matrix;
  }

  function bounded() {
    setMode(false);
    setModeMessage("Modo Bounded activado.");
  }

  function unbounded() {
    setMode(true);
    setModeMessage("Modo Unbounded activado.");
  }

  function invertirElementos(str) {
    // Eliminar la coma final y dividir el string en partes
    let elementos = str.trim().replace(/,$/, "").split(", ");

    // Invertir el orden de los elementos
    let elementosInvertidos = elementos.reverse();

    // Crear el nuevo string con los elementos invertidos
    let resultado = "Me llevo " + elementosInvertidos.join(", ");

    return resultado;
  }

  function calculate_Bounded() {
    // Aquí va el algoritmo Unbounded Knapsack.

    let capacidad = parseInt(capacity);

    //console.log(tableRows);
    //console.log(tableRows.length);
    let matriz = generateMatrix(capacidad + 1, tableRows.length);
    //console.log(matriz);

    for (let columna = 0; columna < tableRows.length; columna++) {
      // Recolección de datos del objeto.

      let objeto = tableRows[columna];
      //console.log(objeto);
      let nombre = objeto.nombre;
      //console.log(nombre);
      let valor = parseInt(objeto.valor);
      //console.log(valor);
      let costo = parseInt(objeto.costo);
      //console.log(costo);

      // Inicio del análisis.

      let capacidad_actual = 0;
      let valor_alcanzado = 0;
      for (let fila = 0; fila < capacidad + 1; fila++) {
        //console.log(matriz[fila][columna]);

        let color_actual = "rojo";
        const cantidad_actual = 1;

        if (columna === 0) {
          // Análisis de la primera columna.

          if (capacidad_actual < costo) {
            // Si el primer objeto no cabe.
            matriz[fila][columna] = {
              nombre: nombre,
              valor: valor_alcanzado,
              costo: costo,
              color: color_actual,
            };
          } else {
            // Si el primer objeto cabe.
            let color_actual = "verde";
            //console.log("Cantidad alcanzada: " + cantidad_alcanzada);

            matriz[fila][columna] = {
              nombre: nombre,
              valor: valor,
              costo: costo,
              color: color_actual,
            };
          }
        } else {
          // QUITAR EL IF, DEJAR SOLO ELSE
          // Análisis de las siguientes columnas.

          if (capacidad_actual < costo) {
            // Si el primer objeto no cabe.
            matriz[fila][columna] = {
              nombre: nombre,
              valor: matriz[fila][columna - 1].valor,
              costo: costo,
              color: "rojo",
            };
          } else {
            // Si el primer objeto cabe.
            //console.log("VOY POR LA CAPACIDAD ACTUAL: " + capacidad_actual);
            let cantidad_maxima_por_capacidad = cantidad_actual;
            //console.log("Cantidad máxima por capacidad: " + cantidad_maxima_por_capacidad);
            //console.log("");
            let valores_temporales = [];
            for (let i = 1; i <= cantidad_maxima_por_capacidad; i++) {
              //console.log("Qué pasa si me llevo " + i + " objeto(s)?");
              let valor_restante = capacidad_actual - i * costo;
              //console.log("Capacidad restante: " + valor_restante);

              let valor_consultado = matriz[valor_restante][columna - 1].valor;
              //console.log("Valor consultado: " + valor_consultado);

              valor_alcanzado = valor_consultado + i * valor;
              //console.log("Valor alcanzado: " + valor_alcanzado);

              valores_temporales.push({ valor: valor_alcanzado, cantidad: i });
            }

            // Encontrar el objeto con el valor más alto
            let valor_maximo = valores_temporales.reduce(
              (max, obj) => {
                return obj.valor > max.valor ? obj : max;
              },
              { valor: -Infinity }
            );

            //console.log("El valor máximo es: ", valor_maximo);

            let valor_anterio = matriz[capacidad_actual][columna - 1].valor;
            //console.log("Valor anterior: " + valor_anterio);

            if (valor_maximo.valor > valor_anterio) {
              matriz[fila][columna] = {
                nombre: nombre,
                valor: valor_maximo.valor,
                costo: costo,
                color: "verde",
              };
            } else {
              matriz[fila][columna] = {
                nombre: nombre,
                valor: valor_anterio,
                costo: costo,
                color: "rojo",
              };
            }
          }
        }
        capacidad_actual++;
        //console.log("");
      }
    }

    // FOR DE REVISIÓN DE COLUMNA ESPECÍFICA.

    for (let fila = 0; fila < capacidad + 1; fila++) {
      console.log(matriz[fila][3]);
    }

    setResult(true);

    return matriz;
  }

  function calculate_Unbounded() {
    // Aquí va el algoritmo Unbounded Knapsack.

    let capacidad = parseInt(capacity);

    //console.log(tableRows);
    //console.log(tableRows.length);
    let matriz = generateMatrix(capacidad + 1, tableRows.length);
    //console.log(matriz);

    for (let columna = 0; columna < tableRows.length; columna++) {
      // Recolección de datos del objeto.

      let objeto = tableRows[columna];
      //console.log(objeto);
      let nombre = objeto.nombre;
      //console.log(nombre);
      let valor = parseInt(objeto.valor);
      //console.log(valor);
      let costo = parseInt(objeto.costo);
      //console.log(costo);

      // Inicio del análisis.

      let capacidad_actual = 0;
      let valor_alcanzado = 0;
      for (let fila = 0; fila < capacidad + 1; fila++) {
        //console.log(matriz[fila][columna]);

        let color_actual = "rojo";
        let cantidad_actual = 0;

        if (columna === 0) {
          // Análisis de la primera columna.

          if (capacidad_actual < costo) {
            // Si el primer objeto no cabe.
            matriz[fila][columna] = {
              nombre: nombre,
              valor: valor_alcanzado,
              costo: costo,
              color: color_actual,
              cantidad: cantidad_actual,
            };
          } else {
            // Si el primer objeto cabe.
            let color_actual = "verde";
            let cantidad_alcanzada = Math.floor(capacidad_actual / costo);
            //console.log("Cantidad alcanzada: " + cantidad_alcanzada);

            matriz[fila][columna] = {
              nombre: nombre,
              valor: valor * cantidad_alcanzada,
              costo: costo,
              color: color_actual,
              cantidad: cantidad_alcanzada,
            };
          }
        } else {
          // QUITAR EL IF, DEJAR SOLO ELSE
          // Análisis de las siguientes columnas.

          if (capacidad_actual < costo) {
            // Si el primer objeto no cabe.
            matriz[fila][columna] = {
              nombre: nombre,
              valor: matriz[fila][columna - 1].valor,
              costo: costo,
              color: "rojo",
              cantidad: 0,
            };
          } else {
            // Si el primer objeto cabe.
            //console.log("VOY POR LA CAPACIDAD ACTUAL: " + capacidad_actual);
            let cantidad_maxima_por_capacidad = Math.floor(
              capacidad_actual / costo
            );
            //console.log("Cantidad máxima por capacidad: " + cantidad_maxima_por_capacidad);
            //console.log("");
            let valores_temporales = [];
            for (let i = 1; i <= cantidad_maxima_por_capacidad; i++) {
              cantidad_actual = i;

              //console.log("Qué pasa si me llevo " + i + " objeto(s)?");
              let valor_restante = capacidad_actual - i * costo;
              //console.log("Capacidad restante: " + valor_restante);

              let valor_consultado = matriz[valor_restante][columna - 1].valor;
              //console.log("Valor consultado: " + valor_consultado);

              valor_alcanzado = valor_consultado + i * valor;
              //console.log("Valor alcanzado: " + valor_alcanzado);

              valores_temporales.push({ valor: valor_alcanzado, cantidad: i });
            }

            // Encontrar el objeto con el valor más alto
            let valor_maximo = valores_temporales.reduce(
              (max, obj) => {
                return obj.valor > max.valor ? obj : max;
              },
              { valor: -Infinity }
            );

            //console.log("El valor máximo es: ", valor_maximo);

            let valor_anterio = matriz[capacidad_actual][columna - 1].valor;
            //console.log("Valor anterior: " + valor_anterio);

            if (valor_maximo.valor > valor_anterio) {
              matriz[fila][columna] = {
                nombre: nombre,
                valor: valor_maximo.valor,
                costo: costo,
                color: "verde",
                cantidad: valor_maximo.cantidad,
              };
            } else {
              matriz[fila][columna] = {
                nombre: nombre,
                valor: valor_anterio,
                costo: costo,
                color: "rojo",
                cantidad: 0,
              };
            }
          }
        }
        capacidad_actual++;
        //console.log("");
      }
    }

    // FOR DE REVISIÓN DE COLUMNA ESPECÍFICA.

    /*for (let fila = 0; fila < capacidad + 1; fila++) {
      console.log(matriz[fila][2]);
    }*/

    setResult(true);

    return matriz;
  }

  const renderizarTabla = (matriz) => {
    if (mode === false) {
      // Modo Bounded
      return (
        <div className="flex justify-center bg-black">
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="border border-white w-12 h-12 font-bold "></th>
                {matriz[0].map((objeto, index) => (
                  <th
                    key={index}
                    className="border border-white w-36 h-12  font-bold text-white"
                  >
                    {objeto.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matriz.map((fila, i) => (
                <tr key={i}>
                  <td className="border border-white w-12 h-12 font-bold text-center text-white">
                    {i}
                  </td>
                  {fila.map((objeto, j) => (
                    <td
                      key={j}
                      className={`border border-white w-12 h-12 text-center ${
                        objeto.color === "rojo" ? "bg-red-400" : "bg-lime-400"
                      }`}
                    >
                      <div>{objeto.valor}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Modo Unbounded
      return (
        <div className="flex justify-center bg-black">
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="border border-white w-12 h-12 font-bold "></th>
                {matriz[0].map((objeto, index) => (
                  <th
                    key={index}
                    className="border border-white w-36 h-12  font-bold text-white"
                  >
                    {objeto.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matriz.map((fila, i) => (
                <tr key={i}>
                  <td className="border border-white w-12 h-12 font-bold text-center text-white">
                    {i}
                  </td>
                  {fila.map((objeto, j) => (
                    <td
                      key={j}
                      className={`border border-white w-12 h-12 text-center ${
                        objeto.color === "rojo" ? "bg-red-400" : "bg-lime-400"
                      }`}
                    >
                      <div>{objeto.valor}</div>
                      <div className="text-xs">x = {objeto.cantidad}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const handleCalculate = () => {
    let matriz = [];
    let resultado = "";

    if (mode === false) {
      // ALGORITMO BOUNDED

      matriz = calculate_Bounded();

      let fila = capacity;
      let columna = tableRows.length - 1;

      for (let i = 0; i < tableRows.length; i++) {
        let coordenada = matriz[fila][columna];
        //console.log(coordenada);
        //console.log("Fila: " + fila + " Columna: " + columna);
        if (coordenada.color === "verde") {
          resultado += coordenada.nombre + ", ";
          //console.log("Cantidad: " + coordenada.cantidad);
          //console.log("Costo: " + coordenada.costo);
          let valor_restado = parseInt(coordenada.costo);
          //console.log("Valor restado: " + valor_restado);
          fila -= valor_restado;
          columna--;
        } else {
          //console.log(coordenada);
          //resultado += "0" + " " + coordenada.nombre + ", ";
          columna--;
        }
      }
    } else {
      // ALGORITMO UNBOUNDED

      matriz = calculate_Unbounded();

      let fila = capacity;
      let columna = tableRows.length - 1;

      for (let i = 0; i < tableRows.length; i++) {
        let coordenada = matriz[fila][columna];
        //console.log(coordenada);
        //console.log("Fila: " + fila + " Columna: " + columna);
        if (coordenada.color === "verde") {
          resultado += coordenada.cantidad + " " + coordenada.nombre + ", ";
          //console.log("Cantidad: " + coordenada.cantidad);
          //console.log("Costo: " + coordenada.costo);
          let valor_restado =
            parseInt(coordenada.cantidad) * parseInt(coordenada.costo);
          //console.log("Valor restado: " + valor_restado);
          fila -= valor_restado;
          columna--;
        } else {
          //console.log(coordenada);
          resultado += coordenada.cantidad + " " + coordenada.nombre + ", ";
          columna--;
        }
      }
    }

    setMatriz(matriz);
    setResultado_Optimo(invertirElementos(resultado));
    console.log(resultado);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-black text-white">
      <h1
        id="titulo_input_capacidad_mochila"
        className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
      >
        Elija el modo del algoritmo.
      </h1>
      <div id="botones_data" className="flex mb-6">
        <Button
          id="btn_cargar"
          radius="full"
          className="bg-gradient-to-b from-orange-600 to-orange-300 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
          onClick={bounded}
        >
          Bounded
        </Button>
        <Button
          id="btn_calcular"
          radius="full"
          className="bg-gradient-to-b from-pink-900 to-pink-600 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
          onClick={unbounded}
        >
          Unbounded
        </Button>
      </div>
      {modeMessage && (
        <p className="mx-8 text-lime-500 font-mono text-lg">{modeMessage}</p>
      )}
      <div id="inputs">
        <h1
          id="titulo_input_capacidad_mochila"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Ingrese la capacidad máxima de la mochila.
        </h1>
        <div
          id="input_capacidad"
          className="mt-6 flex w-full flex-wrap md:flex-nowrap  items-center"
        >
          <Input
            id="inp_initialCost"
            className="w-full mx-8"
            label="Capacidad máxima de la mochila"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <Button
            id="btn_set_value"
            radius="full"
            fullWidth
            className="bg-gradient-to-b from-red-400 to-red-900 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8"
            onClick={handleSetValues}
          >
            Fijar
          </Button>
        </div>
        {check && (
          <p className="mx-8 mt-8 text-lime-500 font-mono text-lg">{check}</p>
        )}
        {error && (
          <p className="mx-8 mt-8 text-red-500 font-mono text-lg">{error}</p>
        )}
        <h1
          id="titulo_input_datos_objetos"
          className="mx-8 mt-10 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Ingrese los datos de los objetos.
        </h1>
        <div
          id="inpt_object_data"
          className="mt-6 flex w-full flex-wrap md:flex-nowrap items-center"
        >
          <Input
            id="inp_nombre_objeto"
            className="w-full mx-8"
            label="Nombre del objeto"
            value={object}
            onChange={(e) => setObject(e.target.value)}
          />
          <Input
            id="np_valor_objeto"
            className="w-full mx-8"
            label="Valor del objeto"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Input
            id="inp_costo_objeto"
            className="w-full mx-8"
            label="Costo del objeto"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <Button
            id="btn_add_data"
            radius="full"
            className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold my-4 mx-8 w-full"
            onClick={handleAddRow}
          >
            + Agregar
          </Button>
        </div>
        {error2 && (
          <p className="mx-8 mt-8 text-red-500 font-mono text-lg">{error2}</p>
        )}
        <Table
          id="tabla_mantenimientos"
          aria-label="Tabla de Reemplazo de Programación"
          className="text-black w-auto mx-8 mt-6"
        >
          <TableHeader>
            {columnsObj.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow key={index}>
                {columnsObj.map((column) => (
                  <TableCell key={column.key}>{row[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div id="botones_data" className="flex mb-6">
          <Button
            id="btn_cargar"
            radius="full"
            className="bg-gradient-to-b from-yellow-600 to-amber-300 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
            onClick={handleButtonClick}
          >
            Cargar datos
          </Button>
          {/* Input file oculto */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".txt"
          />
          <Button
            id="btn_calcular"
            radius="full"
            className="bg-gradient-to-b from-purple-600 to-blue-600 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
            onClick={handleCalculate}
          >
            Hacer la calculación...
          </Button>
        </div>
        {errorFile && (
          <p className="mx-8 mt-8 text-red-500 font-mono text-lg">
            {errorFile}
          </p>
        )}
      </div>
      {result && (
        <div id="resultados" className="mx-8 mt-6">
          <h1
            id="titulo_resultados"
            className="text-center mt-4 mb-8 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
          >
            Resultados
          </h1>
          <h1
            id="titulo_tabla"
            className="text-center mt-4 mb-8 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-purple-600"
          >
            Tabla de resultados
          </h1>
          {/* Aquí va la tabla de resultados */}
          <div id="tabla_m" className="bg-white text-black">
            {renderizarTabla(matriz)}
          </div>
          <h1
            id="resultado_optimo"
            className="text-center my-8 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-purple-600"
          >
            Resultado óptimo:
          </h1>
          <h3 className="mb-20 mt-4 font-mono text-2xl font-extrabold dark:text-white tracking-wider text-red-400 text-center">
            {resultado_optimo}
          </h3>
        </div>
      )}
    </div>
  );
}

export default Backpack;
