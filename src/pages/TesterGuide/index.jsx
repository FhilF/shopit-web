import { Box, Flex, Stack, Text } from "@mantine/core";
import React from "react";

function TesterGuide() {
  return (
    <Box>
      <Flex
        sx={() => ({
          ".menu": {
            width: "300px",
            ".menu-inner": {
              marginTop: "10vh",
            },
          },
          ".content": {
            flex: 1,
          },
        })}
      >
        <Box className="menu">
          <Box>
            <Stack className="menu-inner">
              <Text weight={600} color="blueGray.7">
                Steps
              </Text>
            </Stack>
          </Box>
        </Box>
        <Box className="content">
          <Box>
            <Stack spacing={0}>
              <Text size={40} color="blueGray.7">Tester Guide</Text>
              <Text size="sm" color="blueGray.4">
                This page contains the step-by-step procedure for using the Yeti
                E-Commerce Site.
              </Text>
            </Stack>
            <Stack></Stack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default TesterGuide;
