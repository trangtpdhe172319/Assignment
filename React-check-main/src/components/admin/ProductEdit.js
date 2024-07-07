import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductDetails.module.scss"; // Import CSS module

const ProductDetails = (props) => {
  const initialProductState = {
    id: null,
    name: "",
    desc: "",
    image: "",
    price: 0,
    sales: 0,
    max: 0,
    category: "",
  };
  const [Product, setProduct] = useState(initialProductState);
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCate = async () => {
      try {
        const res = await axios.get("http://localhost:9000/categories");
        setCategories(res.data);
      } catch (e) {
        console.error(e);
      }
      try {
        const res = await axios.get(`http://localhost:9000/products/${id}`);
        setProduct(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchCate();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...Product, [name]: value });
  };

  const saveProduct = () => {
    var data = {
      id: 1,
      categories_id: Product.category,
      free_ship: true,
      space: "Hai Phong",
      etsy_seller: true,
      max: 12,
      ...Product,
    };

    axios
      .put(`http://localhost:9000/products/${id}`, data)
      .then((response) => {
        setSubmitted(true);
        navigate("/admin/product"); // Điều hướng về trang danh sách sản phẩm
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const newProduct = () => {
    setProduct(initialProductState);
    setSubmitted(false);
  };

  return (
    <div className={styles.container}>
      {submitted ? (
        <div className={styles.submittedMessage}>
          <h4>You submitted successfully!</h4>
          <button className={styles.button} onClick={newProduct}>
            Add
          </button>
          <button
            className={styles.button}
            onClick={() => navigate("/admin/product")}
          >
            Back to Product List
          </button>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Product Details</h2>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              className={styles.input}
              id="name"
              required
              value={Product.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="desc" className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              id="desc"
              required
              value={Product.desc}
              onChange={handleInputChange}
              name="desc"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>Image</label>
            <input
              type="text"
              className={styles.input}
              id="image"
              required
              value={Product.image}
              onChange={handleInputChange}
              name="image"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>Price</label>
            <input
              type="number"
              className={styles.input}
              id="price"
              required
              value={Product.price}
              onChange={handleInputChange}
              name="price"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="sales" className={styles.label}>Sales</label>
            <input
              type="number"
              className={styles.input}
              id="sales"
              required
              value={Product.sales}
              onChange={handleInputChange}
              name="sales"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="max" className={styles.label}>Amount</label>
            <input
              type="number"
              className={styles.input}
              id="max"
              required
              value={Product.max}
              onChange={handleInputChange}
              name="max"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>Category</label>
            <select
              name="category"
              value={Product.category}
              onChange={handleInputChange}
              className={styles.select}
            >
              {categories.map((cate) => (
                <option key={cate.id} value={cate.id}>{cate.name}</option>
              ))}
            </select>
          </div>

          <button onClick={saveProduct} className={styles.submitButton}>
            Submit
          </button>
          <button
            className={styles.backButton}
            onClick={() => navigate("/admin/product")}
          >
            Back to Product List
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
