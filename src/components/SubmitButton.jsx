// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// @ts-ignore;
import { RippleEffect } from '@/components/RippleEffect';
export function SubmitButton({
  children,
  isLoading = false,
  isSuccess = false,
  isError = false,
  successText = '成功',
  errorText = '失败',
  disabled = false,
  className = '',
  ...props
}) {
  const getButtonProps = () => {
    if (isSuccess) {
      return {
        className: `bg-green-600 hover:bg-green-700 text-white ${className}`,
        disabled: true
      };
    }
    if (isError) {
      return {
        className: `bg-red-600 hover:bg-red-700 text-white ${className}`,
        disabled: false
      };
    }
    if (isLoading) {
      return {
        className: `bg-blue-600 hover:bg-blue-700 text-white ${className}`,
        disabled: true
      };
    }
    return {
      className: `${className}`,
      disabled
    };
  };
  const buttonProps = getButtonProps();
  return <RippleEffect>
      <Button {...buttonProps} {...props}>
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {isSuccess && <CheckCircle className="h-4 w-4 mr-2" />}
        {isError && <XCircle className="h-4 w-4 mr-2" />}
        {isLoading ? '处理中...' : isSuccess ? successText : isError ? errorText : children}
      </Button>
    </RippleEffect>;
}