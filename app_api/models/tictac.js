var mongoose = require('mongoose');
var tictacSchema = new mongoose.Schema({
    cell1: String,
    cell2: String,
    cell3: String,
    cell4: String,
    cell5: String,
    cell6: String,
    cell7: String,
    cell8: String,
    cell9: String,
    xUser: String,
    oUser: String,
    winner: String,
    xUserEmail: String,
    oUserEmail: String,
    userTurn: String,
    datePlayed: {
	type: Date,
	"default": Date.now
    }
});

mongoose.model('tictac', tictacSchema);
