"use client";

import { Box, Modal } from "@mui/material";
import { FC } from "react";

type RouteType = "Login" | "Sign-Up" | "Verification";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  component: any;
  setRoute?: (route: RouteType) => void; // Corrected type
  refetch?: any;
};

const CustomModal: FC<Props> = ({
  open,
  setOpen,
  setRoute,
  component: Component,
  refetch,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <Component setRoute={setRoute} setOpen={setOpen} refetch={refetch} />
      </Box>
    </Modal>
  );
};

export default CustomModal;
