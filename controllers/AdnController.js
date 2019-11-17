const BitacoraModel = require('../models/Bitacora');

/*
 *Function to process array is comming 
 *@ req -> all request data
 */
const hasMutation = (req, res) => {
    const { adn } = req.body;
    let isMutation = false;
    try {
        //verify if contains some mutation
        if (readDiagonalMatrix(adn, true) || readDiagonalMatrix(adn) || readMatrixLineally(adn)) {
            isMutation = true;
            res.status(200).send({ message: 'OK' })
        } else {
            res.status(403).send({ message: 'mutaion' })
        }

        BitacoraModel.create({ adn: adn.join(), mutation: isMutation });
    } catch (error) {
        //handle any issue on the process and send the issue
        console.log('error', error)
        res.status(500).send({ error });
    }
}

//basic structure  to check out the lettes ocurrency 
const resultStructure = {
    value: '',
    total: 1
};


/*
 *Fucntion to read the matrix lineally
 *@array -> matrix
 */
const readMatrixLineally = (array) => {
    let hasMutation = false;
    let vericalReslt = [];
    for (let index = 0; index < array.length; index++) {
        //init values to check out on the iterations
        let result = {...resultStructure }
        const element = array[index];
        //start item iteration
        for (var i = 0; i < element.length; i++) {
            const letter = element.charAt(i);
            //check out current letter for horizontal lines
            const currentResult = checkResult(result, letter);
            // if vertical line contains some data saved, we check out the current value vs next value
            //if not, init the date with current letter value
            if (vericalReslt[i]) {
                const lastResultForVerticalLine = checkResult(vericalReslt[i], letter);
                //if fount 4 consecutive equals letter, break loop
                if (lastResultForVerticalLine.status) {
                    hasMutation = lastResultForVerticalLine.status;
                    break
                }
            } else {
                vericalReslt[i] = {...currentResult.result }
            }
            //getting result and check out if is there some mutation
            hasMutation = currentResult.status;
            if (hasMutation) { break }
        }
        //if there is a mutation, break the loop
        if (hasMutation) {
            break;
        }
    }
    return hasMutation;
}

/*
 *Fucntion to read the matrix diagonally
 *@array -> matrix
 *@rigthToLeft -> start reding rigth to left or left to rigth
 */
const readDiagonalMatrix = (array, rigthToLeft = false) => {
    //get matrix length properties 
    const Ylength = array.length;
    const Xlength = array[0].length;
    const maxLength = Math.max(Xlength, Ylength);
    //init aux variables, temp to check diagonal lines and hasMutation to break the cicle if exist some mutation
    var temp;
    let hasMutation = false;
    // init k with 4 because we are going to check out only string with 4 letters or bigger than 4 letters
    for (var k = 4; k <= 2 * (maxLength - 1); ++k) {
        temp = [];
        //result variable, we save data to detect the mutation
        let result = {...resultStructure }
            // loop to iterate diagonal way
        for (var y = Ylength - 1; y >= 0; --y) {
            var x = k - (rigthToLeft ? Ylength - y : y);
            if (x >= 0 && x < Xlength) {
                const element = array[y][x];
                hasMutation = checkResult(result, element).status;
                temp.push(element);
                //verify if there are 4 letters equals, it mean there is a mutation
                if (hasMutation) { break }
            }
        }
        //if there is a mutation, break the loop
        if (hasMutation) {
            break;
        }
    }
    //return 
    return hasMutation;
}

const checkResult = (result, currentValue) => {
    const tempLetter = result.value;
    //check out if it is the same value, add 1 to count (total flag)
    // if it is not the same restart the result count and save the new vaule
    if (tempLetter == currentValue) {
        result.total++;
    } else {
        result.total = 1;
    }
    //update last value to compare
    result.value = currentValue;
    //verify if there are 4 letters equals, it mean there is a mutation
    if (result.total == 4) {
        return { status: true, result };
    }

    return { status: false, result };
}

const getStatus = (req, res) => {
    BitacoraModel.find({}, (err, docs) => {
        if (err) {
            //handle any issue on the process and send the issue
            console.log('error', error)
            return res.status(500).send({ error });
        }
        //init response structure
        const result = { count_mutations: 0, count_no_mutation: 0, ratio: 0 }
        for (const item of docs) {
            //check mutation flag
            if (item.mutation) {
                result.count_no_mutation++;
            } else {
                result.count_mutations++;
            }
        }
        //get ratio
        result.ratio = Math.round((result.count_mutations / result.count_no_mutation) * 100) / 100;
        //send response
        return res.status(200).send(result);
    });
}

module.exports = {
    hasMutation,
    getStatus
}