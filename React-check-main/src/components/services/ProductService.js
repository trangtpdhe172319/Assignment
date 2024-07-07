import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductService = (props) => {
  const initialProductState = {
    id: null,
    name: "",
    username: "",
    email: "",
  };
  const [Product, setProduct] = useState(initialProductState);
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  console.log({ id });
  useEffect(() => {
    const fetchCate = async () => {
      try {
        const res = await axios.get("http://localhost:9000/categories");
        console.log(res);
        setCategories(res.data);
      } catch (e) {}
      const res = await axios.get(`http://localhost:9000/products/${id}`);
      setProduct(res.data);
    };

    fetchCate();
  }, [id]);
  /*
    {
    "id": 1,
    "name": "Original Acrylic Painting On Canvas Texture Wall Art Knife Abstract Art living room wall canvas abstract art canvas Personalized lovers Gift",
    "image": "https://i.etsystatic.com/6624893/r/il/c22539/3976761548/il_1588xN.3976761548_b7qc.jpg",
    "price": 7228915,
    "sales": 6114578,
    "categories_id": 1,
    "desc": "Original Acrylic Painting On Canvas Texture Wall Art Personalized Gift Knife Abstract Art living room wall canvas abstract art canvas. Impasto Painting palette knife art rainbow color artWelcome to my shop.✅COPYRIGHT: All paintings copyrighted ..",
    "free_ship": true,
    "space": "Hai Phong",
    "etsy_seller": true,
    "max": 12
  },
  */

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
        console.log(response);
        // setProduct({
        //   id: response.data.id,
        //   name: response.data.name,
        //   username: response.data.username,
        //   email: response.data.email,
        // });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    props.history.push("/product");
  };

  const newProduct = () => {
    setProduct(initialProductState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newProduct}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={Product.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="desc">Descripton</label>
            <input
              type="text"
              className="form-control"
              id="desc"
              required
              value={Product.desc}
              onChange={handleInputChange}
              name="desc"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="text"
              className="form-control"
              id="image"
              required
              value={Product.image}
              onChange={handleInputChange}
              name="image"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              className="form-control"
              id="price"
              required
              value={Product.price}
              onChange={handleInputChange}
              name="price"
            />
          </div>
          <div className="form-group">
            <label htmlFor="sales">Sale</label>
            <input
              type="number"
              className="form-control"
              id="sales"
              required
              value={Product.sales}
              onChange={handleInputChange}
              name="sales"
            />
          </div>
          <div className="form-group">
            <label htmlFor="max">Amount</label>
            <input
              type="number"
              className="form-control"
              id="max"
              required
              value={Product.max}
              onChange={handleInputChange}
              name="max"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">category</label>
            <select
              name="category"
              value={Product.category}
              onChange={handleInputChange}
            >
              {categories.map((cate) => {
                return <option value={cate.id}>{cate.name}</option>;
              })}
            </select>
          </div>

          <button onClick={saveProduct} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductService;
