import { Box } from "@mantine/core";
import React from "react";
import { useAuth } from "utils/authProvider";
import EmailVerification from "./EmailVerification";
import NonLocalProviderVerification from "./NonLocalProviderVerification";

function AccountSetup() {
  const { sessionedUserData, setSessionedUserData } = useAuth();
  return (
    <Box>
      {sessionedUserData &&
        (sessionedUserData.provider === "email" ? (
          <EmailVerification sessionedUserData={sessionedUserData} />
        ) : (
          <NonLocalProviderVerification
            setSessionedUserData={setSessionedUserData}
          />
        ))}
    </Box>
  );
}

export default AccountSetup;
