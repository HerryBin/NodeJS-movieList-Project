var Movie = require('../models/movie');
var _ = require('underscore');
/*app.get('/movie/:id', function (req, res) {*/
exports.detail = function (req, res) {
	var id = req.params.id;

	Movie.findById(id, function (err, movie) {
		if (err) {
			console.log(err);
		}
		//console.log(movie);
		res.render('detail', {
			title: 'imooc ' ,//+ movie.title,
			movie: movie
		});
		return false;
	});
};


//录入新数据
/*app.post('/admin/movie/new', function (req, res) {*/
exports.save = function (req, res) {
	console.log(req.body);
	var movieObj = req.body;
	console.log(movieObj);
	var _movie;
	var id = req.body.id;

	if (id !== 'undefined' && id !== null) {
		console.log('exit id');
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function (err, movie) {
				if (err) {
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			});
		});
	} else {
		console.log('no id');
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});
		console.log('beigin save');
		_movie.save(function (err, movie) {
			if (err) {
				console.log(err);
			}

			res.redirect('/movie/' + movie._id);
		});
	}
};

// 删除记录
/*app.post('/admin/movie/delete', function (req, res) {*/
exports.delete = function (req, res) {
	var id = req.body._id;
	Movie.remove({_id: id}, function (err, docs) {
		if (err) {
			console.log(err);
		}
		console.log('删除成功');
		res.send(docs);
	});
};
// 管理列表
/*app.get('/admin/list', function (req, res) {
 Movie.fetch(function (err, movies) {
 if (err) {
 console.log(err);
 }

 res.render('list', {
 title: 'imooc 列表页',
 movies: movies
 });
 });
 });*/

/*app.get('/movie/list', function (req, res) {*/
exports.list = function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err);
		}
		console.log(movies);
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		});
	});
};

// 录入
/*app.get('/admin/movie', function (req, res) {*/
exports.new = function (req, res) {
	res.render('admin', {
		title: 'imoooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			year: '',
			country: '',
			language: '',
			poster: '',
			flash: '',
			summary: ''
		}
	});
};


/*app.get('/admin/update/:id', function (req, res) {*/
exports.update = function (req, res) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function (err, movie) {
			console.log(movie);
			res.render('admin', {
				title: '电影更新页--' + movie.title,
				movie: movie
			})
		})
	}
};

