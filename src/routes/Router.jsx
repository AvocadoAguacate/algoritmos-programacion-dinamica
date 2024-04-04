import React from 'react'
import Home from '../pages/Home'
import Backpack from '../pages/algorithms/Backpack';
import Floyd from '../pages/algorithms/Floyd'
import MatrixMultiplication from '../pages/algorithms/MatrixMultiplication'
import OpticBinaryTree from '../pages/algorithms/OpticBinaryTree'
import ReplacementScheduling from '../pages/algorithms/ReplacementScheduling'
import SportSeries from '../pages/algorithms/SportSeries';

import { Routes, Route } from 'react-router-dom';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/backpack" element={<Backpack/>}/>
      <Route path="/floyd" element={<Floyd/>} />
      <Route path="/matrixmultiplication" element={<MatrixMultiplication/>}/>
      <Route path="/opticbinarytree" element={<OpticBinaryTree/>} />
      <Route path="/replacementscheduling" element={<ReplacementScheduling/>}/>
      <Route path="/sportseries" element={<SportSeries/>}/>
    </Routes>
  )
}

export default Router