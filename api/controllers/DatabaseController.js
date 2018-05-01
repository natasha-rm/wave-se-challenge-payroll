/**
 * DatabaseController
 *
 * @description :: Utility for DB maintenance.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
    clearDB: function (req, res) {
        if (req.method === 'GET') {
            return res.json({
                'status': 'GET not allowed'
            });
        }

        // Call to /upload via GET is error
        return PayReport.destroy({})
            .then(function () {
                return TimeReport.destroy({});
            }).then(function () {
                console.log('Records have been cleared');
                return res.redirect('/');
            })
    }
};
