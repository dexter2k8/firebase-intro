"use client";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
// import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { API } from "@/app/paths";
import Button from "@/components/Button";
import Input from "@/components/Input";
// import { useSWR } from "@/hook/useSWR";
import schema from "@/schemas/validateEditProfile";
// import api from "@/services/api";
import ChangePasswordModal from "./__components__/ChangePasswordModal";
import styles from "./styles.module.scss";
// import type { SubmitHandler } from "react-hook-form";
// import type { IGetSelfUser } from "@/app/api/get_self_user/types";
import type { IEditProfileProps } from "./types";

export default function EditProfile() {
  // const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { form, item } = styles;
  const {
    control,
    setValue,
    watch,
    // handleSubmit
  } = useForm<IEditProfileProps>({
    resolver: yupResolver(schema),
  });

  // const { response: selfUser, mutate } = useSWR<IGetSelfUser>(API.GET_SELF_USER);
  // useEffect(() => {
  //   if (selfUser) {
  //     setValue("name", selfUser.name);
  //     setValue("email", selfUser.email);
  //     setValue("avatar", selfUser.avatar);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selfUser]);

  // const onSubmit: SubmitHandler<IEditProfileProps> = async (data) => {
  //   const { password, ...rest } = data;
  //   const parsedData = password ? { password } : rest;
  //   try {
  //     setLoading(true);
  //     const response = await api.client.patch("/api/patch_self_user", parsedData);
  //     mutate();
  //     setOpenModal(false);
  //     setLoading(false);
  //     handleCloseModal();
  //     toast.success("Profile updated successfully");
  //     return response.data;
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       toast.error(error?.message);
  //     }
  //   }
  // };

  const handleCloseModal = () => {
    setOpenModal(false);
    setValue("password", undefined);
    setValue("confirmPassword", undefined);
  };

  return (
    <>
      <center>
        <form
          className={form}
          // onSubmit={handleSubmit(onSubmit)}
        >
          <div className={item}>
            <label htmlFor="name">Name</label>
            <Input.Controlled control={control} name="name" id="name" />
          </div>
          <div className={item}>
            <label htmlFor="email">Email</label>
            <Input.Controlled control={control} name="email" id="email" />
          </div>
          <div className={item}>
            <label htmlFor="avatar">Avatar URL</label>
            <Input.Controlled control={control} name="avatar" id="avatar" />
          </div>
          <Button
            // loading={loading}
            size="large"
            variant="primary"
          >
            Update
          </Button>
        </form>
        <Button onClick={() => setOpenModal(true)}>Change Password</Button>
      </center>

      <ChangePasswordModal
        okDisabled={!watch("password")}
        loading={false}
        // loading={loading}
        open={openModal}
        control={control}
        onClose={handleCloseModal}
        onSubmit={() => {}}
        // onSubmit={handleSubmit(onSubmit)}
      />
    </>
  );
}
