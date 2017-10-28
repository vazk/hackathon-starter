/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home-null', {
    title: 'Home'
  });
};
exports.authenticated = (req, res) => {
  if (req.isAuthenticated()) {
      res.render('home', {
        title: 'Workspace'
      });

  } else {
    res.render('home-null', {
      title: 'Home'
    });
  }
};

exports.donate = (req, res) => {
    res.render('donate', {
      title: 'Donate'
    });
};

exports.aboutus = (req, res) => {
    res.render('aboutus', {
      title: 'About Us'
    });
};
