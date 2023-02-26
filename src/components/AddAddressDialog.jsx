import {
  Box,
  Button,
  Checkbox,
  Chip,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import React, { useEffect, useRef, useState } from "react";
import { addressSchema } from "utils/Schema/UserSchema";
import regionJson from "lib/ph-addresses/short-region";
import provinceJson from "lib/ph-addresses/province";
import cityJson from "lib/ph-addresses/city";
import barangayJson from "lib/ph-addresses/barangay";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { getAddressValue } from "lib/address";

function AddDialog(props) {
  const {
    setOpenDialog,
    openDialog,
    updateFieldsRef,
    isFixDefault,
    setSessionedUserData,
    setAddressEdit,
    addressEdit,
    setAddresses,
  } = props;
  const [isFormLoading, setIsFormLoading] = useState(false);
  const localupdateRef = useRef(true);

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const updateRef =
    updateFieldsRef === undefined ? localupdateRef : updateFieldsRef;

  useEffect(() => {
    if (addressEdit) {
      const addressData = {
        region: getAddressValue(addressEdit.region, "region", "label", "id"),
        province: getAddressValue(
          addressEdit.province,
          "province",
          "label",
          "id"
        ),
        city: getAddressValue(addressEdit.city, "city", "label", "id"),
        barangay: getAddressValue(
          addressEdit.barangay,
          "barangay",
          "label",
          "id",
          addressEdit.city
        ),
        zipCode: parseInt(addressEdit.zipCode),
        addressLine1: addressEdit.addressLine1,
      };

      form.setValues({
        ...addressData,
        name: addressEdit.name,
        phoneNumber: addressEdit.phoneNumber,
        label: addressEdit.label,
        isDefault: addressEdit.isDefault,
      });
    }
  }, [addressEdit]);

  useEffect(() => {
    if (!openDialog && addressEdit) {
      form.setValues({
        name: "",
        phoneNumber: { countryCode: 63, number: null },
        region: "",
        province: "",
        city: "",
        barangay: "",
        zipCode: null,
        addressLine1: "",
        label: "",
        isDefault: false,
      });
      setAddressEdit();
    }
  }, [openDialog]);

  const form = useForm({
    initialValues: {
      name: "",
      phoneNumber: { countryCode: 63, number: null },
      region: "",
      province: "",
      city: "",
      barangay: "",
      zipCode: null,
      addressLine1: "",
      label: "",
      isDefault: false,
    },
    validate: zodResolver(addressSchema),
  });

  useEffect(() => {
    let regions = [];
    regionJson.forEach((val, i) => {
      regions.push({ value: val.id, label: val.name });
    });
    setRegions(regions);
  }, []);

  useEffect(() => {
    if (isFixDefault) form.setValues({ isDefault: isFixDefault });
  }, [isFixDefault]);

  useEffect(() => {
    const fRegion = form.values.region;
    if (fRegion) {
      if (updateRef.current) {
        form.setFieldValue("province", "");
        form.setFieldValue("city", "");
        form.setFieldValue("barangay", "");
        setProvinces([]);
        setCities([]);
        setBarangays([]);
      }
      const regionInfo = regionJson.find((el) => el.id === fRegion);
      if (regionInfo) {
        const provinceInfo = provinceJson.filter((el) => {
          return regionInfo.provinces.find((element) => {
            return el.province_code === element;
          });
        });

        if (provinceInfo) {
          let filteredProvinces = [];
          provinceInfo.forEach((val, i) => {
            filteredProvinces.push({
              value: val.province_code,
              label: val.province_name,
            });
          });
          filteredProvinces.sort((a, b) => a.label.localeCompare(b.label));
          setProvinces(filteredProvinces);
        }
      }
    }
  }, [form.values.region]);

  useEffect(() => {
    const fProvince = form.values.province;
    if (fProvince) {
      if (updateRef.current) {
        form.setFieldValue("city", "");
        form.setFieldValue("barangay", "");
        setCities([]);
        setBarangays([]);
      }
      const cityInfo = cityJson.filter((el) => {
        return el.province_code === fProvince;
      });
      if (cityInfo) {
        let modifiedCity = [];
        cityInfo.forEach((val, i) => {
          modifiedCity.push({
            value: val.city_code,
            label: val.city_name,
          });
        });
        modifiedCity.sort((a, b) => a.label.localeCompare(b.label));
        setCities(modifiedCity);
      }
    }
  }, [form.values.province]);

  useEffect(() => {
    const fCity = form.values.city;
    if (fCity) {
      if (updateRef.current) {
        form.setFieldValue("barangay", "");
        setBarangays([]);
      }
      const barangayInfo = barangayJson.filter((el) => {
        return el.city_code === fCity;
      });
      if (barangayInfo) {
        let modifiedBarangays = [];
        barangayInfo.forEach((val, i) => {
          modifiedBarangays.push({
            value: val.brgy_code,
            label: val.brgy_name,
          });
        });
        modifiedBarangays.sort((a, b) => a.label.localeCompare(b.label));
        setBarangays(modifiedBarangays);
      }
    }
  }, [form.values.city]);

  const save = () => {
    setIsFormLoading(true);
    if (form.validate().hasErrors) {
      showNotification({
        title: "Error!",
        message: "Please fill up the form properly",
        color: "red",
      });
      setIsFormLoading(false);
      return true;
    }

    if (addressEdit) {
      const values = { ...form.values };
      const keys = Object.keys(values);
      values.zipCode = values.zipCode.toString();
      values.region = getAddressValue(values.region, "region", "id", "label");
      values.province = getAddressValue(
        values.province,
        "province",
        "id",
        "label"
      );
      values.city = getAddressValue(values.city, "city", "id", "label");
      values.barangay = getAddressValue(
        values.barangay,
        "barangay",
        "id",
        "label"
      );
      let changes = [];
      keys.forEach((v) => {
        if (values[v] !== addressEdit[v]) {
          return changes.push(v);
        }
      });

      if (changes.length === 0) {
        showNotification({
          title: "Action not available!",
          message: "No new updates.",
          color: "yellow.8",
        });
        setIsFormLoading(false);
        return true;
      }
      return axios
        .patch(
          `api/user/address/${addressEdit._id}`,
          { address: { ...form.values, country: "PH" } },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (setAddresses) {
            setAddresses(res.data.Addresses);
          }
          setSessionedUserData((v) => {
            return { ...v, Addresses: res.data.Addresses };
          });
          showNotification({
            title: "Success",
            message: "Successfully added your address",
            color: "teal",
          });
          setOpenDialog(false);
          setIsFormLoading(false);
        })
        .catch((err) => {
          showNotification({
            title: "Error!",
            message:
              "There was a problem submitting your form. Please try again later.",
            color: "red",
          });
          setIsFormLoading(false);
        });
    }
    axios
      .post(
        `api/user/address`,
        { address: { ...form.values, country: "PH" } },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (setAddresses) {
          setAddresses(res.data.Addresses);
        }
        setSessionedUserData((v) => {
          return { ...v, Addresses: res.data.Addresses };
        });
        showNotification({
          title: "Success",
          message: "Successfully added your address",
          color: "teal",
        });
        setOpenDialog(false);
        setIsFormLoading(false);
      })
      .catch((err) => {
        showNotification({
          title: "Error!",
          message:
            "There was a problem submitting your form. Please try again later.",
          color: "red",
        });
        setIsFormLoading(false);
      });
  };

  return (
    <>
      <Modal
        opened={openDialog}
        onClose={() => setOpenDialog(false)}
        title={
          <Text size="xl" weight={500} color="dark.4">
            New address
          </Text>
        }
        centered
        overflow="inside"
      >
        <Box pb={20}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <Stack>
              <TextInput
                placeholder="Joseph Dela Cruz"
                label="Full name"
                withAsterisk
                disabled={isFormLoading}
                {...form.getInputProps("name")}
              />
              <NumberInput
                placeholder="9xxxxxxxxx"
                label="Phone Number"
                withAsterisk
                hideControls
                disabled={isFormLoading}
                icon={
                  <Text size="sm" color="dark.4">
                    +63
                  </Text>
                }
                {...form.getInputProps("phoneNumber.number")}
              />
              <Select
                label="Region"
                placeholder="Select your region"
                withAsterisk
                data={regions}
                disabled={isFormLoading}
                {...form.getInputProps("region")}
                onChange={(v) => {
                  form.setFieldValue("region", v);
                  if (!updateRef.current) {
                    updateRef.current = true;
                  }
                }}
              />
              <Select
                label="Select your province"
                placeholder="Province"
                withAsterisk
                data={provinces}
                disabled={isFormLoading}
                // disabled={form.values.region.length !== 0 ? false : true}
                {...form.getInputProps("province")}
                onChange={(v) => {
                  form.setFieldValue("province", v);
                  if (!updateRef.current) {
                    updateRef.current = true;
                  }
                }}
              />
              <Select
                label="City"
                placeholder="Select your City"
                withAsterisk
                data={cities}
                disabled={isFormLoading}
                {...form.getInputProps("city")}
                onChange={(v) => {
                  form.setFieldValue("city", v);
                  if (!updateRef.current) {
                    updateRef.current = true;
                  }
                }}
              />
              <Select
                label="Barangay"
                placeholder="Select your Barangay"
                withAsterisk
                data={barangays}
                disabled={isFormLoading}
                {...form.getInputProps("barangay")}
                onChange={(v) => {
                  form.setFieldValue("barangay", v);
                  if (!updateRef.current) {
                    updateRef.current = true;
                  }
                }}
              />
              <NumberInput
                placeholder="3100"
                label="Zip Code"
                withAsterisk
                hideControls
                disabled={isFormLoading}
                {...form.getInputProps("zipCode")}
              />
              <Textarea
                placeholder="House No., Street Name, Building Name, Unit No"
                label="Address Line"
                withAsterisk
                disabled={isFormLoading}
                {...form.getInputProps("addressLine1")}
              />
              <Stack spacing={1}>
                <Text size={14} color="#212529" weight={500}>
                  Label<span style={{ color: "#fa5252" }}>&nbsp;*</span>
                </Text>
                <Chip.Group
                  position="left"
                  sx={() => ({})}
                  disabled={isFormLoading}
                  value={form.values.label}
                  onChange={(v) => {
                    form.setValues({ label: v });
                  }}
                >
                  <Chip value="Home" disabled={isFormLoading}>
                    Home
                  </Chip>
                  <Chip value="Work" disabled={isFormLoading}>
                    Work
                  </Chip>
                </Chip.Group>
              </Stack>
              <TextInput
                sx={{
                  ".mantine-Text-root": {
                    marginTop: "-4px",
                  },
                  ".mantine-Input-wrapper": {
                    display: "none",
                  },
                }}
                {...form.getInputProps("label")}
              />
              <Checkbox
                mt="md"
                label={
                  <Text size={14} color="#212529" weight={500}>
                    Default Address
                  </Text>
                }
                checked={form.values.isDefault}
                disabled={
                  isFixDefault ||
                  isFormLoading ||
                  (addressEdit && addressEdit.isDefault)
                }
                {...form.getInputProps("isDefault", { type: "checkbox" })}
              />
              <Group position="right" mt={40}>
                <Button
                  variant="default"
                  disabled={isFormLoading}
                  onClick={() => {
                    setOpenDialog(false);
                  }}
                >
                  Cancel
                </Button>
                <Button disabled={isFormLoading} type="submit">
                  {addressEdit ? "Save" : "Add"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default AddDialog;
