import React from "react";

function Matrix({ rows, columns }) {
  // Generar la matriz basada en las dimensiones N y M
  const renderMatrix = () => {
    const matrix = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        // Añadir un elemento de celda (div) a la fila
        row.push(
          <div
            key={`${i}-${j}`}
            className="cell bg-white border border-gray-300 w-10 h-10 flex items-center justify-center"
          >
            {/* Puedes poner contenido aquí si es necesario */}
          </div>
        );
      }
      // Añadir la fila completa a la matriz
      matrix.push(
        <div key={i} className="row flex">
          {row}
        </div>
      );
    }

    return matrix;
  };

  return (
    <div className="matrix">
      <div className="matrix-container">{renderMatrix()}</div>
    </div>
  );
}

export default Matrix;
