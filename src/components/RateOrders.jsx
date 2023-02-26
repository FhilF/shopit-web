import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  Rating,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { reviewSchema } from "utils/Schema/ReviewSchema";
import CustomImage from "./CustomImage - Copy";
import EmptyOrder from "./Empty/EmptyOrder";
import EmptyForReview from "./Empty/EmptyForReview";
import _ from "lodash";

function RateOrders(props) {
  const { openRate, setOpenRate, orders, orderId, setOrder } = props;

  const [isFormLoading, setIsFormLoading] = useState(false);

  const [existingReviews, setExistingReviews] = useState([]);

  const form = useForm({
    initialValues: {
      reviews: [],
    },
    validate: zodResolver(reviewSchema),
  });

  useEffect(() => {
    const forReview = [];
    orders.forEach((v) => {
      if (!v.isRated)
        forReview.push({
          name: v.name,
          variationName: v.variationName,
          variation: v.variation,
          thumbnail: v.thumbnail,
          variationId: v.variationId,
          _id: v._id,
          rate: 0,
          comment: "",
        });
    });

    form.setValues({ reviews: forReview });
  }, [orders]);

  const submit = () => {
    setIsFormLoading(true);
    let newRate = [];
    let rateIndex = [];
    let incompleteForm = [];
    if (form.validate().hasErrors) return setIsFormLoading(false);

    form.values.reviews.forEach((v, i) => {
      if (v.comment && v.rate === 0) {
        incompleteForm.push([i, "rate"]);
      }
      if (!v.comment && v.rate > 0) {
        incompleteForm.push([i, "comment"]);
      }

      if (v.comment && v.rate > 0) {
        newRate.push({
          _id: v._id,
          variationId: v.variationId,
          comment: v.comment,
          rate: v.rate,
        });
      }
    });
    if (incompleteForm.length > 0) {
      incompleteForm.forEach((v) => {
        form.setFieldError(
          `reviews.${v[0]}.${v[1]}`,
          "Review Incomplete. If not for review, leave field empty."
        );
      });
      return setIsFormLoading(false);
    }

    if (newRate.length === 0) {
      showNotification({
        title: "No review submitted!",
        color: "yellow.8",
      });
      return setIsFormLoading(false);
    }

    axios
      .post(
        `api/user/order/review/${orderId}`,
        { reviews: newRate },
        { withCredentials: true }
      )
      .then((res) => {
        const newOrders = [...orders];
        newOrders.forEach((v1, i) => {
          const item = newRate.find(
            (v2) => v1._id === v2._id && v1.variationId === v2.variationId
          );
          if (item) {
            newOrders[i].isRated = true;
            newOrders[i].review = { comment: item.comment, rate: item.rate };
          }
        });
        setOrder((prevState) => ({
          ...prevState,
          Shop: { ...prevState.Shop, Orders: newOrders },
        }));

        showNotification({
          title: "Success!",
          message: "Your reviews has been submitted.",
          color: "teal",
        });
        setOpenRate(false);
        setIsFormLoading(false);
      })
      .catch((err) => {
        showNotification({
          title: "Error!",
          message:
            "There was a problem submitting your requrest. Try again later.",
          color: "red",
        });
        setIsFormLoading(false);
      });
  };

  return (
    <Modal
      lockScroll={false}
      opened={openRate}
      onClose={() => setOpenRate(false)}
      title={
        <Text color="blueGray.6" weight={600}>
          Review Products
        </Text>
      }
      size="lg"
    >
      <ScrollArea.Autosize maxHeight={540}>
        <Stack pr={15}>
          {form.values.reviews.length > 0 ? (
            form.values.reviews.map((v, i) => {
              return (
                <Stack spacing="sm" key={v.variationId ? v.variationId : v._id}>
                  <Flex>
                    <Box w={60}>
                      <CustomImage height={60} width={60} src={v.thumbnail} />
                    </Box>
                    <Stack spacing={1} ml="md" sx={{ width: "100%" }}>
                      <Text
                        size={15}
                        color="dark.3"
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
                        {v.name}
                      </Text>
                      {v.variationName && (
                        <Group spacing={0}>
                          <Text size={13} color="dark.3" weight={700}>
                            {`${v.variationName}:`}
                          </Text>
                          <Text ml={4} size={13} color="dark.3" weight={400}>
                            {`${v.variation}`}
                          </Text>
                        </Group>
                      )}
                    </Stack>
                  </Flex>

                  <Group position="apart">
                    <Stack spacing={2}>
                      <Group>
                        <Text size="sm" color="blueGray.4" weight={600}>
                          Product Quality:
                        </Text>
                        <Rating
                          {...form.getInputProps(`reviews.${i}.rate`)}
                          readOnly={isFormLoading}
                        />
                      </Group>
                      <NumberInput
                        sx={{ ".mantine-Input-wrapper": { display: "none" } }}
                        {...form.getInputProps(`reviews.${i}.rate`)}
                      />
                    </Stack>

                    <UnstyledButton
                      sx={{
                        ":hover": {
                          div: {
                            textDecoration: "underline",
                          },
                        },
                      }}
                      onClick={() => {
                        form.setFieldValue(`reviews.${i}.rate`, 0);
                        form.setFieldValue(`reviews.${i}.comment`, "");
                        form.clearFieldError(`reviews.${i}.rate`);
                        form.clearFieldError(`reviews.${i}.comment`);
                      }}
                      disabled={isFormLoading}
                    >
                      <Text color="blueGray.4" size="sm">
                        Reset
                      </Text>
                    </UnstyledButton>
                  </Group>

                  <Textarea
                    autosize={false}
                    minRows={4}
                    disabled={isFormLoading}
                    {...form.getInputProps(`reviews.${i}.comment`)}
                  />
                </Stack>
              );
            })
          ) : (
            <EmptyForReview />
          )}
        </Stack>
      </ScrollArea.Autosize>

      <Group position="apart" mt="xl" pr={15}>
        <Group spacing={4}>
          <Text color="blueGray.4" size="sm" weight={600}>
            Note:
          </Text>
          <Text color="blueGray.4" size="sm">
            Leave field empty if not for review.
          </Text>
        </Group>

        <Group
          spacing={0}
          sx={(theme) => ({
            justifyContent: "flex-end",
            width: "100%",
            [theme.fn.largerThan("xs")]: {
              width: "auto",
            },
          })}
        >
          <Button
            variant="subtle"
            color="blueGray.6"
            disabled={isFormLoading}
            onClick={() => {
              setOpenRate(false);
            }}
          >
            Cancel
          </Button>
          {form.values.reviews.length > 0 && (
            <Button
              color="yellow.8"
              disabled={isFormLoading}
              onClick={() => {
                submit();
              }}
            >
              Submit
            </Button>
          )}
        </Group>
      </Group>
    </Modal>
  );
}

export default RateOrders;
