import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import Department from "components/Department";
import React, { useEffect, useState } from "react";
import ShopItHero from "assets/images/shop-it-hero.png";
import ShopItHeroWhiteBg from "assets/images/shop-it-hero-wbg.png";
import { useAuth } from "utils/authProvider";

function Home(props) {
  const { sessionedUserData } = useAuth();
  const { departments, setOpenDeptDrawer } = props;
  return (
    <Box>
      <Stack mt="sm">
        <Hero
          sessionedUserData={sessionedUserData}
          setOpenDeptDrawer={setOpenDeptDrawer}
        />
        <Departments
          departments={departments}
          setOpenDeptDrawer={setOpenDeptDrawer}
        />
      </Stack>
    </Box>
  );
}

const Hero = ({ sessionedUserData, setOpenDeptDrawer }) => {
  return (
    <Box>
      <Box sx={(theme) => ({ position: "relative" })}>
        <Image src={ShopItHero} />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Flex
            justify="center"
            align="center"
            sx={(theme) => ({
              height: "100%",
              [theme.fn.smallerThan("sm")]: {
                ".hero-button": {
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  fontSize: "12px",
                  height: "24px",
                },
              },
            })}
          >
            <Group mt={150}>
              {!sessionedUserData && (
                <Button
                  className="hero-button"
                  variant="subtle"
                  color="dark.4"
                  size="md"
                >
                  Register
                </Button>
              )}
              <Button
                className="hero-button"
                color="yellow.8"
                size="md"
                onClick={() => setOpenDeptDrawer(true)}
              >
                Shop Now!
              </Button>
            </Group>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

const Departments = (props) => {
  const { departments, setOpenDeptDrawer } = props;

  const { width } = useViewportSize();

  return (
    <Paper shadow="sm" radius="md" px="md" pt="lg" pb={20} withBorder>
      <Text size="lg" color="gray.6" weight={500}>
        Departments
      </Text>
      <Box mt={20}>
        {width < 768 && (
          <Grid>
            {departments.slice(0, 16).map((v) => {
              return (
                <Grid.Col span={3} key={v._id}>
                  <Department item={v} key={v._id} />
                </Grid.Col>
              );
            })}
          </Grid>
        )}
        {width >= 768 && (
          <Box
            sx={(theme) => ({
              overflow: "hidden",
              display: "none",
              height: "250px",
              [theme.fn.largerThan("sm")]: { display: "block" },
            })}
          >
            <Flex gap="md" direction="row" wrap="wrap" justify="center">
              {departments.slice(0, 14).map((v) => {
                return <Department item={v} key={v._id} />;
              })}
            </Flex>
          </Box>
        )}

        <Center mt="md">
          <Button
            variant="subtle"
            onClick={() => {
              setOpenDeptDrawer(true);
            }}
          >
            View More
          </Button>
        </Center>
        {/* <Flex
          mih={50}
          gap="md"
          justify="center"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          
        </Flex> */}
      </Box>
    </Paper>
  );
};

export default Home;
