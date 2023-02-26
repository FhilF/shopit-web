import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconList, IconMapPin } from "@tabler/icons";
import axios from "axios";
import ProductCard from "components/Product/ProductCard";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useContentMessage } from "utils/contentMessageProvider";
import ProductView from "components/Product/ProductView";

function ShopView() {
  const { id } = useParams();
  const { setErrorType } = useContentMessage();

  const [shop, setShop] = useState();

  useEffect(() => {
    if (id) {
      // const deptSearch = search.get("dept-id");
      axios
        .get(`/api/shop/${id}/get-shop-info`)
        .then((res) => {
          const shopData = res.data.Shop;
          setShop(shopData);
          // if (deptSearch) {
          //   const filteredProducts = shopData.Products.filter((v1) =>
          //     v1.Departments.some((dept) => dept._id === deptSearch)
          //   );
          //   setProducts([...filteredProducts]);
          // } else {
          //   setProducts([...shopData.Products]);
          // }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            return setErrorType("Item404");
          }
          console.log(err);
        });
    }
  }, [id]);
  return (
    <Box>
      <Stack spacing="lg">
        <Paper radius="xs" withBorder p="xl" mt="xl">
          <Grid>
            <Grid.Col span={6}>
              <Box>
                <Flex align="center">
                  <Box
                    sx={{
                      display: "inline-block",
                      borderRadius: "50%",
                      cursor: "pointer",
                      border: "2px solid #e7e7e7",
                    }}
                  >
                    <Avatar
                      src={shop && shop.imageUrl}
                      size={80}
                      alt="prev-shop-logo"
                      sx={(theme) => ({
                        borderRadius: "50%",
                        ".mantine-Avatar-placeholder": {
                          backgroundColor: theme.colors.gray[3],
                        },
                      })}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }} ml="md">
                    {shop && (
                      <Stack spacing={4}>
                        <Text size="lg" weight={600} color="dark.3">
                          {shop.name}
                        </Text>
                        <Text size="xs" color="#a1a1a1">
                          <Flex>
                            <span>
                              <IconMapPin size={18} />
                            </span>
                            {`${shop.address.city}, ${shop.address.province}`}
                          </Flex>
                        </Text>
                      </Stack>
                    )}
                  </Box>
                </Flex>
              </Box>
            </Grid.Col>
            <Grid.Col span={6}></Grid.Col>
          </Grid>
        </Paper>
        <Box>
          <ProductView
            departments={shop && shop.Departments}
            products={shop && shop.Products}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default ShopView;
