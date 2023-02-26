import { Box, UnstyledButton } from "@mantine/core";
import React from "react";

function FooterLogoImage() {
  return (
    <UnstyledButton component="a" href="/">
      <img
        style={{ width: "120px" }}
        className="logo"
        src={process.env.PUBLIC_URL + "/shop-it-logo.png"}
        alt="shop-it-logo"
      />
    </UnstyledButton>
  );
}

export default FooterLogoImage;
