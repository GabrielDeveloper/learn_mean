//One of differences between array and objects in JS

// In Array Moises can't create the Key
var array = {
    name : 'Moises',
    languages: [
        "PHP",
         "JS"
    ],
};

//In Object Moises finally can create key
var obj = {
    name: 'Moises',
    languages: {
        "primary" : "PHP",
        "secondary" : "JS"
    }
};

console.log(array.languages[0]);
console.log(obj.languages.primary);
