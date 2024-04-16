import React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import History from '../../components/algorithms/History';

function Floyd() {
  return (
    <div>
      <h1>Floyd</h1>
      <History 
      body='aquí la historia del algoritmo' 
      header='Algoritmo Floyd ( Rutas óptimas )'/>
      <Card>
        <CardHeader>
          Configuración
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          Grafo
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          Tabla
        </CardHeader>
      </Card>
    </div>
  )
}

export default Floyd