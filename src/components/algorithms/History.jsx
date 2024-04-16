import React from 'react'
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

export default function History({body, header, classname}) {
  return (
    <Card className={classname}>
      <CardHeader>
        {header}
      </CardHeader>
      <CardBody>
        {body}
      </CardBody>
    </Card>
  )
}
