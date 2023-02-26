import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  NumberInput,
  Paper,
  Radio,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import AddDialog from "components/AddAddressDialog";

function Address(props) {
  const {
    address,
    setAddress,
    addresses,
    setAddresses,
    sessionedUserData,
    setSessionedUserData,
  } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const [addressEdit, setAddressEdit] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const updateFieldsRef = useRef(false);

  return (
    <>
      <Paper radius="xs" withBorder px="xl" pt="md">
        <Text weight={600} color="dark.3" size="xl" mt="xs">
          Address
        </Text>
        <Box mt="sm">
          <Radio.Group
            size="xs"
            value={address}
            onChange={setAddress}
            spacing={4}
            sx={{
              ".mantine-Radio-root": {
                width: "100%",
                ".mantine-Radio-body": {
                  width: "100%",
                  ".mantine-Radio-labelWrapper": {
                    width: "100%",
                  },
                },
              },
            }}
          >
            {addresses.map((v) => {
              return (
                <Radio
                  key={v._id}
                  value={v._id}
                  sx={{
                    ".mantine-Radio-inner": {
                      marginTop: "5px",
                    },
                  }}
                  label={
                    <Grid sx={{ alignItems: "center" }}>
                      <Grid.Col md={11}>
                        <Group spacing={6} sx={{ flex: 1 }}>
                          <Text color="dark.4" size="md" weight={600}>
                            {`${v.name} -`}
                          </Text>
                          <Text color="gray.6" size="md">
                            {`${v.addressLine1}, ${v.barangay}, ${v.city}, ${v.province}, ${v.region}, ${v.zipCode}`}
                          </Text>
                          {v.isDefault && (
                            <Text color="yellow.8" size="sm" weight={600}>
                              - Default address
                            </Text>
                          )}
                        </Group>
                      </Grid.Col>
                      <Grid.Col md={1}>
                        <Group position="right">
                          <UnstyledButton
                            sx={{
                              ":hover": {
                                textDecoration: "underline",
                              },
                            }}
                            onClick={() => {
                              setAddressEdit(v);
                              setOpenDialog(true);
                            }}
                          >
                            <Text size="sm">Edit</Text>
                          </UnstyledButton>
                        </Group>
                      </Grid.Col>
                    </Grid>
                  }
                />
              );
            })}
          </Radio.Group>
        </Box>
        <Divider mt={40} />
        <Group position="right" my="md">
          <Button
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Add{" "}
          </Button>
        </Group>
      </Paper>
      <AddDialog
        setAddresses={setAddresses}
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

export default Address;
