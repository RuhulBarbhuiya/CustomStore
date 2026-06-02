"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.css";

const initialProductState = {
  name: "",
  price: "",
  category: "tshirt",
  image: "",
  backImage: "",
  description: "",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [productNotice, setProductNotice] = useState(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const [product, setProduct] = useState(initialProductState);

  // Fetch Users
  useEffect(() => {
    if (activeTab !== "users") return;
    let ignore = false;
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && Array.isArray(data)) setUsers(data);
      })
      .catch((err) => console.error(err));
    return () => { ignore = true; };
  }, [activeTab]);

  // Fetch Products
  const fetchProducts = () => {
    fetch("/api/products?includeLocal=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setProduct({ ...product, [e.target.name]: value });
  };

  const saveProduct = async () => {
    if (!product.name || !product.price || !product.image || !product.description) {
      setProductNotice({
        type: "error",
        text: "Please fill all required fields.",
      });
      return;
    }

    setIsSavingProduct(true);
    setProductNotice(null);

    const payload = {
      ...product,
      price: Number(product.price),
      isCustomizable: false,
      colorOptions: [],
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setProductNotice({
          type: "error",
          text: "Failed to save product. Please try again.",
        });
        return;
      }

      const wasEditing = Boolean(editingId);
      setProductNotice({
        type: "success",
        text: `Product ${wasEditing ? "updated" : "added"} successfully.`,
      });
      
      // Reset form
      setProduct(initialProductState);
      setEditingId(null);
      fetchProducts();
      
      if (wasEditing) {
        setActiveTab("products"); // Switch back to products view after editing
      }
    } catch (err) {
      setProductNotice({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleEdit = (prod) => {
    setProductNotice(null);
    setProduct({
      name: prod.name,
      price: prod.price,
      category: prod.category || "tshirt",
      image: prod.image,
      backImage: prod.backImage || "",
      description: prod.description || "",
    });
    setEditingId(prod._id || prod.id);
    setActiveTab("addProduct"); // Act as Edit Product
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch (e) {
      alert("Something went wrong.");
    }
  };

  const handleCancelEdit = () => {
    setProduct(initialProductState);
    setEditingId(null);
    setProductNotice(null);
    setActiveTab("products");
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarHeader}>Admin Panel</h2>

        <button
          onClick={() => { setActiveTab("users"); setEditingId(null); }}
          className={`${styles.menuBtn} ${activeTab === "users" ? styles.menuBtnActive : ""}`}
        >
          Users
        </button>

        <button
          onClick={() => { setActiveTab("products"); setEditingId(null); setProductNotice(null); }}
          className={`${styles.menuBtn} ${activeTab === "products" ? styles.menuBtnActive : ""}`}
        >
          Manage Products
        </button>

        <button
          onClick={() => { 
            setActiveTab("addProduct"); 
            setEditingId(null); 
            setProduct(initialProductState); 
            setProductNotice(null);
          }}
          className={`${styles.menuBtn} ${activeTab === "addProduct" && !editingId ? styles.menuBtnActive : ""}`}
        >
          Add Product
        </button>

      </div>

      {/* MAIN */}
      <div className={styles.main}>
        <h1 className={styles.mainHeader}>Dashboard</h1>

        {activeTab === "users" && (
          <div>
            <h2 className={styles.tabTitle}>Registered Users</h2>

            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              users.map((u) => (
                 <div key={u._id || u.email} className={styles.card}>
                  <p className={styles.cardName}>{u.name}</p>
                  <p className={styles.cardEmail}>{u.email}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <h2 className={styles.tabTitle}>Manage Products</h2>

            {productNotice && (
              <p className={`${styles.notice} ${styles[productNotice.type]}`}>
                {productNotice.text}
              </p>
            )}
            
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.productTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id || p.id}>
                        <td>
                          <img src={p.image} alt={p.name} className={styles.tableImg} />
                        </td>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td>{p.category}</td>
                        <td>Rs {p.price}</td>
                        <td className={styles.actionCell}>
                          {p.source === "catalog" ? (
                            <span className={styles.readonlyBadge}>Read only</span>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(p)} className={`${styles.iconBtn} ${styles.editBtn}`}>Edit</button>
                              <button onClick={() => handleDelete(p._id || p.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`}>Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "addProduct" && (
          <div>
            <h2 className={styles.tabTitle}>{editingId ? "Edit Product" : "Add New Product"}</h2>

            <div className={styles.formContainer}>
              {productNotice && (
                <p className={`${styles.notice} ${styles[productNotice.type]}`}>
                  {productNotice.text}
                </p>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label}>Product Name</label>
                <input
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Price (Rs)</label>
                <input
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="tshirt">T-Shirt</option>
                  <option value="mug">Mug</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="full-sleeve">Full Sleeve</option>
                  <option value="cap">Cap</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Image URL</label>
                <input
                  name="image"
                  value={product.image}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Back Image URL</label>
                <input
                  name="backImage"
                  value={product.backImage}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.textarea}`}
                />
              </div>

              <div className={styles.formActions}>
                <button onClick={saveProduct} className={styles.saveBtn} disabled={isSavingProduct}>
                  {isSavingProduct ? "Saving..." : editingId ? "Save Changes" : "Create Product"}
                </button>
                {editingId && (
                  <button onClick={handleCancelEdit} className={styles.cancelBtn}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
