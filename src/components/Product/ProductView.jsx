import { Box, Flex, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconList } from "@tabler/icons";
import EmptyProductSearchByDept from "components/Empty/EmptyProductSearchByDept";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";

function ProductView(props) {
  const {
    products,
    departments,
    setOpenDeptDrawer,
    mainDeparment,
    isPageLoading,
  } = props;
  const [productList, setProductList] = useState([]);

  const [search, setSearch] = useSearchParams();
  const deptId = search.get("find");
  useEffect(() => {
    if (products) {
      if (deptId) {
        const filteredProducts = products.filter((v1) =>
          v1.Departments.some((dept) => dept._id === deptId)
        );
        setProductList([...filteredProducts]);
      } else {
        setProductList([...products]);
      }
    }
  }, [products, deptId]);

  return (
    <Flex
      sx={(theme) => ({
        flexDirection: "column",
        [theme.fn.largerThan("md")]: {
          flexDirection: "row",
        },
      })}
    >
      <Box
        sx={(theme) => ({
          width: "100%",
          flex: "none",
          marginBottom: "16px",
          [theme.fn.largerThan("md")]: { flex: 1, margin: 0 },
        })}
      >
        <Group spacing={4}>
          <IconList size={20} color="#545454" />
          <Text weight={600} color="#545454" size={17}>
            Departments
          </Text>
        </Group>
        <Stack
          spacing={0}
          mt="md"
          sx={(theme) => ({
            ".dept-nav-button": {
              ":hover": {
                backgroundColor: theme.colors.gray[2],
              },
              ".nav-button-text": {
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflowWrap: "break-word",
                WebkitLineClamp: "1",
              },
            },
          })}
        >
          {setOpenDeptDrawer && (
            <UnstyledButton className="dept-nav-button">
              <Text
                className="nav-button-text"
                py={4}
                px="sm"
                weight={600}
                size={14}
                color="dark.3"
                sx={{}}
                onClick={() => {
                  setOpenDeptDrawer(true);
                }}
              >
                Show All Departments
              </Text>
            </UnstyledButton>
          )}

          <UnstyledButton className="dept-nav-button">
            <Text
              className="nav-button-text"
              py={4}
              px="sm"
              weight={600}
              size={14}
              color={!deptId ? "yellow.8" : "dark.3"}
              sx={{}}
              onClick={() => {
                setSearch({});
              }}
            >
              {mainDeparment
                ? mainDeparment.charAt(0).toUpperCase() + mainDeparment.slice(1)
                : "All Products"}
            </Text>
          </UnstyledButton>
          {departments &&
            departments.map((v) => {
              return (
                <UnstyledButton className="dept-nav-button" key={v._id}>
                  <Text
                    className="nav-button-text"
                    py={4}
                    px="sm"
                    weight={600}
                    size={14}
                    color={deptId === v._id ? "yellow.8" : "dark.3"}
                    sx={{}}
                    onClick={() => {
                      setSearch({ find: v._id });
                    }}
                  >
                    {v.name}
                  </Text>
                </UnstyledButton>
              );
            })}
        </Stack>
      </Box>
      <Box
        sx={(theme) => ({
          width: "100%",
          flex: 1,
          [theme.fn.largerThan("md")]: {
            marginLeft: "10px",
            flex: "none",
            width: "850px",
          },
          [theme.fn.largerThan("lg")]: { width: "950px" },
        })}
      >
        <Box>
          <Group
            spacing={6}
            sx={(theme) => ({
              [theme.fn.smallerThan("md")]: {
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                gap: "6px",
              },

              ".prod-container": {
                width: "100%",
                flexGrow: "0",

                maxWidth: "32%",
                flexBasis: "32%",
                [theme.fn.smallerThan("480")]: {
                  maxWidth: "49%",
                  flexBasis: "49%",
                },
                [theme.fn.smallerThan("350")]: {
                  maxWidth: "100%",
                  flexBasis: "100%",
                },

                [theme.fn.largerThan("xs")]: {
                  maxWidth: "24%",
                  flexBasis: "24%",
                },
                [theme.fn.largerThan("sm")]: {
                  maxWidth: "19%",
                  flexBasis: "19%",
                },
                [theme.fn.largerThan("md")]: {
                  flexGrow: "initial",
                  maxWidth: "none",
                  flexBasis: "auto",
                  width: "165px",
                },
                [theme.fn.largerThan("lg")]: {
                  width: "185px",
                },
              },
            })}
          >
            {productList.length > 0 ? (
              productList.map((v) => {
                return (
                  <Box className="prod-container" span={2} key={v._id}>
                    <ProductCard
                      item={v}
                      showStocks={false}
                      href={`/product/${v._id}`}
                    />
                  </Box>
                );
              })
            ) : (
              <EmptyProductSearchByDept setOpenDeptDrawer={setOpenDeptDrawer} />
            )}
          </Group>
        </Box>
      </Box>
    </Flex>
  );
}

export default ProductView;
