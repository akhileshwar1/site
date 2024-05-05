document.addEventListener('DOMContentLoaded', function() {
  console.log("i am here");

  // add an event listener for the tech option click.
  document.getElementById("tech-posts").addEventListener("click", function(event) {
    console.log("i am here hettttttttttttt");
    event.preventDefault(); 

    const postsContainer = document.getElementById("posts-container");
    const homeContainer = document.getElementById("home-container");
    if (postsContainer.style.display == 'none') {
      loadPosts();
      postsContainer.style.display = 'flex'; // Make the container visible
      homeContainer.style.display = 'none'; // Make the container visible
    }
  });

  //add an event listener for the home option click.
  document.getElementById("home").addEventListener("click", function(){
    const homeContainer = document.getElementById("home-container");
    const postsContainer = document.getElementById("posts-container");
    if(homeContainer.style.display == 'none'){
      homeContainer.style.display = "flex";
      postsContainer.style.display = "none";
    }
  });

});

function loadPosts() {
  // Fetch data from the server
  fetch('http://localhost:8080/posts?page=1&limit=10')
    .then(response => response.json()) // Convert the response to JSON
    .then(data => {
      const container = document.getElementById('posts-container'); // Get the container
      container.innerHTML = ''; // Clear previous contents

      // Check if the data array is empty
      if (data.length === 0) {
        container.innerHTML = '<p>No posts available.</p>'; // Display no posts message
      } else {
        // Iterate through each post data
        data.forEach(post => {
          const postElement = document.createElement('div');
          postElement.className = 'post';

          const title = document.createElement('h3');
          title.textContent = post.title;

          const preview = document.createElement('p');
          // Assuming post.content is a string with the full content
          preview.textContent = post.content.substring(0, 100) + '...'; // Show first 100 characters

          const fullContent = document.createElement('p');
          fullContent.textContent = post.content;
          fullContent.style.display = 'none'; // Hide full content initially

          const readMore = document.createElement('button');
          readMore.textContent = 'Read More';
          readMore.onclick = function() {
            if (fullContent.style.display === 'none') {
              fullContent.style.display = 'block'; // Show full content
              preview.style.display = 'none'; // Hide preview
              readMore.textContent = 'Read Less';
            } else {
              fullContent.style.display = 'none'; // Hide full content
              preview.style.display = 'block'; // Show preview
              readMore.textContent = 'Read More';
            }
          };

          postElement.appendChild(title);
          postElement.appendChild(preview);
          postElement.appendChild(fullContent);
          postElement.appendChild(readMore);
          container.appendChild(postElement);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching posts:', error); // Log errors to the console
      document.getElementById('blog-container').innerHTML = '<p>Error loading posts.</p>'; // Display error message
    });
}
