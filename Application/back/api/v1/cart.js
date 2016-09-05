var status = require('http-status');
var _ = require('underscore');

module.exports = function (wagner, api) {

    api.post('/checkout', wagner.invoke(function(User, Stripe) {
        return function (req, res) {
            if (!req.user) {
                return res.
                    status(status.UNAUTHORIZED).
                    json({ error: 'Not logged in'});
            }

            req.user.populate(
                { path: 'data.cart.product', model: 'Product'},
                function (error, user) {
                    var totalCostUSD = 0;
                    _.each(user.data.cart, function(item){
                        totalCostUSD += item.product.internal.approximatePriceUSD * item.quantity
                    });

                    Stripe.charges.create(
                        {
                            amount: Math.ceil(totalCostUSD * 100),
                            currency: 'usd',
                            source: req.body.stripeToken,
                            description: 'Example charge'
                        },
                        function (err, charge) {
                            if (err && err.type === 'StripeCardError') {
                                return res.
                                    status(status.BAD_REQUEST).
                                    json({ error: err.toString() });
                            }
                            if (err) {
                                console.log(err);
                                return res.
                                    status(status.INTERNAL_SERVER_ERROR).
                                    json({error : err.toString()});
                            }

                            req.user.data.cart = [];
                            req.user.save(function() {
                                return res.json({ id: charge.id});
                            });
                        }
                    );
                }
            );
        };
    }));


    return api;
};
