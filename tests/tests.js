(function() {
    var miniCartId = 'testPPMiniCart',
        productCount;
    
    // reset the cart
    window.location.hash = miniCartId + '=reset';
    
    
    // Test all of the callback event functionality
    function testOnRender() {
        var miniCartEl = document.getElementById(miniCartId);
        
        test('onRender', function() {
            ok(!miniCartEl, 'Cart DOM element not present');
        });
    }

    function testAfterRender() {
        var self = this,
            miniCartEl = document.getElementById(miniCartId);
        
        test('afterRender', function() {
            ok(miniCartEl, 'Cart DOM element present');
        });
    }

    function testOnHide(e) {
        var showing = this.isShowing;
    }

    function testAfterHide(e) {
        var showing = this.isShowing;
        
        test('afterHide', function() {
            ok(!showing, 'Cart is currently hiding');
        });
    }

    function testOnShow(e) {
        var showing = this.isShowing;
    }

    function testAfterShow(e) {
        var showing = this.isShowing;

        test('afterShow', function() {
            ok(showing, 'Cart is currently showing');
        });
    }

    function testOnAddToCart(obj) {
        var self = this;
        
        productCount = self.products.length;
        
        test('onAddToCart', function() {
            ok(!!obj, 'Product data was passed');
        });
    }

    function testAfterAddToCart(obj) {
        var self = this;
                
        test('afterAddToCart', function() {
            ok(typeof obj == 'object', 'Product data was passed');
            ok(self.products.length === productCount + 1, 'Product array grew by one');
            ok(self.UI.itemList.children.length === productCount + 1, 'Product UI list grew by one');
        });
    }
    
    function testOnRemoveFromCart(obj) {
        var self = this;
        
        productCount = self.products.length;
        
        test('onRemoveFromCart', function() {
            ok(typeof obj == 'object', 'Product data was passed');
        });
    }

    function testAfterRemoveFromCart(obj) {
        var self = this;
                
        test('afterRemoveFromCart', function() {
            ok(typeof obj == 'object', 'Product data was passed');
            ok(self.UI.itemList.children.length < productCount, 'Product UI list shrunk by one');
        });
    }
    
    function testOnCheckout(e) {
        test('onCheckout', function() {
            ok(!!e, 'Event object was passed');
        });
        
        e.preventDefault();
    }

    function testOnReset() {
        var self = this;
        
        test('onReset', function() {
            ok(self.products.length === 0, 'Cart products array is empty');
            ok(self.UI.itemList.innerHTML === '', 'Cart product UI is empty');
            ok(!self.showing, 'Cart is hiding');
        });
    }

    function testAfterReset() {
        var self = this;
        
        test('afterReset', function() {
            ok(self.products.length === 0, 'Cart products array is empty');
            ok(self.UI.itemList.innerHTML === '', 'Cart product UI is empty');
            ok(!self.showing, 'Cart is hiding');
            
            // let's fake some user activity now that the cart's ready
            testUserAddProducts(self);
        });
    }

    function testUserAddProducts(cart) {
        // add product 1 to the cart
        var product1 = document.getElementById('product1');
        fakeEvent(product1, 'submit');

        // add it again to make sure the quantity updates correctly
        fakeEvent(product1, 'submit');
        fakeEvent(product1, 'submit');
        
        // add product 2 to the cart
        var product2 = document.getElementById('product2');
        fakeEvent(product2, 'submit');
        
        // make sure content is correct
        test('content', 6, function() {
            var product1 = cart.products[0];
            var product2 = cart.products[1];
            
            ok(product1.priceNode.innerHTML == '\u00A54.50', 'Product 1 price was updated correctly');
            ok(product1.quantityNode.value == '3', 'Product 1 quantity was updated correctly');
            ok(product2.nameNode.innerHTML.toLowerCase() == 'product 2<span><br>#12345<br>color: green<br>discount: \u00a51.00</span>', 'Product 2 description was updated correctly');
            ok(product2.quantityNode.value == '2', 'Product 2 quantity was updated correctly');
            ok(product2.priceNode.innerHTML == '\u00A54.00', 'Product 2 price was updated correctly');
            ok(cart.UI.subtotalAmount.innerHTML == '\u00A58.50 JPY', 'Subtotal was updated correctly');         
                        
            testUserRemoveProducts(cart);
        });
        
    }
    
    function testUserRemoveProducts(cart) {
        for (var i = 0; i < cart.products.length; i++) {
            fakeEvent(cart.products[i].removeNode, 'click');
        }
        
        // test if the cart hides when there are no products
        setTimeout(function () {
            var showing = cart.isShowing;

            test('hideOnEmpty', function() {
                ok(!showing, 'Cart is hidden after last product');
            });
        }, 1000);
    }
    
    // utility method to similate events
    function fakeEvent(el, type) {
        var event;

        if (document.createEvent) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = 'on' + type;
        }

        if (document.createEvent) {
            el.dispatchEvent(event);
        } else {
            el.fireEvent(event.eventType, event);
        }
    }
    
    

    // initialize the Mini Cart and get started
    PAYPAL.apps.MiniCart.render({
    	assetURL: '../',
    	name: miniCartId,
    	events: {
            onRender: testOnRender,
            afterRender: testAfterRender,
            onHide: testOnHide,
            afterHide: testAfterHide,
            onShow: testOnShow,
            afterShow: testAfterShow,
            onAddToCart: testOnAddToCart,
            afterAddToCart: testAfterAddToCart,
            onRemoveFromCart: testOnRemoveFromCart,
            afterRemoveFromCart: testAfterRemoveFromCart,
            onCheckout: testOnCheckout,
            onReset: testOnReset,
            afterReset: testAfterReset
        }
    });
        
}());