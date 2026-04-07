"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "tshirt",
    image: "",
    description: "",
  });

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    if (
      !product.name ||
      !product.price ||
      !product.image ||
      !product.description
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
        }),
      });

      if (!res.ok) {
        alert("Failed to add product");
        return;
      }

      alert("Product added!");

      setProduct({
        name: "",
        price: "",
        category: "tshirt",
        image: "",
        description: "",
      });
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>Admin</h2>

        <button
          onClick={() => setActiveTab("users")}
          style={styles.menuBtn}
        >
          Users
        </button>

        <button
          onClick={() => setActiveTab("addProduct")}
          style={styles.menuBtn}
        >
          Add Product
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h1>Admin Dashboard</h1>

        {activeTab === "users" && (
          <div>
            <h2>Registered Users</h2>

            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              users.map((u) => (
                <div key={u._id} style={styles.card}>
                  <p>
                    <b>{u.name}</b>
                  </p>
                  <p>{u.email}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "addProduct" && (
          <div>
            <h2>Add Product</h2>

            <input
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="tshirt">T-Shirt</option>
              <option value="mug">Mug</option>
              <option value="hoodie">Hoodie</option>
            </select>

            <input
              name="image"
              placeholder="Image URL"
              value={product.image}
              onChange={handleChange}
              style={styles.input}
            />

            <textarea
              name="description"
              placeholder="Product Description"
              value={product.description}
              onChange={handleChange}
              style={{ ...styles.input, height: "100px" }}
            />

            <button onClick={addProduct} style={styles.addBtn}>
              Add Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// STYLES
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
  },

  sidebar: {
    width: "200px",
    background: "#222",
    color: "white",
    padding: "15px",
  },

  menuBtn: {
    display: "block",
    width: "100%",
    marginBottom: "8px",
    padding: "8px",
    background: "#444",
    color: "white",
    border: "none",
    outline: "none",              
    boxShadow: "none",            
    WebkitTapHighlightColor: "transparent",
    cursor: "default",
  },

  main: {
    flex: 1,
    padding: "20px",
    background: "#f0f0f0",
  },

  card: {
    background: "white",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
  },

  input: {
    display: "block",
    marginBottom: "10px",
    padding: "8px",
    width: "250px",
    border: "1px solid #ccc",
    outline: "none",
  },

  addBtn: {
    padding: "8px 15px",
    background: "#333",
    color: "white",
    border: "none",
    outline: "none",
    boxShadow: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "default",
  },
};