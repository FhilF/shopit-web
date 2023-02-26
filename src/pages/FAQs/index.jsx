import { Accordion, Box, Flex, Stack, Text } from "@mantine/core";
import React from "react";
import BuyingProduct from "./1-OrderProduct";

function FAQs() {
  return (
    <Box>
      <Flex justify="center">
        <Box
          sx={(theme) => ({
            width: "100%",
            [theme.fn.largerThan("md")]: {
              width: theme.breakpoints.sm,
            },
          })}
        >
          <Stack spacing={0}>
            <Text size={40} color="blueGray.7">
              Tester Guide
            </Text>
            <Text size="sm" color="blueGray.4">
              This page contains the step-by-step procedure for using the Yeti
              E-Commerce Site.
            </Text>
          </Stack>
          <Accordion mt="xl">
            <BuyingProduct />
          </Accordion>
        </Box>
      </Flex>
    </Box>
  );
}

export default FAQs;
