import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";

function MatrixMultiplication() {
  const [rows, setRows] = useState([{ name: "A1", filas: "", columnas: "" }]);
  const [error, setError] = useState("");
  const [counter, setCounter] = useState(1);
  const [calcular, setCalcular] = useState(false);

  let valoresK = [];

  const handleCalcularClick = () => {
    // Cambiar el estado de la variable 'calcular' a true
    setCalcular(true);
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    const newCounter = counter + 1;
    setCounter(newCounter);

    // Obtener el valor de "Columnas" de la fila anterior
    const previousColumns = rows[rows.length - 1].columnas;

    setRows([
      ...rows,
      { name: `A${newCounter}`, filas: previousColumns, columnas: "" },
    ]);
  };

  const handleButtonClick = () => {
    const lastRow = rows[rows.length - 1];
    if (!lastRow.name || !lastRow.filas || !lastRow.columnas) {
      setError("Todos los campos deben estar completos antes de continuar.");
      return;
    }
    setError("");
    console.log(rows);
    addRow();
  };

  function generateMatrix(N) {
    // Crear una matriz de NxN con todas las celdas inicializadas al valor dado (por defecto 0)
    const matrix = Array.from({ length: N }, () => Array(N).fill(0));
    return matrix;
  }

  const setTablaM = () => {
    // ETAPA #1: Crear la matriz M.

    const n = rows.length - 1;
    let tablaM = new Array();
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
        tablaM.push({ i, j, value: 0 });
      }
    }

    // Funciones para el manejo de la matriz M.

    function getElementValue(i, j) {
      let elemento = tablaM.find(
        (element) => element.i === i && element.j === j
      );
      let valor = elemento.value;
      return valor;
    }

    function setElementValue(i, j, value) {
      let elemento = tablaM.find(
        (element) => element.i === i && element.j === j
      );
      elemento.value = value;
    }

    // ETAPA #2: Crear el arreglo de las dimensiones "d" de las matrices.

    const d = [];
    rows.forEach((element, index) => {
      if (index === 0) {
        d.push(parseInt(element.filas) || 0);
      }
      d.push(parseInt(element.columnas) || 0);
    });
    d.pop();

    // ETAPA #3: Llenar la matriz M.

    // Segundo caso trivial.
    for (let j = 1; j <= n; j++) {
      for (let i = 1; i <= n; i++) {
        let diferencia = i - j;

        if (diferencia === -1) {
          const currentElement = rows[i - 1];
          const nextElement = rows[i];

          const numFilasCurrent = parseInt(currentElement.filas) || 0;
          const numColumnasCurrent = parseInt(currentElement.columnas) || 0;
          const numColumnasNext = parseInt(nextElement.columnas) || 0;

          let valor = numFilasCurrent * numColumnasCurrent * numColumnasNext;

          setElementValue(i, j, valor);
        }
      }
    }

    // Caso general.

    let iteraciones = n - 2;
    let celdas = n - 2;
    let coordenadaI = 1;
    let coordenadaJ = 3;
    let controlJ = 0;

    while (iteraciones !== 0) {
      let contador = celdas;
      while (contador !== 0) {
        // Hacer algo aquí.

        let valores = [];
        let k = coordenadaI;
        while (k < coordenadaJ) {
          let sumando1 = getElementValue(coordenadaI, k);
          let sumando2 = getElementValue(k + 1, coordenadaJ);
          let d1 = d[coordenadaI - 1];
          let d2 = d[coordenadaJ];
          let d3 = d[k];
          let valor = sumando1 + sumando2 + d1 * d2 * d3;
          valores.push({ i: coordenadaI, j: coordenadaJ, k: k, valor });
          k++;
        }

        let menorValor = Infinity;
        let objetoMenorValor = null;

        for (let i = 0; i < valores.length; i++) {
          let valorActual = valores[i].valor;

          if (valorActual < menorValor) {
            menorValor = valorActual;
            objetoMenorValor = valores[i];
          }
        }

        setElementValue(coordenadaI, coordenadaJ, menorValor);
        valoresK.push(objetoMenorValor);

        coordenadaI++;
        coordenadaJ++;
        contador--;
      }

      celdas--;
      coordenadaI = 1;
      controlJ++;
      coordenadaJ = 3 + controlJ;

      iteraciones--;
    }

    return tablaM;
  };

  let tabla_M = null;
  if (calcular === false) {
    tabla_M = generateMatrix(100);
  } else {
    tabla_M = setTablaM();
  }

  const renderizarTablaM = (tablaM) => {
    // Eliminar la última fila y columna de la matriz
    const numRows = rows.length - 1;

    return (
      <table className="border-collapse table-fixed">
        <thead>
          <tr>
            <th className="border border-black w-12 h-12 font-bold"></th>
            {Array.from({ length: numRows }, (_, index) => (
              <th
                key={index + 1}
                className="border border-black w-12 h-12 font-bold"
              >
                {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: numRows }, (_, i) => (
            <tr key={i + 1}>
              <td className="border border-black w-12 h-12 font-bold text-center">
                {i + 1}
              </td>
              {Array.from({ length: numRows }, (_, j) => (
                <td
                  key={j + 1}
                  className="border border-black w-12 h-12 text-center"
                >
                  {getTableValue(tablaM, i + 1, j + 1)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const getTableValue = (tablaM, i, j) => {
    const element = tablaM.find((el) => el.i === i && el.j === j);
    return element ? element.value : 0;
  };

  const setTablaP = () => {
    // ETAPA #1: Crear la matriz M.

    const n = rows.length - 1;
    let tablaP = new Array();
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
        tablaP.push({ i, j, value: 0 });
      }
    }

    // Funciones para el manejo de la matriz M.

    function setElementValue(i, j, value) {
      let elemento = tablaP.find(
        (element) => element.i === i && element.j === j
      );
      elemento.value = value;
    }

    // ETAPA #2: Llenar la matriz P.

    // Segundo caso trivial.
    for (let j = 1; j <= n; j++) {
      for (let i = 1; i <= n; i++) {
        let diferencia = i - j;

        if (diferencia === -1) {
          setElementValue(i, j, i);
        }
      }
    }

    for (const objeto of valoresK) {
      let valor_i = objeto.i;
      //console.log(valor_i);
      let valor_j = objeto.j;
      //console.log(valor_j);
      let valor_k = objeto.k;
      //console.log(valor_k);
      //console.log("");
      setElementValue(valor_i, valor_j, valor_k);
    }

    //console.log(tablaP);
    //console.log(valoresK);

    // Caso general.
    /* */

    return tablaP;
  };

  let tabla_P = null;
  if (calcular === false) {
    tabla_P = generateMatrix(100);
  } else {
    tabla_P = setTablaP();
  }

  function matrixGenericToNormal(matrizGenerica) {
    let matriz = generateMatrix(rows.length - 1);

    for (const objeto of matrizGenerica) {
      let i = objeto.i - 1;
      let j = objeto.j - 1;
      let valor = objeto.value;
      matriz[i][j] = valor;
    }
    //console.log(matriz);
    return matriz;
  }

  const resultadoMultiplicacionOptima = (matrizGenerica) => {
    // Función recursiva para imprimir la secuencia óptima de multiplicaciones
    const printOptimalParens = (matrizGenerica, i, j) => {
      if (i === j) {
        return `A${i + 1}`; // Agregar 1 para ajustar al formato 1-based
      } else {
        let k = matrizGenerica[i][j];
        let left = printOptimalParens(matrizGenerica, i, k - 1); // Ajuste del índice para 0-based
        let right = printOptimalParens(matrizGenerica, k, j); // No necesitamos ajustar ya que k es el índice base para j
        return `(${left} x ${right})`;
      }
    };

    // Definir el rango inicial (0 a n-1)
    const n = matrizGenerica.length;
    const optimalSequence = printOptimalParens(matrizGenerica, 0, n - 1);

    return optimalSequence;
  };

  let resultado = null;
  if (calcular === false) {
    resultado = "No hay resultados para mostrar.";
  } else {
    resultado = resultadoMultiplicacionOptima(matrixGenericToNormal(tabla_P));
  }

  return (
    <div
      id="contenedor"
      className="min-h-screen w-full flex flex-col bg-black text-white"
    >
      <div id="seccion_datos_iniciales">
        <h1
          id="titulo_inputs_iniciales"
          className="mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Ingrese sus datos iniciales
        </h1>
        {rows.map((row, index) => (
          <div
            key={index}
            id={`inputs_iniciales_${index}`}
            className="mt-6 flex w-full flex-wrap md:flex-nowrap items-center"
          >
            <Input
              id={`inp_name_${index}`}
              className="w-full mx-8"
              label="Nombre"
              value={row.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
            />
            <h1 className="font-mono text-3xl font-extrabold dark:text-white tracking-wider text-white">
              :
            </h1>
            <Input
              id={`inp_rows_${index}`}
              className="w-full mx-8"
              label="Filas"
              value={row.filas}
              onChange={(e) =>
                handleInputChange(index, "filas", e.target.value)
              }
            />
            <h1 className="font-mono text-3xl font-extrabold dark:text-white tracking-wider text-white">
              X
            </h1>
            <Input
              id={`inp_columns_${index}`}
              className="w-full mx-8"
              label="Columnas"
              value={row.columnas}
              onChange={(e) =>
                handleInputChange(index, "columnas", e.target.value)
              }
            />
          </div>
        ))}
        {error && (
          <p className="mx-8 mt-4 text-red-500 font-mono text-lg">{error}</p>
        )}
        <div className="flex">
          <Button
            id="btn_cargasr_fatos"
            radius="full"
            fullWidth
            className="bg-gradient-to-b from-red-400 to-red-900 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full ml-8 mr-4 mt-8"
            //onClick={}
          >
            Cargar
          </Button>
          <Button
            id="btn_set_values"
            radius="full"
            fullWidth
            className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full ml-4 mr-4 mt-8"
            onClick={handleButtonClick}
          >
            Fijar
          </Button>
          <Button
            id="btn_calculate"
            radius="full"
            fullWidth
            className="bg-gradient-to-b from-purple-600 to-blue-600 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full ml-4 mr-8 mt-8"
            onClick={handleCalcularClick}
          >
            Hacer la calculación...
          </Button>
        </div>
      </div>
      <div id="seccion_resultados">
        <div id="tablas" className="h-auto flex justify-center">
          <div
            id="seccion_tabla_m"
            className="mx-4 my-8 flex flex-col h-auto justify-center items-center"
          >
            <h1
              id="titulo_inputs_iniciales"
              className="my-10 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
            >
              Tabla M
            </h1>
            <div id="tabla_m" className="bg-white text-black">
              {renderizarTablaM(tabla_M)}
            </div>
          </div>
          <div
            id="seccion_tabla_p"
            className="mx-4 flex flex-col h-auto justify-center items-center"
          >
            <h1
              id="titulo_inputs_iniciales"
              className="my-10 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
            >
              Tabla P
            </h1>
            <div id="tabla_P" className="bg-white text-black">
              {renderizarTablaM(tabla_P)}
            </div>
          </div>
        </div>
        <div
          id="seccion_multiplicacion_optima"
          className="flex flex-col h-auto justify-center items-center"
        >
          <h1
            id="titulo_inputs_iniciales"
            className="mx-8 my-10 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
          >
            La multiplicación óptima es:
          </h1>
          <h3 className="mb-20 mt-4 font-mono text-2xl font-extrabold dark:text-white tracking-wider text-red-400">
            {resultado}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default MatrixMultiplication;
