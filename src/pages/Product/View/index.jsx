import { Carousel } from "@mantine/carousel";
import {
  Anchor,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  NumberInput,
  Paper,
  Rating,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconLocation, IconMapPin } from "@tabler/icons";
import axios from "axios";
import CustomImage from "components/CustomImage";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "utils/authProvider";
import { useContentMessage } from "utils/contentMessageProvider";
import ProductInformation from "./ProductInformation";

function ProductView(props) {
  const { setSessionedUserData, sessionedUserData } = useAuth();
  const [product, setProduct] = useState();
  const { id } = useParams();
  const { setErrorType } = useContentMessage();

  useEffect(() => {
    if (id)
      axios
        .get(`/api/product/${id}`)
        .then((res) => {
          const productData = res.data.product;
          console.log(productData);
          setProduct(productData);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            return setErrorType("Item404");
          }
          showNotification({
            title: "Error!",
            message:
              "There was an error processing your request. Please try again later",
            color: "red",
          });
        });
  }, [id]);

  return (
    <Box mt="md">
      <Breadcrumbs>
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
        {product && <Text>{product.name}</Text>}
      </Breadcrumbs>
      <Stack mt="xl">
        <ProductPreview
          product={product}
          id={id}
          setErrorType={setErrorType}
          setSessionedUserData={setSessionedUserData}
          sessionedUserData={sessionedUserData}
        />
        <ProductInformation product={product} />
      </Stack>
    </Box>
  );
}

