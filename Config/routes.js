var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');

module.exports = function (app) {

	app.use(function (req, res, next) {
		var views = req.session.views;
		if (!views) {
			req.session.views = {};
		} else {
			req.session.views['user'] = views.user;
			app.locals.user = views.user;
		}
		return next();
	});

	/*index page */
	app.get('/', Index.index);

	//about user
	app.get('/admin/userlist',User.signinRequired,User.adminRequired, User.list);
	app.post('/user/signin', User.signin);
	app.post('/user/signup', User.signup);
	app.get('/logout', User.logout);
	app.get('/admin/userlist', User.list);

	//about movie
	app.get('/movie/:id', Movie.detail);
	app.post('/admin/movie/new',User.signinRequired,User.adminRequired, Movie.save);
	app.post('/admin/movie/delete',User.signinRequired,User.adminRequired, Movie.delete);
	app.get('/admin/movie/list', User.signinRequired,User.adminRequired,Movie.list);
	app.get('/admin/movie', User.signinRequired,User.adminRequired,Movie.new);
	app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired, Movie.update);

};
