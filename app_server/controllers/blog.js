/*Get list page*/
module.exports.list = function(req, res) {
    res.render('list', {
	title: "Blog List",
	blogs: [{
	    blogtitle: 'my blog',
	    blogtext: 'my text',
	    createdon: Date.now
	}, {
	    blogtitle: 'older blog',
	    blogtext: 'older text',
	    createdon: Date.now
	}, {
	    blogtitle: 'first blog',
	    blogtext: 'first text',
	    createdon: Date.now
	}]
    });
};
/*Get add page*/
module.exports.add = function (req, res) {
    res.render('add', { title: "Add Blogs"});
};
/*Get edit page*/
module.exports.edit = function (req, res) {
    res.render('edit', {title: "Edit Blog"});
};

/*Get remove page*/
module.exports.remove = function (req, res){
    res.render('remove', {title: "Remove Blog"});
};
