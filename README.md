### Docker

```sh
# build beego docker image
$ bin/build

# run beego webapp and visit port :8080
$ bin/run

# go to src
$ bin/enter

# get beego docker log
$ bin/log

# manually start webpack
$ cd ~/Projects/akgo/app/static/js/
$ webpack --color --progress --watch

# or start webpack with a script
$ bin/webpack
```


### Dev flow
- init setup for node modules
	* cd app/static/js
	* npm install
- open 2 terminals
	* one for `bin/run;bin/log`
	* another one for `bin/webpack`
- browser
