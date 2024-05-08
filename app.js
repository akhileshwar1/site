document.addEventListener('DOMContentLoaded', function() {
  console.log("i am here");

  // add an event listener for the tech option click.
  document.getElementById("posts").addEventListener("click", function(event) {
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
      container.style.display = 'grid';

      // Check if the data array is empty
      if (data.length === 0) {
        container.innerHTML = '<p>No posts available.</p>'; // Display no posts message
      } else {
        // iterate through each post data
        data.forEach(post => {
          const postElement = document.createElement('article');
          postElement.className = 'mb-32 mt-10 bg-card text-card-foreground overflow-hidden hover:bg-zinc-50';

          const title = document.createElement('p');
          title.textContent = post.title;
          title.className = 'font-semibold leading-none';
          title.addEventListener('click', function() {
            if (fullContent.style.display === 'none') {
              fullContent.style.display = 'block'; // Show full content
            }
            else{
              fullContent.style.display = 'none';
            }
          }); 

          const fullContent = document.createElement('p');
          fullContent.textContent = post.content;
          fullContent.style.display = 'none'; // Hide full content initially

          postElement.appendChild(title);
          postElement.appendChild(fullContent);
          container.appendChild(postElement);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching posts:', error); // Log errors to the console
      document.getElementById('posts-container').innerHTML = '<p>Error loading posts.</p>'; // Display error message
    });
}
