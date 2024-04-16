import React from 'react'
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

export default function History({body, header}) {
  return (
    <Card>
      <CardHeader>
        {header}
      </CardHeader>
      <CardBody>
        {body}
      </CardBody>
    </Card>
  )
}
