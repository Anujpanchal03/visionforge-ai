import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const transactionId = searchParams.get("transactionId");

    const { backendUrl, loadCreditsData, token } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            if (!token || !transactionId) {
                navigate('/dashboard');
                return;
            }

            try {
                const { data } = await axios.post(
                    `${backendUrl}/api/user/verify-stripe`,
                    { success, transactionId },
                    { headers: { token } }
                );

                if (data.success) {
                    toast.success(data.message || 'Payment verified! Credits added.');
                    loadCreditsData();
                } else {
                    toast.error(data.message || 'Payment verification failed');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message || 'Verification error');
            } finally {
                navigate('/dashboard');
            }
        };

        verifyPayment();
    }, [token, transactionId, success, backendUrl, loadCreditsData, navigate]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-600">Verifying transaction details...</p>
        </div>
    );
};

export default Verify;