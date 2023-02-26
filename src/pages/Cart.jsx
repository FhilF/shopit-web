import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import CustomImage from "components/CustomImage";
import EmptyCart from "components/EmptyCart";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [opened, setOpened] = useState(true);
  useEffect(() => {
    setIsPageLoading(true);
    axios
      .get(`/api/user/cart`, {
        withCredentials: true,
      })
      .then((res) => {
        setCartItems(res.data.Cart);
        setIsPageLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <Box
        sx={{
          ".mantine-UnstyledButton-root": {
            ":disabled": {
              ":hover": {
                div: {
                  textDecoration: "none",
                },
                cursor: "default",
              },
            },
          },
        }}
      >
        <Text size={26} color="dark.3" mt="xl">
          Shopping Cart
        </Text>
        <Grid
          mt="xl"
          sx={(theme) => ({
            [theme.fn.smallerThan("md")]: {
              position: "relative",
            },
          })}
        >
          <Grid.Col span={12} md={8}>
            {!isPageLoading && cartItems.length > 0 ? (
              <Stack spacing="lg">
                {cartItems.map((v1, i1) => {
                  return (
                    <Paper radius="xs" withBorder p="xl" key={v1._id}>
                      <Box>
                        <Stack>
                          <Box>
                            <Box>
                              <UnstyledButton
                                component="a"
                                className="btn-link-text"
                                href={`/shop/${v1._id}`}
                                disabled={isPageLoading || isFormLoading}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (isPageLoading || isFormLoading)
                                    return true;
                                  navigate(`/shop/${v1._id}`);
                                }}
                              >
                                <Text weight={600} color="dark.3">
                                  {v1.name}
                                </Text>
                              </UnstyledButton>
                            </Box>
                            <Divider mt="sm" />
                            <Stack mt="sm" spacing={4}>
                              {v1.items.map((v2, i2) => {
                                return (
                                  <ShopItem
                                    item={v2}
                                    i1={i1}
                                    i2={i2}
                                    key={
                                      v2.variationId ? v2.variationId : v2._id
                                    }
                                    setCartItems={setCartItems}
                                    cartItems={cartItems}
                                    navigate={navigate}
                                    isFormLoading={
                                      isPageLoading || isFormLoading
                                    }
                                    setIsFormLoading={setIsFormLoading}
                                    isPageLoading={isPageLoading}
                                  />
                                );
                              })}
                            </Stack>
                            <Group position="right" spacing={0} mt="sm">
                              <Text color="dark.4" weight={600}>
                                Total:
                              </Text>

                              <Group
                                position="right"
                                align="flex-start"
                                w={100}
                              >
                                <Text color="dark.4" weight={600}>
                                  {`₱${v1.items.reduce(
                                    (a, b) => a + b.unitPrice * b.qty,
                                    0
                                  )}`}
                                </Text>
                              </Group>
                            </Group>
                          </Box>
                        </Stack>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            ) : (
              <Box
                sx={{
                  height: "70vh",
                }}
              >
                <EmptyCart />
              </Box>
            )}
          </Grid.Col>
          <Grid.Col span={12} md={4}>
            <Box
              sx={(theme) => ({
                display: "flex",
                width: "100%",
                marginTop: 0,
                [theme.fn.smallerThan("md")]: {
                  left: "0",
                  position: "fixed",
                  bottom: "0",
                  right: "0",
                  margin: "0",
                  padding: "0",
                },
              })}
            >
              <Paper
                radius="xs"
                withBorder
                sx={(theme) => ({
                  padding: theme.spacing.xl,
                  width: "100%",
                  [theme.fn.smallerThan("md")]: {
                    padding: theme.spacing.xl,
                    paddingLeft: "12px",
                    paddingRight: "12px",
                  },
                })}
              >
                <Box>
                  <Box>
                    <Text weight={600} color="dark.3">
                      Check Out
                    </Text>
                    <Divider my="sm" />
                  </Box>
                  <Stack spacing={4}>
                    <Box>
                      <Stack>
                        <Flex>
                          <Box sx={{ flex: 1 }}>
                            <Text size="md" weight={600} color="#5e5e5e">
                              Shop
                            </Text>
                          </Box>
                          <Group position="right" align="flex-start" w={70}>
                            <Text size="md" weight={600} color="#5e5e5e">
                              Total
                            </Text>
                          </Group>
                        </Flex>
                      </Stack>
                    </Box>
                    {cartItems.map((v) => {
                      return (
                        <Box key={v._id}>
                          <Stack>
                            <Flex>
                              <Box sx={{ flex: 1 }}>
                                <Text size="sm" color="dark.3">
                                  {`${v.name} - (${v.items.length} item${
                                    v.items.length > 1 ? "s" : ""
                                  })`}
                                </Text>
                              </Box>
                              <Group position="right" align="flex-start" w={70}>
                                <Text
                                  size="sm"
                                  color="dark.3"
                                  weight={600}
                                >{`₱${v.items.reduce(
                                  (a, b) => a + b.unitPrice * b.qty,
                                  0
                                )}`}</Text>
                              </Group>
                            </Flex>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                  <Box mt="xl">
                    <Divider my="sm" />
                    <Group position="right" spacing={0}>
                      <Text color="dark.3" weight={600}>
                        Total:
                      </Text>

                      <Group position="right" align="flex-start" w={100}>
                        <Text color="dark.3" weight={600}>
                          {`₱${cartItems.reduce(
                            (a, b) =>
                              a +
                              b.items.reduce(
                                (c, d) => c + d.unitPrice * d.qty,
                                0
                              ),
                            0
                          )}`}
                        </Text>
                      </Group>
                    </Group>
                  </Box>
                  <Group mt="xl" position="center">
                    <Button
                      color="yellow.8"
                      disabled={
                        isPageLoading || isFormLoading || cartItems.length === 0
                      }
                      component="a"
                      href="/checkout"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/checkout");
                      }}
                    >
                      Proceed to checkout
                    </Button>
                  </Group>
                </Box>
              </Paper>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
}

const ShopItem = ({
  item,
  setCartItems,
  cartItems,
  i1,
  i2,
  navigate,
  isFormLoading,
  setIsFormLoading,
  isPageLoading,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newQty, setNewQty] = useState();

  const update = () => {
    setIsFormLoading(true);
    if (newQty === item.qty) {
      setNewQty(item.qty);
      showNotification({
        title: "No changes made!",
        color: "yellow.8",
      });
      setIsFormLoading(false);
      return true;
    }

    if (newQty === 0) {
      deleteItem();
      return true;
    }

    axios
      .patch(
        item.variationId
          ? `/api/user/cart/${item._id}?qty=${newQty}&variation_id=${item.variationId}`
          : `/api/user/cart/${item._id}?qty=${newQty}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        let newCartItems = [...cartItems];
        newCartItems[i1].items[i2].qty = newQty;
        setCartItems([...newCartItems]);
        setIsUpdating(false);
        showNotification({
          title: "Success!",
          message: "Item Updated.",
          color: "teal",
        });
        setIsFormLoading(false);
      })
      .catch((err) => {
        setIsFormLoading(false);
        if (err.response?.data?.message) {
          showNotification({
            title: "Error!",
            message: err.response?.data?.message,
            color: "red",
          });
        } else {
          showNotification({
            title: "Error!",
            message:
              "There was an error processing your request. Please try again later",
            color: "red",
          });
        }
      });
  };

  const deleteItem = () => {
    setIsFormLoading(true);
    axios
      .delete(
        item.variationId
          ? `/api/user/cart/${item._id}?qty=${newQty}&variation_id=${item.variationId}`
          : `/api/user/cart/${item._id}?qty=${newQty}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        let newCartItems = [...cartItems];
        newCartItems[i1].items.splice(i2, 1);

        if (newCartItems[i1].items.length === 0) {
          newCartItems.splice(i1, 1);
        }
        setCartItems([...newCartItems]);
        setIsUpdating(false);
        showNotification({
          title: "Success!",
          message: "Item Deleted.",
          color: "teal",
        });
        setIsFormLoading(false);
      })
      .catch((err) => {
        setIsFormLoading(false);
        if (err.response?.data?.message) {
          showNotification({
            title: "Error!",
            message: err.response?.data?.message,
            color: "red",
          });
        } else {
          showNotification({
            title: "Error!",
            message:
              "There was an error processing your request. Please try again later",
            color: "red",
          });
        }
      });
  };
  return (
    <Box pt={2}>
      <Flex pb={6}>
        <UnstyledButton
          component="a"
          href={`/product/${item._id}`}
          disabled={isPageLoading || isFormLoading}
          onClick={(e) => {
            e.preventDefault();
            if (isPageLoading || isFormLoading) return true;
            navigate(`/product/${item._id}`);
          }}
        >
          <Box w={90}>
            <CustomImage height={80} width={80} src={item.thumbnail} />
          </Box>
        </UnstyledButton>
        <Box sx={{ flex: 1 }} ml="sm">
          <Flex sx={{ justifyContent: "space-between" }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={0}>
                <UnstyledButton
                  component="a"
                  href={`/product/${item._id}`}
                  disabled={isPageLoading || isFormLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isPageLoading || isFormLoading) return true;
                    navigate(`/product/${item._id}`);
                  }}
                >
                  <Text
                    size={15}
                    color="dark.3"
                    weight={600}
                    sx={{
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      overflow: "hidden",
                      display: "-webkit-box",
                      textOverflow: "ellipsis",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: "1",
                    }}
                  >
                    {item.name}
                  </Text>
                </UnstyledButton>
                <Text
                  size={12}
                  color={item.stock < 10 ? "red.6" : "green.5"}
                  weight={600}
                >
                  {item.stock < 10
                    ? `Only ${item.stock} left in stock - order soon.`
                    : "In Stock"}
                </Text>
                {item.variationName && (
                  <Group spacing={0}>
                    <Text size={13} color="dark.3" weight={700}>
                      {`${item.variationName}:`}
                    </Text>
                    <Text ml={4} size={13} color="dark.3" weight={400}>
                      {`${item.variation} - ₱${item.unitPrice}`}
                    </Text>
                  </Group>
                )}
              </Stack>

              <Group mt={6} spacing="sm">
                <Group spacing={4} align="center">
                  <NumberInput
                    size="xs"
                    w={50}
                    value={newQty ? newQty : item.qty}
                    hideControls
                    max={item.stock}
                    onChange={(v) => {
                      setIsUpdating(true);
                      setNewQty(v);
                    }}
                    disabled={isPageLoading || isFormLoading}
                    // onClick={() => {
                    //   setIsUpdating(true);
                    // }}
                  />
                  {isUpdating && (
                    <Group spacing={0}>
                      <Button
                        size="xs"
                        color={"yellow.8"}
                        disabled={isPageLoading || isFormLoading}
                        onClick={() => {
                          update();
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="subtle"
                        size="xs"
                        color="dark"
                        sx={{ paddingLeft: "8px", paddingRight: "8px" }}
                        disabled={isPageLoading || isFormLoading}
                        onClick={() => {
                          setNewQty(undefined);
                          setIsUpdating(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Group>
                  )}
                </Group>
                <i aria-label="i" role="img">
                  |
                </i>
                <UnstyledButton
                  disabled={isPageLoading || isFormLoading}
                  onClick={() => {
                    deleteItem();
                  }}
                >
                  <Text
                    size={13}
                    color="dark.3"
                    sx={{
                      ":hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Remove
                  </Text>
                </UnstyledButton>
              </Group>
            </Box>
            <Group position="right" w={60} sx={{ alignItems: "flex-start" }}>
              <Text
                weight={600}
                color="dark.3"
                size={14}
                sx={{
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  overflow: "hidden",
                  display: "-webkit-box",
                  textOverflow: "ellipsis",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: "1",
                }}
              >{`₱${item.unitPrice * item.qty}`}</Text>
            </Group>
          </Flex>
        </Box>
      </Flex>
      <Divider mt={4} />
    </Box>
  );
};

export default Cart;
