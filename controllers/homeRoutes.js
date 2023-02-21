const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// render homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
  
    const posts = postData.map((post) => post.get({ plain: true }));

    // truncate long posts
    for (let i = 0; i < posts.length; i++) { 
      if (posts[i].body.length > 1200){
        posts[i].body = posts[i].body.substring(0, 1200) + '(... click title to view more)'
      }
    }

    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// render dashboard
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Post,
          include: [User]
        },
      ],
    });

    const user = userData.get({ plain: true });

    for (let i = 0; i < user.posts.length; i++) { 
      if (user.posts[i].body.length > 1200){
      user.posts[i].body = user.posts[i].body.substring(0, 1200) + '( ...click title to view more)'
      }
    }

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// render create form
router.get('/create-post', withAuth, async (req, res) => {
  res.render('post-create', {logged_in: req.session.logged_in});
});

// render update form
router.get('/update-post/:id', withAuth, async (req, res) => {

  const postData = await Post.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['username'],
      },
    ],
  });

  const post = postData.get({ plain: true });

  res.render('post-update', {
    ...post,
    username: req.session.username,
    logged_in: req.session.logged_in
  });

});

// render post
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          // attributes: ['comment_text'],
          include: [User]
        },
      ],
    });

    const post = postData.get({ plain: true });
    const comments = post.comments

    // console.log(post.comments)

    const isAuthor = (post.user.username == req.session.username)

    res.render('post-display', {
      ...post,
      comments,
      isAuthor,
      username: req.session.username,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/comment-create', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});



// manage login
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('user-login');
});

// manage signup
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('user-signup');
});

module.exports = router;
