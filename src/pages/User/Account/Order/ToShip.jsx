import { Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import List from "components/OrderList";
import _ from "lodash";
import EmptyOrder from "components/Empty/EmptyOrder";

function ToShip(props) {
  const {
    toShipList,
    setToShipList,
    setCancelledList,
    navigate,
    isFormLoading,
    setIsFormLoading,
  } = props;

  //   const openCancelDialog = (id) => {
  //     id.current = id;
  //     setOpenCancel(true);
  //   };

  return (
    <>
      <Box mt="lg">
        {toShipList.length > 0 ? (
          <List
            list={toShipList}
            navigate={navigate}
            isFormLoading={isFormLoading}
            setIsFormLoading={setIsFormLoading}
          />
        ) : (
          <EmptyOrder />
        )}
      </Box>
    </>
  );
}

export default ToShip;
