import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import React from "react";

function Payment(props) {
  const {
    paymentMethods,
    payment,
    setPayment,
    cartItems,
    navigate,
    OrderItem,
  } = props;
  return (
    <Paper radius="xs" withBorder p="xl">
      <Text weight={600} color="dark.3" size="xl">
        Payment
      </Text>
      <Stack mt="md" spacing="sm">
        <Box>
          <Group spacing={"xs"}>
            <Text color="dark.3" size="sm" weight={600}>
              Payment Method:
            </Text>
            <Box
              sx={(theme) => ({
                width: "100%",
                [theme.fn.largerThan("md")]: {
                  width: "300px",
                },
              })}
            >
              <Select
                placeholder="Choose one"
                onSearchChange={setPayment}
                searchValue={payment}
                data={paymentMethods.map((v) => {
                  return {
                    value: v._id,
                    label: v.name,
                    disabled: v.isDisabled,
                  };
                })}
              />
            </Box>
          </Group>
        </Box>
        <Box>
          <Divider my="xl" />
          <Group
            sx={(theme) => ({
              ".inner": {
                width: "100%",
              },
              [theme.fn.largerThan("md")]: {
                justifyContent: "flex-end",
                ".inner": {
                  width: "50%",
                },
              },
            })}
          >
            <Box className="inner">
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
                            >{`₱${v.items
                              .reduce((a, b) => a + b.unitPrice * b.qty, 0)
                              .toLocaleString()}`}</Text>
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
                    <Text color="yellow.8" weight={600}>
                      {`₱${cartItems
                        .reduce(
                          (a, b) =>
                            a +
                            b.items.reduce(
                              (c, d) => c + d.unitPrice * d.qty,
                              0
                            ),
                          0
                        )
                        .toLocaleString()}`}
                    </Text>
                  </Group>
                </Group>
              </Box>
              <Group mt="xl" spacing={0} position="right">
                <Button
                  variant="subtle"
                  color="dark.3"
                  onClick={() => navigate("/cart")}
                >
                  Cancel
                </Button>
                <Button
                  color="yellow.8"
                  onClick={() => {
                    OrderItem();
                  }}
                >
                  Place Order
                </Button>
              </Group>
            </Box>
          </Group>
        </Box>
      </Stack>
    </Paper>
  );
}

export default Payment;
