import { Box, Flex, Stack, Text } from "@mantine/core";
import { IconClipboard, IconClipboardList } from "@tabler/icons";
import React from "react";

function EmptyForReview() {
  return (
    <Flex align="center" sx={{ flexDirection: "column" }}>
      <IconClipboardList
        size="160"
        color="#CBD5E1"
        style={{ strokeWidth: 0.3 }}
      />
      <Text color="blueGray.4" size="md" >
        You have already reviewed all your orders.
      </Text>
      <Text color="blueGray.5" size="xs">
        Thank you for helping out the community by giving reviews to products!
      </Text>
    </Flex>
  );
}

export default EmptyForReview;
