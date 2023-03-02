import { Box, Button, Stack, Text, UnstyledButton } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";

import useStyles from "styles/js/layouts/global";
import { ContentMessageProvider } from "utils/contentMessageProvider";

// import { MantineLogo } from "@mantine/ds";

function Global(props) {
  const {
    children,
    signout,
    openDeptDrawer,
    setOpenDeptDrawer,
    departments,
    sessionedUserData,
  } = props;
  const { classes } = useStyles();
  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", top: "40vh", zIndex: 10 }}>
        <Button
          color="yellow.8"
          radius={0}
          component="a"
          href="/guide"
          sx={{
            height: "110px",
            paddingLeft: "1px",
            paddingRight: "1px",
            backgroundColor: "#f08c00b3",
          }}
        >
          <Text size="sm" weight={600} sx={{ writingMode: "vertical-rl" }}>
            Tester Guides
          </Text>
        </Button>
      </Box>
      <Box className={classes.global}>
        <Header
          signout={signout}
          openDeptDrawer={openDeptDrawer}
          setOpenDeptDrawer={setOpenDeptDrawer}
          departments={departments}
          sessionedUserData={sessionedUserData}
        />
        <ContentMessageProvider>
          <Box className="main">
            <Box className="child responsive">{children}</Box>
          </Box>
        </ContentMessageProvider>

        <Footer />
      </Box>
    </Box>
  );
}

export default Global;
