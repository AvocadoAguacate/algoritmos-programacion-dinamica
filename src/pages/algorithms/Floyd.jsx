import React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import History from '../../components/algorithms/History';

function Floyd() {
  return (
    <div>
      <div className='flex flex-wrap justify-start place-content-evenly'>
      <History 
      body='aquí la historia del algoritmo' 
      header='Algoritmo Floyd ( Rutas óptimas )'
      classname='basis-1/4 grow-0'
      />
      <Card className='basis-3/4 grow-0'>
        <CardHeader>
          Configuración
        </CardHeader>
      </Card>
      <Card className='basis-3/6'>
        <CardHeader>
          Grafo
        </CardHeader>
      </Card>
      <Card className='basis-3/6'>
        <CardHeader>
          Tabla P
        </CardHeader>
      </Card>
      <Card className='basis-full'>
        <CardHeader>
          Tablas D
        </CardHeader>
      </Card>
      <Card className='basis-full invisible' >
        <CardHeader>
          Resultado
        </CardHeader>
      </Card>
      </div>
    </div>
  )
}

export default Floyd