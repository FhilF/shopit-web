import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconMail } from "@tabler/icons";
import axios from "axios";
import React, { useState } from "react";

function EmailVerification({ sessionedUserData }) {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const resendEmail = () => {
    setIsFormLoading(true);
    axios
      .post(`auth/send-verification/${sessionedUserData.email}`)
      .then((res) => {
        showNotification({
          title: "Success!",
          message: "Email sent.",
          color: "teal",
        });
        setIsFormLoading(false);
        console.log(res);
      })
      .catch((err) => {
        if (err.response?.data?.message === "User already verified") {
          return window.location.reload();
        }
        showNotification({
          title: "Error!",
          message:
            err.response?.data?.message ||
            "There was an error processing your request. Please try again later.",
          color: "red",
        });
        setIsFormLoading(false);
      });
  };
  return (
    <Box sx={{ height: "90vh", marginTop: "100px" }}>
      <LoadingOverlay visible={isFormLoading} overlayBlur={2} />
      <Flex
        sx={{
          height: "100%",
          width: "100%",
          marginTop: "-100px",
          flexDirection: "column",
        }}
        align="center"
        justify="center"
      >
        <IconMail size={120} style={{ strokeWidth: 1 }} color="#CBD5E1" />

        <Text mt={1} color="blueGray.6" size="lg" weight={600}>
          Verify your email address!
        </Text>

        <Group spacing={4} mt="md">
          <Text color="blueGray.4" size="md">
            Email:
          </Text>
          <Text color="blueGray.4" size="sm" weight={600}>{sessionedUserData.email}</Text>
        </Group>

        <Text
          mt="sm"
          color="blueGray.5"
          size={14}
          align="center"
          px="xl"
          sx={(theme) => ({
            width: "100%",
            [theme.fn.largerThan("md")]: {
              maxWidth: "600px",
            },
          })}
        >
          We need to verify your email first to ensure that the email is real.
          Just click on the link in that email to complete your verification. If
          you don't see it, you may need to check your spam folder.
        </Text>

        <Group spacing={4} mt="sm" align="center">
          <Text color="blueGray.4" size="sm" align="center" weight={600}>
            Didn't received an email?
          </Text>
          <UnstyledButton
            disabled={isFormLoading}
            align="center"
            sx={{
              position: "relative",
              ":disabled": {
                ".mantine-Text-root": {
                  color: "#CBD5E1",
                  cursor: "default",
                },
              },
            }}
            onClick={() => {
              resendEmail();
            }}
          >
            <Text
              color="yellow.8"
              size="sm"
              sx={{
                textDecoration: "underline",
              }}
            >
              Click here to resend
            </Text>
          </UnstyledButton>
        </Group>
      </Flex>
    </Box>
  );
}

export default EmailVerification;
