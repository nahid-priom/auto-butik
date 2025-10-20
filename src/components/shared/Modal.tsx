import classNames from 'classnames';
import React, {
    HTMLAttributes,
    PropsWithChildren,
    useCallback,
    useEffect,
    useState,
} from 'react';
import ReactDOM from 'react-dom';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    toggle?: () => void;
    centered?: boolean;
    backdrop?: boolean;
}

const Modal = (props: PropsWithChildren<ModalProps>) => {
    const {
        isOpen,
        toggle,
        centered = false,
        backdrop = true,
        className,
        children,
        ...rest
    } = props;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        return () => {
            setIsMounted(false);
        };
    }, []);

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        const { body } = document;

        if (isOpen) {
            body.classList.add('modal-open');
        } else {
            body.classList.remove('modal-open');
        }

        return () => {
            body.classList.remove('modal-open');
        };
    }, [isMounted, isOpen]);

    useEffect(() => {
        if (!isMounted || !isOpen || !toggle) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                toggle();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMounted, isOpen, toggle]);

    const handleBackdropMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget && toggle) {
            toggle();
        }
    }, [toggle]);

    if (!isMounted || !isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <>
            <div
                className={classNames('modal', 'fade', { show: isOpen })}
                style={{ display: 'block' }}
                role="dialog"
                aria-modal="true"
                onMouseDown={handleBackdropMouseDown}
                onClick={handleBackdropMouseDown}
            >
                <div className={classNames('modal-dialog', { 'modal-dialog-centered': centered })}>
                    <div
                        className={classNames('modal-content', className)}
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={(event) => event.stopPropagation()}
                        {...rest}
                    >
                        {children}
                    </div>
                </div>
            </div>
            {backdrop && <div className="modal-backdrop fade show" />}
        </>,
        document.body,
    );
};

export default Modal;
