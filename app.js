var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('underscore');

var Movie = require('./models/movie');
var User=require('./models/user');

var app = express();

mongoose.connect('mongodb://127.0.0.1/movie');

mongoose.connection.on("error", function (error) {
	console.log("数据库连接失败：" + error);
});
mongoose.connection.on("open", function () {
	console.log("------数据库连接成功！------");
});


// view engine setup
app.set('views', './views/pages');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var port = process.env.PORT || 3000;

app.listen(port);

console.log('movie start!')

app.get('/', function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('index', {
			title: 'imooc 首页',
			movies: movies
		});
	});
});

app.get('/movie/:id', function (req, res) {
	var id = req.params.id;

	Movie.findById(id, function (err, movie) {
		if (err) {
			console.log(err);
		}
		//console.log(movie);
		res.render('detail', {
			title: 'imooc ' + movie.title,
			movie: movie
		});
		return false;
	});
});

app.get('/list', function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('index', {
			title: 'imooc 列表页',
			movies: movies
		});
	});
});

// 录入
app.get('/admin/movie', function (req, res) {
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
});

app.get('/admin/update/:id', function (req, res) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function (err, movie) {
			res.render('admin', {
				title: '电影更新页--' + movie.title,
				movie: movie
			})
		})
	}
});
// 管理列表
app.get('/admin/list', function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		});
	});
});


//--------------------------------------------------------------【请求接口】

//录入新数据
app.post('/admin/movie/new', function (req, res) {
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
});

// 删除记录

app.post('/admin/movie/delete', function (req, res) {
	var id = req.body._id;
	Movie.remove({_id: id}, function (err, docs) {
		if (err) {
			console.log(err);
		}
		console.log('删除成功');
		res.send(docs);
	});
});
