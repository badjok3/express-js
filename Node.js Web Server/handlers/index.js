const homeHanlder = require('./homeHandler');
const staticHandler = require('./staticHandler');
const movieHandler = require('./movieHandler');
const allMoviesHandler = require('./allMoviesHandler');
const detailsHandler = require('./detailsHandler');

module.exports = [ homeHanlder, staticHandler, movieHandler, allMoviesHandler, detailsHandler ];