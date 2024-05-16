// ========================= IMPORTACIÓN DE LIBRERIAS ==============================    //

import React, { useState } from "react";
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

// ========================= COMPONENTE PRINCIPAL ==============================    //

export default function ReplacementScheduling() {
  // ================= MANEJO DEL FRONTEND =================    //

  // Estado para almacenar las filas de la tabla de mantenimientos.

  const [tableRows, setTableRows] = useState([]);

  // Estados para los valores de los inputs.

  const [year, setYear] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [sales, setSales] = useState("");
  const [initialCost, setInitialCost] = useState("");
  const [projectTime, setProjectTime] = useState("");
  const [vida_util, setVida_Util] = useState("");

  // Columnas de la tabla de mantenimiento.

  const columnsMant = [
    { key: "year", label: "Año" },
    { key: "maintenance", label: "Mantenimiento" },
    { key: "sales", label: "Venta" },
  ];

  // ---------------- FUNCIONES PARA EL MANEJO DE LOS DATOS ---------------- //

  // Función para manejar la inserción de los valores iniciales.

  const handleSetValues = () => {
    // Verificación de campos vacíos.

    if (
      initialCost.trim() === "" ||
      projectTime.trim() === "" ||
      vida_util.trim() === ""
    ) {
      alert(
        "A ver pendejo!!! Me completa todos los campos!!! No me haga ponerme de pie!!!"
      );
      return;
    }

    // Establecimiento de valores iniciales.

    setInitialCost(initialCost);
    setProjectTime(projectTime);
    setVida_Util(vida_util);

    // Mensaje de confirmación.

    alert("Valores establecidos... Buen trabajo!!!");
  };

  // Función para manejar la inserción de datos en la tabla principal

  const handleAddRow = () => {
    // Verificación de campos vacíos.

    if (
      year.trim() === "" ||
      maintenance.trim() === "" ||
      sales.trim() === ""
    ) {
      alert(
        "A ver pendejo!!! Me completa todos los campos!!! No me haga ponerme de pie!!!"
      );
      return;
    }

    // Creación de una nueva fila con los valores de los inputs.

    const newRow = {
      year,
      maintenance,
      sales,
    };

    // Agregación de la nueva fila al estado de filas de la tabla principal.

    setTableRows([...tableRows, newRow]);

    // Limpieza de los valores de los inputs.

    setYear("");
    setMaintenance("");
    setSales("");
  };

  // ================= MANEJO DEL BACKEND =================    //

  // Estado para almacenar los costos calculados

  const [differences, setDifference] = useState([]);

  // Estado para almacenar las filas de la tabla de planes obtenidos.

  const [tableRowsObtnPlans, setTableRowsObtnPlans] = useState([]);

  // Columnas de la tabla de planes obtenidos.

  const columnsObtPlans = [
    { key: "t", label: "T" },
    { key: "Gt", label: "G(T)" },
    { key: "proximo", label: "Próximo" },
  ];

  const [tableRowsObtimPlans, setTableRowsObtimPlans] = useState([]);

  // Columnas de la tabla de planes obtimos.

  const columnsObtimPlans = [{ key: "optimos", label: "Planes Óptimos" }];

  // Función para calcular los costos.

  const calculateCosts = () => {
    let t = 0;
    let x = 1;
    let difference = x - t;

    let calculatedCosts = [];

    while (x <= vida_util) {
      let Mantenimiento = 0;
      for (let i = t; i <= x; i++) {
        let row = tableRows.find((item) => item.year === i.toString());
        if (row) {
          Mantenimiento += parseInt(row.maintenance);
        }
      }

      let Venta = 0;
      let ventaRow = tableRows.find(
        (item) => item.year === difference.toString()
      );
      if (ventaRow) {
        Venta = parseInt(ventaRow.sales);
      }

      let Compra = parseInt(initialCost);
      let Ctx = Compra + Mantenimiento - Venta;

      calculatedCosts.push({ difference, Ctx });

      x++;
      difference = x - t;
    }

    setDifference(calculatedCosts);
  };

  // Función para consultar los costos.

  const consultarCostos = (t, x) => {
    let diffValue = x - t;
    const result = differences.find((item) => item.difference === diffValue);
    return result ? result.Ctx : null;
  };

  // Función para calcular los costos mínimos.

  const costosMinimos = () => {
    let tablaPlanes = [];
    let valoresGt = [];
    let t = parseInt(projectTime);
    let gt = 0;
    let proximo = "";

    const findGtByT = (x) => {
      const result = valoresGt.find((item) => item.valor_t === x);
      return result ? result.valor_Gt : null;
    };

    while (t >= 0) {
      if (t === parseInt(projectTime)) {
        gt = 0;
        valoresGt.push({ valor_t: t, valor_Gt: gt });
        tablaPlanes.push({ t: t, Gt: gt, proximo: proximo });
      } else {
        let t_buscado = t;
        let x_buscado = t + 1;
        let valores_previos = [];
        while (x_buscado <= parseInt(projectTime)) {
          let diferencia = x_buscado - t_buscado;
          if (diferencia <= parseInt(vida_util)) {
            let Ctx = consultarCostos(t_buscado, x_buscado);
            let Gx = findGtByT(x_buscado);
            let costo_previo = Ctx + Gx;
            valores_previos.push({ x: x_buscado, costo: costo_previo });
          }
          x_buscado++;
        }
        let costoMinimo = Infinity;
        valores_previos.forEach((valor) => {
          if (valor.costo < costoMinimo) {
            costoMinimo = valor.costo;
          }
        });
        gt = costoMinimo;
        valoresGt.push({ valor_t: t, valor_Gt: gt });
        valores_previos.forEach((valor) => {
          if (valor.costo === gt) {
            if (proximo === "") {
              proximo += valor.x.toString();
            } else {
              proximo += ", " + valor.x.toString();
            }
          }
        });
        tablaPlanes.push({ t: t, Gt: gt, proximo: proximo });
        proximo = "";
      }
      t--;
    }
    tablaPlanes.reverse();
    setTableRowsObtnPlans(tablaPlanes);
  };

  function findPaths(start, end, adjacencyList, currentPath, allPaths) {
    // Añadir el nodo actual al camino actual
    currentPath.push(start);

    // Si hemos llegado al nodo final, añadir el camino actual a la lista de caminos
    if (start === end) {
      allPaths.push([...currentPath]);
    } else {
      // Explorar los nodos adyacentes al nodo actual
      for (const next of adjacencyList[start]) {
        findPaths(next, end, adjacencyList, currentPath, allPaths);
      }
    }

    // Eliminar el último nodo para retroceder y explorar otros caminos
    currentPath.pop();
  }

  function generateOptimalPlans(tableRowsObtnPlans) {
    // Crear un mapa de adjacencia basado en los valores de "T" y "próximo"
    const adjacencyList = {};

    tableRowsObtnPlans.forEach((row) => {
      const t = row.t;
      const nextNodes = row.proximo
        .split(",")
        .map((num) => parseInt(num.trim()));
      adjacencyList[t] = nextNodes;
    });

    // Encontrar el primer y último valor de "T" en la tabla
    const start = Math.min(...tableRowsObtnPlans.map((row) => row.t));
    const end = Math.max(...tableRowsObtnPlans.map((row) => row.t));

    // Almacenar todos los caminos encontrados
    const allPaths = [];

    // Llamar a la función findPaths para encontrar todos los caminos posibles
    findPaths(start, end, adjacencyList, [], allPaths);

    // Retornar los caminos óptimos encontrados
    return allPaths.map((path) => path.join("-"));
  }

  // Función para realizar los cálculos.

  const handleCalculate = () => {
    calculateCosts();
    costosMinimos();
    const optimalPlans = generateOptimalPlans(tableRowsObtnPlans);
    setTableRowsObtimPlans(optimalPlans.map((plan) => ({ optimos: plan })));
  };

  // ================= CÓDIGO HTML =================    //

  return (
    // Contenedor principal de la página.

    <div
      id="contenedor"
      className="h-auto w-full flex flex-col bg-black text-white"
    >
      {/* Sección de datos iniciales. */}

      <div id="seccion_inputs_iniciales">
        <h1
          id="titulo_inputs_iniciales"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Ingrese sus datos iniciales
        </h1>
        <div
          id="inputs_iniciales"
          className="mt-6 flex w-full flex-wrap md:flex-nowrap  items-center"
        >
          <Input
            id="inp_initialCost"
            className="w-full mx-8"
            label="Costo inicial del equipo"
            value={initialCost}
            onChange={(e) => setInitialCost(e.target.value)}
          />
          <Input
            id="inp_projectTime"
            className="w-full mx-8"
            label="Plazo del proyecto"
            value={projectTime}
            onChange={(e) => setProjectTime(e.target.value)}
          />
          <Input
            id="inp_vida_util"
            className="w-full mx-8"
            label="Vida útil del equipo"
            value={vida_util}
            onChange={(e) => setVida_Util(e.target.value)}
          />
          <Button
            id="btn_set_values"
            radius="full"
            fullWidth
            className="bg-gradient-to-b from-red-400 to-red-900 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8"
            onClick={handleSetValues}
          >
            Fijar
          </Button>
        </div>
      </div>

      {/* Sección de datos de mantenimiento y reventa. */}

      <div id="seccion_inputs_mantenimiento">
        <h1
          id="titulo_inputs_mantenimiento"
          className=" mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Ingrese sus datos de mantenimiento y reventa
        </h1>

        {/* Inputs para los datos de mantenimiento y reventa. */}

        <div
          id="inputs_mantenimeinto"
          className="mt-6 flex w-full flex-wrap md:flex-nowrap  items-center"
        >
          <Input
            id="inp_year"
            className="w-full mx-8"
            label="Año"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <Input
            id="inp_maintenance"
            className="w-full mx-8"
            label="Mantenimiento"
            value={maintenance}
            onChange={(e) => setMaintenance(e.target.value)}
          />
          <Input
            id="inp_sales"
            className="w-full mx-8"
            label="Venta"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
          />
          <Button
            id="btn_add_row"
            radius="full"
            fullWidth
            className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8"
            onClick={handleAddRow}
          >
            + Agregar
          </Button>
        </div>

        {/* Tabla de mantenimiento y reventa. */}

        <h1
          id="titulo_tabla_mantenimiento"
          className="mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
        >
          Datos de mantenimiento
        </h1>
        <Table
          id="tabla_mantenimientos"
          aria-label="Tabla de Reemplazo de Programación"
          className="text-black w-auto mx-8 mt-6"
        >
          <TableHeader>
            {columnsMant.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow key={index}>
                {columnsMant.map((column) => (
                  <TableCell key={column.key}>{row[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sección de resultados. */}

      <div id="resultados" className="flex mt-6">
        {/* Tabla de planes obtenidos. */}

        <div id="planes_obtenidos" className="w-full">
          <h1
            id="titulo_planes_obtenidos"
            className="mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400"
          >
            Planes obtenidos
          </h1>
          <Table
            id="tabla_planes_obtenidos"
            aria-label="Tabla de Planes Obtenidos"
            className="text-black w-auto mx-8 mt-6"
          >
            <TableHeader>
              {columnsObtPlans.map((column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {tableRowsObtnPlans.map((row, index) => (
                <TableRow key={index}>
                  {columnsObtPlans.map((column) => (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Tabla de planes óptimos. */}

        <div id="planes_optimos" className="w-full">
          <h1 className="mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400">
            Planes óptimos
          </h1>
          <Table
            id="tabla_planes_obtimos"
            aria-label="Tabla de Planes Obtimos"
            className="text-black w-auto mx-8 mt-6"
          >
            <TableHeader>
              {columnsObtimPlans.map((column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {tableRowsObtimPlans.map((row, index) => (
                <TableRow key={index}>
                  {columnsObtimPlans.map((column) => (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Botón para cargar datos y calcular. */}

      <div id="botones_data" className="flex mb-6">
        <Button
          id="btn_cargar"
          radius="full"
          className="bg-gradient-to-b from-yellow-600 to-amber-300 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
          //onClick={handleLoadData}
        >
          Cargar datos
        </Button>
        <Button
          id="btn_calcular"
          radius="full"
          className="bg-gradient-to-b from-purple-600 to-blue-600 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
          onClick={handleCalculate}
        >
          Hacer la calculación...
        </Button>
      </div>
    </div>
  );
}
