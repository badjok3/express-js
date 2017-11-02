let storage = {};
const fs = require('fs');
const dataFile = 'storage.json';

function put(key, value) {
    if (typeof key !== 'string') {
        console.log('Key is not in correct format!');
        return;
    }

    storage[key] = value;
}

function get(key) {
    if (typeof key !== 'string') {
        console.log('Key is not in correct format!');
        return;
    }

    if (!storage.hasOwnProperty(key)) {
        console.log('Key does not exist in storage!');
        return;
    }

    return storage[key];
}

function getAll() {
    if (Object.keys(storage).length < 1) {
        return 'There are no items in the storage!';
    }

    return storage;
}

function update(key, newVal) {
    if (typeof key !== 'string') {
        console.log('Key is not in correct format!');
        return;
    }

    if (!storage.hasOwnProperty(key)) {
        console.log('Key does not exist in storage!');
        return;
    }

    storage[key] = newVal;
}

function remove(key) {
    if (typeof key !== 'string') {
        console.log('Key is not in correct format!');
        return;
    }

    if (!storage.hasOwnProperty(key)) {
        console.log('Key does not exist in storage!');
        return;
    }

    delete storage[key];
}

function clear() {
    storage = {};
}

function save() {
    return new Promise((resolve, reject) => {
        let storageString = JSON.stringify(storage);

        fs.writeFile(dataFile, storageString, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

function load() {
    return new Promise((resolve, reject) => {
        fs.readFile(dataFile, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            storage = JSON.parse(data);
            resolve();
        });
    });
}

module.exports = {
    put,
    get,
    getAll,
    update,
    remove,
    clear,
    save,
    load
};