document.addEventListener('DOMContentLoaded', function() {
  console.log("i am here");

  // add an event listener for the tech option click.
  document.getElementById("posts").addEventListener("click", function(event) {
    console.log("i am here hettttttttttttt");
    event.preventDefault(); 

    const postsPage = document.getElementById("posts-page");
    const homeContainer = document.getElementById("home-container");
    if (postsPage.style.display == 'none') {
      loadPosts();
      postsPage.style.display = 'block'; // Make the container visible
      homeContainer.style.display = 'none'; // Make the container visible
    }
  });

  //add an event listener for the home option click.
  document.getElementById("home").addEventListener("click", function(){
    const homeContainer = document.getElementById("home-container");
    const postsPage = document.getElementById("posts-page");
    if(homeContainer.style.display == 'none'){
      homeContainer.style.display = "flex";
      postsPage.style.display = "none";
    }
  });

});

function formatDate(dateString) {
    const date = new Date(dateString);

    //format to "Month Day, Year"
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

function loadPosts() {
  fetch('/api/posts?page=1&limit=10')
    .then(response => response.json())
    .then(data => {
      const pageHeading = document.getElementById("posts-heading");
      pageHeading.style.display = "block";

      const container = document.getElementById('posts-container'); // Get the container
      container.innerHTML = ''; // Clear previous contents
      container.style.display = 'grid';

      if (data.length === 0) {
        container.innerHTML = '<p>No posts available.</p>';
      } else {
        data.forEach(post => {
          const date = formatDate(post.date);

          const postElement = document.createElement('div');
          postElement.className = 'mb-32 mt-10';

          const card = document.createElement('div');
          card.className = 'bg-card text-card-foreground rounded-lg overflow-hidden hover:bg-zinc-50';

          const title = document.createElement('div');
          title.className = 'horizontal-title-container mx-small'

          const titleStart = document.createElement('p');
          titleStart.className = "font-semibold leading-none";
          titleStart.textContent = post.title;
          const titleEnd = document.createElement('p');
          titleEnd.className = "text-sm mx-med tabular-nums text-zinc-400";
          titleEnd.textContent = date;

          title.appendChild(titleStart);
          title.appendChild(titleEnd);

          card.appendChild(title);

          const fullContent = document.createElement('article');
          fullContent.style.display = 'none'; // Hide full content initially

          const heading = document.createElement('div');

          const headingTitle = document.createElement('h3');
          headingTitle.textContent = post.title;
          headingTitle.className = "font-bold text-xl mx-small";
          const headingDate = document.createElement('div');
          headingDate.className = "text-sm tabular-nums mx-small text-zinc-400";
          headingDate.textContent = date;

          heading.appendChild(headingTitle);
          heading.appendChild(headingDate);

          const border = document.createElement('hr');
          border.className = "border-neutral-200 mx-small";

          const postBody = document.createElement('div');
          postBody.textContent = post.content;
          postBody.className = "mx-auto max-w-3xl mx-small";

          fullContent.appendChild(heading);
          fullContent.appendChild(border);
          fullContent.appendChild(postBody);

          const backLink = document.createElement('div');
          backLink.style.display = 'none'; // hidden at the start.
          backLink.className = "centered-container"

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

            // hide the posts-heading.
            const postsHeading = document.getElementById('posts-heading');
            postsHeading.style.display = 'none';

            fullContent.style.display = ''; // Show full content for this post
            backLink.style.display = ''; // Show back link
          });

          backLink.onclick = function() {
            // Show all post titles and hide full content when back is clicked
            document.querySelectorAll('.post-card').forEach(t => {
              t.style.display = ''; // Show all titles
            });

            // show the posts-heading.
            const postsHeading = document.getElementById('posts-heading');
            postsHeading.style.display = 'block';

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
