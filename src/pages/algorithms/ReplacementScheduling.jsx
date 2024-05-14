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

  const columns = [
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
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{row[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Botón para realizar los cálculos. */}

      <Button
        id="btn_calcular"
        radius="full"
        className="bg-gradient-to-b from-purple-600 to-blue-600 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-auto mx-8 mt-8"
        //onClick={}
      >
        Hacer la calculación...
      </Button>

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
            className="text-black w-auto mx-8 mt-4"
          >
            <TableHeader>
              <TableColumn>T</TableColumn>
              <TableColumn>G(T)</TableColumn>
              <TableColumn>Próximo</TableColumn>
            </TableHeader>
            <TableBody></TableBody>
          </Table>
        </div>

        {/* Tabla de planes óptimos. */}

        <div id="planes_optimos" className="w-full">
          <h1 className="mx-8 mt-4 font-mono text-3xl font-extrabold dark:text-white tracking-wider text-lime-400">
            Planes óptimos
          </h1>
          <Table
            id="tabla_planes_optimos"
            aria-label="Tabla de Planes Óptimos"
            className="text-black w-auto mx-8 mt-4"
          >
            <TableHeader>
              <TableColumn>Planes Óptimos</TableColumn>
            </TableHeader>
            <TableBody></TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
