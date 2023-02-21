const newCommentHandler = async (event) => {
    event.preventDefault();
  
    const comment_text = document.querySelector('#comment-text').value.trim();
  
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];


    if (comment_text && post_id) {
      const response = await fetch(`/comment-create`, {
        method: 'POST',
        body: JSON.stringify({ comment_text, post_id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // alert('New comment created!');
        document.location.reload();
      } else {
        alert('Failed to create comment');
      }
    }
  };
  
  document
    .querySelector('.comment-form')
    .addEventListener('submit', newCommentHandler);