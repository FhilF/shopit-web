import { Accordion, Box, Stack, Text } from "@mantine/core";
import React from "react";

function BuyingProduct() {
  return (
    <Accordion.Item value="customization">
      <Accordion.Control>
        <Text weight={600} color="blueGray.6">
          Ordering Product
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack spacing="xs">
          <Box>
            <Text size="sm" color="blueGray.5" weight={600}>
              Step 1:
            </Text>
            <Text size="sm" color="blueGray.5">
              Sign in to your account first.
            </Text>
          </Box>

          <Box>
            <Text size="sm" color="blueGray.5" weight={600}>
              Step 2:
            </Text>
            <Text size="sm" color="blueGray.5">
              Choose a department you want to check to show you a list of
              products. (Note: Some departments might have no products. For
              quicker testing, you can choose the "Computer & Accessories"
              Department)
            </Text>
          </Box>

          <Box>
            <Text size="sm" color="blueGray.5" weight={600}>
              Step 3:
            </Text>
            <Text size="sm" color="blueGray.5">
              Click any item to view the product. Add product to cart to display
              it in your cart.
            </Text>
          </Box>
          <Box>
            <Text size="sm" color="blueGray.5" weight={600}>
              Step 4:
            </Text>
            <Text size="sm" color="blueGray.5">
              Click the shopping cart icon to navigate to your cart. Then
              Proceed to checkout.
            </Text>
          </Box>

          <Box>
            <Text size="sm" color="blueGray.5" weight={600}>
              Step 5:
            </Text>
            <Text size="sm" color="blueGray.5">
              Fill up the address. (Note: Your address will be saved and can be
              used the next time you check out). Then place your order.
            </Text>
          </Box>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default BuyingProduct;
