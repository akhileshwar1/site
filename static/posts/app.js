document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    const routes = {
        '/': renderHome,
        '/posts': renderPosts,
        '/posts/:postTitle': renderPostDetail, // This will match individual post pages
    };

  function navigate(event) {
    event.preventDefault();
    // Traverse up the DOM tree to find the closest ancestor <a> tag with an href attribute
    let target = event.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }

    // If a valid <a> tag with an href attribute is found, get its href attribute
    const path = target ? target.getAttribute('href') : '/';

    // Perform navigation based on the retrieved path
    window.history.pushState({}, '', path);
    render(); // Render the appropriate content based on the path
  }

  function render() {
    const path = window.location.pathname;
    console.log("path is", path);
    // Attempt to match the path against defined routes
    const matchedRoute = matchRoute(path);

    // If a matched route with params is found, render the corresponding function
    if (matchedRoute && matchedRoute.route && matchedRoute.params) {
      routes[matchedRoute.route](matchedRoute.params);
    } else {
      routes[matchedRoute.route]();
    }
  }

  function matchRoute(path) {
    for (const routePath in routes) {
      // Exact match found, return it
      if (path === routePath) {
        return { route: routePath, params: null };
      }

      // Check for routes with dynamic segments
      if (routePath.includes('/:')) {
        // Split the route path and current path into segments
        const routeSegments = routePath.split('/');
        const pathSegments = path.split('/');

        if (routeSegments.length === pathSegments.length) {
          // Iterate through segments to match
          let params = {};
          let isMatch = true;
          for (let i = 0; i < routeSegments.length; i++) {
            if (routeSegments[i] === pathSegments[i]) {
              continue;
            }
            if (routeSegments[i].startsWith(':')) {
              // Dynamic segment found, extract parameter
              const paramName = routeSegments[i].substring(1);
              params[paramName] = pathSegments[i];
              continue;
            }
            // No match found
            isMatch = false;
            break;
          }
          if (isMatch) {
            return { route: routePath, params: params };
          }
        }
      }
    }

    // No route found, return null
    return { route: '/', params: null }; // Default route if no match
  }

    function renderHome() {
        app.innerHTML = `
            <div id="home-container" class="vertical-left-container font-mono">
                <img src="sicp-eval-apply-m.jpg" class="mx-small"> 
                <p><strong class="font-bold text-xl mx-small">hi, i'm akhil</strong></p>
                <div class="font-mono text-muted-foreground text-sm mx-small">
                    <p>i am a programmer.</p>
                    <p>as you might have guessed, i love lisp and i owe it to SICP for turning me into who i am today.</p>
                    <p>currently, i work as a Software Engineer at SpartanPoker, where i primarily use Clojure and Java to build and scale game servers.</p>
                    <p>feel free to explore and if you find anything that interests you, do get in touch at akhilprm999@gmail.com.</p>
                </div>
            </div>
        `;
    }

    function renderPosts() {
        console.log("in render posts");
        app.innerHTML = `
            <div id="posts-page" class="vertical-left-container font-mono">
                <div id="posts-heading" class="vertical-left-container">
                    <h2 class="mx-small text-2xl font-bold">posts</h2>
                    <p class="text-sm text-muted-foreground mx-small font-mono">here, you can find my notes on a variety of topics.</p>
                </div>
                <div id="posts-container" class="posts-grid"></div>
            </div>
        `;
        loadPosts();
    }

    function renderPostDetail(params) {
        let postTitle = params.postTitle;
        postTitle = decodeURIComponent(postTitle.split('/').pop()).replace(/-/g, ' ');
        app.innerHTML = `
            <div id="post-detail-page" class="vertical-left-container">
            </div>
        `;
        loadPostDetail(postTitle);
    }

  function loadPosts() {
    fetch('/api/posts?page=1&limit=10')
      .then(response => response.json())
      .then(data => {
        console.log("in load posts");
        const container = document.getElementById('posts-container');
        container.innerHTML = '';
        if (data.length === 0) {
          container.innerHTML = '<p>No posts available.</p>';
        } else {
          data.forEach(post => {
            const card = document.createElement('div');
            card.className = 'bg-card text-card-foreground rounded-lg overflow-hidden hover:bg-zinc-50';

            const titleContainer = document.createElement('div');
            titleContainer.className = 'horizontal-title-container';

            const title = document.createElement('p');
            title.className = 'font-semibold leading-none';
            title.textContent = post.title;

            const date = document.createElement('p');
            date.className = 'mx-2 tabular-nums text-zinc-400';
            date.textContent = formatDate(post.date);

            titleContainer.appendChild(title);
            titleContainer.appendChild(date);

            card.appendChild(titleContainer);

            card.addEventListener('click', () => {
              navigateToPost(post.title);
            });

            container.appendChild(card);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        document.getElementById('posts-container').innerHTML = '<p>Error loading posts.</p>';
      });
  }

  function navigateToPost(title) {
    const path = `/posts/${encodeURIComponent(title.replace(/\s+/g, '-').toLowerCase())}`;
    window.history.pushState({}, '', path);
    render();
  }

    function loadPostDetail(title) {
        fetch(`/api/posts/${title}`)
            .then(response => response.json())
            .then(post => {
                const container = document.getElementById('post-detail-page');
                container.innerHTML = `
                    <article style = "width:100%;">
                        <h2 class="mx-small text-2xl font-bold">${post.title}</h2>
                        <p class="tabular-nums mx-small text-zinc-400">${formatDate(post.date)}</p>
                        <hr class="border-neutral-200 mx-small">
                        <div class="mx-auto max-w-3xl mx-small">${post.content}</div>
                    </article>
                `;
                hljs.highlightAll();
            })
            .catch(error => {
                console.error('Error fetching post:', error);
                document.getElementById('post-detail-container').innerHTML = '<p>Error loading post.</p>';
            });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    document.getElementById('home').addEventListener('click', navigate);
    document.getElementById('posts').addEventListener('click', navigate);

    window.addEventListener('popstate', render);

    render();
});
