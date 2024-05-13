import React from "react";
import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Fila 1 */}
      <div className="flex flex-1">
        {/* Zona 1 */}
        <div className="flex-1">
          <div className="flex h-full border-double border-4 border-lime-500">
            {/* Mitad Izquierda */}
            <div className="flex-1 flex items-center justify-center p-4">
              <Image
                className="object-cover"
                src="/rutas_mas_cortas.jpg"
                style={{ aspectRatio: "3/2" }}
              />
            </div>
            {/* Mitad Derecha */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="mb-10">
                <h1 className="font-mono text-3xl font-extrabold dark:text-white tracking-wider text-center">
                  Rutas más cortas
                </h1>
              </div>
              <Link to="/Floyd" style={{ width: "100%" }}>
                <Button
                  radius="full"
                  fullWidth
                  className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold"
                >
                  Explorar
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Zona 2 */}
        <div className="flex-1">
          <div className="flex h-full border-double border-4 border-lime-500">
            {/* Mitad Izquierda */}
            <div className="flex-1 flex items-center justify-center p-4">
              <Image
                className="object-cover"
                src="/mochila.jpg"
                style={{ aspectRatio: "3/2" }}
              />
            </div>
            {/* Mitad Derecha */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="mb-10">
                <h1 className="font-mono text-3xl font-extrabold dark:text-white tracking-wider text-center">
                  Problema de la mochila
                </h1>
              </div>
              <Link to="/Backpack" style={{ width: "100%" }}>
                <Button
                  radius="full"
                  fullWidth
                  className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold"
                >
                  Explorar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fila 2 */}
      <div className="flex flex-1">
        {/* Zona 3 */}
        <div className="flex-1">
          <div className="flex h-full border-double border-4 border-lime-500">
            {/* Mitad Izquierda */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="mb-10">
                <h1 className="font-mono text-3xl font-extrabold dark:text-white tracking-wider text-center">
                  Reemplazo de equipos
                </h1>
              </div>
              <Link to="/ReplacementScheduling" style={{ width: "100%" }}>
                <Button
                  radius="full"
                  fullWidth
                  className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold"
                >
                  Explorar
                </Button>
              </Link>
            </div>
            {/* Mitad Derecha */}
            <div className="flex-1 flex items-center justify-center p-4">
              <Image
                className="object-cover"
                src="/reemplazo_equipos.jpg"
                style={{ aspectRatio: "3/2" }}
              />
            </div>
          </div>
        </div>
        {/* Zona 4 */}
        <div className="flex-1">
          <div className="flex h-full border-double border-4 border-lime-500">
            {/* Mitad Izquierda */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="mb-10">
                <h1 className="font-mono text-3xl font-extrabold dark:text-white tracking-wider text-center">
                  Árboles binarios de búsqueda
                </h1>
              </div>
              <Link to="/OpticBinaryTree" style={{ width: "100%" }}>
                <Button
                  radius="full"
                  fullWidth
                  className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold"
                >
                  Explorar
                </Button>
              </Link>
            </div>
            {/* Mitad Derecha */}
            <div className="flex-1 flex items-center justify-center p-4">
              <Image
                className="object-cover"
                src="/busqueda_binaria.jpg"
                style={{ aspectRatio: "3/2" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fila 3 */}
      <div className="flex flex-1">
        {/* Zona 5 */}
        <div className="flex-1">
          <div className="flex h-full border-double border-4 border-lime-500">
            {/* Mitad Izquierda */}
            <div className="flex-1 flex items-center justify-center p-4">
              <Image
                className="object-cover"
                src="/series_deportivas.jpg"
                style={{ aspectRatio: "3/2" }}
              />
            </div>
            {/* Mitad Derecha */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="mb-10">
                <h1 className="font-mono text-3xl font-extrabold dark:text-white tracking-wider text-center">
                  Series deportivas
                </h1>
              </div>
              <Link to="/SportSeries" style={{ width: "100%" }}>
                <Button
                  radius="full"
                  fullWidth
                  className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold"
                >
                  Explorar
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Zona 6 */}
        <div className="flex-1">
          <div className="flex h-full border-double border-4 border-lime-500">
            {/* Mitad Izquierda */}
            <div className="flex-1 flex items-center justify-center p-4">
              <Image
                className="object-cover"
                src="/matrices.jpg"
                style={{ aspectRatio: "3/2" }}
              />
            </div>
            {/* Mitad Derecha */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="mb-10">
                <h1 className="font-mono text-3xl font-extrabold dark:text-white tracking-wider text-center">
                  Multiplicación de matrixes
                </h1>
              </div>
              <Link to="/MatrixMultiplication" style={{ width: "100%" }}>
                <Button
                  radius="full"
                  fullWidth
                  className="bg-gradient-to-b from-lime-400 to-yellow-400 text-white shadow-lg font-mono tracking-wider text-lg font-semibold"
                >
                  Explorar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
