import React from "react";

const BlogList = ({ blogs, setActiveBlog }) => {
  return (
    <>
      {blogs.length > 0 ? (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div
              className="blog-item"
              key={blog._id}
              onClick={() => setActiveBlog(blog)}
            >
              <img
                src={blog.imagePath} // Direct Cloudinary URL
                alt="Uploaded"
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
              />
              <p style={{ fontSize: '35px' }}>{blog.title}</p>
              <p
                className="single-line-text"
                style={{
                  fontSize: '17px',
                  color: 'gray',
                  marginTop: '18px',
                  marginBottom: '18px',
                }}
              >
                {blog.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>No Blogs Uploaded Yet</div>
      )}
    </>
  );
};

export default BlogList;
