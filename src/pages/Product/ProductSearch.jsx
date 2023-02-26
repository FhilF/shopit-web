import { Box, Col, Grid, Group, LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import ProductCard from "components/Product/ProductCard";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductView from "components/Product/ProductView";

function ProductSearch(props) {
  const { departmentList, setOpenDeptDrawer } = props;
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [search, setSearch] = useSearchParams();
  const [productView, setProductView] = useState([]);
  const [departments, setDepartments] = useState([]);
  const productRef = useRef();
  const deptId = search.get("id");

  const { id } = useParams();

  const deptParentId = id.split(".")[1];

  useEffect(() => {
    if (deptParentId) {
      setIsPageLoading(true);
      axios
        .get(`/api/product/department?id=${deptParentId}`)
        .then((res) => {
          const productData = res.data.products;
          productRef.current = productData;
          setProductView([...productData]);

          let prodDepts = [];
          productData.forEach((v) => {
            if (v.Departments.length >= 2) {
              prodDepts.push(v.Departments[1]);
            }
          });
          setIsPageLoading(false);
        })
        .catch((err) => {
          showNotification({
            title: "Error!",
            message:
              "There was an error loading the page. Please try again later",
            color: "red",
          });
          setIsPageLoading(false);
        });
    }
  }, [id]);

  return (
    <Box mt="xl">
      <LoadingOverlay visible={isPageLoading} overlayBlur={100} />
      <ProductView
        mainDeparment={id.split(".")[0]}
        products={productView}
        departments={departments}
        id={null}
        setOpenDeptDrawer={setOpenDeptDrawer}
        isPageLoading={isPageLoading}
      />
    </Box>
  );
}

export default ProductSearch;
