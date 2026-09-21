import type { CustomerInfo } from '../types/attendance';
import { ArrowRight } from 'lucide-react';

interface CustomerFormProps {
    data: CustomerInfo;
    onChange: (field: keyof CustomerInfo, value: string) => void;
    onNext: () => void;
}

function getCurrentLocalDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function CustomerForm({
    data,
    onChange,
    onNext,
}: CustomerFormProps) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onNext();
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="mx-auto w-full max-w-xl"
            >

                <div className="flex w-full flex-col rounded-2xl bg-white p-6 shadow-sm md:h-[60dvh] md:p-8">
                    <h2 className="mb-6 text-xl font-semibold text-gray-800">
                        Información del cliente
                    </h2>

                    <div className="space-y-5">

                        <div>
                            <label
                                className="mb-2 block font-medium text-gray-700"
                                htmlFor="firstName"
                            >
                                Nombre
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                value={data.firstName}
                                onChange={(event) =>
                                    onChange('firstName', event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                required
                            />
                        </div>

                        <div>
                            <label
                                className="mb-2 block font-medium text-gray-700"
                                htmlFor="lastName"
                            >
                                Apellidos
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                value={data.lastName}
                                onChange={(event) =>
                                    onChange('lastName', event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                required
                            />
                        </div>

                        <div>
                            <label
                                className="mb-2 block font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    onChange('email', event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                required
                            />
                        </div>

                        <div>
                            <label
                                className="mb-2 block font-medium text-gray-700"
                                htmlFor="attendanceDate"
                            >
                                Fecha y hora
                            </label>
                            <input
                                id="attendanceDate"
                                type="datetime-local"
                                value={data.attendanceDate}
                                min={getCurrentLocalDateTime()}
                                onChange={(event) =>
                                    onChange('attendanceDate', event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                required
                            />
                        </div>

                    </div>

                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="
                            flex w-full items-center justify-center gap-2
                            rounded-lg bg-green-600 px-6 py-3
                            font-semibold text-white transition
                            hover:bg-green-700
                            sm:w-auto
                        "
                    >
                        Siguiente
                        <ArrowRight size={18} />
                    </button>
                </div>
            </form>


        </>

    );
}

export default CustomerForm;