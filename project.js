//slot simulator for educational purpose only
//steps:-
//1. deposit money
//2. determine number of lines to bet on
//3. determine how much to bet per line
//4. spin the slot
//5. check if user won
//6. give user amount they won
//7. display play again



//call the package we need
const prompt = require("prompt-sync")();

//declaring global variables
const ROWS = 3;
const COLS = 3;

//mapping and assigning values to the symbols in slots using object
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}
const SYMBOL_VALUE = {
    A: 5,
    B: 4,
    C: 3,
    D: 2    
}

//deposit money i.e. balance
function deposit(){
    while(true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount); //explicitly type casting string to float

        //check is  the number is valid i.e. is a number and is not less or equal to zero
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid try again");
        }
        else{
            return numberDepositAmount;
        }
    }
}

//get number of lines to bet on
function getNumberOfLine(){
    while(true){
        const Lines = prompt("Enter numbers of lines to bet(1-3): ");
        const numberLine = parseInt(Lines); //explicitly type casting string to integer

        //check is  the number is valid i.e. is a number and is not less than zero or greater than 3
        if(isNaN(numberLine) || numberLine <= 0 || numberLine > 3){
            console.log("Invalid try again");
        }
        else{
            return numberLine;
        }
    }    
}

//determining the amount to bet
function getBet(balance, Lines){
    while(true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet); //explicitly type casting string to float

        //check is  the number is valid i.e. is a number and is not less or equal to zero and 
        //isnt greater than balance
        if(isNaN(numberBet) || numberBet <= 0 || numberBet > (balance / Lines)){
            console.log("Invalid try again");
        }
        else{
            return numberBet;
        }
    }
}

function spin(){
    // array is a reference data type in js, 
    //so we can change the content of array without changing the reference to the array
    const symbols = [];

    //looping through all the entries we have in our object defined above
    //[symbol, count] is the array we declared which gets the symbol and value assigned to it in 
    //object SYMBOL_COUNT
    for(const[symbol, count] of Object.entries(SYMBOLS_COUNT)){
        //another loop to push the entries(SYMBOLS) we obtained and assign it to array symbols using push
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    
    //generating slots of our slot machine (3 in each)
    const reels =[];
    for(let i = 0; i< COLS; i++){
        //generating an array index for each time it loops 
        reels.push([]);
        //copy the symbols we have available for each reel into an array
        //we have limited pull for each symbols, so when taking spining a reel and obtaining a symbol
        //have to remove them and add onto our reels array which is what you pulled
        //but we cant remove from the main symbols array as we will need them for 
        //another reel. So, we are creating a reel specific array to function properly.
        const reelSymbols =  [...symbols];
        for(let j = 0; j< ROWS; j++){
            //creating a random variable using math.random that selected a random number from 0 to 1
            //then multiplying with the length of our symbol array so the random number generated is always 
            //within the array. Math.floor will round off the number generated to the nearest lower integer 
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            // since all symbol in the array have their own index number
            //we select the random index generated and its corrresponding symbol is assigned to selectedsymbol
            const selectedSymbol = reelSymbols[randomIndex];
            //pushing the random symbol gained to main reels array
            reels[i].push(selectedSymbol);
            //splicing i.e. removing the symbol from the column so that it doesnt appear again in the column
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

//the reel we obtain will group the column together instead of rows which we dont want, so
//we create a transpose function to invert rows and colums and interchange their position using nested loop
function transpose(reels){
    const rows = [];
    for(let i = 0; i< ROWS; i++){
        rows.push([]);
        for(let j = 0; j< COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

//function to customize the display with pipes separating
function printRows(rows){
    for(const row of rows){
        let rowString = "";
        //takes index number and its corresponding symbol
        for(const[i, symbol] of row.entries()){
            //concatenate in the variable
            rowString += symbol;
            //adds pipe to separate the symbols unless it is the last symbol
            if(i != row.length - 1){
                rowString += " | "
            }
        }
        console.log(rowString);
    }
}

//granting money if all symbol are same in row
function getWinnings(rows, bet, Lines){
    let winnings = 0;
    for(let row =0; row < Lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }  
        }
        if(allSame){
            winnings += bet * SYMBOL_VALUE[symbols[0]];
        }
    }
    return winnings;
}


//main function
function game(){
    let balance = deposit();

    while(true){
        const numberOfLine = getNumberOfLine();
        const bet=getBet(balance, numberOfLine);
        balance -= bet * numberOfLine;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLine);
        balance += winnings;
        console.log("Balance = $" + balance);
        console.log("You won $" + winnings.toString());

        if(balance<=0){
            console.log("You ran out of money");
            break;
        }

        const playagain = prompt("Do you want to play again? (Y/N) ")
        if(playagain != 'Y' && playagain != 'y'){
            break;
        }
    }

}

//calling the main function
game();

