import React, {Fragment} from 'react';
import {Dialog,Transition,TransitionChild, DialogPanel,DialogTitle} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

interface ModalProps{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({isOpen,onClose,title,children}) =>{
    return(
        <Transition show={isOpen} as={Fragment}>
            <Dialog as='div' className='relative z-50' onClose={onClose}>
                <TransitionChild 
                    as={Fragment} 
                    enter='ease-out duration-300' 
                    enterFrom='opacity-0' 
                    enterTo='opacity-100' 
                    leave='ease-in duration-200' 
                    leaveFrom='opacity-100' 
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity'/>
                </TransitionChild>
                
                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <TransitionChild 
                            as={Fragment} 
                            enter='ease-out duration-300' 
                            enterFrom='opacity-0 scale-95' 
                            enterTo='opacity-100 scale-100' 
                            leave='ease-in duration-200' 
                            leaveFrom='opacity-100 scale-100' 
                            leaveTo='opacity-0 scale-95'
                        >
                            <DialogPanel className='relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 text-left shadow-2xl shadow-black/50 transition-all'>
                                <div className='bg-gradient-to-br from-white/[0.03] to-white/[0.01] px-6 pt-6 pb-6'>
                                    <div className='flex justify-between items-start'>
                                        <DialogTitle as='h3' className='text-lg font-semibold leading-6 text-white'>
                                            {title}
                                        </DialogTitle>
                                        <button 
                                            type='button' 
                                            className='text-gray-400 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors' 
                                            onClick={onClose}
                                        >
                                            <XMarkIcon className='h-6 w-6' aria-hidden='true'/>
                                        </button>
                                    </div>
                                    <div className='mt-6'>
                                        {children}
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;