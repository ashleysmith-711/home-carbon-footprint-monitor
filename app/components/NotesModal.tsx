import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import toast from 'react-hot-toast';
import { reformatDate } from '../utils';


interface Props {
    date: string;
    customerId: number;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}
type EnergyAction = {
    name: string;
    selected: boolean;
}
export default function NotesModal({ isOpen, setOpen, date, customerId }: Props) {
    const [energyActions, setEnergyActions] = useState<EnergyAction[]>([
        { name: "Dishwasher Use", selected: false },
        { name: "Washing Machine", selected: false },
        { name: "Away From Home", selected: false },
        { name: "High Heat", selected: false },
        { name: "High AC", selected: false },
        { name: "Long Showers", selected: false },
        { name: "Cooking/Baking", selected: false },
        { name: "Electronics Use", selected: false },
        { name: "Poor Insulation", selected: false },
        { name: "Fridge Openings", selected: false }
    ])
    console.log('date in modal', date)
    const cancelButtonRef = useRef(null)

    const resetSelected = () => {
        setEnergyActions(energyActions.map(action => {
            action.selected = false;
            return action;
        }));
    }

    const handleSaveNotes = async () => {
        // make api call
        const str = energyActions.filter(action => action.selected).map(action => action.name).join(', ');

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    note: str,
                    customer_id: customerId,
                    note_date: date
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            resetSelected();

            if (result) {
                toast.success('Notes saved!');
            } else {
                toast.error('Bummer, there was an error saving notes');
            }
        } catch (error) {
            console.error('Error posting note:', error);
        }
     
        
        setOpen(false)
    }

    const updateSelected = (index: number) => {
        const newActions = [...energyActions];
        newActions[index].selected = !newActions[index].selected;
        setEnergyActions(newActions);
    }
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">

                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Add Actions for {reformatDate(date)}?
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Save notes and correlate common actions to a reduction in your carbon footprint.
                                                </p>
                                                <div className="flex flex-wrap">
                                                    {energyActions.map((action, index) => {
                                                        return (
                                                            <span key={index} className={`${action.selected ? 'bg-blue-400' : 'bg-slate-200'}  w-fit p-2 m-1 rounded-full cursor-pointer`} onClick={() => updateSelected(index)}>
                                                                {action.name}
                                                            </span>
                                                        )
                                                    })}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 sm:ml-3 sm:w-auto"
                                        onClick={handleSaveNotes}
                                    >
                                        Save actions
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => {
                                            setOpen(false);
                                            resetSelected();
                                        }}
                                        ref={cancelButtonRef}
                                    >
                                        No thanks
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
