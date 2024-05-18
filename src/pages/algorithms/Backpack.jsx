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

function Backpack() {
  const [tableRows, setTableRows] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [counter, setCounter] = useState(1);
  const [object, setObject] = useState("Objeto #" + counter);
  const [cost, setCost] = useState("");
  const [value, setValue] = useState("");
  const [available, setAvailable] = useState("");
  const [check, setCheck] = useState("");
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const columnsObj = [
    { key: "object", label: "Objeto" },
    { key: "cost", label: "Costo" },
    { key: "value", label: "Valor" },
    { key: "available", label: "Cantidad Disponible" },
  ];

  const handleSetValues = () => {
    // Verificación de campos vacíos.

    setCapacity(capacity);

    if (capacity === "") {
      setCheck("");
      setError("Todos los campos deben estar completos antes de continuar.");
      return;
    } else {
      setError("");
      setCheck("Capacidad máxima establecida.");
    }

    // Establecimiento de valores iniciales.

    // Mensaje de confirmación.
  };

  const handleAddRow = () => {
    // Verificación de campos vacíos.

    if (capacity === "") {
      setError("Todos los campos deben estar completos antes de continuar.");
      return;
    }

    if (cost === "" || value === "" || available === "") {
      setError2("Todos los campos deben estar completos antes de continuar.");
      return;
    }

    // Creación de una nueva fila con los valores de los inputs.

    const newRow = {
      object: object,
      cost: cost,
      value: value,
      available: available,
    };

    // Agregación de la nueva fila al estado de filas de la tabla principal.

    setTableRows([...tableRows, newRow]);

    // Limpieza de los valores de los inputs.

    setObject("Objeto #" + (counter + 1));
    setCost("");
    setValue("");
    setAvailable("");
    setCounter(counter + 1);
    setError2("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-black text-white">
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
          {/* <div className="ml-8 w-full">
            <h1 className="font-mono text-3xl font-extrabold dark:text-white tracking-wider text-white text-center">
              {object}
            </h1>
      </div> */}
          <Input
            id="inp_nombre_objeto"
            className="w-full mx-8"
            label="Nombre del objeto"
            value={object}
            onChange={(e) => setObject(e.target.value)}
          />
          <Input
            id="inp_costo_objeto"
            className="w-full mx-8"
            label="Costo del objeto"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <Input
            id="np_valor_objeto"
            className="w-full mx-8"
            label="Valor del objeto"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Input
            id="np_cantidad_disponible_objeto"
            className="w-full mx-8"
            label="Cantidad disponible del objeto"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
          />
        </div>
        {error2 && (
          <p className="mx-8 mt-8 text-red-500 font-mono text-lg">{error2}</p>
        )}
        <div
          id="section_add_button"
          className="mt-6 flex w-full flex-wrap md:flex-nowrap  items-center"
        >
          <Button
            id="btn_add_data"
            radius="full"
            className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold my-4 mx-8 w-full"
            onClick={handleAddRow}
          >
            Agregar
          </Button>
        </div>
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
            //onClick={handleLoadData}
          >
            Cargar datos
          </Button>
          <Button
            id="btn_calcular"
            radius="full"
            className="bg-gradient-to-b from-purple-600 to-blue-600 text-white shadow-lg font-mono tracking-wider text-lg font-semibold w-full mx-8 mt-8"
            //onClick={handleCalculate}
          >
            Hacer la calculación...
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Backpack;
