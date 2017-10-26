/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  if (req.isAuthenticated()) {
      res.render('home', {
        title: 'Home'
      });

  } else {
    res.render('home-null', {
      title: 'Home'
    });
  }
};
