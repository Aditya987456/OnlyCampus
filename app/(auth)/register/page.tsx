
// app/register/page.tsx
'use client';
import { useRouter } from 'next/navigation';


export default function Register() {
const router = useRouter();


const handleRegister = (e: React.FormEvent) => {
e.preventDefault();
router.push('/login');
};


return (
<div className="min-h-screen flex items-center justify-center bg-gray-50">
<form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-md w-96">
<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
<input type="text" placeholder="Full Name" className="w-full mb-4 p-2 border rounded" required />
<input type="email" placeholder="Email" className="w-full mb-4 p-2 border rounded" required />
<input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" required />
<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
</form>
</div>
);
}