import {
  Accordion,
  Avatar,
  Box,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconBuildingStore,
  IconChevronRight,
  IconHome,
  IconPackage,
  IconReceipt,
  IconUser,
} from "@tabler/icons";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "utils/authProvider";

function Profile(props) {
  const { children } = props;
  const location = useLocation();
  useEffect(() => {}, []);
  return (
    <Box className="portal">
      <Box className="navbar">
        <Box mt="xl" className="nav-group">
          <Nav location={location} />
        </Box>
      </Box>
      <Box className="container" sx={(theme) => ({})}>
        {children}
      </Box>
    </Box>
  );
}

const Nav = ({ location }) => {
  const navItems = [
    // {
    //   label: "Shop",
    //   icon: <IconBuildingStore />,
    //   basePath: "/portal",
    //   link: "",
    // },
    {
      label: "Account",
      icon: <IconReceipt />,
      basePath: "/user/account",
      sublinks: [
        { label: "Profile", link: "/profile" },
        { label: "Addresses", link: "/address" },
      ],
    },
    {
      label: "My Orders",
      icon: <IconPackage />,
      link: "/user/order",
    },
  ];
  return (
    <Stack spacing={4} className="nav-item-container">
      {navItems.map((el) => (
        <NavItem key={el.label} {...el} currentLoc={location.pathname} />
      ))}
    </Stack>
  );
};

const NavItem = ({ label, icon, link, sublinks, basePath, currentLoc }) => {
  const [open, setOpen] = useState(
    (basePath && currentLoc.includes(basePath)) || false
  );

  useEffect(() => {
    setOpen(basePath && currentLoc.includes(basePath));
  }, [currentLoc]);
  return (
    <>
      <Link
        className={clsx(
          "link",
          !sublinks &&
            currentLoc === link &&
            "active"
        )}
        onClick={(e) => {
          if (sublinks) {
            setOpen((o) => !o);
          }
        }}
        to={sublinks ? `${basePath}` : link}
      >
        <Group position="apart">
          <Group spacing={8}>
            <Box className="icon-container">{icon}</Box>
            <Text className="label" size="sm" weight={600} color="gray.7">
              {label}
            </Text>
          </Group>
          {sublinks && (
            <IconChevronRight
              className="chevron"
              size={14}
              stroke={1.5}
              style={{
                transform: open ? `rotate(90deg)` : "none",
              }}
            />
          )}
        </Group>
      </Link>
      {sublinks && (
        <Collapse in={open} className="sub-link-container">
          {sublinks.map((e) => {
            return (
              <Link
                className={clsx(
                  "sub-link",
                  currentLoc === `${basePath}${e.link}` && "active"
                )}
                to={`${basePath}${e.link}`}
                key={e.label}
              >
                <Text size="sm" weight={500} color="gray.7">
                  {e.label}
                </Text>
              </Link>
            );
          })}
        </Collapse>
      )}
    </>
  );
};

export default Profile;
