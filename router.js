// Import module
const router = require('express').Router();
const fs = require('fs');

// directory path
const dir = 'routers/';

// list all files in the directory
fs.readdir(dir, (err, files) => {
    if (err) {
        throw err;
    }

    // files object contains all files names
    // log them on console
    files.forEach(file => {
        const routerClass = require(`./routers/${file}`);
        let nameClass = file.split('.')[0];

        nameClass = (nameClass.charAt(nameClass.length-1) !== 's' ? nameClass + 's' : nameClass);
        router.use(`/${nameClass}`, routerClass);
    });
});

module.exports = router;