'use strict';

app.config(function ($stateProvider) {

    $stateProvider.state('cart', {
        url: '/cart/',
        controller: 'CartController',
        templateUrl: 'js/cart/cart.html',
        resolve: {
          theSession: function (CartFactory) {
            return CartFactory.getSession();
          },
          cartItems: function(CartFactory) {
            return CartFactory.fetchAllInCart();
          }
        }
    });

});

app.controller('CartController', function ($scope, Session, theSession, InventoryFactory, cartItems, CartFactory, $state) {

  $state.go($state.current, {}, {reload: true})

  $scope.cartItems = cartItems;

  $scope.grandTotal = cartItems.reduce(function(sum, item){
    return sum + (item.price * item.qty);
  }, 0)
  
  $scope.formatPrice = CartFactory.formatPrice;

});

app.factory('CartFactory', function ($http, $state) {

  var CartFactory = {};

  CartFactory.getSession = function() {
    return $http.get('/api/cart')
    .then(function(session) {
      return session.data;
    })
  }

  CartFactory.fetchAllInCart = function() {
    return $http.get('/api/cart/myCart')
    .then(function(response) {
      return response.data
    })
  }

  CartFactory.addToCart = function(inventoryId) {
    return $http.post('/api/cart/add', {id: inventoryId})
    .then(function(cart){
      return cart;
    })
  }

  CartFactory.formatPrice = function(price) {
    var priceStr = String(price);
    if (priceStr.length < 3) priceStr = ("00" + priceStr).slice(-3)
    return "$" + priceStr.slice(0, -2) + "." + priceStr.slice(-2);
  }

  return CartFactory;

});