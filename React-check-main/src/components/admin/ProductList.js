import React, { useState, useEffect, useMemo, useRef } from "react";
import UserDataService from "../services/ProductService";
import "./ProductsList.module.scss"
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ProductsList.module.scss"; // Import CSS module

const ProductsList = (props) => {
  const [Products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const ProductsRef = useRef();
  const navigate = useNavigate();
  ProductsRef.current = Products;

  useEffect(() => {
    retrieveProducts();
  }, []);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const retrieveProducts = () => {
    axios
      .get("http://localhost:9000/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveProducts();
  };

  const removeAllProducts = () => {
    UserDataService.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    UserDataService.findByTitle(searchName)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openUser = (rowIndex) => {
    const id = ProductsRef.current[rowIndex].id;
    navigate("/admin/product/" + id);
  };

  const deleteUser = (rowIndex) => {
    const id = ProductsRef.current[rowIndex].id;

    axios
      .delete(`http://localhost:9000/products/${id}`)
      .then((response) => {
        let newProducts = [...ProductsRef.current];
        newProducts.splice(rowIndex, 1);

        setProducts(newProducts);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "desc",
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: (props) => {
          return (
            <img
              src={props.value}
              alt="Product"
              className={styles.productImage}
            />
          );
        },
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Sale",
        accessor: "sales",
      },
      {
        Header: "Amount",
        accessor: "max",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div className={styles.actionsContainer}>
              <span
                onClick={() => openUser(rowIdx)}
                className={`${styles.actionIcon} far fa-edit`}
              ></span>
              <span
                onClick={() => deleteUser(rowIdx)}
                className={`${styles.actionIcon} fas fa-trash`}
              ></span>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data: Products,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className={`list row ${styles.productsList}`}>
      <div className="col-md-12">
        <div className={`input-group mb-3 ${styles.searchContainer}`}>
          <input
            type="text"
            className={`form-control ${styles.searchInput}`}
            placeholder="Search By Any Field"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <button
            className={`btn btn-primary ${styles.addButton}`}
            onClick={() => navigate("/admin/product/add")}
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="col-md-12 list">
        <table
          className={`table table-striped table-bordered ${styles.table}`}
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button
            className="btn btn-default"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"First"}
          </button>{" "}
          <button
            className="btn btn-default"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Previous
          </button>{" "}
          <button
            className="btn btn-default"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Next
          </button>{" "}
          <button
            className="btn btn-default"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {"Last"}
          </button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const pageNumber = e.target.value
                  ? Number(e.target.value) - 1
                  : 0;
                gotoPage(pageNumber);
              }}
              style={{ width: "50px" }}
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="col-md-8">
        <button className="btn btn-sm btn-danger" onClick={removeAllProducts}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default ProductsList;
