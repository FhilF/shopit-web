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
  Radio,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import CustomImage from "components/CustomImage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Address from "./Address";
import Payment from "./Payment";
import { useAuth } from "utils/authProvider";

function Cart() {
  const navigate = useNavigate();

  const { sessionedUserData, setSessionedUserData } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [opened, setOpened] = useState(true);
  const [address, setAddress] = useState();
  const [payment, setPayment] = useState();

  useEffect(() => {
    axios
      .get(`/api/user/cart`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.Cart.length === 0) {
          navigate("/cart");
          return true;
        }
        setCartItems(res.data.Cart);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/api/user/address`, {
        withCredentials: true,
      })
      .then((res) => {
        const addressData = res.data.Addresses;
        setAddresses(addressData);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/api/payment_method`, {
        withCredentials: true,
      })
      .then((res) => {
        const paymentMethodData = res.data.PaymentMethods;
        const data = paymentMethodData.filter(
          (v) => v.name === "Cash On Delivery"
        );
        if (data.length > 0) {
          setPayment(data[0].name);
        }
        setPaymentMethods(paymentMethodData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const OrderItem = () => {
    const paymentId = paymentMethods.filter((v) => v.name === payment)[0]?._id;
    if (cartItems.length === 0) {
      return showNotification({
        title: "Cart is empty!",
        color: "red",
      });
    }

    if (!address) {
      return showNotification({
        title: "Address not filled!",
        color: "red",
      });
    }
    axios
      .post(
        `/api/user/order?address=${address}&payment_method=${paymentId}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setSessionedUserData((v) => {
          return { ...v, Cart: [] };
        });
        navigate("/cart");
        showNotification({
          title: "Success!",
          message: "Order submitted.",
          color: "teal",
        });
      })
      .catch((err) => {
        console.log(err);
        showNotification({
          title: "Error!",
          message:
            "There was an error processing your request. Please try again later",
          color: "red",
        });
      });
  };

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.filter((v) => v.isDefault)[0];
      setAddress(defaultAddress._id);
    }
  }, [addresses]);

  return (
    <>
      <Box>
        <Text size={26} color="dark.3" mt="xl">
          Checkout
        </Text>
        <Stack mt="xl">
          <Address
            address={address}
            setAddress={setAddress}
            addresses={addresses}
            setAddresses={setAddresses}
            sessionedUserData={sessionedUserData}
            setSessionedUserData={setSessionedUserData}
          />
          <Stack
            spacing="xs"
            sx={{
              ".item-right": {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              },
            }}
          >
            {cartItems.map((v1, i1) => {
              return (
                <Paper radius="xs" withBorder p="xl" key={v1._id}>
                  <Box>
                    {i1 === 0 && (
                      <Grid>
                        <Grid.Col
                          span={6}
                          md={9}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Text weight={600} color="dark.3" size="xl">
                            Products Ordered
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={2} md={1} className="item-right">
                          <Text size="sm" color="#7e7e7e" weight={600}>
                            Unit Price
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={2} md={1} className="item-right">
                          <Text size="sm" color="#7e7e7e" weight={600}>
                            Quantity
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={2} md={1} className="item-right">
                          <Text size="sm" color="#7e7e7e" weight={600}>
                            Item Total
                          </Text>
                        </Grid.Col>
                      </Grid>
                    )}

                    <Stack mt={i1 === 0 && "xl"}>
                      <Box>
                        <Box>
                          <Text weight={600} color="dark.3">
                            {v1.name}
                          </Text>
                        </Box>
                        <Stack mt="sm" spacing={4}>
                          {v1.items.map((v2, i2) => {
                            return (
                              <ShopItem
                                item={v2}
                                i1={i1}
                                i2={i2}
                                key={v2.variationId ? v2.variationId : v2._id}
                                setCartItems={setCartItems}
                                cartItems={cartItems}
                                navigate={navigate}
                                isFormLoading={isFormLoading}
                                setIsFormLoading={setIsFormLoading}
                              />
                            );
                          })}
                        </Stack>
                        <Group position="right" spacing={0} mt="sm">
                          <Text color="dark.4" weight={600}>
                            Total:
                          </Text>

                          <Group position="right" align="flex-start" w={100}>
                            <Text color="yellow.8" weight={600}>
                              {`₱${v1.items
                                .reduce((a, b) => a + b.unitPrice * b.qty, 0)
                                .toLocaleString()}`}
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

          <Payment
            paymentMethods={paymentMethods}
            payment={payment}
            setPayment={setPayment}
            cartItems={cartItems}
            navigate={navigate}
            OrderItem={OrderItem}
          />
        </Stack>
      </Box>
    </>
  );
}

const ShopItem = ({ item }) => {
  return (
    <Box>
      <Box sx={{ flex: 1 }}>
        <Grid>
          <Grid.Col span={6} md={9}>
            <Flex pb={6} align="center">
              <Box w={60}>
                <CustomImage height={60} width={60} src={item.thumbnail} />
              </Box>
              <Stack spacing={1} ml="md">
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
                {item.variationName && (
                  <Group spacing={0}>
                    <Text size={13} color="dark.3" weight={700}>
                      {`${item.variationName}:`}
                    </Text>
                    <Text ml={4} size={13} color="dark.3" weight={400}>
                      {`${item.variation}`}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Flex>
          </Grid.Col>
          <Grid.Col span={2} md={1} className="item-right">
            <Text
              size="sm"
              color="dark.4"
              weight={600}
            >{`₱${item.unitPrice.toLocaleString()}`}</Text>
          </Grid.Col>
          <Grid.Col span={2} md={1} className="item-right">
            <Text size="sm" color="dark.4" weight={600}>
              {item.qty}
            </Text>
          </Grid.Col>
          <Grid.Col span={2} md={1} className="item-right">
            <Text size="sm" color="dark.4" weight={600}>{`₱${(
              item.unitPrice * item.qty
            ).toLocaleString()}`}</Text>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};

export default Cart;
