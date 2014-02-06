module.exports = function (grunt) {
	grunt.initConfig({
		sprite: {
			all: {
				src: 'src/img/sprite/*.png',
				destImg: 'src/img/sprite.png',
				cssFormat: 'stylus',
				destCSS: 'src/stylus/sprite.styl',
				algorithm: 'binary-tree',
				padding: 8,
				engine: 'pngsmith',
				imgOpts: {
					format: 'png'
				}
			}
		},

		imagemin: {
			options: {
				optimizationLevel: 1,
				pngquant: true,
				progressive: false,
				interlaced: false
			},
			images: {
				files: [{
					expand: true,
					cwd: 'src/img/',
					src: ['**/*.{png,jpg,gif}', '!sprite/*'],
					dest: 'dev/img/'
				}]
			}
		},

		stylus: {
			options: {
				compress: false
			},
			compile: {
				files: [{
					cwd: 'src/stylus',
					src: 'main.styl',
					dest: 'dev/css',
					expand: true,
					ext: '.css'
				}, {
					cwd: 'src/stylus',
					src: 'main.styl',
					dest: 'public/css',
					expand: true,
					ext: '.min.css'
				}]
			}
		},

		autoprefixer: {
			options: {
				browsers: [
					'ie 9',
					'ff 25',
					'opera 12',
					'safari 6',
					'chrome 30',
					'android 4',
					'ios 5'
				]
			},
			main: {
				src: ['dev/css/main.css', 'public/css/main.min.css']
			}
		},

		cssbeautifier: {
			files : 'dev/css/main.css'
		},

		cssmin: {
			combine: {
				files: {
					'public/css/main.min.css': 'public/css/main.min.css'
				}
			}
		},

		jade: {
			dev: {
				options: {
					data: {
						isDev: true
					}
				},
				files: [{
					cwd: 'src',
					src: ['**/*.jade', '!inc/**/*.jade'],
					dest: 'dev',
					expand: true,
					ext: '.html'
				}]
			},
			public: {
				files: [{
					cwd: 'src',
					src: ['**/*.jade', '!inc/**/*.jade'],
					dest: 'public',
					expand: true,
					ext: '.html'
				}]
			}
		},

		prettify: {
			options: {
				brace_style: 'expand',
				indent: 1,
				indent_char: '	',
				condense: true,
				indent_inner_html: true
			},
			all: {
				expand: true,
				cwd: 'dev',
				ext: '.html',
				src: ['**/*.html'],
				dest: 'dev'
			},
		},
		
		concat: {
			options: {
				separator: ';'
			},
			public: {
				files: [{
					src: [
						'src/js/libs/jquery-2.1.0.min.js',
						'src/js/libs/**/*.js',
						'src/js/main.js'
					],
					dest: 'public/js/main.min.js'
				}]
			}
		},

		uglify: {
			options: {
				report: 'min'
			},
			build: {
				src: 'public/js/main.min.js',
				dest: 'public/js/main.min.js'
			}
		},

		copy: {
			fonts: {
				files: [{
					expand: true,
					cwd: 'src/fonts/',
					src: '*',
					dest: 'public/fonts/',
					filter: 'isFile'
				}, {
					expand: true,
					cwd: 'src/fonts/',
					src: '*',
					dest: 'dev/fonts/',
					filter: 'isFile'
				}]
			},
			js: {
				files: [{
					expand: true,
					cwd: 'src/js/',
					src: '**/*',
					dest: 'dev/js/',
					filter: 'isFile'
				}]
			},
			img: {
				files: [{
					expand: true,
					cwd: 'dev/img/',
					src: '**/*',
					dest: 'public/img/',
					filter: 'isFile'
				}]
			}
		},

		connect: {
			public: {
				options: {
					port: 3000,
					base: 'public'
				}
			},
			dev: {
				options: {
					port: 4000,
					base: 'dev'
				}
			}
		},

		watch: {
			sprite: {
				files: ['src/img/sprite/*.png'],
				tasks: ['sprite']
			},
			imagemin: {
				files: ['src/img/**/*.{png,jpg,gif}'],
				tasks: ['imagemin']
			},
			stylus: {
				files: ['src/stylus/**/*.styl'],
				tasks: ['stylus', 'autoprefixer', 'cssbeautifier', 'cssmin']
			},
			jade: {
				files: ['src/**/*.jade', '!inc/**/*.jade'],
				tasks: ['jade', 'prettify']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['concat', 'uglify', 'jade', 'copy:js']
			},
			copyFonts: {
				files: ['src/fonts/**/*'],
				tasks: ['copy:fonts']
			},
			copyImg: {
				files: ['dev/img/**/*'],
				tasks: ['copy:img']
			},
			livereload: {
				options: {
					livereload: true
				},
				files: ['public/**/*']
			}
		}

	});

	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-cssbeautifier');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-prettify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'sprite',
		'imagemin',
		'stylus',
		'autoprefixer',
		'cssbeautifier',
		'cssmin',
		'jade',
		'prettify',
		'concat',
		'uglify',
		'copy',
		'connect',
		'watch'
	]);
};