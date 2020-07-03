import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     render() {
//       return (
//         <button className="square" 
//         onClick={() => this.props.onClick()}>
//           {this.props.value}
//         </button>
//       );
//     }
//   }
  function Square(props) {
      const name = props.checking ? "win" : "square";
      return (
        <button className={name} 
        onClick={props.onClick}>
          {props.value}
        </button>
      );
  }

  class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // }
    // handleClick(i) {
    //     const squares = this.state.squares.slice();
    //     if (calculateWinner(squares) || squares[i]) {
    //         return;
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext
    //     });
    // }
    renderSquare(i, check) {
      return (
      <Square 
        value ={this.props.squares[i]}
        checking = {check}
        onClick= {() => this.props.onClick(i)}
      />
      );
    }
  
    render() {
    //   const winner = calculateWinner(this.state.squares);
    //   let status;
    //   if(winner) {
    //       status = 'Winner: ' + winner;
    //   }
    //   else {
    //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    //   }
      let board = [];
      for(let i = 0; i < 3; i++) {
            let row = [];
            for(let j = 0; j < 3; j++) {
                let check = false;
                if(this.props.winners != null) {
                  if((i * 3 + j) === this.props.winners[1] || (i * 3 + j) === this.props.winners[2] || (i * 3 + j) === this.props.winners[3]) {
                    check = true;
                  }
                }
                row.push(this.renderSquare(i * 3 + j, check));
            }
            board.push(<div className="board-row">{row}</div>);
      }
      return (
        // <div>
        //   <div className="board-row">
        //     {this.renderSquare(0)}
        //     {this.renderSquare(1)}
        //     {this.renderSquare(2)}
        //   </div>
        //   <div className="board-row">
        //     {this.renderSquare(3)}
        //     {this.renderSquare(4)}
        //     {this.renderSquare(5)}
        //   </div>
        //   <div className="board-row">
        //     {this.renderSquare(6)}
        //     {this.renderSquare(7)}
        //     {this.renderSquare(8)}
        //   </div>
        // </div>
        <div>
            {board}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: {
                    row: null,
                    col: null
                }
            }],
            
            stepNumber: 0,
            xIsNext: true
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares,
                location: {
                    row: Math.floor(i/3),
                    col: i%3
                }
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
      const history = this.state.history;
      //const current = history[history.length - 1];
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      
      const moves = history.map((step, move) => {
          const desc = (move ?  'Go to move #' + move : 'Go to game start') + ' location is row = ' + step.location.row + ' and col is ' + step.location.col;
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner[0];
      }
      else if(this.state.stepNumber === 9 && winner === null){
        status = 'Match Drawn';
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares = {current.squares}
                winners = {winner}
                onClick = {i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      let ans = [];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        //ans.concat(squares[a],lines[i]);
        ans.push(squares[a]);
        ans.push(a);
        ans.push(b);
        ans.push(c);
        return ans;
      }
    }
    return null;
  }