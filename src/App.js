import './App.css'
import React, { useState } from 'react';

function Square({ value, highlight, onSquareClick }) {
  const className = `square ${highlight ? 'highlight-' + highlight.toLowerCase() : ''}`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const { winner, line } = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(square => square != null)) {
    status = 'Draw!'
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

const boardSize = 3;
  let board = [];
  for (let row = 0; row < boardSize; row++) {
    let boardRow = [];
    for (let col = 0; col < boardSize; col++) {
      const index = row * boardSize + col;
      const isWinningSquare = line && line.includes(index);
      boardRow.push(
        <Square
          key={index}
          value={squares[index]}
          highlight={isWinningSquare ? squares[index] : null}
          onSquareClick={() => handleClick(index)}
        />
      );
    }
    board.push(<div key={row} className="board-row">{boardRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );  
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

export default Game; 
