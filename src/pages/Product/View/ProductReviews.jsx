import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  Rating,
  Stack,
  Text,
} from "@mantine/core";
import EmptyReview from "components/Empty/EmptyReview";
import React, { useEffect, useState } from "react";
import moment from "moment/moment";

function ProductReviews({ product }) {

  return (
    <Paper radius="xs" withBorder p="xl" pb={40}>
      <Stack>
        <Group position="apart">
          <Box
            sx={(theme) => ({
              marginBottom: "30px",
              [theme.fn.largerThan("md")]: {},
            })}
          >
            <Text size={18} weight={500} color="blueGray.6">
              Reviews
            </Text>
            <Divider
              size="sm"
              mt="sm"
              sx={(theme) => ({
                width: "140px",
              })}
            />
          </Box>
        </Group>
        {product &&
          (product.Reviews.length > 0 ? (
            [...product.Reviews].reverse().map((v) => {
              return <Review item={v} key={v._id} />;
            })
          ) : (
            <EmptyReview />
          ))}
      </Stack>
    </Paper>
  );
}

const Review = ({ item }) => {
  return (
    <Stack>
      <Flex>
        <Avatar color="yellow.9" radius="xl" size={46} src={item.avatarUrl}>
          {item.username.charAt(0).toUpperCase()}
        </Avatar>

        <Stack spacing={4} ml="sm" sx={{ flex: 1 }}>
          <Text size={12} color="blueGray.6" weight={600} sx={{}}>
            {item.username}
          </Text>
          <Rating readOnly value={item.rate} size={12} />
          {item.variationName && (
            <Group spacing={0}>
              <Text size={12} color="blueGray.4" weight={700}>
                {`${item.variationName}:`}
              </Text>
              <Text ml={4} size={12} color="dark.3" weight={400}>
                {`${item.variation}`}
              </Text>
            </Group>
          )}

          <Text size={13} color="blueGray.6">
            {item.comment}
          </Text>

          <Text size={12} color="blueGray.4">
            {moment(item.createdAt).format("MM/DD/YYYY, hh:mm")}
          </Text>
        </Stack>
      </Flex>
      <Divider />
    </Stack>
  );
};

export default ProductReviews;
