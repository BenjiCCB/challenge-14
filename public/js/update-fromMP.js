const updatePostHandler = async (event) => {
    event.preventDefault();
    
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/posts/update/${id}`, {
        method: 'GET',
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to delete project');
      }
    }
  };
  
  document
    .querySelector('.update-post')
    .addEventListener('click', updatePostHandler);
  