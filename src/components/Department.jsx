import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  Text,
  UnstyledButton,
} from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";

function Department(props) {
  const { item } = props;
  const navigate = useNavigate();
  return (
    <UnstyledButton
      sx={(theme) => ({
        width: "12%",
        [theme.fn.smallerThan("sm")]: { width: "100%" },
        [theme.fn.largerThan("xl")]: { width: "13%" },
      })}
      component="a"
      href={`/product/department/${item.name
        .replace(/\s+/g, "-")
        .toLowerCase()}.${item._id}`}
      onClick={(e) => {
        e.preventDefault();
        navigate(
          `/product/department/${item.name
            .replace(/\s+/g, "-")
            .toLowerCase()}.${item._id}`
        );
      }}
    >
      <Flex
        gap={6}
        justify="flex-start"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <Avatar src={item.imageUrl} size={70} />
        <Text size="sm" color="dark.4" align="center">
          {item.name}
        </Text>
      </Flex>
    </UnstyledButton>
  );
}

export default Department;
