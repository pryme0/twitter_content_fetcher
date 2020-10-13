
const asyncHandler = require('../utilities/asyncHandler');
const TwitterService = require('../Services/TwitterService');



//generate twitter authorization urrl
exports.twitter =  asyncHandler(async(req, res) => {
    let url = await TwitterService.url();
   return res.redirect(url);
});

exports.twitterCallback =   asyncHandler(async(req, res) => {
    if (req.query.error) throw new AuthFailureError();
        // get Access tokens and process user data
    let results = await TwitterService.getUserAccessTokens(req.query);
    if (results) req.session.user = results.user;
    return res.redirect('/dashboard');
});
exports.dashboard =  asyncHandler(async(req, res) => {
    const user = req.session.user;
    if (user) {
        return res.render('dashboard', { user: user });
    } else {
        res.redirect('/');
    }
})
exports.getInterests =asyncHandler(async(req, res) => {
    const user = req.session.user;
    let interest = await TwitterService.getInterest(user.email);
    return res.json(interest);
})

exports.updateInterest = asyncHandler(async(req, res) => {
    const data = req.body;
    const userId = req.session.user._id;
    const report = await TwitterService.updateInterest(data, userId);
    return res.json(report);
})

exports.getUserContent =asyncHandler(async(req, res) => {
    const user = req.session.user;
    let content = await TwitterService.getUserContent(user);
    return res.json(content);
})

exports.deleteInterests = asyncHandler(async(req, res) => {
    //get interest from query parameters
     let interest = req.params.interest
     let user = req.session.user._id
     console.log(user)
    result = await TwitterService.deleteInterest(user,interest)
      return res.json(result)
})

exports.logout = asyncHandler(async(req, res) => {
    req.session.destroy();
    res.redirect('/');
})