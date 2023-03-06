import {
  Accordion,
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Indicator,
  Menu,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAddressBook,
  IconAlertTriangle,
  IconArrowLeft,
  IconChecklist,
  IconChevronRight,
  IconDoorEnter,
  IconDoorExit,
  IconHome,
  IconList,
  IconPackage,
  IconShoppingCart,
  IconUser,
  IconUserCircle,
  IconX,
} from "@tabler/icons";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";

import useStyles from "styles/js/layouts/global/header";
import { showNotification } from "@mantine/notifications";
import { isProduction } from "config";
function Index(props) {
  const navigate = useNavigate();
  const {
    signout,
    openDeptDrawer,
    setOpenDeptDrawer,
    departments,
    sessionedUserData,
  } = props;

  const deptNavRef = useRef(false);

  const [openNav, setOpenNav] = useState(false);
  const { classes } = useStyles();

  const ShoppingCart = () => {
    return (
      <Box ml="xs" sx={() => ({ height: "100%" })}>
        <UnstyledButton
          component="a"
          href="/cart"
          onClick={(e) => {
            e.preventDefault();
            if (!sessionedUserData) {
              return showNotification({
                title: "Sign in first",
                color: "yellow.8",
              });
            }
            navigate("/cart");
          }}
          className="items"
        >
          <Indicator
            label={sessionedUserData && sessionedUserData.Cart?.length}
            size={16}
            dot={sessionedUserData}
            color="yellow.8"
            sx={() => ({ fontSize: 0 })}
          >
            <IconShoppingCart />
          </Indicator>
        </UnstyledButton>
      </Box>
    );
  };

  return (
    <Box className={classes.header}>
      <Box className="child responsive">
        <Box sx={() => ({ width: "100%", height: "100%" })}>
          <Group position="apart" className="inner-nav" sx={() => ({})}>
            <Group>
              <Burger
                opened={openNav}
                onClick={() => setOpenNav((val) => !val)}
                className="burger"
                size="sm"
                color="white"
              />
              <UnstyledButton
                component="a"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
              >
                <Group spacing={4}>
                  <img
                    className="logo"
                    src={process.env.PUBLIC_URL + "/shop-it-logo.png"}
                    alt="shop-it-logo"
                  />
                </Group>
              </UnstyledButton>
            </Group>
            <Group spacing={4} className="menu-m">
              {!sessionedUserData && (
                <a
                  href=" #"
                  className="items"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/sign-in");
                  }}
                >
                  Sign in
                </a>
              )}

              {(!sessionedUserData ||
                (sessionedUserData &&
                  sessionedUserData.isEmailVerified &&
                  sessionedUserData.isUserUpdated)) && <ShoppingCart />}
            </Group>
            <Group spacing={4} className="menu">
              {(!sessionedUserData ||
                (sessionedUserData &&
                  sessionedUserData.isEmailVerified &&
                  sessionedUserData.isUserUpdated)) && (
                <UnstyledButton
                  component="a"
                  className="items"
                  href={
                    isProduction
                      ? "https://seller.shopit-demo.com/"
                      : "http://localhost:3001/"
                  }
                >
                  <Text weight={600} size="sm" color="yellow.8">
                    Seller Portal
                  </Text>
                </UnstyledButton>
              )}
              <Link className="items" to="/">
                <Text weight={600} size="sm">
                  Home
                </Text>
              </Link>
              {(!sessionedUserData ||
                (sessionedUserData &&
                  sessionedUserData.isEmailVerified &&
                  sessionedUserData.isUserUpdated)) && (
                <Box
                  className="items"
                  sx={() => ({ cursor: "pointer" })}
                  onClick={() => {
                    setOpenDeptDrawer(true);
                    deptNavRef.current = false;
                  }}
                >
                  <Text weight={600} size="sm">
                    Departments
                  </Text>
                </Box>
              )}

              <Box
                ml="xl"
                sx={() => ({
                  display: "flex",
                  height: "100%",
                })}
              >
                {sessionedUserData ? (
                  sessionedUserData.isEmailVerified &&
                  sessionedUserData.isUserUpdated ? (
                    <ProfileHeader
                      sessionedUserData={sessionedUserData}
                      signout={signout}
                      navigate={navigate}
                    />
                  ) : (
                    <Box
                      className="items"
                      sx={() => ({ cursor: "pointer" })}
                      onClick={() => {
                        signout();
                      }}
                    >
                      <Text weight={600} size="sm">
                        Sign out
                      </Text>
                    </Box>
                  )
                ) : (
                  <a
                    href=" #"
                    className="items"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/sign-in");
                    }}
                  >
                    Sign in
                  </a>
                )}
              </Box>
              {(!sessionedUserData ||
                (sessionedUserData &&
                  sessionedUserData.isEmailVerified &&
                  sessionedUserData.isUserUpdated)) && <ShoppingCart />}

              {/* {sessionedUserData ? (
                  sessionedUserData.isEmailVerified &&
                  sessionedUserData.isUserUpdated(
                  
                )} */}
            </Group>
          </Group>
        </Box>
      </Box>
      <DepartmentDrawer
        classes={classes}
        setOpenNav={setOpenNav}
        setOpenDeptDrawer={setOpenDeptDrawer}
        openDeptDrawer={openDeptDrawer}
        deptNavRef={deptNavRef}
        departments={departments}
        navigate={navigate}
      />
      <BurgerDrawer
        classes={classes}
        setOpenNav={setOpenNav}
        openNav={openNav}
        setOpenDeptDrawer={setOpenDeptDrawer}
        openDeptDrawer={openDeptDrawer}
        deptNavRef={deptNavRef}
        departments={departments}
        navigate={navigate}
        sessionedUserData={sessionedUserData}
        signout={signout}
      />
    </Box>
  );
}

