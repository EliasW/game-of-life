import React, { useEffect, useState } from 'react';
import './App.css';
import axios from "axios"
import Grid from './components/Grid';
const inputfile = require('./input.txt')

const fetchData = async () => {
  let resp = await axios.get(inputfile)
  let final = await resp.data
  var lines = final.split("\r\n");
  var cols = lines[0].split(" ")[1]
  var rows = lines[1].split(" ")[1]
  var generation = lines[2].split(" ")[1]
  var speedInterval = lines[3].split(" ")[1]

  var result = {
    horizontal: cols,
    vertical: rows,
    generation: generation,
    speedInterval: speedInterval
  };
  return result
}

function App() {
  const [props, setProps] = useState({ vertical: '', horizontal: '', generation: '', speedInterval: '' })
  const [grid, setGrid] = useState(false)

  //read the initial setting (generation, grid size) of the game
  useEffect(() => {
    const data = fetchData();
    data.then((res) => {
      console.log("data", data)
      console.log("res", res)
      setProps(res)
      setGrid(true)
    })

  }, [])

  const { vertical, horizontal, generation, speedInterval } = props

  if (grid && ((Number(vertical) * Number(horizontal)) >= Number(generation))) return (<Grid {...props} />)
  else if (grid && (Number(vertical) * Number(horizontal) < Number(generation))) return (<> <div style={{ margin: "30px" }}>Initial generation is out of grid </div> </>)
  else return (<> <div style={{ margin: "30px" }}> Initial setting not loaded correctly </div> </>)
}

export default App