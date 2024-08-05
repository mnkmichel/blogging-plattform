const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.json()); // Parse JSON request bodies (redundant with express.json())
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir); // Create 'uploads' directory if it doesn't exist
}

const pool = new Pool({
  user: 'stinkstiefel',
  host: 'localhost',
  database: 'blog',
  password: 'monika',
  port: 5432,
});

// Configure multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Set destination to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid filename conflicts
  },
});

const upload = multer({ storage: storage });

// Register a User
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate request data
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Save the user to the database (note: password is stored in plain text)
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login a User
app.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Retrieve user by email or username
    const userQuery = 'SELECT * FROM users WHERE email = $1 OR username = $1';
    const userResult = await pool.query(userQuery, [identifier]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Successful login
    res.status(200).json({
      success: true,
      message: 'Login successful',
      userId: user.id, // Include user ID in the response
      username: user.username
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows); // Send all posts as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single post by ID
app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(result.rows[0]); // Send the post as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new post
app.post('/posts', upload.single('image'), async (req, res) => {
  const { title, author, content, fulltext } = req.body;
  const imageUrl = req.file ? `uploads/${req.file.filename}` : null; // Use uploaded file URL if available

  try {
    const result = await pool.query(
      'INSERT INTO posts (title, author, content, image_url, fulltext) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, author, content, imageUrl, fulltext]
    );
    res.status(201).json(result.rows[0]); // Send the created post as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a post by ID
app.put('/posts/:id', upload.single('image'), async (req, res) => {
  const id = req.params.id;
  const { title, author, content, fulltext } = req.body;
  let imageUrl = '';

  try {
    if (req.file) {
      imageUrl = `uploads/${req.file.filename}`; // Use the new uploaded file URL
    } else {
      const currentPost = await pool.query('SELECT image_url FROM posts WHERE id = $1', [id]);
      if (currentPost.rows.length > 0) {
        imageUrl = currentPost.rows[0].image_url; // Retain existing image URL if no new file is uploaded
      }
    }

    const updatedPost = await pool.query(
      `UPDATE posts
       SET title = $1, author = $2, content = $3, fulltext = $4, image_url = $5
       WHERE id = $6 RETURNING *`,
      [title, author, content, fulltext, imageUrl, id]
    );
    res.json(updatedPost.rows[0]); // Send the updated post as JSON
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Error updating post' });
  }
});

// Delete a post by ID
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
