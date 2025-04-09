var app = angular.module("myApp", ["ngRoute"]);
let API = "http://localhost:3000/";

app.factory("UserService", function () {
    return {
        saveUser: function (user) {
            localStorage.setItem("user", JSON.stringify(user));
        },
        getUser: function () {
            return JSON.parse(localStorage.getItem("user"));
        },
        removeUser: function () {
            localStorage.removeItem("user");
        },
    };
});
app.run([
    "$rootScope",
    "UserService",
    function ($rootScope, UserService) {
        $rootScope.user = UserService.getUser(); 
    },

]);

// get-data-from-JSON
app.controller("appCtrl", function ($scope, $location, $http, UserService) {
    function getDataFromJSON() {
        $http.get(API + "cakes").then(
            function (response) {
                $scope.cakes = response.data;
            },
            function (response) {
                console.log(response);
            }
        );
        $http.get(API + "categories").then(
            function (response) {
                $scope.categories = response.data;
            },
            function (response) {
                console.log(response);
            }
        );
    }
    getDataFromJSON();
    $scope.getCake = function (cake) {
        $location.path("/product-detail/" + cake.id);
    };
    $scope.logOut = function () {
        UserService.removeUser();
        window.location.reload();
    }
    
});

app.controller("menuCtrl", function ($scope, $location, $http) {
    function getDataFromJSON() {
        $http.get(API + "cakes").then(
            function (response) {
                $scope.cakes = response.data;
            },
            function (response) {
                console.log(response);
            }
        );
        $http.get(API + "categories").then(
            function (response) {
                $scope.categories = response.data;
            },
            function (response) {
                console.log(response);
            }
        );
    }
    getDataFromJSON();
    $scope.setOrder = function (categoryName) {
        if ($scope.order == categoryName) {
            $scope.order = "";
        } else {
            $scope.order = categoryName;
        }
    };
    $scope.getCake = function (cake) {
        $location.path("/product-detail/" + cake.id);
    };
});


app.controller(
    "productCtrl",
    function ($scope, $routeParams, $http, $location) {
        let productID = $routeParams.productID;
        $http.get(API + "cakes/" + productID).then(function (response) {
            $scope.cake = response.data;
        });
        $http.get(API + "cakes").then(
            function (response) {
                $scope.cakes = response.data;
            },
            function (response) {
                console.log(response);
            }
        );
        $scope.getCake = function (cake) {
            $location.path("/product-detail/" + cake.id);
        };
    }
);


app.controller(
    "userCtrl",
    function ($scope, $rootScope, $http, $timeout, $location, UserService) {
        $scope.getUsers = function () {
            $http.get(API + "users/").then(
                function (response) {
                    $scope.users = response.data;
                },
                function (response) {
                    console.log(response);
                }
            );
        };
        $scope.addUser = function (newUser) {
            $http.post(API + "users/", newUser).then(
                function (response) {
                    $scope.getUsers();
                },
                function (response) {
                    console.log(response);
                }
            )
        }
        $scope.getUsers();
        $scope.login = function () {
            if (checkEmpty($scope.user)) {
                $scope.checkAuth();
            } else {
                alert("Vui lòng nhập email và password");
            }
        };
        $scope.checkAuth = function () {
            if ($scope.isUserInUsers()) {
                alert("Mừng bạn trở lại " + $scope.user.name);
                $rootScope.user = UserService.getUser(); 
                $timeout(function () {
                    $location.path("/");
                }, 2000);
            } else {
                alert("Sai tên đăng nhập hoặc mật khẩu");
            }
        };
        $scope.isUserInUsers = function () {
            let check = false;
            $scope.users.forEach(function (user) {
                if (
                    $scope.user.email === user.email &&
                    $scope.user.password === user.password
                ) {
                    UserService.saveUser(user);
                    $scope.user = user;
                    check = true;
                }
            });
            return check;
        };

        $scope.signUp = function () {
            if (checkEmpty($scope.newUser)) {
                alert("Đăng ký thành công, bạn sẽ được chuyển đến trang đăng nhập");
                $scope.addUser($scope.newUser);
                $timeout(function () {
                    $location.path("/login");
                }, 2000);
            } else {
                alert("Vui lòng điền đầy đủ thông tin");
            }
        }
    }
);
//scoll-on-top
app.run([
    "$rootScope",
    "$anchorScroll",
    function ($rootScope, $anchorScroll) {
        $rootScope.$on("$routeChangeSuccess", function () {
            $anchorScroll();
        });
    },
]);

// config-SPA
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "home.html",
            controller: "appCtrl",
        })
        .when("/about-us", {
            templateUrl: "about-us.html",
        })
        .when("/RickMenu", {
            templateUrl: "menu.html",
            controller: "menuCtrl",
        })
        .when("/product-detail/:productID", {
            templateUrl: "products-detail.html",
            controller: "productCtrl",
        })
        .when("/contact", {
            templateUrl: "contact.html",
        })
        .when("/login", {
            templateUrl: "login.html",
            controller: "userCtrl",
        })
        .when("/sign-up", {
            templateUrl: "sign-up.html",
            controller: "userCtrl",
        })
        .when("/cart", {
            templateUrl: "cart.html",
        })
        .when("/check-out", {
            templateUrl: "check-out.html",
        })
        .when("/404", {
            templateUrl: "404.html",
        })
        .otherwise({
            redirectTo: "/404",
        });
});

let checkEmpty = function (obj) {
    for (let key in obj) {
        if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
            return false;
        }
    }
    return true;
};
