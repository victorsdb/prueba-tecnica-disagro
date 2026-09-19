import { CheckCircle2, RotateCcw } from 'lucide-react';

import type { CustomerInfo } from '../types/attendance';
import type { Product, Service } from '../types/catalog';
import type { RegistrationResponse } from '../types/registration';

interface RegistrationConfirmationProps {
    customerInfo: CustomerInfo;
    registration: RegistrationResponse;
    products: Product[];
    services: Service[];
    onRestart: () => void;
}

function RegistrationConfirmation({
    customerInfo,
    registration,
    products,
    services,
    onRestart,
}: RegistrationConfirmationProps) {

    //const serviceSavings = Number(registration.serviceSubtotal) - Number(registration.serviceTotal);
    const serviceDiscountAmount = Number(registration.serviceSubtotal) - Number(registration.serviceTotal);


    //const productSavings = Number(registration.productSubtotal) - Number(registration.productTotal);
    const productDiscountAmount = Number(registration.productSubtotal) - Number(registration.productTotal);

    //const totalSavings = serviceSavings + productSavings;

    // return (
    //     <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

    //         <section className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm">

    //             <div className="mb-8 text-center">
    //                 <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600" />

    //                 <h1 className="text-2xl font-bold text-gray-800">
    //                     ¡Asistencia confirmada!
    //                 </h1>

    //                 <p className="mt-2 text-gray-500">
    //                     Tu registro fue realizado correctamente.
    //                 </p>
    //             </div>

    //             <div className="mb-6 border-b border-gray-200 pb-6">
    //                 <p className="font-semibold text-gray-800">
    //                     {customerInfo.firstName} {customerInfo.lastName}
    //                 </p>

    //                 <p className="text-sm text-gray-500">
    //                     {customerInfo.email}
    //                 </p>
    //             </div>

    //             <div className="space-y-6">

    //                 <div>
    //                     <h2 className="mb-3 font-semibold text-gray-800">
    //                         Servicios seleccionados
    //                     </h2>

    //                     <div className="divide-y divide-gray-200">
    //                         {services.map((service) => (
    //                             <div
    //                                 key={service.id}
    //                                 className="flex justify-between py-2 text-sm"
    //                             >
    //                                 <span>{service.name}</span>

    //                                 <span className="font-semibold">
    //                                     Q{Number(service.price).toFixed(2)}
    //                                 </span>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>

    //                 <div>
    //                     <h2 className="mb-3 font-semibold text-gray-800">
    //                         Productos seleccionados
    //                     </h2>

    //                     <div className="divide-y divide-gray-200">
    //                         {products.map((product) => (
    //                             <div
    //                                 key={product.id}
    //                                 className="flex justify-between py-2 text-sm"
    //                             >
    //                                 <span>{product.name}</span>

    //                                 <span className="font-semibold">
    //                                     Q{Number(product.price).toFixed(2)}
    //                                 </span>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>

    //             </div>

    //             <div className="mt-8 rounded-xl bg-zinc-700 p-5 text-white">

    //                 <div className="grid gap-4 sm:grid-cols-2">

    //                     <div className="space-y-2 sm:pr-6">
    //                         <p className="flex justify-between gap-4 text-sm">
    //                             <span>Subtotal:</span>
    //                             <span className="font-semibold">
    //                                 Q{Number(registration.serviceSubtotal).toFixed(2)}
    //                             </span>
    //                         </p>

    //                         <p className="flex justify-between gap-4 text-sm">
    //                             <span>Descuento:</span>
    //                             <span className="font-bold text-green-500">
    //                                 {Number(registration.serviceDiscountPercent)}%
    //                             </span>
    //                         </p>

    //                         <p className="flex justify-between gap-4 text-sm">
    //                             <span>Ahorras:</span>
    //                             <span className="font-bold text-green-500">
    //                                 Q{serviceSavings.toFixed(2)}
    //                             </span>
    //                         </p>

    //                         <p className="flex justify-between gap-4 text-sm">
    //                             <span>Total:</span>
    //                             <span className="font-bold">
    //                                 Q{Number(registration.serviceTotal).toFixed(2)}
    //                             </span>
    //                         </p>
    //                     </div>


    //                     <div className="space-y-2 border-t border-zinc-500 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
    //                         <p className="flex justify-between gap-4 text-sm">
    //                             <span>Subtotal:</span>
    //                             <span className="font-semibold">
    //                                 Q{Number(registration.productSubtotal).toFixed(2)}
    //                             </span>
    //                         </p>

    //                         <p className="flex justify-between gap-4 text-sm">
    //                             <span>Descuento:</span>
    //                             <span className="font-bold text-green-500">
    //                                 {Number(registration.productDiscountPercent)}%
    //                             </span>
    //                         </p>

    //                         <p className="flex justify-between gap-4 text-sm">
    //                             <span>Ahorras:</span>
    //                             <span className="font-bold text-green-500">
    //                                 Q{productSavings.toFixed(2)}
    //                             </span>
    //                         </p>

    //                         <p className="flex justify-between gap-4 text-sm">
    //                             <span>Total:</span>
    //                             <span className="font-bold">
    //                                 Q{Number(registration.productTotal).toFixed(2)}
    //                             </span>
    //                         </p>
    //                     </div>



    //                 </div>

    //                 <div className="mt-5 flex items-center justify-between border-t border-zinc-500 pt-4">
    //                     <span className="font-semibold">
    //                         Total general
    //                     </span>

    //                     <span className="text-xl font-bold">
    //                         Q{Number(registration.grandTotal).toFixed(2)}
    //                     </span>
    //                 </div>

    //             </div>

    //         </section>

    //     </main>
    // );

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

            <section className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm">

                {/* Confirmación */}
                <div className="mb-8 text-center">
                    <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600" />

                    <h1 className="text-2xl font-bold text-gray-800">
                        ¡Asistencia confirmada!
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Tu registro fue realizado correctamente.
                    </p>
                </div>

                {/* Cliente */}
                <div className="mb-8 border-b border-gray-200 pb-5">
                    <p className="font-semibold text-gray-800">
                        {customerInfo.firstName} {customerInfo.lastName}
                    </p>

                    <p className="text-sm text-gray-500">
                        {customerInfo.email}
                    </p>
                </div>

                {/* Servicios */}
                <div className="mb-10">
                    <h2 className="mb-3 text-lg font-semibold text-gray-800">
                        Servicios seleccionados
                    </h2>

                    <div className="divide-y divide-gray-100">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="flex items-center justify-between py-2 text-sm"
                            >
                                <span className="text-gray-700">
                                    {service.name}
                                </span>

                                <span className="font-medium text-gray-800">
                                    Q{Number(service.price).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Resumen servicios */}
                    <div className="mt-3 space-y-2 border-t border-gray-300 pt-3">

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Subtotal
                            </span>

                            <span className="font-medium text-gray-800">
                                Q{Number(registration.serviceSubtotal).toFixed(2)}
                            </span>
                        </div>

                        {Number(registration.serviceDiscountPercent) > 0 ? (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    Descuento {Number(registration.serviceDiscountPercent)}%
                                </span>

                                <span className="font-semibold text-green-600">
                                    -Q{serviceDiscountAmount.toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    Descuento
                                </span>

                                <span className="font-medium text-gray-500">
                                    No aplica
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between font-semibold">
                            <span className="text-gray-800">
                                Total servicios
                            </span>

                            <span className="text-gray-900">
                                Q{Number(registration.serviceTotal).toFixed(2)}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Productos */}
                <div className="mb-10">
                    <h2 className="mb-3 text-lg font-semibold text-gray-800">
                        Productos seleccionados
                    </h2>

                    <div className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between py-2 text-sm"
                            >
                                <span className="text-gray-700">
                                    {product.name}
                                </span>

                                <span className="font-medium text-gray-800">
                                    Q{Number(product.price).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Resumen productos */}
                    <div className="mt-3 space-y-2 border-t border-gray-300 pt-3">

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Subtotal
                            </span>

                            <span className="font-medium text-gray-800">
                                Q{Number(registration.productSubtotal).toFixed(2)}
                            </span>
                        </div>

                        {Number(registration.productDiscountPercent) > 0 ? (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    Descuento {Number(registration.productDiscountPercent)}%
                                </span>

                                <span className="font-semibold text-green-600">
                                    -Q{productDiscountAmount.toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    Descuento
                                </span>

                                <span className="font-medium text-gray-500">
                                    No aplica
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between font-semibold">
                            <span className="text-gray-800">
                                Total productos
                            </span>

                            <span className="text-gray-900">
                                Q{Number(registration.productTotal).toFixed(2)}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Total general */}
                <div className="border-t-2 border-gray-800 pt-5">
                    <div className="flex items-center justify-between">

                        <span className="text-lg font-bold text-gray-800">
                            Total general
                        </span>

                        <span className="text-2xl font-bold text-gray-900">
                            Q{Number(registration.grandTotal).toFixed(2)}
                        </span>

                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={onRestart}
                        className="
            flex items-center gap-2
            rounded-lg border border-green-600
            px-6 py-3
            font-semibold text-green-700
            transition
            hover:bg-green-50
        "
                    >
                        <RotateCcw size={18} />
                        Registrar otra asistencia
                    </button>
                </div>
            </section>

        </main>
    );
}

export default RegistrationConfirmation;