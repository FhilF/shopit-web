import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Rating,
  Stack,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons";
import EmptyReview from "components/Empty/EmptyReview";
import React, { useEffect, useState } from "react";

function Reviews({ setOpenRate, order }) {
  const [orderList, setOrderList] = useState([]);
  useEffect(() => {
    if (order) {
      const ordersWithReviews = [];
      order.Shop.Orders.forEach((v) => {
        if (v.isRated) {
          ordersWithReviews.push(v);
        }
      });
      setOrderList(ordersWithReviews);
    }
    // setOrderList()
  }, [order]);

  return (
    <Box>
      <Stack>
        <Group position="apart" mb="xl">
          <Box>
            <Text weight={600} color="blueGray.6">
              Your Review
            </Text>
            <Divider
              size="sm"
              sx={(theme) => ({
                width: "100px",
                marginTop: "16px",
              })}
            />
          </Box>
          <Button
            size="xs"
            color="yellow.8"
            onClick={() => {
              setOpenRate(true);
            }}
          >
            Review Order
          </Button>
        </Group>
        {orderList.length > 0 ? (
          orderList.map((v) => {
            return (
              <Review item={v} key={v.variationId ? v.variationId : v._id} />
            );
          })
        ) : (
          <EmptyReview />
        )}
      </Stack>
    </Box>
  );
}

const edit = () => {
  showNotification({
    title: "This feature is not yet available!",
    color: "yellow.8",
  });
};

const Review = ({ item }) => {
  console.log(item);
  return (
    <Group position="apart">
      <Stack spacing={4}>
        <Rating readOnly value={item.review.rate} size="xs" />
        <Text
          size={12}
          color="blueGray.5"
          weight={600}
          sx={{
            wordWrap: "break-word",
            whiteSpace: "normal",
            overflow: "hidden",
            display: "-webkit-box",
            textOverflow: "ellipsis",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "1",
          }}
        >
          {item.name}
        </Text>
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
        <Text size={13} color="blueGray.4">
          {item.review.comment}
        </Text>
        <Divider />
      </Stack>
      <ActionIcon
        size="sm"
        color="yellow.8"
        onClick={() => {
          edit();
        }}
      >
        <IconPencil />
      </ActionIcon>
    </Group>
  );
};

export default Reviews;
