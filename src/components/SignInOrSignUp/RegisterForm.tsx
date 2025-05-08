import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../apis/auth';
import { RegisterRequest } from '../../types/auth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState<RegisterRequest>({
        username: '',
        password: '',
        networkId: '',
        organizationId: '',
        departmentId: '',
        roles: [],
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, roles: value ? [value] : [] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            toast.success('Registration successful!');
            navigate('/');
        } catch {
            toast.error('Registration failed. Please try again.');

        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-transparent">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white/70 backdrop-blur-lg rounded-xl shadow-2xl p-8 space-y-6 border border-white/30">
                <h2 className="text-2xl font-bold text-center text-primary">Register</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className="label text-sm font-medium">Username</label>
                        <input name="username" value={formData.username} onChange={handleChange} className="input input-bordered w-full" placeholder="Enter username" />
                    </div>
                    <div>
                        <label className="label text-sm font-medium">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="input input-bordered w-full" placeholder="Enter password" />
                    </div>

                    <div>
                        <label className="label text-sm font-medium">Network</label>
                        <select name="networkId" value={formData.networkId} onChange={handleChange} className="select select-bordered w-full">
                            <option value="">Select Network</option>
                            <option value="03cEFceE-E629-ceEb-6DB2-9f85d3201Bfa">Network 1</option>
                        </select>
                    </div>

                    <div>
                        <label className="label text-sm font-medium">Organization</label>
                        <select name="organizationId" value={formData.organizationId} onChange={handleChange} className="select select-bordered w-full">
                            <option value="">Select Organization</option>
                            <option value="9F0D810E-BDb2-88C3-61eD-fA051BD8CE10">Organization 1</option>
                        </select>
                    </div>

                    <div>
                        <label className="label text-sm font-medium">Department</label>
                        <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="select select-bordered w-full">
                            <option value="">Select Department</option>
                            <option value="d2ff83E2-b3dA-F064-4eeA-ECdC2DD3454B">Department 1</option>
                        </select>
                    </div>

                    <div>
                        <label className="label text-sm font-medium">Role</label>
                        <select value={formData.roles[0] || ''} onChange={handleRoleChange} className="select select-bordered w-full">
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="receptionist">Receptionist</option>
                        </select>
                    </div>

                </div>

                <button type="submit" className="btn btn-primary w-full">Register</button>
                <div className="text-center text-sm text-gray-500">
                    <p>Already have an account? <Link to="/" className="text-blue-500 hover:underline">Login here</Link></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
