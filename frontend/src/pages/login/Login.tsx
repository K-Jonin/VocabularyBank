import React, { useState } from 'react';
import { IoIosMail } from 'react-icons/io';
import { RiLockPasswordFill } from 'react-icons/ri';
import styles from './Login.module.scss';
import { InputText } from '@/components/common/input/InputText';
import { Button } from '@/components/common/button/Button';
import { useAuth } from '@/hooks/useAuth';

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, errorMessage, isLoading } = useAuth();

  /** サブミット */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        <div className={styles.errorContainer}>
          <p className='error' role='alert'>
            {errorMessage}
          </p>
        </div>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor='email'>
                <IoIosMail />
              </label>
              <InputText
                variant='user'
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete='email'
                placeholder='Email'
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='password'>
                <RiLockPasswordFill />
              </label>
              <InputText
                variant='user'
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hasPasswordMask={true}
                placeholder='Password'
              />
            </div>
            <div className={styles.submitButtonWrapper}>
              <Button
                type='submit'
                variant='primary'
                fullWidth
                isLoading={isLoading}
              >
                Login
              </Button>
            </div>
            <p className={styles.signUp}>
              {/* TODO: ユーザー登録未実装 */}
              <a href='/login'>or sign up..</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
