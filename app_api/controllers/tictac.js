var mongoose = require('mongoose');
var Tictac = mongoose.model('tictac');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}

//********************************************************************************

 /* GET a list of all blogs */
module.exports.ticTacList = function(req, res) {
    console.log('Getting game list');
  Tictac
	.find()
	.exec(function(err, results) {
            if (!results) {
		sendJSONresponse(res, 404, {
		    "message": "no games found"
		});
		return;
            } else if (err) {
		console.log(err);
		sendJSONresponse(res, 404, err);
		return;
            }
            console.log(results);
            sendJSONresponse(res, 200, buildGameList(req, res, results));
	}); 
};

var buildGameList = function(req, res, results) {
    var games = [];
    results.forEach(function(obj) {
	games.push({
	    xUser: obj.xUser,
	    oUser: obj.oUser,
	    xUserEmail: obj.xUserEmail,
	    oUserEmail: obj.oUserEmail,
	    winner: obj.winner,
	    playedOn: obj.datePlayed,
	    _id: obj._id
	});
    });
    return games;
};

//********************************************************************************

/* POST a new blog */
/* /api/blogs */
module.exports.ticTacCreate = function(req, res) {
    console.log(req.body);
  Tictac
	.create({
	    xUser: req.body.xUser,
	    cell1: "",
	    cell2: "",
	    cell3: "",
	    cell4: "",
	    cell5: "",
	    cell6: "",
	    cell7: "",
	    cell8: "",
	    cell9: "",
	    xUserEmail: req.body.xUserEmail,
	    oUser: "",
	    oUserEmail: "",
	    userTurn: req.body.xUserEmail,
	    winner: ""
	}, function(err, tictac) {
	    if (err) {
		console.log(err);
		sendJSONresponse(res, 400, err);
	    } else {
		console.log(tictac);
		sendJSONresponse(res, 201, tictac);
	    }
	}
	       );
}; 

//********************************************************************************

/* GET a blog by the id */
module.exports.ticTacReadOne = function(req, res) {
    console.log('Finding game details', req.params);
    if (req.params && req.params.tictacid) {
    Tictac
	    .findById(req.params.tictacid)
	    .exec(function(err, tictac) {
		if (!tictac) {
		    sendJSONresponse(res, 404, {
			"message": "game id not found"
		    });
		    return;
		} else if (err) {
		    console.log(err);
		    sendJSONresponse(res, 404, err);
		    return;
		}
		console.log(tictac);
		sendJSONresponse(res, 200, tictac);
	    });
    } else {
	console.log('No game id specified');
	sendJSONresponse(res, 404, {
	    "message": "No game id in request"
	});
    }
};

//********************************************************************************

/* Update one Book entry */

module.exports.ticTacUpdateOne = function(req, res) {                                      
    console.log("Updating game: " + req.params.tictacid);
    console.log(req.body);
    Tictac
	.findOneAndUpdate(
	    {_id: req.params.tictacid},
	    {$set: {"cell1": req.body.cell1,
		    "cell2": req.body.cell2,
		    "cell3": req.body.cell3,
		    "cell4": req.body.cell4,
		    "cell5": req.body.cell5,
		    "cell6": req.body.cell6,
		    "cell7": req.body.cell7,
		    "cell8": req.body.cell8,
		    "cell9": req.body.cell9,
		    "oUser": req.body.oUser,
		    "oUserEmail": req.body.oUserEmail,
		    "userTurn": req.body.userTurn,
		    "winner": req.body.winner
		   }},
	function (err, response) {
	if (err){
	    sendJSONresponse(res, 400, err);
	}else{
	    sendJSONresponse(res, 201, response);
	}
	});
	
};
//********************************************************************************
module.exports.ticTacDeleteOne = function(req, res) {
    console.log("Deleting game entry with id of " + req.params.tictacid);
    console.log(req.body);
Tictac
	.findByIdAndRemove(req.params.tictacid)
	.exec (
	    function(err, response) {
		if (err) {
		    sendJSONresponse(res, 404, err);
		} else {
		    sendJSONresponse(res, 204, null);
		}
	    }
        );
};
