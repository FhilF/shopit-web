import { Box, Button, Flex, Text } from "@mantine/core";
import { IconLayoutList } from "@tabler/icons";
import React from "react";

function EmptyProductSearchByDept({ setOpenDeptDrawer }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Flex align="center" sx={{ flexDirection: "column", marginTop: "10vh" }}>
        <IconLayoutList
          size="200"
          color="#CBD5E1"
          style={{ strokeWidth: 0.3 }}
        />
        <Text color="blueGray.3" size="lg" weight={600}>
          No products available
        </Text>
        {setOpenDeptDrawer && (
          <Button
            color="yellow.8"
            radius="md"
            mt="md"
            onClick={() => {
              setOpenDeptDrawer(true);
            }}
          >
            Show Departments
          </Button>
        )}
      </Flex>
    </Box>
  );
}

export default EmptyProductSearchByDept;