const DepartmentDrawer = (props) => {
  const {
    classes,
    setOpenNav,
    setOpenDeptDrawer,
    openDeptDrawer,
    deptNavRef,
    departments,
    navigate,
  } = props;
  return (
    <Drawer
      className={clsx(classes.drawer, classes.secondaryDrawer)}
      opened={openDeptDrawer}
      onClose={() => setOpenDeptDrawer((val) => !val)}
      title=""
      size="lg"
      withCloseButton={false}
    >
      <Box h={56} className="sub-drawer-header">
        <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
          <Box sx={{ width: "100%" }}>
            <Group position="apart">
              <Group spacing={2}>
                {deptNavRef.current && (
                  <ActionIcon
                    onClick={() => {
                      setOpenDeptDrawer(false);
                      setOpenNav(true);
                    }}
                  >
                    <IconArrowLeft />
                  </ActionIcon>
                )}

                <Text color="gray.0" weight={600} size="lg">
                  Departments
                </Text>
              </Group>
              <ActionIcon onClick={() => setOpenDeptDrawer((val) => !val)}>
                <IconX />
              </ActionIcon>
            </Group>
          </Box>
        </Box>
      </Box>
      <Box className="drawer-menu" px="md">
        <ScrollArea style={{ height: "88vh" }}>
          <Stack spacing={0}>
            {departments.map((v) => {
              return (
                <UnstyledButton
                  key={v._id}
                  mt={6}
                  py={6}
                  mr={8}
                  sx={(theme) => ({
                    cursor: "pointer",
                    ":hover": {
                      background: theme.colors.gray[2],
                    },
                  })}
                  href={`/product/department/${v.name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}.${v._id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDeptDrawer(false);
                    navigate(
                      `/product/department/${v.name
                        .replace(/\s+/g, "-")
                        .toLowerCase()}.${v._id}`
                    );
                  }}
                >
                  <Text px="sm" size="sm" color="dark.3" weight={600}>
                    {v.name}
                  </Text>
                </UnstyledButton>
              );
            })}
          </Stack>
        </ScrollArea>
        {/* <Link className="items" to="/">
          Home
        </Link> */}
      </Box>
    </Drawer>
  );
};

const BurgerDrawer = (props) => {
  const {
    classes,
    openNav,
    setOpenNav,
    sessionedUserData,
    setOpenDeptDrawer,
    deptNavRef,
    navigate,
    signout,
  } = props;
  return (
    <Drawer
      lockScroll={true}
      className={classes.drawer}
      opened={openNav}
      onClose={() => setOpenNav((val) => !val)}
      title=""
      size="lg"
      withCloseButton={false}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 0 }} pb={10} className="drawer-header">
          <Group pt={20} pb={30} position="apart">
            <UnstyledButton component="a" href="/">
              <img
                className="logo"
                src={process.env.PUBLIC_URL + "/shop-it-logo.png"}
                alt="shop-it-logo"
              />
            </UnstyledButton>

            <ActionIcon
              onClick={() => {
                setOpenNav(false);
              }}
            >
              <IconX />
            </ActionIcon>
          </Group>
        </Box>
        <Box sx={{ flex: 1 }} className="drawer-menu">
          <Stack spacing="xl">
            <Stack spacing="lg">
              <UnstyledButton
                className="items"
                onClick={() => {
                  setOpenNav(false);
                  navigate("/");
                }}
              >
                <Group spacing="sm">
                  <IconHome className="menu-item-icon" />
                  <Text weight={600} size={15} color="blueGray.8">
                    Home
                  </Text>
                </Group>
              </UnstyledButton>
              <Box
                className="items"
                sx={() => ({ cursor: "pointer" })}
                onClick={() => {
                  setOpenNav(false);
                  setOpenDeptDrawer(true);
                  deptNavRef.current = true;
                }}
              >
                <Group position="apart">
                  <Group spacing="sm">
                    <IconList className="menu-item-icon" />
                    <Text weight={600} size={15} color="blueGray.8">
                      Departments
                    </Text>
                  </Group>
                  <Text color="dark.6" sx={() => ({ lineHeight: 0 })}>
                    <IconChevronRight />
                  </Text>
                </Group>
              </Box>
            </Stack>
            {sessionedUserData && (
              <>
                <Divider />
                <Stack spacing="lg">
                  <UnstyledButton
                    className="items"
                    component="a"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenNav(false);
                      navigate("/user/account/profile");
                    }}
                  >
                    <Group spacing="sm">
                      <IconUserCircle className="menu-item-icon" />
                      <Text weight={600} size={15} color="blueGray.8">
                        My Account
                      </Text>
                    </Group>
                  </UnstyledButton>
                  <UnstyledButton
                    className="items"
                    component="a"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenNav(false);
                      navigate("/user/order");
                    }}
                  >
                    <Group spacing="sm">
                      <IconPackage className="menu-item-icon" />
                      <Text weight={600} size={15} color="blueGray.8">
                        Orders
                      </Text>
                    </Group>
                  </UnstyledButton>
                  <UnstyledButton
                    className="items"
                    component="a"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenNav(false);
                      navigate("/user/account/address");
                    }}
                  >
                    <Group spacing="sm">
                      <IconAddressBook className="menu-item-icon" />
                      <Text weight={600} size={15} color="blueGray.8">
                        Addresses
                      </Text>
                    </Group>
                  </UnstyledButton>
                  <UnstyledButton
                    className="items"
                    component="a"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenNav(false);
                      navigate("/cart");
                    }}
                  >
                    <Group spacing="sm">
                      <IconShoppingCart className="menu-item-icon" />
                      <Text weight={600} size={15} color="blueGray.8">
                        My Cart
                      </Text>
                    </Group>
                  </UnstyledButton>
                </Stack>
              </>
            )}
          </Stack>
        </Box>
        <Box sx={{ flex: 0 }} pb="xl">
          <Divider mb="sm" />
          {sessionedUserData ? (
            <UnstyledButton
              sx={{
                width: "100%",
                paddingLeft: "16px",
                paddingRight: "16px",
                color: "#25262b",
                fontWeight: "600",
                WebkitTextDecoration: "none",
                textDecoration: "none",
                fontSize: "18px",
                height: "100%",
              }}
              onClick={() => {
                setOpenNav(false);
                signout();
                navigate("/");
              }}
            >
              <Group spacing="sm">
                <IconDoorExit size={18} className="menu-item-icon" />
                <Text weight={600} size={15} color="blueGray.8">
                  Sign Out
                </Text>
              </Group>
            </UnstyledButton>
          ) : (
            <UnstyledButton
              sx={{
                width: "100%",
                paddingLeft: "16px",
                paddingRight: "16px",
                color: "#25262b",
                fontWeight: "600",
                WebkitTextDecoration: "none",
                textDecoration: "none",
                fontSize: "18px",
                height: "100%",
              }}
              onClick={() => {
                setOpenNav(false);
                navigate("/sign-in");
              }}
            >
              <Group spacing="sm">
                <IconDoorEnter size={18} className="menu-item-icon" />
                <Text weight={600} size={15} color="blueGray.8">
                  Sign in
                </Text>
              </Group>
            </UnstyledButton>
          )}
        </Box>
      </Box>

      {/* Drawer content */}
    </Drawer>
  );
};

const ProfileHeader = ({ sessionedUserData, signout, navigate }) => {
  const [openNav, setOpenNav] = useState(false);
  return (
    <Menu
      width={260}
      position="bottom-end"
      transition="pop-top-right"
      opened={openNav}
      onChange={setOpenNav}
    >
      <Menu.Target>
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            paddingLeft: "8px",
            paddingRight: "8px",
            [theme.fn.smallerThan("sm")]: {
              paddingLeft: "0px",
              paddingRight: "0px",
              paddingBottom: "12px",
              paddingTop: "12px",
            },
            [theme.fn.largerThan("sm")]: {
              ":hover": {
                background: theme.colors.dark[7],
              },
            },
          })}
        >
          <Avatar
            color="yellow.9"
            radius="xl"
            size={32}
            src={sessionedUserData.avatar}
          >
            {sessionedUserData.username.charAt(0).toUpperCase()}
          </Avatar>

          <Indicator
            // label={sessionedUserData.Cart.length}
            label={sessionedUserData.isEmailVerified ? 0 : 1}
            showZero={false}
            dot={false}
            size={16}
            sx={() => ({
              fontSize: 0,
              ".mantine-Indicator-common": {},
            })}
            color="yellow.8"
          >
            <Text ml={6} size="sm" weight={700} color="gray.0" pr={4}>
              {sessionedUserData.username}
            </Text>
          </Indicator>
        </Box>
      </Menu.Target>

      <Menu.Dropdown sx={{ zIndex: "1001 !important" }}>
        <Menu.Item
          component={Link}
          to="/user/account/profile"
          icon={<IconUserCircle size={16} stroke={1.5} />}
        >
          <Text weight={500} size="sm" color="dark.4">
            My Account
          </Text>
        </Menu.Item>
        <Menu.Item
          component={Link}
          to="/user/order"
          icon={<IconPackage size={16} stroke={1.5} />}
        >
          <Text weight={500} size="sm" color="dark.4">
            Orders
          </Text>
        </Menu.Item>
        <Menu.Item
          component={Link}
          to="/user/account/address"
          icon={<IconAddressBook size={16} stroke={1.5} />}
        >
          <Text weight={500} size="sm" color="dark.4">
            Addresses
          </Text>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          icon={<IconDoorExit size={14} stroke={1.5} />}
          onClick={() => {
            signout();
          }}
        >
          <Text weight={500} size="sm" color="dark.4">
            Sign Out
          </Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default Index;
