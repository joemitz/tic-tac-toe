function playGame() {
	var availableMoves = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
	var humanMoves = [];
	var computerMoves = [];
	var draw = true;
	var winConditions = [
		['A1', 'B1', 'C1'],
		['A2', 'B2', 'C2'],
		['A3', 'B3', 'C3'],
		['A1', 'A2', 'A3'],
		['B1', 'B2', 'B3'],
		['C1', 'C2', 'C3'],
		['A1', 'B2', 'C3'],
		['A3', 'B2', 'C1']
	];

	console.clear();
	displayGame(humanMoves, computerMoves);

	while (availableMoves.length > 0) {

		var humanMove = humanTurn(availableMoves);
		humanMoves.push(humanMove);

		var removeIndex = availableMoves.indexOf(humanMove);
		availableMoves.splice(removeIndex, 1);

		console.clear();
		displayGame(humanMoves, computerMoves);

		if (hasPlayerWon(humanMoves, winConditions)) {
			console.log('You win!\n');
			draw = false;
			break;
		}
		var computerMove = computerTurn(availableMoves, humanMoves, computerMoves, winConditions);
		computerMoves.push(computerMove);

		var removeIndex = availableMoves.indexOf(computerMove);
		availableMoves.splice(removeIndex, 1);

		console.clear();
		displayGame(humanMoves, computerMoves);

		if (hasPlayerWon(computerMoves, winConditions)) {
			console.log('Computer wins!\n');
			draw = false;
			break;
		}
	}
	if (draw) {
		console.log('Draw!\n');
	}
}

function displayGame(humanMoves, computerMoves) {
	var positions = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
	var moves = [];

	for (var i = 0; i < positions.length; i++) {
		if (humanMoves.indexOf(positions[i]) !== -1) {
			moves.push('X');
		} else if (computerMoves.indexOf(positions[i]) !== -1) {
			moves.push('O');
		} else {
			moves.push(' ');
		}
	}
	console.log(
		'\n  1   2   3 \n' +
		'A ' + moves[0] + ' \| ' + moves[1] + ' \| ' + moves[2] + ' \n' +
		' ---\|---\|---\n' +
		'B ' + moves[3] + ' \| ' + moves[4] + ' \| ' + moves[5] + ' \n' +
		' ---\|---\|---\n' +
		'C ' + moves[6] + ' \| ' + moves[7] + ' \| ' + moves[8] + ' \n'
	);
}

function humanTurn(availableMoves) {
	const prompt = require('prompt-sync')();
	var input = prompt('Please enter your move: ');
	var move = input[0].toUpperCase() + input[1];

	while (true) {
		if (availableMoves.indexOf(move) === -1) {
			input = prompt('Invalid choice. Please enter your move: ');
			move = input[0].toUpperCase() + input[1];
		} else {
			var humanMove = move;
			break;
		}
	}
	return humanMove;
}

function computerTurn(availableMoves, humanMoves, computerMoves, winConditions) {
	var compWinningMove = isWinAvailable(availableMoves, computerMoves, winConditions);
	if (compWinningMove.length > 0) {
		return compWinningMove;
	}
	var humanWinningMove = isWinAvailable(availableMoves, humanMoves, winConditions);
	if (humanWinningMove.length > 0) {
		return humanWinningMove;
	}
	var bestComputerMoves = findBestMoves(availableMoves, computerMoves, winConditions);
	var bestHumanMoves = findBestMoves(availableMoves, humanMoves, winConditions);

	var sharedMoves = [];
	for (var i = 0; i < bestComputerMoves.length; i++) {
		if (bestHumanMoves.indexOf(bestComputerMoves[i]) !== -1) {
			sharedMoves.push(bestComputerMoves[i]);
		}
	}
	if (bestComputerMoves.length === 0) {
		var randomChoice = Math.floor((Math.random() * availableMoves.length));
		return availableMoves[randomChoice];

	} else if (sharedMoves.length === 0) {
		var randomChoice = Math.floor((Math.random() * bestComputerMoves.length));
		return bestComputerMoves[randomChoice];

	}	else {
		var randomChoice = Math.floor((Math.random() * sharedMoves.length));
		return sharedMoves[randomChoice];
	}
}

function isWinAvailable(availableMoves, playerMoves, winConditions) {
	var winningMove = '';
	var counter = 0;

	for (var i = 0; i < winConditions.length; i++) {
		for (var j = 0; j < winConditions[i].length; j++) {
			if (playerMoves.indexOf(winConditions[i][j]) !== -1) {
				counter++;
			} else {
				var playerMove = winConditions[i][j];
			}
		}
		if (counter === 2 && availableMoves.indexOf(playerMove) !== -1) {
			winningMove = playerMove;
			break;
		} else {
			counter = 0;
		}
	}
	return winningMove;
}

function findBestMoves(availableMoves, playerMoves, winConditions) {
	var combinedMoves = availableMoves.concat(playerMoves);

	var availWinConditions = [];
	for (var i = 0; i < winConditions.length; i++) {
		if (combinedMoves.indexOf(winConditions[i][0]) !== -1 &&
				combinedMoves.indexOf(winConditions[i][1]) !== -1 &&
				combinedMoves.indexOf(winConditions[i][2]) !== -1) {
			availWinConditions.push(winConditions[i]);
		}
	}
	var bestWinConditions = [];
	for (var i = 0; i < availWinConditions.length; i++) {
  	for (var j = 0; j < availWinConditions[i].length; j++) {
			if (playerMoves.indexOf(availWinConditions[i][j]) !== -1) {
				bestWinConditions.push(availWinConditions[i]);
			}
		}
	}
	if (bestWinConditions.length > 0) {
		var bestMoves = findMostCommonMoves(bestWinConditions, playerMoves);
		return bestMoves;

	} else {
		var bestMoves = findMostCommonMoves(availWinConditions, playerMoves);
		return bestMoves;
	}
}

function findMostCommonMoves(bestWinConditions, playerMoves) {
	var mostCommonMoves = [];
	var moveCount = {};

	for (var i = 0; i < bestWinConditions.length; i++) {
		for (var j = 0; j < bestWinConditions[i].length; j++) {

			if (playerMoves.indexOf(bestWinConditions[i][j]) === -1) {
				if (moveCount[bestWinConditions[i][j]] === undefined) {
					moveCount[bestWinConditions[i][j]] = 1;
				} else {
					moveCount[bestWinConditions[i][j]]++;
				}
			}
		}
	}
	var highestCount = 0;
	for (key in moveCount) {
		if (moveCount[key] > highestCount) {
			highestCount = moveCount[key];
		}
	}
	var mostCommonMoves = [];
	for (key in moveCount) {
		if (moveCount[key] === highestCount) {
			mostCommonMoves.push(key);
		}
	}
	return mostCommonMoves;
}

function hasPlayerWon(playerMoves, winConditions) {
	for (var i = 0; i < winConditions.length; i++) {
		if (playerMoves.indexOf(winConditions[i][0]) !== -1 &&
				playerMoves.indexOf(winConditions[i][1]) !== -1 &&
				playerMoves.indexOf(winConditions[i][2]) !== -1) {
			return true;
		}
	}
	return false;
}

playGame();