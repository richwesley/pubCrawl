// var BreweryDb = require('brewerydb-node');
var brewdb = new Beermap('80c8b27a4e1b949f915b79456ff1a14d');

function getById (id, opts, callback) {
  beermap.breweries.find( { established: 2010 }, callback);
}

function searchAll (q, callback) {
  brewdb.search.all( { q: q }, callback);
}

module.exports = {
  getById: getById,
  searchAll: searchAll
};