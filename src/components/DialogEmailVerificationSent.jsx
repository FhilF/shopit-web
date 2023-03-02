import { Box, Flex, Group, Modal, Text, UnstyledButton } from "@mantine/core";
import { IconMail } from "@tabler/icons";
import React from "react";

function DialogEmailVerificationSent({
  showEmailVeriSent,
  setShowEmailVeriSent,
}) {
  return (
    <Modal
      opened={showEmailVeriSent}
      onClose={() => setShowEmailVeriSent(false)}
      size="lg"
      centered
    >
      <Box pb="md">
        <Flex
          sx={{
            height: "100%",
            width: "100%",
            flexDirection: "column",
          }}
          align="center"
          justify="center"
        >
          <IconMail size={120} style={{ strokeWidth: 1 }} color="#CBD5E1" />

          <Text mt={1} color="blueGray.6" size="lg" weight={600}>
            Email verification sent!
          </Text>

          <Text mt="sm" color="blueGray.5" size={14} align="center" px="xl">
            We need to verify your email first to ensure that the email is real.
            Just click on the link in that email to complete your verification.
            If you don't see it, you may need to check your spam folder.
          </Text>

          <Text color="blueGray.4" size="sm" align="center" mt="md" weight={600}>
            Didn't received an email?
          </Text>

          <Text color="blueGray.4" size="sm" align="center">
            Sign in to your Shop It account to resend the verification link.
          </Text>
        </Flex>
      </Box>
    </Modal>
  );
}

export default DialogEmailVerificationSent;
