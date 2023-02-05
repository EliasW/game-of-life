import React, { useEffect, useRef, useState } from "react"
import "../App.css"

//construct the Grid based on the input dimensions and generation number
const constructGrid = (rows: number, cols: number, gen: number) => {

    const grid = []
    for (let i = 0; i < rows; i++) {
        const row = []
        for (let j = 0; j < cols; j++) {
            row.push(0)
        }
        grid.push(row)
    }
    let checkDuplicate: string[] = []
    for (let k = 0; k < gen; k++) {
        let rand1 = Math.floor(Math.random() * (rows))
        let rand2 = Math.floor(Math.random() * (cols))
        var concatRand = `${rand1}${rand2}`
        //check if cell is alive
        if (!checkDuplicate.includes(concatRand)) {
            checkDuplicate.push(concatRand)
            grid[rand1][rand2] = 1
        }
        //remove cell alive if the grid cell is alive
        else if (checkDuplicate.includes(concatRand))
            k--
    }
    return grid
}

// positions: N, S, E, W, NE, NW, SE, SW
const positions = [
    [0, 1], // right
    [0, -1], // left
    [1, -1], // top left
    [-1, 1], // top right
    [1, 1], // top
    [-1, -1], // bottom
    [1, 0], // bottom right
    [-1, 0], // bottom left
]

function Grid({ ...props }) {
    const { generation, horizontal, vertical, speedInterval } = props
    debugger
    const [grid, setGrid] = useState(() => {
        return constructGrid(0, 0, 0);
    })
    const [start, setStart] = useState(false)
    const startRef = useRef(start)
    startRef.current = start
    useEffect(() => {
        setGrid(constructGrid(horizontal, vertical, generation))
    }, [])

    function runSimulation() {
        if (!startRef.current) {
            return
        }
        setGrid((grid) => {
            const nextGeneration = grid.map((row, i) => {
                return row.map((cell, j) => {
                    let neighbors = 0
                    positions.forEach((position) => {
                        const x = i + position[0]
                        const y = j + position[1]
                        if (x >= 0 && x < horizontal && y >= 0 && y < vertical) {
                            neighbors += grid[x][y]
                        }
                    })
                    if (neighbors < 2 || neighbors > 3) {
                        return 0
                    }
                    if (neighbors === 3) {
                        return 1
                    }
                    return grid[i][j]
                })
            })
            return nextGeneration
        })
    }

    return (
        <>
            <div className="containerGame"> GAME OF LIFE
                <div className="menuGrid">
                    <button className="playButton" style={{ backgroundColor: start ? "red" : "green" }}
                        onClick={() => {
                            setStart(!start)
                            if (!start) {
                                startRef.current = true
                            }
                            setInterval(() => {
                                runSimulation()
                            }, speedInterval)
                        }}                >
                        {start ? "Stop" : "Play"}
                    </button>
                    <button className="resetButton"
                        onClick={() => setGrid(constructGrid(horizontal, vertical, generation))}
                    >
                        Reset
                    </button>
                </div>
                <div className="grid">
                    {grid &&
                        grid.map((rows, i) =>
                            <li key={i} style={{ listStyle: 'none', margin: "10px" }}>{
                                rows.map((col, k) => (
                                    <div key={k} style={{ fontSize: "20px", fontWeight: "bold" }}>{grid[i][k] ? '*' : '.'}</div>
                                ))}
                            </li>
                        )}
                </div>
            </div>
        </>
    )
}

export default Grid