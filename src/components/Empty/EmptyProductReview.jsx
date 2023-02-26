import { Box, Flex, Stack, Text } from "@mantine/core";
import { IconClipboard, IconClipboardList } from "@tabler/icons";
import React from "react";

function EmptyProductReview() {
  return (
    <Flex align="center" sx={{ flexDirection: "column" }}>
      <Text color="blueGray.4" size="sm">
        You haven't added a review to your order/s.
      </Text>
    </Flex>
  );
}

export default EmptyProductReview;
