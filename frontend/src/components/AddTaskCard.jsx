import { CardContent, Typography, Card, Box } from "@mui/material";
import { Plus } from "lucide-react";

export default function AddTaskCard({ onClick }) {
    return (
        <Card
            onClick={onClick}
            sx={{
                minWidth: 280,
                maxWidth: 350,
                height: '100%',
                minHeight: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: 'divider',
                backgroundColor: 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                }
            }}
        >
            <CardContent>
                <Box sx= {{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}
                    >
                        <Plus size={24} />
                    </Box>
                    <Typography variant="body1" fontWeight="medium" color="text.secondary">
                        Add New Task
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}