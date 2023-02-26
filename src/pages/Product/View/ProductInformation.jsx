import {
  Anchor,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Flex,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconMapPin } from "@tabler/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import ProductReviews from "./ProductReviews";

function ProductInformation(props) {
  const { product } = props;
  const navigate = useNavigate();
  return (
    <Flex
      sx={(theme) => ({
        ".product-spec": {
          flex: 1,
          marginRight: "16px",
        },
        ".shop-profile": { width: "220px" },

        [theme.fn.smallerThan("md")]: {
          flexDirection: "column-reverse",
          ".product-spec": {
            width: "100%",
            margin: 0,
            marginTop: "16px",
          },
          ".shop-profile": {
            width: "100%",
          },
        },
      })}
    >
      <Box sx={{ flex: 1 }} className="product-spec">
        <Stack>
          <Paper radius="xs" withBorder p="xl">
            {product && (
              <Box>
                <Box
                  sx={(theme) => ({
                    marginBottom: "30px",
                    [theme.fn.largerThan("md")]: {},
                  })}
                >
                  <Text size={18} weight={500} color="blueGray.6">
                    Product Specification
                  </Text>
                  <Divider
                    size="sm"
                    mt="sm"
                    sx={(theme) => ({
                      width: "140px",
                    })}
                  />
                </Box>

                <Stack mt="xl" spacing="xs">
                  <Flex align="center">
                    <Box w={180}>
                      <Text color="#999999">Department:</Text>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Breadcrumbs separator=">">
                        {product &&
                          product.Departments.map((v) => {
                            return (
                              <Anchor
                                key={v._id}
                                href={`/product/department?id=${v._id}`}
                                target="_blank"
                              >
                                {v.name}
                              </Anchor>
                            );
                          })}
                      </Breadcrumbs>
                    </Box>
                  </Flex>
                  {product.specifications.map((v) => {
                    return (
                      <Flex align="center" key={v._id}>
                        <Box w={180}>
                          <Text color="#999999">{`${v.label}:`}</Text>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Text weight={600} color="dark.3">
                            {v.value}
                          </Text>
                        </Box>
                      </Flex>
                    );
                  })}
                  <Flex align="center">
                    <Box w={180}>
                      <Text color="#999999">Ships From:</Text>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Text weight={600} color="dark.3">
                        {`${product.Shop.address.city}, ${product.Shop.address.province}`}
                      </Text>
                    </Box>
                  </Flex>
                </Stack>
                <Box mt={40}>
                  <Box
                    sx={(theme) => ({
                      marginBottom: "30px",
                      [theme.fn.largerThan("md")]: {},
                    })}
                  >
                    <Text size={18} weight={500} color="blueGray.6">
                      Product Description
                    </Text>
                    <Divider
                      size="sm"
                      mt="sm"
                      sx={(theme) => ({
                        width: "140px",
                      })}
                    />
                  </Box>
                  <Box>
                    <Text color="#999999">{product.description}</Text>
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
          <ProductReviews product={product} />
        </Stack>
      </Box>
      <Box className="shop-profile">
        <Paper radius="xs" withBorder>
          {product && (
            <Stack spacing={8} pt="xl" pb="md" px="sm">
              <Flex>
                <Box>
                  <UnstyledButton
                    sx={{
                      display: "inline-block",
                      borderRadius: "50%",
                      cursor: "pointer",
                      border: "2px solid #e7e7e7",
                    }}
                    component="a"
                    href={`/shop/${product.Shop._id}`}
                  >
                    <Avatar
                      src={product.Shop.imageUrl}
                      size={36}
                      alt="prev-shop-logo"
                      sx={(theme) => ({
                        borderRadius: "50%",
                        ".mantine-Avatar-placeholder": {
                          backgroundColor: theme.colors.gray[3],
                        },
                      })}
                    />
                  </UnstyledButton>
                </Box>
                <Stack spacing={4} sx={{ flex: 1 }} ml={4}>
                  <Text size={13} weight={600}>
                    {product.Shop.name}
                  </Text>
                  <Text size="xs" color="#a1a1a1">
                    <Flex>
                      <span>
                        <IconMapPin size={18} />
                      </span>
                      {`${product.Shop.address.city}, ${product.Shop.address.province}`}
                    </Flex>
                  </Text>
                </Stack>
              </Flex>

              <Flex justify="center">
                <Button
                  variant="outline"
                  color="yellow.8"
                  component="a"
                  size="xs"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/shop/${product.Shop._id}`);
                  }}
                  href={`/shop/${product.Shop._id}`}
                >
                  View Shop
                </Button>
              </Flex>
            </Stack>
          )}
        </Paper>
      </Box>
    </Flex>
  );
}

export default ProductInformation;
