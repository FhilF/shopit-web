import {
  Box,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Button,
  TextInput,
  Paper,
  Divider,
  NumberInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import ProfileComponent from "components/User/Profile";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "utils/authProvider";
import {
  accountEmailEditSchema,
  accountPhoneNumberEditSchema,
  profileEditSchema,
} from "utils/Schema/UserSchema";

function Profile(props) {
  const {} = props;
  const { updateSessionedUser, sessionedUserData, setSessionedUserData } =
    useAuth();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [pTempImgUrl, setPTempImgUrl] = useState(null);
  useEffect(() => {
    axios
      .get(`auth/sessioned_user`, {
        withCredentials: true,
      })
      .then((res) => {
        setSessionedUserData(res.data.sessionedUser);
        setPTempImgUrl(res.data.sessionedUser.avatar);
      })
      .catch((err) => {
        // if (err.response?.status === 404) {
        //   setErrorType("Item404");
        //   return true;
        // }
        // setErrorType("Error500");
        // setisPageLoading(false);
      });
  }, []);

  return (
    <Paper className="content" pb={30}>
      <Box mb="xl" pt="xl">
        <Text weight={600} size="xl" color="dark.3">
          User Information
        </Text>
      </Box>
      <Box
        mt="xl"
        sx={(theme) => ({
          width: "100%",
          ".input-container": {
            ".item-a": {
              alignSelf: "center",
            },
            [theme.fn.smallerThan("sm")]: {
              ".item-a": {
                marginBottom: "-16px",
              },
            },
            [theme.fn.largerThan("lg")]: {
              ".item-a": {
                textAlign: "right",
              },
              // width: theme.breakpoints.sm,
            },
            [theme.fn.largerThan("xl")]: {},
          },
        })}
      >
        <Stack spacing={40}>
          <PersonalInformation
            sessionedUserData={sessionedUserData}
            setSessionedUserData={setSessionedUserData}
            isFormLoading={isFormLoading}
            setIsFormLoading={setIsFormLoading}
            pTempImgUrl={pTempImgUrl}
            setPTempImgUrl={setPTempImgUrl}
            updateSessionedUser={updateSessionedUser}
          />
          <AccountInformation
            sessionedUserData={sessionedUserData}
            setSessionedUserData={setSessionedUserData}
            isFormLoading={isFormLoading}
            setIsFormLoading={setIsFormLoading}
          />
        </Stack>
      </Box>
    </Paper>
  );
}

const PersonalInformation = (props) => {
  const {
    sessionedUserData,
    setSessionedUserData,
    isFormLoading,
    setIsFormLoading,
    pTempImgUrl,
    setPTempImgUrl,
    updateSessionedUser,
  } = props;
  const [reset, setReset] = useState(false);
  const form = useForm({
    initialValues: { image: [], name: "" },
    validate: zodResolver(profileEditSchema),
  });

  useEffect(() => {
    if (sessionedUserData) {
      form.setValues({ name: sessionedUserData.name });
    }
  }, [sessionedUserData]);

  useEffect(() => {
    const values = form.values;
    if (sessionedUserData) {
      if (values.name !== sessionedUserData.name || values.image.length > 0) {
        setReset(true);
      } else {
        setReset(false);
      }
    }
  }, [form.values, sessionedUserData]);

  const save = () => {
    setIsFormLoading(true);
    if (form.validate().hasErrors) {
      showNotification({
        title: "Error updating your email!",
        message: "Please fill up the form properly",
        color: "red",
      });
      setIsFormLoading(false);
      return true;
    }

    const formData = new FormData();

    const payload = { name: form.values.name };

    formData.append("payload", JSON.stringify(payload));

    if (form.values.image.length > 0) {
      formData.append("avatar", form.values.image[0].file);
    }

    axios
      .patch("api/user/account/profile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setReset(false);
        setSessionedUserData({
          ...sessionedUserData,
          ...res.data.profile,
        });
        if (res.data.profile.avatar)
          updateSessionedUser({
            ...sessionedUserData,
            avatar: res.data.profile.avatar,
          });
        showNotification({
          title: "Success!",
          message: "Profile updated.",
          color: "teal",
        });
        setIsFormLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showNotification({
          title: "Error!",
          message:
            "There was a problem submitting your requrest. Try again later.",
          color: "red",
        });
        setIsFormLoading(false);
      });
  };

  const cancel = () => {
    form.setValues({ name: sessionedUserData.name, image: [] });
    setPTempImgUrl(sessionedUserData.avatar);
    setReset(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <Stack>
        <ProfileComponent
          form={form}
          sessionedUserData={sessionedUserData}
          isFormLoading={isFormLoading}
          pTempImgUrl={pTempImgUrl}
          setPTempImgUrl={setPTempImgUrl}
        />
        <Group spacing={2} position="right">
          <Button
            variant="subtle"
            color="gray.7"
            disabled={!reset || isFormLoading}
            onClick={() => cancel()}
          >
            Cancel
          </Button>
          <Button
            color="yellow.8"
            type="submit"
            disabled={!reset || isFormLoading}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

const AccountInformation = (props) => {
  const {
    sessionedUserData,
    setSessionedUserData,
    isFormLoading,
    setIsFormLoading,
  } = props;
  const emailForm = useForm({
    initialValues: {
      email: "",
    },
    validate: zodResolver(accountEmailEditSchema),
  });
  const numberForm = useForm({
    initialValues: {
      countryCode: null,
      number: null,
    },
    validate: zodResolver(accountPhoneNumberEditSchema),
  });

  const updateEmail = (formState) => {
    setIsFormLoading(true);
    if (emailForm.validate().hasErrors) {
      showNotification({
        title: "Error updating your email!",
        message: "Please fill up the form properly",
        color: "red",
      });
      setIsFormLoading(false);
      return true;
    }

    if (emailForm.values.email === sessionedUserData.email) {
      showNotification({
        title: "No changes made!",
        message: "There were no new updates from your input.",
        color: "yellow.8",
      });
      formState(false);
      setIsFormLoading(false);
      return true;
    }
    axios
      .patch(
        `api/user/account/email`,
        { email: emailForm.values.email },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setSessionedUserData({
          ...sessionedUserData,
          email: res.data.newEmail,
        });
        showNotification({
          title: "Success!",
          message: "Email updated.",
          color: "teal",
        });
        formState(false);
        setIsFormLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showNotification({
          title: "Error!",
          message:
            "There was a problem submitting your requrest. Try again later.",
          color: "red",
        });
        setIsFormLoading(false);
      });
  };

  const updateNumber = (formState) => {
    setIsFormLoading(true);
    if (numberForm.validate().hasErrors) {
      showNotification({
        title: "Error updating your phone number!",
        message: "Please fill up the form properly",
        color: "red",
      });
      setIsFormLoading(false);
      return true;
    }
    if (numberForm.values.number === sessionedUserData.phoneNumber.number) {
      showNotification({
        title: "No changes made!",
        message: "There were no new updates from your input.",
        color: "yellow.8",
      });
      formState(false);
      setIsFormLoading(false);
      return true;
    }
    axios
      .patch(
        `api/user/account/phonenumber`,
        { phoneNumber: { ...numberForm.values } },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setSessionedUserData({
          ...sessionedUserData,
          phoneNumber: res.data.newPhoneNumber,
        });
        showNotification({
          title: "Success!",
          message: "Phone number updated.",
          color: "teal",
        });
        formState(false);
        setIsFormLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showNotification({
          title: "Error!",
          message:
            "There was a problem submitting your requrest. Try again later.",
          color: "red",
        });
        setIsFormLoading(false);
      });
  };

  useEffect(() => {
    if (sessionedUserData) {
      emailForm.setValues({ email: sessionedUserData.email });
      numberForm.setValues({
        number: sessionedUserData.phoneNumber?.number,
        countryCode: sessionedUserData.phoneNumber?.countryCode,
      });
      // setUsername(sessionedUserData.username);
      // setEmail(sessionedUserData.email);
      // setPhoneNumber(sessionedUserData.phoneNumber);
    }
  }, [sessionedUserData]);

  return (
    <Stack>
      <Box>
        <Box
          sx={(theme) => ({
            marginBottom: "30px",
            [theme.fn.largerThan("md")]: {
              // marginLeft: isSetup && "40px",
            },
          })}
        >
          <Divider
            size="sm"
            sx={(theme) => ({
              width: "80px",
              // borderTopColor: `${theme.colors.yellow[6]} !important`,
            })}
          />
          <Text weight={600} color="dark.4" mt="xs">
            Account
          </Text>
          <Text color="gray.5" size="sm">
            Information that will not be displayed to users
          </Text>
        </Box>
        <Grid gutter="lg" className="input-container">
          <ItemInfo label="Username" refData={sessionedUserData?.username} />
          <ItemInfo
            label="Email"
            refData={sessionedUserData?.email}
            isEmail={true}
            editable={false}
            form={emailForm}
            inputValue="email"
            isFormLoading={isFormLoading}
            save={updateEmail}
          />
          <ItemInfo
            label="Phone Number"
            refData={sessionedUserData?.phoneNumber}
            isPhoneNumber={true}
            editable={true}
            form={numberForm}
            inputValue="number"
            isFormLoading={isFormLoading}
            save={updateNumber}
          />
        </Grid>
      </Box>
    </Stack>
  );
};

const ItemInfo = ({
  label,
  refData,
  isNumber,
  isPhoneNumber,
  editable,
  form,
  inputValue,
  isFormLoading,
  save,
}) => {
  const [update, setUpdate] = useState(false);
  return (
    <>
      <Grid.Col span={12} sm={3} lg={4} className="item-a">
        <Text size="sm" weight={600} color="dark.4">
          {label}:
        </Text>
      </Grid.Col>
      <Grid.Col span={12} sm={9} lg={8} className="item-b">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(setUpdate);
          }}
        >
          {update ? (
            <Box sx={{ display: "flex" }}>
              {isNumber || isPhoneNumber ? (
                <NumberInput
                  sx={{ flex: 1 }}
                  icon={
                    isPhoneNumber && (
                      <Text size="sm" color="dark.4">
                        +63
                      </Text>
                    )
                  }
                  hideControls
                  {...form.getInputProps(inputValue)}
                  disabled={isFormLoading}
                />
              ) : (
                <TextInput
                  sx={{ flex: 1 }}
                  {...form.getInputProps(inputValue)}
                  disabled={isFormLoading}
                />
              )}

              <Group spacing={6} ml={10}>
                <Button
                  variant="default"
                  size="xs"
                  disabled={isFormLoading}
                  onClick={() => {
                    setUpdate(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="green"
                  size="xs"
                  disabled={isFormLoading}
                  type="submit"
                >
                  Save
                </Button>
              </Group>
            </Box>
          ) : (
            <Group position="apart">
              <Text size="sm" weight={600} color="gray.6">
                {editable ? (
                  <>
                    {isPhoneNumber && "+63 "}
                    {form?.values[inputValue]}
                  </>
                ) : (
                  refData
                )}
              </Text>
              {editable && (
                <Button
                  variant="default"
                  size="xs"
                  disabled={isFormLoading}
                  onClick={() => {
                    setUpdate(true);
                  }}
                >
                  Update
                </Button>
              )}
            </Group>
          )}
        </form>
      </Grid.Col>
    </>
  );
};

export default Profile;
