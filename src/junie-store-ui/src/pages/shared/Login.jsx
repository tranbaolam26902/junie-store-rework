// Libraries
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Hooks
import { useLogin } from '@hooks/shared';

// Components
import { Button, Container, Input } from '@components/shared';
import { PageTransition, Underline } from '@components/shared/animations';

export default function Login() {
    // Hooks
    const login = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);

    // Event handlers
    const handleLogin = async (e) => {
        e.preventDefault();

        const loginResult = await login(username, password);

        if (loginResult.isSuccess) {
            const from = location.state?.from?.pathname || '/'; // Get location before login to restore after login. If it doesn't exist, navigate user to home page after login

            navigate(from, { replace: true });
        } else setErrorMessages(loginResult.errors);
    };

    return (
        <PageTransition>
            <Container className='flex flex-col gap-8 md:mx-auto my-32 md:max-w-2xl'>
                <span className='text-3xl font-thin text-center uppercase'>JUNIE VN</span>
                <form className='flex flex-col gap-4' onSubmit={handleLogin}>
                    <span className='text-2xl font-semibold uppercase'>Đăng nhập</span>
                    {errorMessages.map((errorMessage, index) => (
                        <span key={index} className='text-sm text-red text-center'>
                            {errorMessage}
                        </span>
                    ))}
                    <Input
                        label='Tên đăng nhập'
                        id='username'
                        placeholder='Nhập tên đăng nhập'
                        autoFocus
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <Input
                        label='Mật khẩu'
                        id='password'
                        type='password'
                        placeholder='Nhập mật khẩu'
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button
                        submit
                        secondary
                        full
                        disabled={username.trim() === '' || password.trim() === ''}
                        text='Đăng nhập'
                    />
                    <div className='flex items-center justify-between'>
                        <Link
                            to='/account/password-recovery'
                            className='transition duration-200 opacity-50 hover:opacity-100'
                        >
                            Quên mật khẩu?
                        </Link>
                        <div className='flex items-center gap-1'>
                            <span className='font-thin'>Chưa có tài khoản?</span>
                            <Link to='/account/sign-up' className='relative group'>
                                <span>Đăng ký ngay</span>
                                <Underline />
                            </Link>
                        </div>
                    </div>
                </form>
            </Container>
        </PageTransition>
    );
}
