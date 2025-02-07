import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Define a schema and model
const blogSchema = new mongoose.Schema({
    title:{type:String,required:true},
    text: { type: String, required: true },
    imagePath: { type: String, required: true },
    date:{type:Date,required:true},
    locations:{type:[String]},
    email:{type:String,required:true}
});

const userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
})
const Blog = mongoose.model('Blog', blogSchema);
const User=mongoose.model('User',userSchema);
// Multer configuration
const __dirname = path.resolve(); // Fix for ES Modules to use dirname

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "mern_uploads", // Cloudinary folder name
      allowed_formats: ["jpg", "png", "jpeg"],
    },
  });
  
  const upload = multer({ storage });

// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });


// const upload = multer({ storage });

// API endpoint to upload text and image
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const {title,date,text,locations,email} = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const imagePath = req.file.path;

        // Save to MongoDB
        const newBlog = new Blog({ title,date,text, imagePath,locations:locations.split(','),email });
        await newBlog.save();

        res.status(201).json({ message: 'Upload successful', blog: newBlog });
    } catch (error) {
        console.error('Error uploading blog:', error);
        res.status(500).json({ message: 'Error uploading blog', error: error.message });
    }
});

app.post('/api/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: 'email not found' });
          }
          if(password!==user.password){
         return res.status(400).json({ message: 'password incorrect' });
          }
          res.status(200).json({message:`login succesfull`});
    }
    catch(error){
        console.log(error);
    }
});

app.post('/api/signup',async(req,res)=>{
    try{
        const{username,email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
        const newuser=new User({username,email,password});
        await newuser.save();
        return res.status(200).json({message:'success signup'});
        }
        res.status(404).json({message:`email already taken`});
    }
    catch(error){
        console.log(error);
    }
})



// Endpoint to fetch all blogs
app.get('/api/blogs', async (req, res) => {
  try {
      const blogs = await Blog.find();
      res.status(200).json(blogs);
      
  } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

app.get('/api/userblogs', async (req, res) => {
    try {
        const email=req.query.email;
        const blogs = await Blog.find({email:email});
        res.status(200).json(blogs);
        
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
  });



// Update endpoint
app.put('/api/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, text, locations, email } = req.body;

        // Find the existing blog
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Update fields
        if (title) blog.title = title;
        if (date) blog.date = date;
        if (text) blog.text = text;
        if (locations) blog.locations = locations.split(','); // Convert comma-separated string to array
        if (email) blog.email = email;

        // Update image if a new file is provided
        if (req.file) {
            blog.imagePath = req.file.path; // Save new image path
        }

        // Save changes
        await blog.save();

        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
});

// Start the server
app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'frontend','dist','index.html'));
});
app.listen(process.env.PORT,'0.0.0.0', () => console.log(`Server running on http://localhost:${process.env.PORT}`));
