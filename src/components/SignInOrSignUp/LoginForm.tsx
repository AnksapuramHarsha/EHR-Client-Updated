import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../apis/auth';
import { LoginRequest } from '../../types/auth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState<LoginRequest>({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token } = await loginUser(formData);
            const expiration = new Date().getTime() + 5 * 60 * 60 * 1000;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('token_expiry', expiration.toString());
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch {
            toast.error('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-transparent">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white/70 backdrop-blur-lg rounded-xl shadow-2xl p-8 space-y-6 border border-white/30">
                <h2 className="text-2xl font-bold text-center text-primary">Login</h2>

                <div>
                    <label className="label text-sm">Username</label>
                    <input name="username" value={formData.username} onChange={handleChange} className="input input-bordered w-full" placeholder="Enter username" />
                </div>

                <div>
                    <label className="label text-sm">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="input input-bordered w-full" placeholder="Enter password" />
                </div>
                <button type="submit" className="btn btn-primary w-full">Login</button>
                <div className="text-center text-sm text-gray-500">
                    <p>Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link></p>
                </div>

            </form>

        </div>
    );
};

export default LoginForm;
