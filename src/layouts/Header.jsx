import {
  Accordion,
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Button,
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
  IconDoorExit,
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

  const [open, setOpen] = useState(false);
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
                opened={open}
                onClick={() => setOpen((val) => !val)}
                className="burger"
                size="sm"
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
            <Group spacing={4} className="menu">
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
        setOpen={setOpen}
        setOpenDeptDrawer={setOpenDeptDrawer}
        openDeptDrawer={openDeptDrawer}
        deptNavRef={deptNavRef}
        departments={departments}
        navigate={navigate}
      />
    </Box>
  );
}

const DepartmentDrawer = (props) => {
  const {
    classes,
    setOpen,
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
                      setOpen(true);
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
    open,
    setOpen,
    sessionedUserData,
    setOpenDeptDrawer,
    deptNavRef,
    navigate,
  } = props;
  return (
    <Drawer
      className={classes.drawer}
      opened={open}
      onClose={() => setOpen((val) => !val)}
      title=""
      size="lg"
      withCloseButton={false}
    >
      <Box pb={10} className="drawer-header">
        <Group py={20} position="apart">
          <img
            className="logo"
            src={process.env.PUBLIC_URL + "/shop-it-logo.png"}
            alt="shop-it-logo"
          />

          <ActionIcon
            onClick={() => {
              setOpen(false);
            }}
          >
            <IconX />
          </ActionIcon>
        </Group>
        <Box pt={4}>
          {sessionedUserData ? (
            <ProfileHeader
              sessionedUserData={sessionedUserData}
              navigate={navigate}
            />
          ) : (
            <Group spacing={2} pb={10}>
              <Text color="gray.0" size="sm" sx={() => ({ lineHeight: 0 })}>
                <IconUser />
              </Text>
              <Text color="gray.0" size="md" weight={500}>
                Sign in
              </Text>
            </Group>
          )}
        </Box>
      </Box>
      <Box className="drawer-menu">
        <Link className="items" to="/">
          <Text weight={600} size="sm">
            Home
          </Text>
        </Link>

        <Box
          className="items"
          sx={() => ({ cursor: "pointer" })}
          onClick={() => {
            setOpen(false);
            setOpenDeptDrawer(true);
            deptNavRef.current = true;
          }}
        >
          <Group position="apart">
            <Text weight={600} size="sm">
              Departments
            </Text>
            <Text color="dark.6" sx={() => ({ lineHeight: 0 })}>
              <IconChevronRight />
            </Text>
          </Group>
        </Box>

        {/* <Accordion className="accordion-drawer">
        <Accordion.Item value="customization">
          <Accordion.Control>Customization</Accordion.Control>
          <Accordion.Panel>
            Colors, fonts, shadows and many other parts are customizable
            to fit your design needs
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion> */}
      </Box>
      {/* Drawer content */}
    </Drawer>
  );
};

const ProfileHeader = ({ sessionedUserData, signout, navigate }) => {
  const [open, setOpen] = useState(false);
  return (
    <Menu
      width={260}
      position="bottom-end"
      transition="pop-top-right"
      opened={open}
      onChange={setOpen}
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
          to="/addresses"
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
