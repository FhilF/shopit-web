import { Box, Image, Text } from "@mantine/core";
import React from "react";
import EmptyCartImage from "assets/images/cart-empty.png";

function EmptyCart() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        marginTop:"100px"
      }}
    >
      <Image width={160} src={EmptyCartImage} />
      <Text weight={600} color="dark.3" size={26} mt={26}>
        Your cart is empty.
      </Text>
    </Box>
  );
}

export default EmptyCart;
