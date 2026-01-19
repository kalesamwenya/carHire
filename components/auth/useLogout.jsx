// Within your Header or Sidebar component
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function useLogout() {
    const router = useRouter();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        try {
            // 1. Tell the backend to destroy the session
            if (token) {
                await axios.post('http://api.citydrivehire.local/users/logout.php', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (err) {
            console.error("Server-side logout failed, clearing local session anyway.");
        } finally {
            // 2. Clear local storage regardless of server success
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');

            toast.success("Logged out successfully");
            
            // 3. Redirect to sign-in page
            router.push('/auth/signin');
        }
    };

    return { handleLogout };
}