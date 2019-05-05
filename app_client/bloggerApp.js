var app = angular.module('blogApp', ['ngRoute']);

app.service('authentication', authentication);
authentication.$inject = ['$window', '$http'];
function authentication ($window, $http) {

    var saveToken = function (token) {
        $window.localStorage['blog-token'] = token;
    };

    var getToken = function () {
        return $window.localStorage['blog-token'];
    };

    var register = function(user) {
        console.log('Registering user ' + user.email + ' ' + user.password);
        return $http.post('/api/register', user).success(function(data){
	    saveToken(data.token);
        });
    };

    var login = function(user) {
        console.log('Attempting to login user ' + user.email + ' ' + user.password);
        return $http.post('/api/login', user).success(function(data) {
            saveToken(data.token);
	});
    };

    var logout = function() {
        $window.localStorage.removeItem('blog-token');
    };

    var isLoggedIn = function() {
        var token = getToken();
	
        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    var currentUser = function() {
        
        if(isLoggedIn()){
	    var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
                email : payload.email,
                name : payload.name
            };
        }
    };
    return {
        saveToken : saveToken,
        getToken : getToken,
        register : register,
	login : login,
        logout : logout,
        isLoggedIn : isLoggedIn,
        currentUser : currentUser
    };
}
    
    //***Router Provider ***
app.config(function($routeProvider) {
  $routeProvider
	.when('/', {
	    templateUrl: 'home.html',
	    controller: 'homeController',
	    controllerAs: 'vm'
	})

	.when('/list', {
	    templateUrl: 'list.html',
	    controller : 'listController',
            controllerAs: 'vm'
	})

	.when('/add', {
	    templateUrl: 'add.html',
	    controller: 'addController',
            controllerAs: 'vm'
	})
        .when('/game/:tictacid', {
	    templateUrl: 'game.html',
	    controller: 'gameController',
            controllerAs: 'vm'
	})
	.when('/remove/:tictacid', {
	    templateUrl: 'remove.html',
	    controller: 'removeController',
	    controllerAs: 'vm'
	})
	.when('/login', {
	    templateUrl: 'login.html',
	    controller: 'LoginController',
	    controllerAs: 'vm'
	})
	.when('/register', {
	    templateUrl: 'register.html',
	    controller: 'RegisterController',
	    controllerAs: 'vm'
	})
	.otherwise({redirectTo: '/'});
});

//*** Controllers ***
app.controller('homeController', function homeController() {
    var vm = this;
    vm.homeHeader = "Eric Frey's Tic Tac Toe Extravaganza";
    vm.homeText = "Sign in to start playing with a friend!";
    vm.submit = function(){
	console.log("Do stuff");
	
    }
});

app.controller('listController', [ '$http', 'authentication', function listController($http, authentication) {
    var vm = this;
    vm.listHeader = "Game List";

    vm.isLoggedIn = function(){
	return authentication.isLoggedIn();
    }
    vm.isAuthor = function(game) {
	return vm.isLoggedIn() && authentication.currentUser().name == game.xUser;
    }
    getAllBlogs($http)
	.success(function(data) {
	    vm.games = data;
	})
}]);

app.controller('gameController', [ '$http','$routeParams','$interval', '$location', 'authentication', function gameController($http, $routeParams, $interval, $location, authentication){
    var vm = this;
    var id = $routeParams.tictacid;

    vm.isLoggedIn = function() {
	return authentication.isLoggedIn();
    }
    getTicTacByID($http, id)                                                        
	.success(function(data) {
            console.log("success");
            vm.game = data;                                                             
	})
    vm.getUserEmail = function() {
	return authentication.currentUser().email;
    }
    vm.isUserTurn = function() {
	return vm.game.userTurn == authentication.currentUser().email;
    }
    vm.joinGame = function() {
	var data = vm.game;
	data.oUser = authentication.currentUser().name;
	data.oUserEmail = authentication.currentUser().email;

	if (data.userTurn == ""){
	    console.log("nextTurn");
	    data.userTurn = data.oUserEmail;
	}
	vm.game = data;
	updateTicTac($http, data, id, authentication)
            .success(function(data) {
                console.log("UPDATED");
            })
    }
    vm.clickedOn = function(cell) {
        var data = vm.game;
	if (data.winner == ''){
	var userSide = "";
	
	if (data.xUserEmail == authentication.currentUser().email){
	    userSide = "X";
	}else{
	    userSide = "O";
        }
	
	
	//Fill cell value
	switch(cell){
	case '1':
	    data.cell1 = userSide;
	    break;
	case '2':
	    data.cell2 = userSide;
	    break;
	case '3':
	    data.cell3 = userSide;
	    break;
	case '4':
	    data.cell4 = userSide;
	    break;
	case '5':
	    data.cell5=userSide;
	    break;
	case '6':
	    data.cell6=userSide;
	    break;
	case '7':
	    data.cell7=userSide;
	    break;
	case '8':
	    data.cell8=userSide;
	    break;
	case '9':
	    data.cell9=userSide;
	    break;
	}
	
	//Check for win
	if (data.cell1==userSide && data.cell2==userSide && data.cell3==userSide){
	    data.winner = authentication.currentUser().email;
	}else if (data.cell4==userSide && data.cell5==userSide && data.cell6==userSide){
	    data.winner=authentication.currentUser().email;
	}else if (data.cell7==userSide && data.cell8==userSide && data.cell9==userSide){
	    data.winner=authentication.currentUser().email;
	}else if (data.cell1==userSide && data.cell4==userSide && data.cell7==userSide){
	    data.winner=authentication.currentUser().email;
	}else if (data.cell2==userSide && data.cell5==userSide && data.cell8==userSide){
	    data.winner=authentication.currentUser().email;
	}else if (data.cell3==userSide && data.cell6==userSide && data.cell9==userSide){
	    data.winner=authentication.currentUser().email;
	}else if (data.cell1==userSide && data.cell5==userSide && data.cell9==userSide){
	    data.winner=authentication.currentUser().email;
	}else if (data.cell3==userSide && data.cell5==userSide && data.cell7==userSide){
	    data.winner=authentication.currentUser().email;
	}else if(data.cell1!='' && data.cell2!='' && data.cell3!='' && data.cell4!='' && data.cell5!='' && data.cell6!='' && data.cell7!='' && data.cell8!='' && data.cell9!=''){
	    data.winner = "Nobody";
	}
	
	
	if (data.xUserEmail == authentication.currentUser().email){
	    data.userTurn = data.oUserEmail;
	}else{
	    data.userTurn = data.xUserEmail;
	}
	vm.game = data;
        updateTicTac($http, data, id, authentication)
	    .success(function(data) {
                console.log("UPDATED");
	    })                                                                           
    }	
	promise = $interval(function(){
	    getTicTacByID($http, id)
		.success(function(data) {
		    console.log("success");
		    vm.game = data;
		})
	}, 1000);
	vm.stopGame = function(){
	    console.log("STOPPING");
	    $interval.cancel(promise);
	}
    }
    vm.hasWinner = function(){
	return vm.game.winner != '';
    }
}]);
app.controller('removeController', [ '$http', '$routeParams', '$location', 'authentication', function removeController($http, $routeParams, $location, authentication){
    var vm = this;
    var id = $routeParams.tictacid;

    vm.isLoggedIn = function(){
	return authentication.isLoggedIn();
    }
    getTicTacByID($http, id)
        .success(function(data) {
	    console.log("success");
            vm.game = data;
	})
    vm.submit = function() {
	deleteTicTac($http, id, authentication)
            .success(function(data) {
		$location.path('/list').replace();
            })
    }
}]);

