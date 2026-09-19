import { useState } from 'react';

import Header from '../components/Header';
import Stepper from '../components/Stepper';
import CustomerForm from '../components/CustomerForm';
import ProductServiceSelection from '../components/ProductServiceSelection';
import RegistrationConfirmation from '../components/RegistrationConfirmation';


import { createRegistration } from '../services/registrationService';

import type { CustomerInfo } from '../types/attendance';
import type { Product, Service } from '../types/catalog';
import type { RegistrationResponse } from '../types/registration';


function AttendancePage() {
    const [currentStep, setCurrentStep] = useState(1);

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        firstName: '',
        lastName: '',
        email: '',
        attendanceDate: '',
    });

    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

    const [confirmedProducts, setConfirmedProducts] = useState<Product[]>([]);
    const [confirmedServices, setConfirmedServices] = useState<Service[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registration, setRegistration] = useState<RegistrationResponse | null>(null);

    const steps = [
        'Ingrese su información',
        'Seleccione servicios y productos de su interés'
    ];

    const goNext = () => {
        setCurrentStep(2);
    };

    const goBack = () => {
        setCurrentStep(1);
    };

    const handleCustomerChange = (field: keyof CustomerInfo, value: string) => {
        setCustomerInfo((previousData) => ({
            ...previousData,
            [field]: value,
        }));
    };

    const handleProductToggle = (productId: number) => {
        setSelectedProductIds((currentIds) =>
            currentIds.includes(productId)
                ? currentIds.filter((id) => id !== productId)
                : [...currentIds, productId]
        );
    };

    const handleServiceToggle = (serviceId: number) => {
        setSelectedServiceIds((currentIds) =>
            currentIds.includes(serviceId)
                ? currentIds.filter((id) => id !== serviceId)
                : [...currentIds, serviceId]
        );
    };

    const handleConfirm = async (
        products: Product[],
        services: Service[]
    ) => {
        try {
            setIsSubmitting(true);

            const createdRegistration = await createRegistration({
                name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
                email: customerInfo.email,
                attendanceAt: customerInfo.attendanceDate,
                productIds: selectedProductIds,
                serviceIds: selectedServiceIds,
            });

            setConfirmedProducts(products);
            setConfirmedServices(services);

            setRegistration(createdRegistration);

            console.log('Registro creado:', createdRegistration);

        } catch (error) {
            console.error('Error al confirmar asistencia:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRestart = () => {
        setCurrentStep(1);

        setCustomerInfo({
            firstName: '',
            lastName: '',
            email: '',
            attendanceDate: '',
        });

        setSelectedProductIds([]);
        setSelectedServiceIds([]);

        setConfirmedProducts([]);
        setConfirmedServices([]);

        setRegistration(null);
    };

    return (
        <>
            <Header />

            {registration ? (
                <RegistrationConfirmation
                    customerInfo={customerInfo}
                    registration={registration}
                    products={confirmedProducts}
                    services={confirmedServices}
                    onRestart={handleRestart}
                />
            ) : (
                <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Confirma tu asistencia al evento.
                        </p>
                    </div>

                    <Stepper
                        currentStep={currentStep}
                        steps={steps}
                    />

                    {currentStep === 1 && (
                        <CustomerForm
                            data={customerInfo}
                            onChange={handleCustomerChange}
                            onNext={goNext}
                        />
                    )}

                    {currentStep === 2 && (
                        <ProductServiceSelection
                            selectedProductIds={selectedProductIds}
                            selectedServiceIds={selectedServiceIds}
                            onProductToggle={handleProductToggle}
                            onServiceToggle={handleServiceToggle}
                            onBack={goBack}
                            onConfirm={handleConfirm}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </main>
            )}
        </>

    );
}

export default AttendancePage;