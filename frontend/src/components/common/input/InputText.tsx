import { forwardRef, InputHTMLAttributes, useState } from 'react';
import classNames from 'classnames';
import styles from './InputText.module.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type InputVariant = 'default' | 'user';
type InputSize = 'small' | 'medium' | 'large';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  hasError?: boolean;
  hasPasswordMask?: boolean;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      variant = 'default',
      inputSize = 'medium',
      hasError = false,
      hasPasswordMask = false,
      className,
      type,
      ...props
    },
    ref
  ) => {
    const [unmasking, setUnmasking] = useState(false);

    const inputText = (
      <input
        ref={ref}
        className={classNames(
          styles.base,
          styles[variant],
          styles[inputSize],
          hasError && styles.error,
          hasPasswordMask && styles.passwordMask,
          className
        )}
        type={unmasking ? 'text' : type}
        {...props}
      />
    );

    if (hasPasswordMask) {
      return (
        <div className={classNames(styles.maskInput)}>
          {inputText}
          <button
            className={styles.maskButton}
            type='button'
            onClick={() => setUnmasking((s) => !s)}
            aria-label={unmasking ? 'パスワードを隠す' : 'パスワードを表示'}
          >
            {unmasking ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      );
    }

    return inputText;
  }
);

InputText.displayName = 'InputText';

export default InputText;