app.controller('addController', ['$http', '$location', 'authentication', function addController($http, $location, authentication) {
    var vm = this;
    vm.tictac = {};

    vm.isLoggedIn = function(){
	return authentication.isLoggedIn();
    }
    
    vm.submit = function(){
	var data = vm.tictac;
	data.xUserEmail = authentication.currentUser().email;
	data.xUser = authentication.currentUser().name;
	data.userTurn = data.xUserEmail;
	
	console.log("adding");
	addTicTac($http, data, authentication)
	    .success(function(data) {
		$location.path('/game/'+data._id).replace();
	    })
    }
}]);

//Authentication Service

//*** Authentication Service and Methods *              
app.controller('LoginController', [ '$http', '$location', 'authentication', function LoginController($http, $location, authentication) {
    var vm = this;
    
    vm.pageHeader = {
	title: 'Sign in to Blogger'
    };

    vm.credentials = {
	email : "",
	password : ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
	vm.formError = "";
	if (!vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
	} else {
            vm.doLogin();
	}
    };

    vm.doLogin = function() {
	console.log("ATTEMPTING LOGIN");
	vm.formError = "";
	authentication
            .login(vm.credentials)
            .error(function(err){
		var obj = err;
		vm.formError = obj.message;
            })
            .then(function(){
		$location.search('page', null); 
		$location.path(vm.returnPage);
            });
    };
}]);

app.controller('RegisterController', [ '$http', '$location', 'authentication', function RegisterController($http, $location, authentication) {
    var vm = this;
    vm.pageHeader = {
	title: 'Create a new Blooger account'
    };
    
    vm.credentials = {
	name : "",
	email : "",
	password : ""
    };
    
    vm.returnPage = $location.search().page || '/';
    
    vm.onSubmit = function () {
	vm.formError = "";
	if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
	} else {
            vm.doRegister();
	}
    };

    vm.doRegister = function() {
	vm.formError = "";
      authentication
            .register(vm.credentials)
            .error(function(err){
          vm.formError = "Error registering. Try again with a different email address."
          //vm.formError = err;
            })
            .then(function(){
		$location.search('page', null); 
		$location.path(vm.returnPage);
            });
    };
}]);

//*** REST Web API functions ***                                                          
function getAllBlogs($http){
    return $http.get('/api/tictac');
}

/*function addBlog($http, data, authentication) {
    return $http.post('/api/blogs', data, { headers: {Authorization: 'Bearer '+ authentication.getToken()}});
    }*/
function addTicTac($http, data, authentication) {                                        
    return $http.post('/api/tictac', data, { headers: {Authorization: 'Bearer '+ authentication.getToken()}});                                                     
}


function getTicTacByID($http, tictacid){
    return $http.get('/api/tictac/'+ tictacid);
}
function updateTicTac($http, data, tictacid, authentication) {
    return $http.put('/api/tictac/'+ tictacid, data, { headers: {Authorization: 'Bearer '+ authentication.getToken()}});
}

function deleteTicTac($http, tictacid, authentication){
    return $http.delete('/api/tictac/'+ tictacid, { headers: {Authorization: 'Bearer '+ authentication.getToken()}});
}
