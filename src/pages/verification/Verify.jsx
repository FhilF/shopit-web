import { Box, Button, Flex, Group, Loader, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "utils/authProvider";
import { useContentMessage } from "utils/contentMessageProvider";

function Verify() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [message, setMessage] = useState();

  const { setErrorType } = useContentMessage();
  const { sessionedUserData, setSessionedUserData } = useAuth();

  useEffect(() => {
    console.log(sessionedUserData);
  }, [sessionedUserData]);

  const { email, token } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    setIsPageLoading(true);
    axios
      .post(
        `auth/verify/${email}/${token}`,
        {},
        { withCredentials: sessionedUserData ? true : false }
      )
      .then((res) => {
        showNotification({
          title: "Success!",
          message: "Email verified.",
          color: "teal",
        });
        if (sessionedUserData) {
          setSessionedUserData({ ...sessionedUserData, isEmailVerified: true });
        }
        setIsPageLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 500) {
          setIsPageLoading(false);
          return setErrorType("Err500");
        }
        if (err.response.data?.message) {
          setIsPageLoading(false);
          return setMessage(err.response.data.message);
        }

        setIsPageLoading(false);
        return setMessage("No message");
      });
  }, []);

  return (
    <Box sx={{ height: "90vh" }}>
      <Flex
        sx={{
          height: "100%",
          width: "100%",
          flexDirection: "column",
        }}
        align="center"
        justify="center"
      >
        {isPageLoading ? (
          <>
            <Loader size={80} />
            <Text mt="xl" color="blueGray.6" size="sm">
              Verifying your email...
            </Text>
          </>
        ) : (
          message && (
            <>
              <Text
                color="blueGray.6"
                size="lg"
                weight={600}
                sx={{
                  marginTop: "-100px",
                }}
              >
                There was an error on verifying your account.
              </Text>

              <Text mt="sm" color="blueGray.5" size="md" align="center">
                {message}
              </Text>

              <Group mt="md" spacing={0}>
                <Button
                  variant={"subtle"}
                  color={"dark.4"}
                  component="a"
                  href="/"
                >
                  Home
                </Button>
                {!sessionedUserData ? (
                  <Button color="yellow.8" component="a" href="/sign-in">
                    Sign in
                  </Button>
                ) : (
                  <Button color="yellow.8" component="a" href="/">
                    Send Verification
                  </Button>
                )}
              </Group>
            </>
          )
        )}
      </Flex>
    </Box>
  );
}

export default Verify;
