import { useUser } from "../UserContext";
import { useParams, Link,  useNavigate  } from "react-router-dom";
import { getInviteByToken, acceptInvite } from "../api/apigroups";
import { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Mail, CheckCircle2, XCircle, Users } from "lucide-react";

export default function InvitePage() {
    const { user } = useUser();
    const { token } = useParams();
    const [status, setStatus] = useState("loading"); // "loading" | "valid" | "invalid"
    const [groupName, setGroupName] = useState("");
    const { navigate } = useNavigate();

    const handleAcceptInvite = async () => {
        try {
            await acceptInvite(token);
            navigate("/app/groups");
        } catch (error) {
            console.error("Error accepting invite:", error);
        };
    }

    useEffect(() => {
        let active = true;

        const fetchInvite = async () => {
            try {
                const response = await getInviteByToken(token);
                if (!active) return;
                setGroupName(response.data?.groupName ?? "");
                setStatus("valid");
            } catch (error) {
                console.error("Error fetching invite:", error);
                if (!active) return;
                setStatus("invalid");
            }
        };

        fetchInvite();
        return () => { active = false; };
    }, [token]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                position: 'relative',
                background: `
                    radial-gradient(1200px 600px at 15% 0%, rgba(99,102,241,0.10), transparent 60%),
                    radial-gradient(900px 500px at 100% 20%, rgba(139,92,246,0.10), transparent 55%),
                    radial-gradient(1000px 600px at 50% 100%, rgba(16,185,129,0.08), transparent 55%),
                    #fdfdff
                `,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3,
                py: 6,
            }}
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 460,
                    textAlign: 'center',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(15,15,35,0.06)',
                    boxShadow: '0 20px 60px rgba(30,20,80,0.12)',
                    px: { xs: 3.5, sm: 5 },
                    py: 5.5,
                }}
            >
                {/* Icon badge */}
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '14px',
                        mx: 'auto',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        background:
                            status === 'invalid'
                                ? 'linear-gradient(135deg, #ef4444, #f97316)'
                                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        boxShadow:
                            status === 'invalid'
                                ? '0 6px 16px rgba(239,68,68,0.3)'
                                : '0 6px 16px rgba(99,102,241,0.3)',
                    }}
                >
                    {status === 'loading' && <Mail size={26} />}
                    {status === 'valid' && <Users size={26} />}
                    {status === 'invalid' && <XCircle size={26} />}
                </Box>

                {status === 'loading' && (
                    <>
                        <Typography
                            sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1.35rem', mb: 1.5 }}
                        >
                            Checking your invite…
                        </Typography>
                        <CircularProgress size={22} thickness={5} sx={{ color: '#8b5cf6', mt: 1 }} />
                    </>
                )}

                {status === 'valid' && (
                    <>
                        <Typography
                            sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                letterSpacing: '-0.02em',
                                lineHeight: 1.2,
                                mb: 1.5,
                                color: '#18181b',
                            }}
                        >
                            You've been invited to join{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {groupName || 'this group'}
                            </Box>
                        </Typography>

                        <Typography sx={{ color: '#52525b', fontSize: '0.95rem', mb: 4 }}>
                            {user
                                ? "You're signed in — accept below to join the group."
                                : 'Log in or create an account to accept this invite.'}
                        </Typography>

                        <Button
                            component={user ? 'button' : Link}
                            onClick={user ? handleAcceptInvite : undefined}
                            to={user ? undefined : '/login'}
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                py: 1.35,
                                borderRadius: 2.5,
                                boxShadow: '0 6px 18px rgba(99,102,241,0.35)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    boxShadow: '0 8px 22px rgba(99,102,241,0.45)',
                                },
                            }}
                        >
                            {user ? 'Accept Invite' : 'Log In to Accept'}
                        </Button>
                    </>
                )}

                {status === 'invalid' && (
                    <>
                        <Typography
                            sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1.35rem', mb: 1.5, color: '#18181b' }}
                        >
                            Invite not found
                        </Typography>
                        <Typography sx={{ color: '#52525b', fontSize: '0.95rem', mb: 4 }}>
                            This invite link is invalid or has expired. Ask the group owner to send you a new one.
                        </Typography>
                        <Button
                            component={Link}
                            to="/"
                            variant="outlined"
                            fullWidth
                            size="large"
                            sx={{
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                py: 1.3,
                                borderRadius: 2.5,
                                borderColor: 'rgba(99,102,241,0.4)',
                                color: '#6366f1',
                                '&:hover': {
                                    borderColor: '#6366f1',
                                    backgroundColor: 'rgba(99,102,241,0.05)',
                                },
                            }}
                        >
                            Back to Home
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
}