const ProductPreview = (props) => {
  const { product, id, setErrorType, setSessionedUserData, sessionedUserData } =
    props;

  const [productImages, setProductImages] = useState([]);
  const [productImagePreview, setProductImagePreview] = useState();
  const [productView, setProductView] = useState();
  const [productQty, setProductQty] = useState(1);
  const [productVariation, setProductVariation] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {
    if (product) {
      const images = product.images;
      const thumbnailImage = images.filter((v) => v.isThumbnail === true)[0]
        .fileUrl;
      const galleryImage = images
        .filter((v) => v.isThumbnail === false)
        .map((v) => v.fileUrl);
      setProductView({ isMultipleVariation: product });
      setProductImagePreview(thumbnailImage);
      setProductImages([thumbnailImage, ...galleryImage]);

      if (product.isMultipleVariation) {
        const minPrice = Math.min(
          ...product.variations.map((item) => item.price)
        );
        const maxPrice = Math.max(
          ...product.variations.map((item) => item.price)
        );
        const finalPrice =
          minPrice === maxPrice
            ? minPrice.toString()
            : `${minPrice} - ${maxPrice}`;

        setProductView({
          price: finalPrice,
          qty: product.variations
            .map((item) => item.stock)
            .reduce((prev, next) => prev + next),
          fileUrl: null,
        });
      } else {
        setProductView({
          price: product.price,
          qty: product.stock,
          fileUrl: null,
        });
      }
    }
  }, [product]);

  const addToCart = () => {
    if (!sessionedUserData) {
      return showNotification({
        title: "Sign in first",
        color: "yellow.8",
      });
    }
    setIsFormLoading(true);
    if (product.isMultipleVariation && !productVariation) {
      showNotification({
        title: "Error!",
        message: "No variation inputted",
        color: "red",
      });
      setIsFormLoading(false);
      return true;
    }

    if (productQty === 0) {
      showNotification({
        title: "Error!",
        message: "No quantity inputted",
        color: "red",
      });
      setIsFormLoading(false);
      return true;
    }
    if (!id || !product) {
      setIsFormLoading(false);
      return true;
    }
    const apiUri = product.isMultipleVariation
      ? `/api/user/cart/${id}?qty=${productQty}&variation_id=${productVariation}`
      : `/api/user/cart/${id}?qty=${productQty}`;

    axios
      .post(
        apiUri,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setSessionedUserData((prev) => ({ ...prev, Cart: res.data.Cart }));
        setIsFormLoading(false);
        showNotification({
          title: "Success!",
          message: "Item has been added to your shopping cart.",
          color: "teal",
        });
      })
      .catch((err) => {
        setIsFormLoading(false);
        if (err.response?.data.code === "OSP") {
          return showNotification({
            title: "Error!",
            message: "Cannot add to cart your own shop product!",
            color: "red",
          });
        }
        if (err.response?.status === 404) {
          return setErrorType("Item404");
        }

        if (err.response?.status === 409) {
          return showNotification({
            title: "Error!",
            message:
              "You already have a max quantity of stocks from your cart.",
            color: "red",
          });
        }
        showNotification({
          title: "Error!",
          message:
            "There was an error processing your request. Please try again later",
          color: "red",
        });
      });
  };

  return (
    <Paper radius="xs" withBorder>
      <Box p="xl">
        <Grid>
          <Grid.Col span={12} md={5}>
            <Stack>
              <Box>
                {productImagePreview && (
                  <CustomImage height="400px" src={productImagePreview} />
                )}
              </Box>
              <Box h={85}>
                <Carousel
                  withIndicators
                  slideSize="20%"
                  slideGap="md"
                  height={85}
                  draggable={false}
                  withControls={productImages.length > 5}
                  breakpoints={
                    [
                      // { maxWidth: "md", slideSize: "50%" },
                      // { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
                    ]
                  }
                  loop
                  align="start"
                  sx={{
                    ".mantine-Carousel-slide": {
                      paddingRight: "6px",
                    },
                    ".mantine-Carousel-controls": {
                      paddingLeft: "4px",
                      paddingRight: "4px",
                    },
                  }}
                >
                  {productImages.map((v, i) => {
                    return (
                      <Carousel.Slide key={i}>
                        <Box sx={{ border: "1px solid #e3e3e3" }}>
                          <UnstyledButton
                            onClick={() => setProductImagePreview(v)}
                          >
                            <CustomImage height="80px" src={v} />
                          </UnstyledButton>
                        </Box>
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>
              </Box>
            </Stack>
          </Grid.Col>
          <Grid.Col span={12} md={7}>
            {product && (
              <Box
                sx={(theme) => ({
                  [theme.fn.largerThan("md")]: { marginLeft: "24px" },
                })}
              >
                <Stack spacing={4}>
                  <Text
                    size={22}
                    weight={600}
                    color="blueGray.6"
                    sx={{
                      // minHeight: "40px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      overflow: "hidden",
                      display: "-webkit-box",
                      textOverflow: "ellipsis",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: "2",
                    }}
                  >
                    {product.name}
                  </Text>
                  <Group spacing={4}>
                    <Text size="sm" color="gray.6">
                      {`(${
                        product.Reviews.reduce(
                          (total, next) => total + next.rate,
                          0
                        ) / product.Reviews.length
                      })`}
                    </Text>
                    <Rating
                      readOnly
                      fractions={2}
                      defaultValue={
                        product.Reviews.reduce(
                          (total, next) => total + next.rate,
                          0
                        ) / product.Reviews.length
                      }
                      sx={{
                        cursor: "pointer",
                        ".mantine-Rating-label": {
                          cursor: "pointer !important",
                          svg: { width: "16px", height: "16px" },
                        },
                      }}
                    />
                  </Group>
                </Stack>

                <Divider my="md" />
                {productView && (
                  <>
                    <Stack>
                      <Group spacing={0}>
                        <Box w={90}>
                          <Text size="md" weight={600} color="blueGray.6">
                            Price:
                          </Text>
                        </Box>
                        <Text size={25} weight={600} color="yellow.8">
                          ₱{productView.price}
                        </Text>
                      </Group>
                      {product.variationName && (
                        <Group spacing={0}>
                          <Box w={90}>
                            <Text size="md" weight={600} color="blueGray.6">
                              {product.variationName}
                            </Text>
                          </Box>
                          <Chip.Group
                            position="left"
                            sx={() => ({})}
                            disabled={isFormLoading}
                            value={productVariation}
                            onChange={(v) => {
                              setProductVariation(v);
                            }}
                          >
                            {product.variations.map((v) => {
                              return (
                                <Chip
                                  value={v._id}
                                  key={v._id}
                                  onClick={() => {
                                    setProductView({
                                      price: v.price,
                                      qty: v.stock,
                                      fileUrl: null,
                                    });
                                    setProductImagePreview(v.fileUrl);
                                  }}
                                >
                                  {v.name}
                                </Chip>
                              );
                            })}
                          </Chip.Group>
                        </Group>
                      )}

                      <Group spacing={0}>
                        <Box w={90}>
                          <Text size="md" weight={600} color="blueGray.6">
                            Quantity:
                          </Text>
                        </Box>
                        <NumberInput
                          defaultValue={1}
                          w={100}
                          min={1}
                          max={productView.qty}
                          disabled={isFormLoading}
                          onChange={(v) => {
                            setProductQty(v);
                          }}
                        />
                        <Text size="md" color="dark.4" ml="sm">
                          {`${productView.qty} pieces available`}
                        </Text>
                      </Group>
                    </Stack>

                    <Group mt={50}>
                      <Button
                        size="lg"
                        color="yellow.8"
                        disabled={isFormLoading}
                        onClick={() => {
                          addToCart();
                        }}
                      >
                        Add To Cart
                      </Button>
                    </Group>
                  </>
                )}
              </Box>
            )}
          </Grid.Col>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProductView;
