var app = angular.module("myApp", ["ngRoute"]);
let API = "/api/data";

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
    "$rootScope", "UserService",
    function ($rootScope, UserService) {
        $rootScope.user = UserService.getUser();
    }
]);

app.controller("appCtrl", function ($scope, $location, $http, UserService) {
    function getData() {
        $http.get(API).then(function (response) {
            $scope.cakes = response.data.cakes;
            $scope.categories = response.data.categories;
        }, function (response) {
            console.log(response);
        });
    }
    getData();

    $scope.getCake = function (cake) {
        $location.path("/product-detail/" + cake.id);
    };

    $scope.logOut = function () {
        UserService.removeUser();
        window.location.reload();
    };
});

app.controller("menuCtrl", function ($scope, $location, $http) {
    function getData() {
        $http.get(API).then(function (response) {
            $scope.cakes = response.data.cakes;
            $scope.categories = response.data.categories;
        }, function (response) {
            console.log(response);
        });
    }
    getData();

    $scope.setOrder = function (categoryName) {
        $scope.order = ($scope.order === categoryName) ? "" : categoryName;
    };

    $scope.getCake = function (cake) {
        $location.path("/product-detail/" + cake.id);
    };
});

app.controller("productCtrl", function ($scope, $routeParams, $http, $location) {
    $http.get(API).then(function (response) {
        $scope.cakes = response.data.cakes;
        $scope.cake = $scope.cakes.find(c => c.id === $routeParams.productID);
    }, function (response) {
        console.log(response);
    });

    $scope.getCake = function (cake) {
        $location.path("/product-detail/" + cake.id);
    };
});

app.controller("userCtrl", function ($scope, $rootScope, $http, $timeout, $location, UserService) {
    $scope.users = [];

    $http.get(API).then(function (response) {
        $scope.users = response.data.users;
    }, function (response) {
        console.log(response);
    });

    $scope.login = function () {
        if (checkEmpty($scope.user)) {
            $scope.checkAuth();
        } else {
            alert("Vui lòng nhập email và password");
        }
    };

    $scope.checkAuth = function () {
        let found = $scope.users.find(user =>
            user.email === $scope.user.email && user.password === $scope.user.password
        );
        if (found) {
            alert("Mừng bạn trở lại " + found.name);
            UserService.saveUser(found);
            $rootScope.user = found;
            $timeout(() => $location.path("/"), 1000);
        } else {
            alert("Sai tên đăng nhập hoặc mật khẩu");
        }
    };

    $scope.signUp = function () {
        if (checkEmpty($scope.newUser)) {
            alert("Đăng ký thành công, nhưng đây là data cứng nên không lưu!");
            $timeout(() => $location.path("/login"), 1000);
        } else {
            alert("Vui lòng điền đầy đủ thông tin");
        }
    };
});

// scroll on top
app.run([
    "$rootScope", "$anchorScroll",
    function ($rootScope, $anchorScroll) {
        $rootScope.$on("$routeChangeSuccess", function () {
            $anchorScroll();
        });
    }
]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "home.html", controller: "appCtrl" })
        .when("/about-us", { templateUrl: "about-us.html" })
        .when("/RickMenu", { templateUrl: "menu.html", controller: "menuCtrl" })
        .when("/product-detail/:productID", { templateUrl: "products-detail.html", controller: "productCtrl" })
        .when("/contact", { templateUrl: "contact.html" })
        .when("/login", { templateUrl: "login.html", controller: "userCtrl" })
        .when("/sign-up", { templateUrl: "sign-up.html", controller: "userCtrl" })
        .when("/cart", { templateUrl: "cart.html" })
        .when("/check-out", { templateUrl: "check-out.html" })
        .when("/404", { templateUrl: "404.html" })
        .otherwise({ redirectTo: "/404" });
});

let checkEmpty = function (obj) {
    for (let key in obj) {
        if (!obj[key]) {
            return false;
        }
    }
    return true;
};
