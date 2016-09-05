var handle = rootRequire('helper/handle')();
var status = require('http-status');

module.exports = function (wagner, api) {

    api.get('/me', function (req, res){
        if (!req.user) {
            return res.
                status(status.UNAUTHORIZED).
                json({ error: "Not logged in"});
        }

        req.user.populate(
            { path: 'data.cart.product', model: 'Product'},
            handle.One.bind(null, 'user', res)
        );
    });

    api.put('/me/cart', wagner.invoke(function(User){
        return function(req, res) {
            try {
                var cart = req.body.data.cart;
            } catch(e) {
                status(status.BAD_REQUEST).
                    json({ error: 'No cart specified!'});
            }

            req.user.data.cart = cart;
            req.user.save(function (error, user) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString()});
                }

                return res.json({ user: user});
            });
        };
    }));


    return api;
};
