import {
  Box,
  Button,
  Grid,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconPencil,
  IconToggleRight,
  IconTrash,
} from "@tabler/icons";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import AddDialog from "components/AddAddressDialog";
import { showNotification } from "@mantine/notifications";
import { useAuth } from "utils/authProvider";

function Address(props) {
  const { sessionedUserData, setSessionedUserData } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [addressEdit, setAddressEdit] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const updateFieldsRef = useRef(false);

  const saveDefaultAddress = (id) => {
    setIsFormLoading(true);
    axios
      .patch(
        `api/user/address/${id}/default`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setSessionedUserData({
          ...sessionedUserData,
          Addresses: res.data.Addresses,
        });
        showNotification({
          title: "Success!",
          message: "Successfully updated your address.",
          color: "teal",
        });
        setIsFormLoading(false);
      })
      .catch((err) => {
        showNotification({
          title: "Error!",
          message:
            "There was an error processing your request. Please try again later.",
          color: "red",
        });
        setIsFormLoading(false);
      });
  };

  const deleteAddress = (id, isDefault) => {
    setIsFormLoading(true);
    if (isDefault) {
      showNotification({
        title: "Action not available!",
        message: "Cannot delete default address.",
        color: "yellow.8",
      });
      setIsFormLoading(false);
      return true;
    }

    axios
      .delete(`api/user/address/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setSessionedUserData({
          ...sessionedUserData,
          Addresses: res.data.Addresses,
        });
        showNotification({
          title: "Success!",
          message: "Successfully deleted your address",
          color: "teal",
        });
        setIsFormLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showNotification({
          title: "Error!",
          message:
            "There was an error processing your request. Please try again later.",
          color: "red",
        });
        setIsFormLoading(false);
      });
  };

  return (
    <>
      <Paper className="content" pb={30}>
        <Group position="apart" mb="xl" pt="xl">
          <Text weight={600} size="xl" color="dark.3">
            Address
          </Text>
          <Button
            color="yellow.8"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Add
          </Button>
        </Group>
        <Box>
          <Stack spacing="xl">
            {sessionedUserData &&
              sessionedUserData.Addresses.map((v) => {
                return (
                  <ItemAddress
                    key={v._id}
                    address={v}
                    saveDefaultAddress={saveDefaultAddress}
                    deleteAddress={deleteAddress}
                    setAddressEdit={setAddressEdit}
                    setOpenDialog={setOpenDialog}
                    isFormLoading={isFormLoading}
                  />
                );
              })}
          </Stack>
        </Box>
      </Paper>
      <AddDialog
        addressEdit={addressEdit}
        setAddressEdit={setAddressEdit}
        updateFieldsRef={updateFieldsRef}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setSessionedUserData={setSessionedUserData}
        isFixDefault={
          sessionedUserData && sessionedUserData.Addresses.length === 0
        }
      />
    </>
  );
}

const ItemAddress = ({
  address,
  saveDefaultAddress,
  deleteAddress,
  setOpenDialog,
  setAddressEdit,
  isFormLoading,
}) => {
  const openUpdateDialog = () => {
    setAddressEdit(address);
    setOpenDialog(true);
  };

  return (
    <Box py="lg" sx={{ borderBottom: "1px solid #e7e7e7" }}>
      <Box sx={{ display: "flex" }}>
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Group spacing={4} mb={4}>
            <Text weight={600} color="dark.4">
              {address.name}
            </Text>
            |
            <Text weight={600} size="sm" color="gray.6">
              {`(+${address.phoneNumber.countryCode}) ${address.phoneNumber.number}`}
            </Text>
          </Group>
          <Text color="gray.6" size="sm">
            {`${address.addressLine1}, ${address.barangay}`}
          </Text>
          <Text color="gray.6" size="sm">
            {`${address.city}, ${address.province}, ${address.zipCode}, ${address.region}`}
          </Text>
          {address.isDefault && (
            <Box mt={4}>
              <Box>
                <Text size="xs" color="green.6" weight={600}>
                  Default Address
                </Text>
              </Box>
            </Box>
          )}
        </Stack>

        <Box>
          <Menu transition="pop" withArrow position="bottom-end" width={120}>
            <Menu.Target>
              <Button
                rightIcon={<IconChevronDown />}
                size="xs"
                variant="default"
                disabled={isFormLoading}
              >
                Actions
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                icon={<IconPencil size={14} />}
                onClick={() => {
                  openUpdateDialog();
                }}
              >
                <Text size="sm">Edit</Text>
              </Menu.Item>
              <Menu.Item
                disabled={address.isDefault}
                icon={<IconToggleRight size={14} />}
                onClick={() => {
                  saveDefaultAddress(address._id);
                }}
              >
                <Text size="sm">Default</Text>
              </Menu.Item>
              <Menu.Item
                icon={<IconTrash size={14} color="red" />}
                onClick={() => {
                  deleteAddress(address._id, address.isDefault);
                }}
              >
                <Text size="sm">Delete</Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Address;
