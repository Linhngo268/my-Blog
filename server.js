const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public',)));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
 

const dataFilePath = path.join(__dirname, 'posts.json');
  let posts = [];

  if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath);
        posts = JSON.parse(fileData);
    }


// Get the list of blogs
app.get("/api/posts", (req, res) => {
   
  res.json(posts);
});

// Add a new blog
app.post("/api/posts", (req, res) => {
  const newPost = { id: posts.length + 1, ...req.body };
  posts.push(newPost);
  fs.writeFileSync(dataFilePath, JSON.stringify(posts));
  res.json(newPost);
});

// Edit a blog
app.put("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const updatedPost = { id: Number(id), ...req.body };
  if (id !== undefined && posts[id]) {
  posts = posts.map((post) => (post.id === Number(id) ? updatedPost : post));
fs.writeFileSync(dataFilePath, JSON.stringify(posts));
res.json(posts);
  }
  else{
    res.status(404).send({message:'not found'});
  }
});

// Delete a blog
app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((post) => post.id !== Number(id));
  res.json({ message: "Post deleted" });
  fs.writeFileSync(dataFilePath, JSON.stringify(posts));
 

});
 





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

