import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, TextField, Button, Box, Typography, } from "@mui/material";
import { X } from "lucide-react";
import { useUser } from "../UserContext";

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        fontFamily: "'Inter', sans-serif",
        "& fieldset": {
            borderColor: "rgba(15,15,35,0.1)",
        },
        "&:hover fieldset": {
            borderColor: "rgba(99,102,241,0.5)",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#6366f1",
        },
    },
};

const emptyForm = {
    name: "",
    description: "",
};

// Reusable static label, kept consistent with NewTaskDialog
function FieldLabel({ children, error, optional }) {
    return (
        <Typography
            sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.8rem",
                color: error ? "#d32f2f" : "#3f3f46",
                mb: 0.75,
            }}
        >
            {children}
            {optional && (
                <Box
                    component="span"
                    sx={{ fontWeight: 400, color: "#a1a1aa", ml: 0.5 }}
                >
                    (optional)
                </Box>
            )}
        </Typography>
    );
}

export default function NewGroupDialog({ open, onClose, onCreate }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const { user, loading} = useUser();

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleClose = () => {
        setForm(emptyForm);
        setErrors({});
        onClose();
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.name.trim()) nextErrors.name = "Group name is required";
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const newGroup = {
            name: form.name.trim(),
            description: form.description.trim(),
            creatorId: user.id,
        };

        onCreate?.(newGroup);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    p: 1,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                }}
            >
                <Typography
                    component="span"
                    sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "1.4rem",
                    }}
                >
                    New{" "}
                    <Box
                        component="span"
                        sx={{
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Group
                    </Box>
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
                    <Box>
                        <FieldLabel error={!!errors.name}>Group Name</FieldLabel>
                        <TextField
                            placeholder="e.g. Design Team"
                            value={form.name}
                            onChange={handleChange("name")}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            sx={inputSx}
                        />
                    </Box>

                    <Box>
                        <FieldLabel optional>Description</FieldLabel>
                        <TextField
                            placeholder="What is this group responsible for?"
                            value={form.description}
                            onChange={handleChange("description")}
                            multiline
                            minRows={3}
                            fullWidth
                            sx={inputSx}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5,
                        mt: 4,
                        mb: 1,
                    }}
                >
                    <Button
                        onClick={handleClose}
                        sx={{
                            textTransform: "none",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            color: "#71717a",
                            borderRadius: 2.5,
                            px: 2.5,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        sx={{
                            textTransform: "none",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            color: "#ffffff",
                            borderRadius: 2.5,
                            px: 3,
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            boxShadow: "0 4px 10px rgba(99,102,241,0.3)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #5457e0, #7c4fe6)",
                                boxShadow: "0 6px 14px rgba(99,102,241,0.4)",
                            },
                        }}
                    >
                        Create Group
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}