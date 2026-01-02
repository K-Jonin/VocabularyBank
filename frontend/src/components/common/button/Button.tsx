import { ButtonHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  buttonSize?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      buttonSize = 'medium',
      fullWidth = false,
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          styles.base,
          styles[variant],
          styles[buttonSize],
          fullWidth && styles.fullWidth,
          isLoading && styles.loading,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <span className={styles.spinner}></span> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
