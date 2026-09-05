import { createContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);
    const [credit, setCredit] = useState(0);
    const [stats, setStats] = useState({ availableCredits: 0, generatedCount: 0, creditsUsed: 0 });
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const navigate = useNavigate();

    const loadCreditsData = useCallback(async () => {
        if (!token) return;
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
                headers: { token }
            });
            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
                if (data.stats) {
                    setStats(data.stats);
                }
            } else if (data.message && data.message.toLowerCase().includes('authorized')) {
                logout();
            }
        } catch (error) {
            console.error('Error loading credits:', error);
        }
    }, [token, backendUrl]);

    const loadHistory = useCallback(async () => {
        if (!token) return [];
        setLoadingHistory(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/image/history`, {
                headers: { token }
            });
            if (data.success) {
                setHistory(data.history || []);
                return data.history;
            }
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoadingHistory(false);
        }
        return [];
    }, [token, backendUrl]);

    const generateImage = async ({ prompt, style = 'Realistic', negativePrompt = '', aspectRatio = '1:1' }) => {
        if (!token) {
            setShowLogin(true);
            toast.info('Please sign in to generate images');
            return null;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/image/generate-image`,
                { prompt, style, negativePrompt, aspectRatio },
                { headers: { token } }
            );

            if (data.success) {
                setCredit(data.creditBalance);
                loadCreditsData();
                loadHistory();
                toast.success('Image generated successfully! (1 Credit used)');
                return {
                    resultImage: data.resultImage,
                    creditBalance: data.creditBalance,
                    generation: data.generation
                };
            } else {
                toast.error(data.message || 'Generation failed');
                if (typeof data.creditBalance === 'number') {
                    setCredit(data.creditBalance);
                }
                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
                return null;
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Image generation failed';
            toast.error(msg);
            return null;
        }
    };

    const deleteHistoryItem = async (id) => {
        if (!token) return false;
        try {
            const { data } = await axios.delete(`${backendUrl}/api/image/history/${id}`, {
                headers: { token }
            });
            if (data.success) {
                setHistory(prev => prev.filter(item => item._id !== id));
                toast.success('Image removed from gallery');
                loadCreditsData();
                return true;
            } else {
                toast.error(data.message || 'Failed to delete');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting image');
        }
        return false;
    };

    const toggleFavoriteItem = async (id) => {
        if (!token) return;
        try {
            const { data } = await axios.patch(`${backendUrl}/api/image/history/${id}/favorite`, {}, {
                headers: { token }
            });
            if (data.success) {
                setHistory(prev => prev.map(item => item._id === id ? { ...item, isFavorite: data.isFavorite } : item));
            }
        } catch (error) {
            console.error('Favorite toggle error:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setCredit(0);
        setStats({ availableCredits: 0, generatedCount: 0, creditsUsed: 0 });
        setHistory([]);
        toast.info('Logged out successfully');
        navigate('/');
    };

    useEffect(() => {
        if (token) {
            loadCreditsData();
            loadHistory();
        } else {
            setUser(null);
            setCredit(0);
        }
    }, [token, loadCreditsData, loadHistory]);

    const value = {
        token,
        setToken,
        user,
        setUser,
        showLogin,
        setShowLogin,
        credit,
        setCredit,
        stats,
        history,
        loadingHistory,
        loadCreditsData,
        loadHistory,
        generateImage,
        deleteHistoryItem,
        toggleFavoriteItem,
        backendUrl,
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;