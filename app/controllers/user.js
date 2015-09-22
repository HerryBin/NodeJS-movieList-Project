var User = require('../models/user');

/*app.post('/user/signin', function (req, res) {*/
exports.signin = function (req, res) {
	var _user = req.body;
	var name = _user.name, password = _user.password;
	User.findOne({name: name}, function (err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			console.log('not exit user')
		}
		else {
			if (user.password === password) {
				req.session.views['user'] = user;
				return res.redirect('/');
			}
			else {
				console.log('error password')
			}
		}
	});
};

/*app.post('/user/signup', function (req, res) {*/
exports.signup = function (req, res) {
	var _userObj = req.body;
	console.log(_userObj);
	var user = new User(_userObj);
	user.save(function (err, _user) {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});
	/*User.find({name: _userObj.name}, function (err, user) {
	 if (err) {
	 console.log(err);
	 }

	 if (user) {
	 res.redirect('/');
	 } else {
	 var user = new User(_userObj);
	 user.save(function (err, _user) {
	 if (err) {
	 console.log(err);
	 }
	 res.redirect('/');
	 });
	 }
	 })*/
};

/*app.get('/logout', function (req, res) {*/
exports.logout = function (req, res) {
	delete  req.session.views.user;
	delete app.locals.user;
	res.redirect('/');
};

/*app.get('/admin/userlist', function (req, res) {*/
exports.list = function (req, res) {
	User.fetch(function (err, users) {
		if (err) {
			console.log(err);
		}

		res.render('userlist', {
			title: 'imooc 用户列表页',
			users: users
		});
	});
};

// midware for user
exports.signinRequired = function (req, res, next) {
	var user = req.session.views['user'];

	if (!user) {
		return res.redirect('/signin')
	}

	next();
}

exports.adminRequired = function (req, res, next) {
	var user = req.session.views['user'];
	console.log(user);
	if (user.role <= 10) {
		return res.redirect('/')
	}

	next();
};