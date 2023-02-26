import { Button, Divider, Group } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { useState } from "react";
import { listType } from "utils/helper";
import ConfirmDialog from "../ConfirmDialog";

function OrderAction({ order, setOrder }) {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const confirmCancel = () => {
    setIsFormLoading(true);
    axios
      .post(`api/user/order/${order._id}/cancel`, {}, { withCredentials: true })
      .then((res) => {
        setOpenCancel(false);
        setOrder(res.data.Order);
        showNotification({
          title: "Success!",
          message: "Order successfully cancelled.",
          color: "teal",
        });
        setIsFormLoading(false);
      })
      .catch((err) => {
        setOpenCancel(false);
        showNotification({
          title: "Error!",
          message:
            "There was an error processing your request. Please try again later",
          color: "red",
        });
      });
  };
  return (
    <>
      <Divider />
      {order.isCancelled || order.isAccepted || order.isDelivered ? (
        <></>
      ) : (
        <Group spacing={0} position="right">
          <Button
            size="xs"
            px="xs"
            color="dark.4"
            variant="outline"
            disabled={isFormLoading}
            onClick={() => {
              setOpenCancel(true);
            }}
          >
            Cancel Order
          </Button>
        </Group>
      )}
      <ConfirmDialog
        dialogType={1}
        open={openCancel}
        setOpen={setOpenCancel}
        confirmAction={confirmCancel}
        isFormLoading={isFormLoading}
      />
    </>
  );
}

export default OrderAction;
