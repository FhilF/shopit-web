import { Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import List from "components/OrderList";
import _ from "lodash";
import EmptyOrder from "components/Empty/EmptyOrder";

function Pending(props) {
  const { pendingList, setPendingList, setToShipList, setCancelledList, navigate,isFormLoading, setIsFormLoading } =
    props;
  const [openCancel, setOpenCancel] = useState(false);
  const idRef = useRef();

  const confirmCancel = () => {
    axios
      .post(
        `api/user/order/${idRef.current}/cancel`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        setCancelledList((prevElem) => [...prevElem, res.data.Order]);
        setPendingList((prevElem) => [
          ..._.reject(prevElem, function (v) {
            return v._id === idRef.current;
          }),
        ]);
        setOpenCancel(false);
        showNotification({
          title: "Success!",
          message: "Order successfully cancelled.",
          color: "teal",
        });
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
      <Box mt="lg">
        {pendingList.length > 0 ? (
          <List
            list={pendingList}
            setOpenCancel={setOpenCancel}
            idRef={idRef}
            navigate={navigate}
            isFormLoading={isFormLoading}
            setIsFormLoading={setIsFormLoading}
          />
        ) : (
          <EmptyOrder />
        )}
      </Box>
      <ConfirmDialog
        dialogType={1}
        open={openCancel}
        setOpen={setOpenCancel}
        confirmAction={confirmCancel}
      />
    </>
  );
}

export default Pending;
