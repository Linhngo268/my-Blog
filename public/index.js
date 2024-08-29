document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.getElementById("posts");
    const postForm = document.getElementById("postForm");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    
    // Fetch and display posts
    const fetchPosts = async () => {
        const response = await fetch("http://localhost:3000/api/posts");
        const posts = await response.json();
        
        // Sort posts by ID in descending order
        posts.sort((a, b) => b.id - a.id);
 
        postsContainer.innerHTML = posts
        .map(
            (post) => {
                const postingDate = new Date(post.postingTime);
                const formattedDate = postingDate.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });

                return `
                <div class="post" id="post-${post.id}">
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <p class="posting-time">Posted on: ${formattedDate}</p>
                    <div class="actions">
                        <button onclick="editPost(${post.id})">Edit</button>
                        <button onclick="deletePost(${post.id})">Delete</button>
                    </div>
                </div>
                `;
            }
        )
        .join("");
    };
    
   

     
    document.getElementById('newpost').addEventListener('click',function(){
        var postDiv=document.getElementById('post1');
        postDiv.style.display = (postDiv.style.display ==='none' ) ? 'flex' : 'none';
    });
    document.querySelector('.close1').onclick = () => {
        document.getElementById('post1').style.display = 'none';
    };

    // Add a new post
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Get the current date and time for the new posting time
        const newPostingTime = new Date().toISOString();
        
        // Create the new post object
        const newPost = {
            title: titleInput.value,
            content: contentInput.value,
            postingTime: newPostingTime  
        };
        
        // Send the POST request to create a new post
        const response = await fetch("http://localhost:3000/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPost),
        });
        
        const createdPost = await response.json();
    
        // Format the posting time for display
        const formattedDate = new Date(createdPost.postingTime).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    
        // Create a new post element with posting time
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.id = `post-${createdPost.id}`;
        postElement.innerHTML = `
            <h2>${createdPost.title}</h2>
            <p>${createdPost.content}</p>
            <p class="posting-time">Posted on: ${formattedDate}</p>
            <div class="actions">
                <button onclick="editPost(${createdPost.id})">Edit</button>
                <button onclick="deletePost(${createdPost.id})">Delete</button>
            </div>
        `;
    
        // Prepend the new post to the top of the list
        postsContainer.prepend(postElement);
    
        // Clear the form inputs
        titleInput.value = "";
        contentInput.value = "";
    });
    

    // Delete a post
    window.deletePost = async (id) => {
        if (confirm("Are you sure you want to delete this post?")) {
            await fetch(`http://localhost:3000/api/posts/${id}`, {
                method: "DELETE",
            });
            fetchPosts();
        }
    };
    
    // Initial fetch of posts
    fetchPosts();
    });
    
    
    
   // Edit the post
const editModal = document.getElementById('editModal');
const editTitleInput = document.getElementById('editTitle');
const editContentInput = document.getElementById('editContent');
const saveEditButton = document.getElementById('saveEdit');
let currentPostId = null;

// Function to open the modal and populate it with the current post data
window.editPost = (id) => {
    const post = document.querySelector(`#post-${id}`);
    const title = post.querySelector("h2").textContent;
    const content = post.querySelector("p").textContent;

    editTitleInput.value = title;
    editContentInput.value = content;
    currentPostId = id;

    editModal.style.display = 'flex'; // Show the modal
};

// Function to close the modal
document.querySelector('.close').onclick = () => {
    editModal.style.display = 'none';
};

// Function to save the edited post and update the DOM automatically
saveEditButton.onclick = async () => {
    const title = editTitleInput.value;
    const content = editContentInput.value;

    if (title && content) {
        // Ensure newPostingTime is defined within this block
        const newPostingTime = new Date().toISOString();

        await fetch(`http://localhost:3000/api/posts/${currentPostId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content, postingTime: newPostingTime }), // Include postingTime
        });

        // Update the DOM with the new title, content, and posting time
        const post = document.querySelector(`#post-${currentPostId}`);
        post.querySelector("h2").textContent = title;
        post.querySelector("p").textContent = content;

        const postingTimeElement = post.querySelector(".posting-time");
        if (postingTimeElement) {
            const formattedDate = new Date(newPostingTime).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            postingTimeElement.textContent = `Posted on: ${formattedDate}`;
        }

        editModal.style.display = 'none'; // Hide the modal after saving
    }
};
