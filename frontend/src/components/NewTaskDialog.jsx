import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    MenuItem,
    Button,
    Box,
    Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { getGroupsForUser } from "../api/apigroups";
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
    title: "",
    description: "",
    dueDate: "",
    groupId: "",
    assignedUserId: "",
};

// Reusable static label, used above every field for consistent spacing
// (avoids floating-label overlap issues, e.g. with native date inputs)
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

export default function NewTaskDialog({ open, onClose, onCreate }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const { user } = useUser();
    const [groups, setGroups] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (!user) return;

        const loadGroups = async() => {
            const groupRes = await getGroupsForUser(user.id);
            setGroups(groupRes.data);
        }

        loadGroups();
    }, [open, user]);

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
        if (!form.title.trim()) nextErrors.title = "Title is required";
        if (!form.dueDate) nextErrors.dueDate = "Due date is required";
        if (!form.groupId) nextErrors.groupId = "Group is required";
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const newTask = {
            title: form.title.trim(),
            description: form.description.trim(),
            status: "todo",
            dueDate: form.dueDate,
            groupId: form.groupId,
            creatorId: user.id,
        }

        onCreate?.(newTask);
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
                        Task
                    </Box>
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
                    <Box>
                        <FieldLabel error={!!errors.title}>Title</FieldLabel>
                        <TextField
                            placeholder="e.g. Design Homepage Mockup"
                            value={form.title}
                            onChange={handleChange("title")}
                            error={!!errors.title}
                            helperText={errors.title}
                            fullWidth
                            sx={inputSx}
                        />
                    </Box>

                    <Box>
                        <FieldLabel>Description</FieldLabel>
                        <TextField
                            placeholder="What needs to be done?"
                            value={form.description}
                            onChange={handleChange("description")}
                            multiline
                            minRows={3}
                            fullWidth
                            sx={inputSx}
                        />
                    </Box>

                    <Box>
                        <FieldLabel error={!!errors.dueDate}>Due Date</FieldLabel>
                        <TextField
                            type="date"
                            value={form.dueDate}
                            onChange={handleChange("dueDate")}
                            error={!!errors.dueDate}
                            helperText={errors.dueDate}
                            fullWidth
                            sx={inputSx}
                        />
                    </Box>

                    <Box>
                        <FieldLabel error={!!errors.groupId}>Group</FieldLabel>
                        <TextField
                            select
                            value={form.groupId}
                            onChange={handleChange("groupId")}
                            error={!!errors.groupId}
                            helperText={errors.groupId}
                            fullWidth
                            sx={inputSx}
                        >
                            {groups.map((group) => (
                                <MenuItem key={group.id} value={group.id}>
                                    {group.name}
                                </MenuItem>
                            ))}
                        </TextField>
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
                        Create Task
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}