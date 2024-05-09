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
  fetch('http://localhost:8080/posts?page=1&limit=10')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('posts-container'); // Get the container
      container.innerHTML = ''; // Clear previous contents
      container.style.display = 'grid';

      if (data.length === 0) {
        container.innerHTML = '<p>No posts available.</p>';
      } else {
        data.forEach(post => {
          const postElement = document.createElement('div');
          postElement.className = 'mb-32 mt-10';

          const card = document.createElement('div');
          card.className = 'bg-card text-card-foreground overflow-hidden hover:bg-zinc-50';
          const title = document.createElement('p');
          title.className = "font-semibold leading-none";
          title.textContent = post.title;

          card.appendChild(title);

          const fullContent = document.createElement('article');
          fullContent.style.display = 'none'; // Hide full content initially

          const heading = document.createElement('div');
          heading.textContent = post.title;
          heading.className = "font-bold text-xl";

          const border = document.createElement('hr');
          border.className = "border-neutral-200";

          const postBody = document.createElement('div');
          postBody.textContent = post.content;
          postBody.className = "mx-auto max-w-3xl";

          fullContent.appendChild(heading);
          fullContent.appendChild(border);
          fullContent.appendChild(postBody);

          const backLink = document.createElement('div');
          backLink.style.display = 'none'; // hidden at the start.
          backLink.className = "center";

          const backText = document.createElement('h3');
          backText.className = "font-mono";
          backText.textContent = 'Back';
          backText.style.cursor = 'pointer';

          backLink.appendChild(backText);

          card.addEventListener('click', function() {
            // Hide other post titles and show content for clicked title
            document.querySelectorAll('.post-card').forEach(t => {
              if (t !== title) {
                t.style.display = 'none'; // Hide other titles
              }
            });

            fullContent.style.display = ''; // Show full content for this post
            backLink.style.display = ''; // Show back link
          });

          backLink.onclick = function() {
            // Show all post titles and hide full content when back is clicked
            document.querySelectorAll('.post-card').forEach(t => {
              t.style.display = ''; // Show all titles
            });

            fullContent.style.display = 'none'; // Hide full content
            backLink.style.display = 'none'; // Hide back link
          };

          postElement.appendChild(card);
          card.classList.add('post-card'); // Add class for easier selection
          postElement.appendChild(fullContent);
          postElement.appendChild(backLink);
          container.appendChild(postElement);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      container.innerHTML = '<p>Error loading posts.</p>';
    });
}
