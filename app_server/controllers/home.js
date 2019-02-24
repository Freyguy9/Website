/*Get home page*/
module.exports.home = function(req, res){
    res.render('home', {title: "Eric Frey's Blog Site"});
}
