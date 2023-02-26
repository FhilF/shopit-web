import {
  Box,
  Button,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { useState } from "react";
import { nonEmailProviderSetup } from "utils/Schema/UserSchema";

function NonLocalProviderVerification({ setSessionedUserData }) {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const form = useForm({
    initialValues: {
      username: "",
      phoneNumber: { countryCode: 63, number: null },
    },
    validate: zodResolver(nonEmailProviderSetup),
  });

  const register = () => {
    setIsFormLoading(true);
    if (form.validate().hasErrors) {
      setIsFormLoading(false);
      return showNotification({
        title: "Error submitting form",
        message: "Please finish the required inputs before submitting",
        color: "red",
      });
    }

    axios
      .post("auth/account/setup", { ...form.values }, { withCredentials: true })
      .then((res) => {
        setIsFormLoading(false);
        setSessionedUserData((prevState) => ({
          ...prevState,
          ...form.values,
          isUserUpdated: true,
        }));
      })
      .catch((err) => {
        setIsFormLoading(false);
        if (err.response.status === 400 && err.response.data.key) {
          showNotification({
            title: "Sorry we can't process your request!",
            message: "There is an error from your form.",
            color: "red",
          });
          return form.setFieldError(
            err.response.data.key,
            `This ${err.response.data.key} has already been taken. Try another`
          );
        }
        showNotification({
          title: "Error submitting form",
          message: "Please finish the required inputs before submitting",
          color: "red",
        });
      });
  };
  return (
    <Box sx={{ height: "94vh" }}>
      <Group position="center">
        <Paper
          p="xl"
          radius="xs"
          withBorder
          sx={{ width: "450px", marginTop: "15vh" }}
        >
          <Box>
            <Text color="blueGray.6" weight={600} size="lg">
              Setup Account
            </Text>
            <Stack
              mt="lg"
              spacing="xs"
              sx={(theme) => ({
                ".text-input": {
                  label: { color: theme.colors.blueGray[5] },
                },
              })}
            >
              <TextInput
                className="text-input"
                label="Username"
                withAsterisk
                autoComplete="off"
                disabled={isFormLoading}
                {...form.getInputProps("username")}
              />
              <NumberInput
                placeholder="9xxxxxxxxx"
                label="Phone Number"
                withAsterisk
                hideControls
                disabled={isFormLoading}
                icon={
                  <Text size="sm" color="dark.4">
                    +63
                  </Text>
                }
                {...form.getInputProps("phoneNumber.number")}
              />
            </Stack>
            <Group mt="xl" position="right">
              <Button
                onClick={() => {
                  register();
                }}
              >
                Submit
              </Button>
            </Group>
          </Box>
        </Paper>
      </Group>
    </Box>
  );
}

export default NonLocalProviderVerification;
